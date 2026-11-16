import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  UserPlus,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Clock,
  Phone,
  Printer,
  Search,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { PatientCrmProfile } from '../types/clinic';
import { useCurrency } from '../context/CurrencyContext';

interface PatientCrmPanelProps {
  onTriageLogged?: () => void;
}

const PRACTITIONERS = [
  'Dr. Hafizullah Safi',
  'Safi Clinical Care Team',
];

/**
 * PatientCrmPanel
 * ----------------------------------------------------------------------------
 * Patient CRM & Front-Desk QR Identity Triage System.
 *
 * Lifecycle:
 *   1. Registration (`POST /api/patients`): Generates a unique `SNC-PAT-XXXXX`
 *      token in PostgreSQL and renders the scannable QR Identity Badge via
 *      `<QRCodeSVG />` (`qrcode.react`).
 *   2. Instant Triage (`GET /api/patients/qr/:token`): Front desk scans the
 *      patient's QR card (via camera `Html5Qrcode`, manual token input, or
 *      clicking any registered patient card) to pull up Mizaj, medical history,
 *      active herbal protocols, and prior visit logs.
 *   3. Arrival Check-In (`POST /api/patients/:id/checkin`): Atomically records
 *      the clinical visit, increments `totalVisits`, and writes the consultation
 *      fee automatically to the centralized `transactions` accounting ledger.
 */
