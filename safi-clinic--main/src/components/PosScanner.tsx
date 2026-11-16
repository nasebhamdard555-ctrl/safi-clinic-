import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera,
  CameraOff,
  QrCode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  CreditCard,
  Banknote,
  Building2,
  UserCheck,
  Receipt,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { useCurrency } from '../context/CurrencyContext';
import { MedicineInventoryItem, PatientCrmProfile } from '../types/clinic';
import {
  calculatePosCartTotals,
  classifyInventoryStatus,
} from '../utils/clinicLogic';

interface PosCartLine {
  medicine: MedicineInventoryItem;
  quantity: number;
}

interface PosScannerProps {
  onSaleCompleted?: () => void;
}

/**
 * PosScanner
 * ----------------------------------------------------------------------------
 * Pharmacy Point of Sale (POS) Terminal + Camera QR/Barcode Medicine Scanner.
 *
 * Camera Stream Lifecycle (html5-qrcode):
 *   1. Camera stream only opens when staff clicks "Start Camera Scanner" so
 *      headless browsers and permission-restricted environments never crash on mount.
 *   2. Html5Qrcode attaches to `#pos-qr-reader` using `{ facingMode: 'environment' }`.
 *   3. Decoded SKU/QR tokens match against `medicines.barcodeQr` or `medicines.sku`,
 *      immediately incrementing the POS cart with a short cooldown to prevent
 *      double-scans from adjacent video frames.
 *   4. On stop or unmount, `scanner.stop()` and `scanner.clear()` safely release
 *      the MediaStream tracks.
 *   5. Manual Barcode/QR input and Quick-Scan bottle buttons are always available
 *      alongside the camera feed for uninterrupted front-desk operation.
 */
