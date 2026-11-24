import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  PlayCircle,
  Stethoscope,
  Pill,
  Building2,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Users,
  Plus,
  Trash2,
  Power,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import {
  useStaffPortal,
  StaffRole,
  PatientClinicalRouting,
} from '../context/StaffPortalContext';

export const SastechLoginGate: React.FC = () => {
  const { loginStaff, enterCustomerDemo } = useStaffPortal();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = loginStaff(username, password);
    if (!res.ok) {
      setError(res.error || 'Authentication failed');
    }
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07150e] text-[#f4f0e6] flex flex-col justify-between font-mono selection:bg-[#15803d] selection:text-white">
      {/* Top Marg ERP 9+ Title Bar */}
      <div className="bg-[#14532d] border-b-2 border-[#052e16] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-sm bg-[#facc15] text-[#052e16] font-extrabold tracking-wider uppercase text-[11px] font-mono">
            MARG ERP A1+
          </span>
          <span className="font-bold text-white tracking-wide">
            MARG ERP 9+ · SAFI CLINIC &amp; APOTHECARY MANAGEMENT SYSTEM (KABUL AFGHANISTAN)
          </span>
        </div>
        <div className="text-[11px] text-[#86efac] font-mono">
          Outpatient Clinic Staff Edition · No Hospital Wards · FY: 2026-2027
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded border-2 border-[#166534] bg-[#eef3ee] text-[#111827] shadow-2xl overflow-hidden font-mono text-xs">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#14532d] to-[#166534] text-white px-3 py-1.5 flex items-center justify-between font-bold text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-[#facc15] font-black">MARG ERP 9+</span>
              <span>· COMPANY LOGIN &amp; OPERATOR AUTHENTICATION</span>
            </div>
            <span className="text-[10px] text-[#86efac] font-mono">
              OFFICE: #C93 GUL BAHAR CENTER KABUL
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#9ca3af]">
            {/* Left Column: Company Directory & Demo Mode Launchers */}
            <div className="lg:col-span-6 p-4 sm:p-5 bg-[#f8faf8] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border border-[#166534] bg-white rounded p-3 space-y-2">
                  <div className="font-bold text-xs text-[#14532d] uppercase flex items-center justify-between border-b border-gray-200 pb-1">
                    <span>SELECT COMPANY / CLINIC</span>
                    <span className="text-[10px] text-gray-500 font-mono">F1=Directory</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <label
                      onClick={() => setSelectedCompany('01')}
                      className={`p-2 border block cursor-pointer transition ${
                        selectedCompany === '01'
                          ? 'border-[#14532d] bg-[#dcfce7] font-bold text-[#14532d]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>01  SAFI NATURAL CARE CLINIC</span>
                        <span className="text-[10px] font-mono">2026-2027</span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        C93 Gul Bahar Center Kabul · Outpatient &amp; Dispensary
                      </div>
                    </label>

                    <label
                      onClick={() => setSelectedCompany('02')}
                      className={`p-2 border block cursor-pointer transition ${
                        selectedCompany === '02'
                          ? 'border-[#14532d] bg-[#dcfce7] font-bold text-[#14532d]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>02  AYAN MOBILE &amp; APOTHECARY</span>
                        <span className="text-[10px] font-mono">2026-2027</span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Botanical Raw Material &amp; Retail Counter
                      </div>
                    </label>
                  </div>
                </div>

                {/* Marg ERP Style Notice */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-[11px] text-emerald-950 font-sans space-y-1">
                  <div className="font-bold text-[#14532d] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Strict Outpatient Clinic Management Edition</span>
                  </div>
                  <p className="text-[10px] text-gray-600">
                    All hospital inpatient modules, surgery suites, and bed wards are excluded.
                    Fully streamlined for outpatient doctor consultations, prescription approvals,
                    dispensary POS, and double-entry Marg accounting.
                  </p>
                </div>
              </div>

              {/* One-Click Demo Mode Buttons (Marg ERP Retro Styled) */}
              <div className="pt-3 border-t border-gray-300 space-y-2">
                <div className="text-[11px] font-bold text-[#14532d] uppercase tracking-wide">
                  One-Click Customer Presentation &amp; Demo Launch:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => enterCustomerDemo('admin')}
                    className="p-2 bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs uppercase rounded flex items-center justify-between cursor-pointer shadow"
                  >
                    <span>[ DEMO: ADMIN ]</span>
                    <PlayCircle className="w-3.5 h-3.5 text-[#facc15]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => enterCustomerDemo('doctor')}
                    className="p-2 bg-[#065f46] hover:bg-[#047857] text-white font-bold text-xs uppercase rounded flex items-center justify-between cursor-pointer shadow"
                  >
                    <span>[ DEMO: DOCTOR ]</span>
                    <Stethoscope className="w-3.5 h-3.5 text-[#facc15]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => enterCustomerDemo('pharmacist')}
                    className="p-2 bg-[#075985] hover:bg-[#0284c7] text-white font-bold text-xs uppercase rounded flex items-center justify-between cursor-pointer shadow"
                  >
                    <span>[ DEMO: DISPENSARY ]</span>
                    <Pill className="w-3.5 h-3.5 text-[#facc15]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => enterCustomerDemo('receptionist')}
                    className="p-2 bg-[#854d0e] hover:bg-[#a16207] text-white font-bold text-xs uppercase rounded flex items-center justify-between cursor-pointer shadow"
                  >
                    <span>[ DEMO: RECEPTION ]</span>
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#facc15]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => enterCustomerDemo('accountant')}
                    className="sm:col-span-2 p-2 bg-[#1f2937] hover:bg-[#374151] text-white font-bold text-xs uppercase rounded flex items-center justify-between cursor-pointer shadow"
                  >
                    <span>[ DEMO: CLINIC ACCOUNTANT / MARG LEDGER ]</span>
                    <PlayCircle className="w-3.5 h-3.5 text-[#facc15]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Operator Credentials Login Form */}
            <div className="lg:col-span-6 p-4 sm:p-5 bg-white space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-gray-300 pb-2">
                  <span className="text-[10px] font-bold text-[#14532d] uppercase tracking-wider block">
                    Marg ERP 9+ Enterprise Terminal
                  </span>
                  <h2 className="text-base font-bold text-gray-900 mt-0.5">
                    Operator ID &amp; Password Sign In
                  </h2>
                  <p className="text-[11px] text-gray-600 font-sans mt-0.5">
                    Enter your staff credentials or use one of the quick demo buttons on the left.
                  </p>
                </div>

                {error && (
                  <div className="p-2.5 rounded bg-rose-100 border border-rose-400 text-rose-900 text-xs font-bold flex items-center gap-2 mt-3">
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
                  <label className="block space-y-1">
                    <span className="font-bold text-[#14532d] uppercase text-[11px]">
                      User Name / Staff ID *
                    </span>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. admin, doctor, pharmacy, reception"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-400 focus:border-[#14532d] text-gray-900 font-mono outline-none"
                      />
                    </div>
                  </label>

                  <label className="block space-y-1">
                    <span className="font-bold text-[#14532d] uppercase text-[11px]">
                      Password *
                    </span>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-400 focus:border-[#14532d] text-gray-900 font-mono outline-none"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition cursor-pointer shadow"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#facc15]" />
                    <span>Enter Marg ERP System</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Quick Fill Credentials Grid */}
              <div className="pt-3 border-t border-gray-300 space-y-2">
                <div className="text-[10px] font-bold text-gray-600 uppercase">
                  Default Role Credentials (Password: 123):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => quickFill('admin', '123')}
                    className="p-1.5 bg-gray-100 hover:bg-[#dcfce7] border border-gray-300 text-left rounded cursor-pointer"
                  >
                    <div className="font-bold text-[#14532d]">Admin</div>
                    <div className="font-mono text-gray-500">ID: admin</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('doctor', '123')}
                    className="p-1.5 bg-gray-100 hover:bg-[#dcfce7] border border-gray-300 text-left rounded cursor-pointer"
                  >
                    <div className="font-bold text-emerald-800">Doctor</div>
                    <div className="font-mono text-gray-500">ID: doctor</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('pharmacy', '123')}
                    className="p-1.5 bg-gray-100 hover:bg-[#dcfce7] border border-gray-300 text-left rounded cursor-pointer"
                  >
                    <div className="font-bold text-sky-800">Dispensary</div>
                    <div className="font-mono text-gray-500">ID: pharmacy</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('reception', '123')}
                    className="p-1.5 bg-gray-100 hover:bg-[#dcfce7] border border-gray-300 text-left rounded cursor-pointer"
                  >
                    <div className="font-bold text-amber-800">Reception</div>
                    <div className="font-mono text-gray-500">ID: reception</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('accountant', '123')}
                    className="p-1.5 bg-gray-100 hover:bg-[#dcfce7] border border-gray-300 text-left rounded cursor-pointer"
                  >
                    <div className="font-bold text-purple-800">Accountant</div>
                    <div className="font-mono text-gray-500">ID: accountant</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar matching Video */}
          <div className="bg-[#14532d] text-white px-3 py-1 text-[10px] font-mono flex flex-wrap items-center justify-between border-t border-[#052e16]">
            <span>M-SOFT TECHNOLOGIES · Marg ERP A1+ Silver Edition</span>
            <span>Help Line: +93 774 291 300 · Kabul Afghanistan</span>
          </div>
        </div>
      </div>

      <div className="bg-[#05100b] border-t border-[#163626] px-4 py-2 text-[11px] text-[#8da396] flex flex-wrap items-center justify-between gap-2 font-mono">
        <span>Powered by Marg ERP 9+ (A1+) · Outpatient Clinic &amp; Apothecary Suite</span>
        <span>No Hospital Size Clutter · Clinic Staff &amp; Dispensary Only</span>
      </div>
    </div>
  );
};