export const PatientCrmPanel: React.FC<PatientCrmPanelProps> = ({ onTriageLogged }) => {
  const { formatPrice } = useCurrency();
  const [patients, setPatients] = useState<PatientCrmProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientCrmProfile | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Triage Scanner & Lookup state
  const [qrLookupInput, setQrLookupInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Check-in Arrival Controls
  const [checkInPractitioner, setCheckInPractitioner] = useState(PRACTITIONERS[0]);
  const [checkInFee, setCheckInFee] = useState('140');
  const [checkInNotes, setCheckInNotes] = useState('In-Clinic Pulse & Mizaj Follow-Up');
  const [checkingIn, setCheckingIn] = useState(false);

  // Registration Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [mizaj, setMizaj] = useState('Sanguine (Damavi)');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentProtocols, setCurrentProtocols] = useState('');
  const [registering, setRegistering] = useState(false);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients);
          if (!selectedPatient && data.patients.length > 0) {
            setSelectedPatient(data.patients[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load patient CRM directory:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    loadPatients();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      try {
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  const lookupByQrToken = async (rawToken: string) => {
    const token = rawToken.trim().toUpperCase();
    if (!token) return;
    setStatusNotice(null);

    try {
      const res = await fetch(`/api/patients/qr/${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `No patient found for ${token}`);
      }
      setSelectedPatient(data.patient);
      setStatusNotice({
        type: 'success',
        text: `QR Identity Verified: ${data.patient.fullName} (${data.patient.qrCodeToken})`,
      });
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        text: err.message || 'QR token lookup failed.',
      });
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode('patient-triage-qr-reader');
      scannerRef.current = scanner;
      setCameraActive(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decoded) => {
          await lookupByQrToken(decoded);
          await stopCamera();
        },
        () => {}
      );
    } catch (err: any) {
      setCameraActive(false);
      scannerRef.current = null;
      setCameraError(
        err?.message ||
          'Camera unavailable or permission denied. Enter the patient QR ID (e.g. SNC-PAT-84019) or click a card below.'
      );
    }
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setRegistering(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          age: age.trim() || undefined,
          gender,
          mizaj,
          medicalHistory: medicalHistory.trim() || 'Initial clinical intake',
          currentProtocols: currentProtocols.trim() || 'Pending Unani temperament assessment',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register patient');
      }

      const created: PatientCrmProfile = data.patient;
      setPatients((prev) => [created, ...prev]);
      setSelectedPatient(created);
      setFullName('');
      setPhone('');
      setEmail('');
      setAge('');
      setMedicalHistory('');
      setCurrentProtocols('');
      setStatusNotice({
        type: 'success',
        text: `Registered ${created.fullName} with QR Identity ${created.qrCodeToken}.`,
      });
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        text: err.message || 'Registration error.',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleCheckInArrival = async () => {
    if (!selectedPatient) return;
    setCheckingIn(true);
    setStatusNotice(null);

    try {
      const feeNum = Math.max(0, Number(checkInFee) || 140);
      const res = await fetch(`/api/patients/${selectedPatient.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practitionerName: checkInPractitioner,
          visitType: 'QR Instant Triage Check-In',
          consultationFee: feeNum,
          notes: checkInNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Check-in failed');
      }

      // Reload selected patient record with updated visit logs
      await lookupByQrToken(selectedPatient.qrCodeToken);
      await loadPatients();
      onTriageLogged?.();
      setStatusNotice({
        type: 'success',
        text: `Checked in ${selectedPatient.fullName}. $${feeNum.toFixed(
          2
        )} consultation fee automatically posted to Accounting Ledger (${data.transaction?.referenceNumber}).`,
      });
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        text: err.message || 'Unable to log arrival.',
      });
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {statusNotice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            statusNotice.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
              : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
          }`}
        >
          {statusNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusNotice.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 6 COLS: Instant Triage Scanner & Active Patient QR Badge */}
        <div className="lg:col-span-6 space-y-6">
          {/* Front-Desk Instant Triage QR Scanner */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3b2f]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec]">
                    Instant Front-Desk QR Triage
                  </h3>
                  <p className="text-[11px] text-[#8da396]">
                    Scan patient card or enter QR ID to open dossier & log today's arrival.
                  </p>
                </div>
              </div>

              {cameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-2 rounded-lg bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
                  <span>Scan Patient Card</span>
                </button>
              )}
            </div>

            <div
              id="patient-triage-qr-reader"
              className={`w-full rounded-xl overflow-hidden bg-[#040d08] border border-[#1b3b2f] ${
                cameraActive ? 'min-h-[220px]' : 'h-0 border-0'
              }`}
            />

            {cameraError && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookupByQrToken(qrLookupInput);
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <label htmlFor="patient-qr-lookup" className="sr-only">
                Patient QR Code Token
              </label>
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="patient-qr-lookup"
                  type="text"
                  value={qrLookupInput}
                  onChange={(e) => setQrLookupInput(e.target.value)}
                  placeholder="Enter Patient QR ID (e.g. SNC-PAT-84019)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-xs font-mono text-[#f5f3ec] placeholder-[#526d5e] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider cursor-pointer shrink-0"
              >
                Lookup QR
              </button>
            </form>
          </div>

          {/* Selected Patient Dossier + QR Identity Badge */}
          {selectedPatient && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#d4af37]/50 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1b3b2f]">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-[#d4af37] uppercase tracking-wider">
                    Verified Patient QR Badge · {selectedPatient.qrCodeToken}
                  </span>
                  <h4 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                    {selectedPatient.fullName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#a6b6ad]">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      {selectedPatient.phone}
                    </span>
                    <span>· Mizaj: {selectedPatient.mizaj}</span>
                    <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                      {selectedPatient.totalVisits} Visits
                    </span>
                  </div>
                </div>

                {/* Scannable QR Code SVG */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#d4af37] shrink-0">
                  <QRCodeSVG
                    value={selectedPatient.qrCodeToken}
                    size={88}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>

              {/* Clinical Medical Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] block">
                    Medical History & Intake
                  </span>
                  <p className="text-[#d8e2dc] leading-relaxed">
                    {selectedPatient.medicalHistory || 'No prior notes recorded.'}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Active Herbal Protocols
                  </span>
                  <p className="text-[#d8e2dc] leading-relaxed">
                    {selectedPatient.currentProtocols || 'None assigned yet.'}
                  </p>
                </div>
              </div>

              {/* Check-In Arrival Box */}
              <div className="p-4 rounded-xl bg-[#05110a] border border-[#234b3c] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5f3ec] flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#d4af37]" />
                    Log Today's Arrival & Consultation Ledger Entry
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="text-[11px] text-[#8da396] hover:text-[#d4af37] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <select
                    aria-label="Consulting Practitioner"
                    value={checkInPractitioner}
                    onChange={(e) => setCheckInPractitioner(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  >
                    {PRACTITIONERS.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    aria-label="Consultation Fee USD"
                    value={checkInFee}
                    onChange={(e) => setCheckInFee(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-[#f5f3ec] font-mono tabular-nums focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <input
                  type="text"
                  aria-label="Check-in Clinical Note"
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="Visit reason / clinical triage note..."
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                />

                <button
                  type="button"
                  disabled={checkingIn}
                  onClick={handleCheckInArrival}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-60"
                >
                  {checkingIn
                    ? 'Recording Visit & Ledger Entry...'
                    : `Check In & Log Arrival (${formatPrice(Number(checkInFee || 140), { compactDecimals: true })} Consultation)`}
                </button>
              </div>

              {/* Recent Visit History */}
              {selectedPatient.visits && selectedPatient.visits.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#8da396] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    Recent Arrival & Visit Logs
                  </h5>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedPatient.visits.map((v) => (
                      <div
                        key={v.id}
                        className="p-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#f5f3ec]">
                            {v.practitionerName} · {v.visitType}
                          </div>
                          <div className="text-[11px] text-[#8da396]">
                            {v.notes || 'Standard Unani & Naturopathic assessment'}
                          </div>
                        </div>
                        <span
                          dir="ltr"
                          className="font-mono tabular-nums font-bold text-emerald-400 whitespace-nowrap"
                        >
                          {formatPrice(Number(v.consultationFee))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT 6 COLS: Register Patient + QR Directory */}
        <div className="lg:col-span-6 space-y-6">
          {/* Patient Registration Form */}
          <form
            onSubmit={handleRegisterPatient}
            className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-[#1b3b2f]">
              <UserPlus className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec]">
                  Register Patient & Generate QR ID
                </h3>
                <p className="text-[11px] text-[#8da396]">
                  Auto-assigns a unique SNC-PAT QR token linked to PostgreSQL CRM.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">Full Name *</span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Wardak"
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">Phone / WhatsApp *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+93 780 112 233"
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] font-mono focus:outline-none"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">Email (Optional)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@safihealthcare.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1">
                  <span className="text-[#c9dad0] font-medium">Age</span>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="38"
                    className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[#c9dad0] font-medium">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-[#f5f3ec] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">
                  Unani Constitutional Temperament (Mizaj)
                </span>
                <select
                  value={mizaj}
                  onChange={(e) => setMizaj(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-[#f5f3ec] focus:outline-none"
                >
                  <option value="Sanguine (Damavi)">Sanguine (Damavi · Hot & Moist)</option>
                  <option value="Bilious (Safravi)">Bilious (Safravi · Hot & Dry)</option>
                  <option value="Phlegmatic (Balghami)">Phlegmatic (Balghami · Cold & Moist)</option>
                  <option value="Melancholic (Saudavi)">Melancholic (Saudavi · Cold & Dry)</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">
                  Medical History & Presenting Symptoms
                </span>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="e.g. Seasonal respiratory fatigue, mild joint stiffness"
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[#c9dad0] font-medium">
                  Initial Recommended Herbal Protocol
                </span>
                <input
                  type="text"
                  value={currentProtocols}
                  onChange={(e) => setCurrentProtocols(e.target.value)}
                  placeholder="e.g. Black Seed Elixir 5ml AM, Saffron Nerve Tea PM"
                  className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={registering}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-60"
            >
              {registering ? 'Generating QR Identity...' : 'Register Patient & Issue QR Card'}
            </button>
          </form>

          {/* Registered Patient QR Directory */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                Registered Patient QR Directory
              </h3>
              <span className="text-xs font-mono tabular-nums text-[#8da396]">
                {loadingPatients ? 'Loading...' : `${patients.length} profiles`}
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {patients.map((p) => {
                const active = selectedPatient?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => lookupByQrToken(p.qrCodeToken)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      active
                        ? 'bg-[#0d261a] border-[#d4af37]'
                        : 'bg-[#05110a] border-[#1b3b2f] hover:border-[#2e5e4b]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f5f3ec] truncate">
                        {p.fullName}
                      </div>
                      <div className="text-[11px] font-mono text-[#d4af37]">
                        {p.qrCodeToken} · {p.mizaj}
                      </div>
                    </div>
                    <div className="text-right shrink-0 text-[11px] font-mono tabular-nums">
                      <span className="text-emerald-400 font-bold block">
                        {p.totalVisits} visits
                      </span>
                      <span className="text-[#8da396]">Tap to load</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
