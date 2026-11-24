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
    <div className="min-h-screen bg-[#07150e] text-[#f4f0e6] flex flex-col justify-between font-sans selection:bg-[#15803d] selection:text-white">
      <div className="bg-[#14532d] border-b-2 border-[#052e16] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-[#facc15] text-[#052e16] font-extrabold tracking-wider uppercase text-[11px]">
            SASTECH ERP
          </span>
          <span className="font-bold text-white tracking-wide">
            Sastech Clinic Management &amp; Apothecary Ledger Suite
          </span>
        </div>
        <div className="text-[11px] text-emerald-100 font-mono">
          Clinic Edition · No Hospital Modules · v2026.4
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden border-2 border-[#166534] bg-[#0b1f15] shadow-2xl">
          <div className="lg:col-span-5 bg-gradient-to-b from-[#14532d] to-[#0a2e1a] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#166534]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/30 border border-[#facc15]/50 text-[#facc15] text-[11px] font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Presented by Sastech</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Clinic Management &amp; Pharmacy ERP
              </h1>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                High-density outpatient clinic control, reception-to-doctor patient routing,
                doctor-approved medicine dispensing, stock valuation, and double-entry clinic accounting.
              </p>

              <div className="space-y-2 pt-2 text-xs text-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span>Admin-Controlled Staff Access (Doctors &amp; Dispensary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span>Direct Reception → Doctor Consultation Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span>Doctor/Admin Approval Gate Before Medicine Sale</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-emerald-700/60 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#facc15]">
                Client Presentation Mode
              </div>
              <button
                type="button"
                onClick={() => enterCustomerDemo('admin')}
                className="w-full py-3 px-4 rounded-lg bg-[#facc15] hover:bg-[#fde047] text-[#052e16] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Customer Demo</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => enterCustomerDemo('doctor')}
                  className="py-1.5 px-2.5 rounded bg-black/30 hover:bg-black/50 border border-emerald-400/40 text-[11px] text-emerald-100 font-semibold cursor-pointer"
                >
                  Demo as Doctor
                </button>
                <button
                  type="button"
                  onClick={() => enterCustomerDemo('pharmacist')}
                  className="py-1.5 px-2.5 rounded bg-black/30 hover:bg-black/50 border border-emerald-400/40 text-[11px] text-emerald-100 font-semibold cursor-pointer"
                >
                  Demo as Medicine Seller
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-5 bg-[#091811]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
                Authorized Clinic Terminal
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Staff &amp; Administrator Sign In
              </h2>
              <p className="text-xs text-[#9eb3a8] mt-1">
                Enter credentials assigned by your Clinic Administrator.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/70 text-rose-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <label className="block space-y-1.5">
                <span className="font-bold text-emerald-100 uppercase tracking-wider text-[11px]">
                  Login ID / Username
                </span>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin, doctor, or pharmacy"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#05100b] border border-[#1d4632] focus:border-[#facc15] text-white font-mono focus:outline-none"
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="font-bold text-emerald-100 uppercase tracking-wider text-[11px]">
                  Password
                </span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#05100b] border border-[#1d4632] focus:border-[#facc15] text-white font-mono focus:outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#15803d] hover:bg-[#16a34a] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Clinic System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-[#163626] space-y-2">
              <div className="text-[11px] text-[#8da396] font-mono">
                Quick-Fill Default Role Credentials (Password: 123):
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => quickFill('admin', '123')}
                  className="p-2 rounded bg-[#0e261b] hover:bg-[#143726] border border-[#1f4d37] text-left cursor-pointer"
                >
                  <div className="font-bold text-[#facc15] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-200">ID: admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill('doctor', '123')}
                  className="p-2 rounded bg-[#0e261b] hover:bg-[#143726] border border-[#1f4d37] text-left cursor-pointer"
                >
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    <span>Doctor</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-200">ID: doctor</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill('pharmacy', '123')}
                  className="p-2 rounded bg-[#0e261b] hover:bg-[#143726] border border-[#1f4d37] text-left cursor-pointer"
                >
                  <div className="font-bold text-sky-300 flex items-center gap-1">
                    <Pill className="w-3 h-3" />
                    <span>Dispensary</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-200">ID: pharmacy</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#05100b] border-t border-[#163626] px-4 py-2 text-[11px] text-[#8da396] flex flex-wrap items-center justify-between gap-2 font-mono">
        <span>Powered by Sastech IT Solutions · Outpatient Clinic &amp; Apothecary ERP</span>
        <span>All Hospital Inpatient Modules Excluded · Clinic Workflow Edition</span>
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