export const StaffAccessManagerPanel: React.FC = () => {
  const {
    accounts,
    currentStaff,
    createStaffAccount,
    toggleStaffActive,
    removeStaffAccount,
  } = useStaffPortal();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('doctor');
  const [specialtyOrDept, setSpecialtyOrDept] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) return;
    createStaffAccount({
      fullName: fullName.trim(),
      username: username.trim(),
      password: password.trim(),
      role,
      specialtyOrDept:
        specialtyOrDept.trim() ||
        (role === 'doctor'
          ? 'Outpatient Consultation Physician'
          : role === 'pharmacist'
          ? 'Medicine Counter & Apothecary'
          : 'Clinic Administration'),
    });
    setNotice(`Created ${role.toUpperCase()} login "${username.trim()}" for ${fullName.trim()}.`);
    setFullName('');
    setUsername('');
    setPassword('');
    setSpecialtyOrDept('');
  };

  return (
    <div className="clinic-erp rounded-lg overflow-hidden border-2 border-[#15803d]">
      <div className="clinic-erp-header">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#facc15]" />
          <span className="font-bold uppercase tracking-wider">
            Sastech Role-Based Staff Login &amp; Access Control
          </span>
        </div>
        <span className="text-[11px] font-mono">
          Active Accounts: {accounts.filter((a) => a.active).length} / {accounts.length}
        </span>
      </div>

      <div className="p-4 bg-[#eef3ee] text-[#111827] space-y-4">
        {notice && (
          <div className="p-2.5 rounded bg-emerald-100 border border-emerald-600 text-emerald-950 text-xs font-semibold flex items-center justify-between">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <form
          onSubmit={handleCreate}
          className="p-3 bg-white border border-[#86efac] rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-end"
        >
          <label className="block">
            <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
              Staff Full Name *
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Ahmadzai"
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs bg-white text-black"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
              Role Access *
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs bg-white text-black"
            >
              <option value="doctor">Doctor (Consultation &amp; Rx Approval)</option>
              <option value="pharmacist">Medicine Seller (Pharmacy POS)</option>
              <option value="receptionist">Receptionist (Patient Intake &amp; Triage)</option>
              <option value="accountant">Accountant (Marg Ledger &amp; Cashier)</option>
              <option value="admin">Admin (Full Clinic Control)</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
              Login Username *
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dr.ahmadzai"
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs font-mono bg-white text-black"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
              Password *
            </span>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set password"
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs font-mono bg-white text-black"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
              Clinic Desk / Specialty
            </span>
            <input
              type="text"
              value={specialtyOrDept}
              onChange={(e) => setSpecialtyOrDept(e.target.value)}
              placeholder="e.g. Unani Consultation"
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs bg-white text-black"
            />
          </label>

          <button
            type="submit"
            className="py-1.5 px-3 bg-[#14532d] hover:bg-[#166534] text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Grant Login</span>
          </button>
        </form>

        <div className="overflow-x-auto border border-[#86efac] bg-white">
          <table className="clinic-erp-grid">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Login ID</th>
                <th>Password</th>
                <th>Clinic Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acct) => (
                <tr key={acct.id}>
                  <td className="font-bold">{acct.fullName}</td>
                  <td className="uppercase font-bold">
                    {acct.role === 'pharmacist' ? 'Medicine Seller' : acct.role}
                  </td>
                  <td className="font-mono">{acct.username}</td>
                  <td className="font-mono">{acct.password}</td>
                  <td>{acct.specialtyOrDept}</td>
                  <td>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        acct.active
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                          : 'bg-rose-100 text-rose-900 border border-rose-400'
                      }`}
                    >
                      {acct.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStaffActive(acct.id)}
                        className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Power className="w-3 h-3" />
                        <span>{acct.active ? 'Revoke' : 'Enable'}</span>
                      </button>
                      {acct.username !== 'admin' && acct.id !== currentStaff?.id && (
                        <button
                          type="button"
                          onClick={() => removeStaffAccount(acct.id)}
                          className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-400 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="clinic-erp-shortcut-bar">
        <span>
          <span className="clinic-erp-key">ADMIN</span> Grant Doctor &amp; Medicine Seller Logins
        </span>
        <span>
          <span className="clinic-erp-key">SECURITY</span> Instant Revoke / Enable Access
        </span>
      </div>
    </div>
  );
};

interface RxDraft {
  medicines: string;
  notes: string;
}

const parseMedicines = (raw: string): string[] =>
  raw
    .split(/[,\n]/)
    .map((m) => m.trim())
    .filter(Boolean);

const defaultDraft = (item: PatientClinicalRouting): RxDraft => ({
  medicines: item.prescribedMedicines.join(', '),
  notes: '',
});

export const DoctorConsultationQueuePanel: React.FC = () => {
  const { routingQueue, currentStaff, doctorApprovePrescription } = useStaffPortal();
  const [drafts, setDrafts] = useState<Record<string, RxDraft>>({});

  const canApprove = currentStaff?.role === 'doctor' || currentStaff?.role === 'admin';
  const waiting = routingQueue.filter((r) => r.status === 'Waiting for Doctor');
  const reviewed = routingQueue.filter((r) => r.status !== 'Waiting for Doctor');

  const updateDraft = (item: PatientClinicalRouting, patch: Partial<RxDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [item.id]: { ...(prev[item.id] ?? defaultDraft(item)), ...patch },
    }));
  };

  const handleApprove = (item: PatientClinicalRouting) => {
    if (!canApprove || !currentStaff) return;
    const draft = drafts[item.id] ?? defaultDraft(item);
    const medicines = parseMedicines(draft.medicines);
    if (medicines.length === 0) return;
    doctorApprovePrescription(
      item.id,
      medicines,
      draft.notes.trim() || 'Approved - no additional dosage notes.',
      currentStaff.fullName
    );
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  };

  return (
    <div className="clinic-erp rounded-lg overflow-hidden border-2 border-[#15803d]">
      <div className="clinic-erp-header">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-[#facc15]" />
          <span className="font-bold uppercase tracking-wider">
            Doctor Consultation Queue &amp; Prescription Approval
          </span>
        </div>
        <span className="text-[11px] font-mono">
          Waiting: {waiting.length} / Reviewed: {reviewed.length}
        </span>
      </div>

      <div className="p-4 bg-[#eef3ee] text-[#111827] space-y-4">
        {!canApprove && (
          <div className="p-2.5 rounded bg-amber-100 border border-amber-400 text-amber-950 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>View only. A Doctor or Admin must approve prescriptions.</span>
          </div>
        )}

        {waiting.length === 0 ? (
          <div className="p-3 bg-white border border-[#86efac] rounded text-xs font-bold text-[#14532d] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No patients waiting for a doctor. Patients routed from reception appear here.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {waiting.map((item) => {
              const draft = drafts[item.id] ?? defaultDraft(item);
              const hasMedicines = parseMedicines(draft.medicines).length > 0;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-white border border-[#86efac] rounded space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold">{item.id}</span>
                      <span className="font-bold text-sm">{item.patientName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-400 text-[10px] font-bold">
                        WAITING FOR DOCTOR
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-600">
                      Registered {item.registeredAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-[11px]">
                    <div>
                      <span className="font-bold text-[#14532d]">QR Token: </span>
                      <span className="font-mono">{item.qrToken}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#14532d]">Phone: </span>
                      <span className="font-mono">{item.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#14532d]">Age / Gender: </span>
                      <span>
                        {item.age || '-'} / {item.gender || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#14532d]">Mizaj: </span>
                      <span>{item.mizaj || '-'}</span>
                    </div>
                    <div className="col-span-2 lg:col-span-4">
                      <span className="font-bold text-[#14532d]">Symptoms: </span>
                      <span>{item.symptoms || '-'}</span>
                    </div>
                    <div className="col-span-2 lg:col-span-4">
                      <span className="font-bold text-[#14532d]">Assigned Doctor: </span>
                      <span>{item.assignedDoctor || '-'}</span>
                    </div>
                  </div>

                  {canApprove && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-end">
                      <label className="block lg:col-span-5">
                        <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
                          Medicines (comma separated) *
                        </span>
                        <input
                          type="text"
                          value={draft.medicines}
                          onChange={(e) => updateDraft(item, { medicines: e.target.value })}
                          placeholder="e.g. Black Seed & Honey Elixir, Saffron Tea"
                          className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs bg-white text-black"
                        />
                      </label>
                      <label className="block lg:col-span-5">
                        <span className="block text-[11px] font-bold text-[#14532d] mb-0.5">
                          Dosage &amp; Notes
                        </span>
                        <input
                          type="text"
                          value={draft.notes}
                          onChange={(e) => updateDraft(item, { notes: e.target.value })}
                          placeholder="e.g. 5ml twice daily after meals"
                          className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs bg-white text-black"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!hasMedicines}
                        onClick={() => handleApprove(item)}
                        className="lg:col-span-2 py-1.5 px-3 bg-[#14532d] hover:bg-[#166534] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-[#facc15]" />
                        <span>Approve &amp; Sign</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {reviewed.length > 0 && (
          <div className="overflow-x-auto border border-[#86efac] bg-white">
            <table className="clinic-erp-grid">
              <thead>
                <tr>
                  <th>Queue ID</th>
                  <th>Patient</th>
                  <th>Medicines</th>
                  <th>Dosage &amp; Notes</th>
                  <th>Approved By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reviewed.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono font-bold">{item.id}</td>
                    <td className="font-bold">{item.patientName}</td>
                    <td>{item.prescribedMedicines.join(', ') || '-'}</td>
                    <td>{item.prescriptionNotes || '-'}</td>
                    <td>
                      {item.approvedBy ? `${item.approvedBy} (${item.approvedAt})` : '-'}
                    </td>
                    <td>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          item.status === 'Dispensed'
                            ? 'bg-sky-100 text-sky-900 border-sky-400'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        }`}
                      >
                        {item.status === 'Dispensed' ? 'DISPENSED' : 'APPROVED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="clinic-erp-shortcut-bar">
        <span>
          <span className="clinic-erp-key">STEP 2</span> Doctor / Admin Reviews &amp; Signs Prescription
        </span>
        <span>
          <span className="clinic-erp-key">GATE</span> Medicine Sale Unlocks After Approval
        </span>
      </div>
    </div>
  );
};