export const PosScanner: React.FC<PosScannerProps> = ({ onSaleCompleted }) => {
  const { medicines, settings, refreshInventory } = useClinicConfig();
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState<PosCartLine[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [scanMessage, setScanMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Camera scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef<{ code: string; timestamp: number }>({
    code: '',
    timestamp: 0,
  });

  // Checkout & patient link state
  const [patients, setPatients] = useState<PatientCrmProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [walkInName, setWalkInName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash / POS Terminal');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    referenceNumber: string;
    total: number;
    cogsAmount: number;
    netAmount: number;
    triggeredAlerts: Array<{ name: string; stockQuantity: number }>;
  } | null>(null);

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.patients)) {
          setPatients(data.patients);
        }
      })
      .catch(() => {});
  }, []);

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Ignore stop errors if stream already closed
      }
      try {
        scannerRef.current.clear();
      } catch {
        // Ignore clear errors
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const addMedicineByCode = (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return;

    const found = medicines.find(
      (m) =>
        m.barcodeQr.toUpperCase() === clean ||
        m.sku.toUpperCase() === clean ||
        m.productId.toUpperCase() === clean
    );

    if (!found) {
      setScanMessage({
        type: 'error',
        text: `Unrecognized barcode or QR code "${clean}".`,
      });
      return;
    }

    if (found.stockQuantity <= 0) {
      setScanMessage({
        type: 'error',
        text: `${found.name} is currently Out of Stock (0 units).`,
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((line) => line.medicine.id === found.id);
      if (existing) {
        if (existing.quantity >= found.stockQuantity) {
          setScanMessage({
            type: 'error',
            text: `Maximum available stock (${found.stockQuantity}) reached for ${found.name}.`,
          });
          return prev;
        }
        return prev.map((line) =>
          line.medicine.id === found.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...prev, { medicine: found, quantity: 1 }];
    });

    setScanMessage({
      type: 'success',
      text: `Scanned & added: ${found.name} (${formatPrice(Number(found.unitPrice))})`,
    });
    setReceipt(null);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScanMessage(null);
    try {
      const scanner = new Html5Qrcode('pos-qr-reader');
      scannerRef.current = scanner;
      setCameraActive(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          const now = Date.now();
          if (
            lastScanRef.current.code === decodedText &&
            now - lastScanRef.current.timestamp < 1800
          ) {
            return;
          }
          lastScanRef.current = { code: decodedText, timestamp: now };
          addMedicineByCode(decodedText);
        },
        () => {}
      );
    } catch (err: any) {
      setCameraActive(false);
      scannerRef.current = null;
      setCameraError(
        err?.message ||
          'Camera unavailable or permission denied. Use Manual QR/Barcode entry or Quick-Scan bottle buttons below.'
      );
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicineByCode(manualCode);
    setManualCode('');
  };

  const updateQty = (medicineId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.medicine.id !== medicineId) return line;
          const nextQty = line.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > line.medicine.stockQuantity) return line;
          return { ...line, quantity: nextQty };
        })
        .filter(Boolean) as PosCartLine[]
    );
  };

  const removeLine = (medicineId: number) => {
    setCart((prev) => prev.filter((line) => line.medicine.id !== medicineId));
  };

  const posTotals = useMemo(
    () =>
      calculatePosCartTotals(
        cart.map((c) => ({
          unitPrice: Number(c.medicine.unitPrice),
          cogsPrice: Number(c.medicine.cogsPrice),
          quantity: c.quantity,
        })),
        0.05
      ),
    [cart]
  );

  const filteredShelf = useMemo(
    () =>
      medicines.filter(
        (m) =>
          !searchFilter ||
          m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          m.barcodeQr.toLowerCase().includes(searchFilter.toLowerCase()) ||
          m.sku.toLowerCase().includes(searchFilter.toLowerCase())
      ),
    [medicines, searchFilter]
  );

  const handleCompletePosSale = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setScanMessage(null);

    try {
      const selectedPatient = patients.find(
        (p) => String(p.id) === selectedPatientId
      );
      const patientNameToSend =
        selectedPatient?.fullName ||
        walkInName.trim() ||
        'Walk-In Dispensary Patient';

      const res = await fetch('/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient ? selectedPatient.id : null,
          patientName: patientNameToSend,
          paymentMethod,
          totalOverride: posTotals.total,
          items: cart.map((line) => ({
            medicineId: line.medicine.id,
            productId: line.medicine.productId,
            quantity: line.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'POS checkout failed');
      }

      setReceipt({
        referenceNumber: data.transaction.referenceNumber,
        total: Number(data.transaction.grossAmount),
        cogsAmount: Number(data.transaction.cogsAmount),
        netAmount: Number(data.transaction.netAmount),
        triggeredAlerts: data.lowStockAlertsTriggered || [],
      });
      setCart([]);
      setWalkInName('');
      await refreshInventory();
      onSaleCompleted?.();
    } catch (err: any) {
      setScanMessage({
        type: 'error',
        text: err.message || 'Unable to process POS sale.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT 7 COLS: QR / Barcode Medicine Scanner + Dispensary Shelf */}
      <div className="lg:col-span-7 space-y-6">
        {/* Camera + Manual QR Scanner Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3b2f]">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec]">
                  Medicine QR & Barcode Scanner
                </h3>
                <p className="text-[11px] text-[#8da396]">
                  Scan bottle labels or enter a QR/SKU code to add directly to POS checkout.
                </p>
              </div>
            </div>

            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-2 rounded-lg bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-900/50 cursor-pointer"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>Stop Camera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-2 rounded-lg bg-[#0d261a] border border-[#d4af37]/50 text-[#d4af37] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#143726] cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Start Camera Scanner</span>
              </button>
            )}
          </div>

          {/* Camera Feed Container */}
          <div
            id="pos-qr-reader"
            className={`w-full rounded-xl overflow-hidden bg-[#040d08] border border-[#1b3b2f] transition-all ${
              cameraActive ? 'min-h-[240px]' : 'h-0 border-0'
            }`}
          />

          {cameraError && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual QR / SKU Entry */}
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="pos-manual-qr" className="sr-only">
              Enter Medicine QR Token or SKU
            </label>
            <input
              id="pos-manual-qr"
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Scan or type QR / SKU (e.g. MED-BLACK-SEED)"
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-xs text-[#f5f3ec] font-mono placeholder-[#526d5e] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer shrink-0"
            >
              Scan Token
            </button>
          </form>

          {scanMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                scanMessage.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
              }`}
            >
              {scanMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{scanMessage.text}</span>
            </div>
          )}
        </div>

        {/* Dispensary Shelf Catalog (Tap to Add / Simulate Barcode Scan) */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
              Apothecary Dispensary Bottles (Quick Scan / Tap)
            </h3>
            <div className="relative sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter shelf items..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs text-[#f5f3ec] placeholder-[#526d5e] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredShelf.map((med) => {
              const status = classifyInventoryStatus(
                med.stockQuantity,
                settings.lowStockThreshold
              );
              const isOut = status === 'Out of Stock';
              const isLow = status === 'Low Stock';

              return (
                <div
                  key={med.id}
                  className="p-3.5 rounded-xl bg-[#05110a] border border-[#1b3b2f] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-[#f5f3ec] truncate">
                      {med.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#d4af37]">
                      {med.barcodeQr} · <span dir="ltr">{formatPrice(Number(med.unitPrice))}</span>
                    </div>
                    <div
                      className={`text-[11px] font-semibold font-mono tabular-nums ${
                        isOut
                          ? 'text-rose-400'
                          : isLow
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {status} ({med.stockQuantity} left)
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isOut}
                    onClick={() => addMedicineByCode(med.barcodeQr)}
                    aria-label={`Scan ${med.name} (${med.barcodeQr})`}
                    className="px-3 py-2 rounded-lg bg-[#0d261a] border border-[#234b3c] hover:border-[#d4af37] text-[#d4af37] text-[11px] font-bold whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    + Scan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT 5 COLS: Active POS Checkout Register */}
      <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#c5a059]/40 space-y-5 lg:sticky lg:top-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b3b2f]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec]">
              Dispensary POS Register
            </h3>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#d4af37] font-bold">
            {cart.reduce((s, l) => s + l.quantity, 0)} units
          </span>
        </div>

        {/* Receipt banner after completed POS checkout */}
        {receipt && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Receipt className="w-4 h-4" />
              <span>Sale Logged: {receipt.referenceNumber}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono tabular-nums">
              <div>
                <span className="text-[10px] text-[#8da396] block">Gross</span>
                <span dir="ltr" className="text-[#f5f3ec] font-bold">
                  {formatPrice(receipt.total)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8da396] block">COGS</span>
                <span dir="ltr" className="text-amber-300 font-bold">
                  {formatPrice(receipt.cogsAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8da396] block">Net Profit</span>
                <span dir="ltr" className="text-emerald-400 font-bold">
                  {formatPrice(receipt.netAmount)}
                </span>
              </div>
            </div>
            {receipt.triggeredAlerts.length > 0 && (
              <div className="pt-2 border-t border-emerald-700/40 text-amber-300 text-[11px]">
                Low-Stock Alert Triggered:{' '}
                {receipt.triggeredAlerts
                  .map((a) => `${a.name} (${a.stockQuantity} left)`)
                  .join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Cart Lines */}
        {cart.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#1b3b2f] rounded-xl text-xs text-[#8da396] space-y-1">
            <QrCode className="w-8 h-8 mx-auto text-[#526d5e] mb-2" />
            <p className="font-semibold text-[#c9dad0]">POS Register Empty</p>
            <p>Scan a medicine bottle or tap "+ Scan" to begin checkout.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {cart.map((line) => (
              <div
                key={line.medicine.id}
                className="p-3 rounded-lg bg-[#05110a] border border-[#1b3b2f] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-[#f5f3ec] truncate">
                    {line.medicine.name}
                  </div>
                  <div dir="ltr" className="text-[11px] font-mono text-[#8da396]">
                    {formatPrice(Number(line.medicine.unitPrice))} × {line.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center rounded bg-[#0a1e15] border border-[#1b3b2f]">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${line.medicine.name}`}
                      onClick={() => updateQty(line.medicine.id, -1)}
                      className="p-1.5 text-[#a6b6ad] hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-mono tabular-nums font-bold text-[#f5f3ec]">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${line.medicine.name}`}
                      onClick={() => updateQty(line.medicine.id, 1)}
                      className="p-1.5 text-[#a6b6ad] hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span
                    dir="ltr"
                    className="min-w-[82px] text-right font-mono tabular-nums font-bold text-[#d4af37] whitespace-nowrap"
                  >
                    {formatPrice(Number(line.medicine.unitPrice) * line.quantity)}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${line.medicine.name}`}
                    onClick={() => removeLine(line.medicine.id)}
                    className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patient Attribution & Payment Method */}
        <div className="space-y-3 pt-2 border-t border-[#1b3b2f] text-xs">
          <div>
            <label
              htmlFor="pos-patient-select"
              className="text-[#c9dad0] font-medium flex items-center gap-1.5 mb-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Link Patient Profile (Optional)</span>
            </label>
            <select
              id="pos-patient-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="">Walk-In Dispensary Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.fullName} ({p.qrCodeToken})
                </option>
              ))}
            </select>
          </div>

          {!selectedPatientId && (
            <div>
              <label
                htmlFor="pos-walkin-name"
                className="text-[#8da396] text-[11px] block mb-1"
              >
                Walk-In Patient Name (Optional)
              </label>
              <input
                id="pos-walkin-name"
                type="text"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="e.g. Tariq Ahmad"
                className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          <div>
            <span className="text-[#c9dad0] font-medium block mb-1.5">
              Payment Tender
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Cash / POS Terminal', short: 'Cash', icon: Banknote },
                { label: 'Card / POS', short: 'Card', icon: CreditCard },
                { label: 'Bank Transfer', short: 'Transfer', icon: Building2 },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setPaymentMethod(opt.label)}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#143726] border-[#d4af37] text-[#d4af37]'
                        : 'bg-[#05110a] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-4 rounded-xl bg-[#05110a] border border-[#1b3b2f] space-y-1.5 text-xs font-mono tabular-nums">
          <div className="flex justify-between text-[#a6b6ad]">
            <span>Subtotal</span>
            <span dir="ltr">{formatPrice(posTotals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#a6b6ad]">
            <span>Dispensary Tax (5%)</span>
            <span dir="ltr">{formatPrice(posTotals.tax)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-[#6b8275]">
            <span>Wholesale COGS Tracked</span>
            <span dir="ltr">{formatPrice(posTotals.totalCogs)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#1b3b2f] text-sm font-bold text-[#d4af37]">
            <span>Total Due</span>
            <span dir="ltr">{formatPrice(posTotals.total)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={cart.length === 0 || submitting}
          onClick={handleCompletePosSale}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {submitting
            ? 'Logging Sale & Decrementing Stock...'
            : `Complete POS Sale (${formatPrice(posTotals.total)})`}
        </button>
      </div>
    </div>
  );
};
