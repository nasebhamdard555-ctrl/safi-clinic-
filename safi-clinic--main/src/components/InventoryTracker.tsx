import React, { useState } from 'react';
import {
  AlertTriangle,
  PackageCheck,
  PackageX,
  Plus,
  Mail,
  Search,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { useCurrency } from '../context/CurrencyContext';
import { classifyInventoryStatus } from '../utils/clinicLogic';

interface InventoryTrackerProps {
  onInventoryUpdated?: () => void;
}

/**
 * InventoryTracker
 * ----------------------------------------------------------------------------
 * Smart Inventory Management & Proactive Low-Stock Alert Engine:
 *   - Color + Label Status Rules:
 *       * stockQuantity <= 0            -> "Out of Stock" (Crimson Red)
 *       * stockQuantity < threshold     -> "Low Stock" (Amber Yellow)
 *       * stockQuantity >= threshold    -> "In Stock" (Emerald Green)
 *   - Whenever any medicine falls below the configured threshold (default 20),
 *     a persistent owner alert banner appears and populates the automated
 *     "Restock Required" queue with one-click +25 replenishment & email alert dispatch.
 */
export const InventoryTracker: React.FC<InventoryTrackerProps> = ({ onInventoryUpdated }) => {
  const { medicines, lowStockItems, settings, refreshInventory } = useClinicConfig();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [restockingId, setRestockingId] = useState<number | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [dispatchingEmail, setDispatchingEmail] = useState<boolean>(false);

  const filtered = medicines.filter(
    (m) =>
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.barcodeQr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestock = async (medicineId: number, amount: number = 25) => {
    setRestockingId(medicineId);
    try {
      const res = await fetch(`/api/medicines/${medicineId}/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: amount }),
      });
      if (res.ok) {
        await refreshInventory();
        onInventoryUpdated?.();
      }
    } catch (err) {
      console.error('Failed to restock medicine:', err);
    } finally {
      setRestockingId(null);
    }
  };

  const handleSendOwnerAlert = async () => {
    setDispatchingEmail(true);
    setEmailNotice(null);
    try {
      const res = await fetch('/api/medicines/alerts/dispatch', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEmailNotice(
          `Restock notification dispatched to ${data.dispatchedTo} for ${data.alertCount} low-stock formulations.`
        );
        await refreshInventory();
      }
    } catch (err) {
      console.error('Alert dispatch error:', err);
    } finally {
      setDispatchingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Persistent Owner Warning Banner when Stock < Threshold */}
      {lowStockItems.length > 0 && (
        <div
          role="alert"
          className="p-5 rounded-xl bg-amber-950/40 border border-amber-500/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-serif-classic font-bold text-sm sm:text-base text-amber-200">
                Restock Required: {lowStockItems.length} Formulations Below {settings.lowStockThreshold}-Unit Threshold
              </h3>
              <p className="text-xs text-amber-100/80">
                Low/Out-of-stock items:{' '}
                <strong className="text-white">
                  {lowStockItems.map((i) => `${i.name} (${i.stockQuantity})`).join(', ')}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendOwnerAlert}
            disabled={dispatchingEmail}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{dispatchingEmail ? 'Dispatching...' : 'Send Owner Restock Alert'}</span>
          </button>
        </div>
      )}

      {emailNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{emailNotice}</span>
        </div>
      )}

      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
            Smart Dispensary Inventory & QR Barcodes
          </h2>
          <p className="text-xs text-[#8da396] mt-0.5">
            Stock decrements automatically on every POS terminal and online order checkout.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by medicine, SKU, or QR..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-xs text-[#f5f3ec] placeholder-[#526d5e] focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Grid Table */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Medicine Formulation</th>
                <th className="py-3 px-4">Barcode / QR</th>
                <th className="py-3 px-4 text-right">Retail</th>
                <th className="py-3 px-4 text-right">COGS</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {filtered.map((med) => {
                const status = classifyInventoryStatus(med.stockQuantity, settings.lowStockThreshold);
                const isLow = status === 'Low Stock';
                const isOut = status === 'Out of Stock';

                return (
                  <tr key={med.id} className="hover:bg-[#0b2117] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#f5f3ec]">{med.name}</div>
                      <div className="text-[11px] text-[#8da396]">
                        {med.category} · SKU: <span className="font-mono">{med.sku}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#d4af37] whitespace-nowrap">
                      {med.barcodeQr}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#f5f3ec] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(med.unitPrice))}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#a6b6ad] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(med.cogsPrice))}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#f5f3ec]">
                      {med.stockQuantity} units
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold">
                          <PackageX className="w-3.5 h-3.5" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <PackageCheck className="w-3.5 h-3.5" />
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRestock(med.id, 25)}
                        disabled={restockingId === med.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d261a] border border-[#234b3c] hover:border-[#d4af37] text-[#d4af37] font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{restockingId === med.id ? 'Updating...' : 'Restock +25'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8da396]">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No formulations match your inventory filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
