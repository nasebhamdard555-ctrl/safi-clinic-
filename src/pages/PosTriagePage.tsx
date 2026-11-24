import React, { useState } from 'react';
import {
  ShoppingCart,
  UserCheck,
  BarChart3,
  ArrowRight,
  Stethoscope,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { PosScanner } from '../components/PosScanner';
import { PatientCrmPanel } from '../components/PatientCrmPanel';
import { DoctorConsultationQueuePanel } from '../components/SastechLoginGate';
import { useLanguage } from '../context/LanguageContext';
import { useStaffPortal } from '../context/StaffPortalContext';

interface PosTriagePageProps {
  onNavigateToAdmin: () => void;
}

type OperationsTab = 'triage' | 'doctor' | 'pos';

export const PosTriagePage: React.FC<PosTriagePageProps> = ({
  onNavigateToAdmin,
}) => {
  const { t } = useLanguage();
  const { currentStaff, routingQueue, markDispensed } = useStaffPortal();
  const defaultTab: OperationsTab =
    currentStaff?.role === 'doctor'
      ? 'doctor'
      : currentStaff?.role === 'pharmacist'
      ? 'pos'
      : 'triage';
  const [activeTab, setActiveTab] = useState<OperationsTab>(defaultTab);

  const pendingDoctor = routingQueue.filter((r) => r.status === 'Waiting for Doctor');
  const approvedForDispensing = routingQueue.filter((r) => r.status === 'Approved by Doctor');

  return (
    <div className="pt-28 md:pt-36 pb-20 min-h-screen bg-[#07150e] text-[#f5f3ec]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4">
        <div className="clinic-erp rounded-lg overflow-hidden border-2 border-[#166534] shadow-2xl">
          <div className="clinic-erp-header">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#facc15] text-[#052e16] font-extrabold text-[11px]">
                SASTECH CLINICAL WORKFLOW
              </span>
              <span className="font-bold text-white">
                Reception Triage → Doctor Consultation → Dispensary POS
              </span>
            </div>

            <button
              type="button"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#facc15] hover:bg-[#fde047] text-[#052e16] font-extrabold text-[11px] uppercase tracking-wider cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.posAdmin.viewLedgerBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Clinic Operations Workflow"
            className="flex flex-wrap items-center gap-1 p-1.5 bg-[#dcfce7] border-b border-[#86efac]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'triage'}
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'triage'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>1. Reception &amp; Patient Routing</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'doctor'}
              onClick={() => setActiveTab('doctor')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>2. Doctor Queue &amp; Rx Approval ({pendingDoctor.length} Pending)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pos'}
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'pos'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>3. Dispensary POS ({approvedForDispensing.length} Approved)</span>
            </button>
          </div>

          <div className="p-3 sm:p-4 bg-[#06140d] text-[#f5f3ec] space-y-4">
            {activeTab === 'triage' && (
              <PatientCrmPanel onTriageLogged={() => setActiveTab('doctor')} />
            )}

            {activeTab === 'doctor' && <DoctorConsultationQueuePanel />}

            {activeTab === 'pos' && (
              <div className="space-y-4">
                <div className="clinic-erp rounded border-2 border-[#15803d] overflow-hidden">
                  <div className="clinic-erp-header">
                    <span className="font-bold uppercase">
                      Doctor / Admin Approved Prescriptions Ready for Dispensary Sale
                    </span>
                    <span className="text-[11px] font-mono">
                      Approval Gate: ACTIVE
                    </span>
                  </div>
                  <div className="p-3 bg-[#eef3ee] text-[#111827]">
                    {approvedForDispensing.length === 0 ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-400 p-2.5 rounded">
                        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          No pending doctor-approved prescriptions in queue. A Doctor or Admin must approve a patient&apos;s prescription before medicine sale.
                        </span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto bg-white border border-[#86efac]">
                        <table className="clinic-erp-grid">
                          <thead>
                            <tr>
                              <th>Queue ID</th>
                              <th>Patient</th>
                              <th>QR Token</th>
                              <th>Approved Medicines</th>
                              <th>Approved By</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {approvedForDispensing.map((rx) => (
                              <tr key={rx.id}>
                                <td className="font-mono font-bold">{rx.id}</td>
                                <td className="font-bold">{rx.patientName}</td>
                                <td className="font-mono">{rx.qrToken}</td>
                                <td>{rx.prescribedMedicines.join(', ')}</td>
                                <td className="text-emerald-900 font-bold">
                                  {rx.approvedBy} ({rx.approvedAt})
                                </td>
                                <td>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                                    APPROVED FOR SALE
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => markDispensed(rx.id)}
                                    className="px-2 py-0.5 rounded bg-[#14532d] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#facc15]" />
                                    <span>Mark Dispensed</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <PosScanner />
              </div>
            )}
          </div>

          <div className="clinic-erp-shortcut-bar">
            <span>
              <span className="clinic-erp-key">STEP 1</span> Reception Registers &amp; Routes Patient
            </span>
            <span>
              <span className="clinic-erp-key">STEP 2</span> Doctor/Admin Approves Prescription
            </span>
            <span>
              <span className="clinic-erp-key">STEP 3</span> Medicine Seller Completes POS Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