interface SastechSessionBannerProps {
  onNavigate: (pageId: string, serviceId?: string) => void;
}

export const SastechSessionBanner: React.FC<SastechSessionBannerProps> = ({ onNavigate }) => {
  const { currentStaff, isDemoMode, logoutStaff } = useStaffPortal();
  if (!currentStaff) return null;

  const roleLabel =
    currentStaff.role === 'pharmacist'
      ? 'Medicine Seller'
      : currentStaff.role === 'doctor'
      ? 'Doctor'
      : currentStaff.role === 'receptionist'
      ? 'Receptionist'
      : currentStaff.role === 'accountant'
      ? 'Accountant'
      : 'Admin';

  return (
    <div className="h-8 px-3 flex items-center justify-between gap-2 bg-[#14532d] border-b border-[#052e16] text-[11px] text-emerald-50 font-mono whitespace-nowrap overflow-hidden">
      <div className="flex items-center gap-2 min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-[#facc15] text-[#052e16] font-extrabold tracking-wider shrink-0">
          SASTECH ERP
        </span>
        <span className="truncate">
          <span className="font-bold text-white">{currentStaff.fullName}</span>
          <span className="hidden sm:inline"> · {roleLabel}</span>
        </span>
        {isDemoMode && (
          <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/30 border border-[#facc15]/60 text-[#facc15] font-bold shrink-0">
            DEMO MODE
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {currentStaff.role === 'admin' && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 border border-emerald-400/40 font-semibold cursor-pointer"
          >
            Ledger
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate('pos-triage')}
          className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 border border-emerald-400/40 font-semibold cursor-pointer"
        >
          Workflow
        </button>
        <button
          type="button"
          onClick={() => logoutStaff()}
          className="px-2 py-0.5 rounded bg-[#facc15] hover:bg-[#fde047] text-[#052e16] font-extrabold inline-flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
