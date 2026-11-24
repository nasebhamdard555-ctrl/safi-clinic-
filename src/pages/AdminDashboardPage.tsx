import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Sliders,
  QrCode,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Users,
  Stethoscope,
} from 'lucide-react';
import { AccountingDashboard } from '../components/AccountingDashboard';
import { InventoryTracker } from '../components/InventoryTracker';
import { SocialSettingsPanel } from '../components/SocialSettingsPanel';
import { Accounting2009Workspace } from '../components/moa2009/Accounting2009Workspace';
import { MargErpClinicWorkspace } from '../components/moa2009/MargErpClinicWorkspace';
import {
  StaffAccessManagerPanel,
  DoctorConsultationQueuePanel,
} from '../components/SastechLoginGate';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { useStaffPortal } from '../context/StaffPortalContext';

interface AdminDashboardPageProps {
  onNavigateToPos: () => void;
}

type AdminTab = 'marg-erp' | 'accounting' | 'moa2009' | 'inventory' | 'staff-access' | 'doctor-desk' | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateToPos,
}) => {
  const { t } = useLanguage();
  const { currentStaff, routingQueue } = useStaffPortal();
  const [activeTab, setActiveTab] = useState<AdminTab>('marg-erp');
  const [analyticsRefreshTick, setAnalyticsRefreshTick] = useState(0);
  const { lowStockItems, settings } = useClinicConfig();

  const triggerAnalyticsRefresh = () => {
    setAnalyticsRefreshTick((prev) => prev + 1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('marg-erp');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('accounting');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActiveTab('moa2009');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('inventory');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActiveTab('doctor-desk');
      } else if (e.key === 'F6' && currentStaff?.role === 'admin') {
        e.preventDefault();
        setActiveTab('staff-access');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setActiveTab('settings');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentStaff?.role]);

  const pendingDoctorCount = routingQueue.filter((r) => r.status === 'Waiting for Doctor').length;

  return (
    <div className="pt-28 md:pt-36 pb-20 min-h-screen bg-[#07150e] text-[#f5f3ec]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4">
        <div className="clinic-erp rounded-lg overflow-hidden border-2 border-[#166534] shadow-2xl">
          <div className="clinic-erp-header">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#facc15] text-[#052e16] font-extrabold text-[11px]">
                SASTECH ERP · CLINIC LEDGER &amp; STOCK
              </span>
              <span className="font-bold text-white">
                {settings.clinicName} — Outpatient Clinic Management Console
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-100 hidden sm:inline">
                Operator: {currentStaff?.fullName} ({currentStaff?.role.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={onNavigateToPos}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#facc15] hover:bg-[#fde047] text-[#052e16] font-extrabold text-[11px] uppercase tracking-wider cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.posAdmin.openPosBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Admin Dashboard Sections"
            className="flex flex-wrap items-center gap-1 p-1.5 bg-[#dcfce7] border-b border-[#86efac]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'marg-erp'}
              onClick={() => setActiveTab('marg-erp')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'marg-erp'
                  ? 'bg-[#14532d] border-[#052e16] text-[#facc15]'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#facc15]" />
              <span>[F1] Marg ERP 9+ (A1+) Console</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'accounting'}
              onClick={() => setActiveTab('accounting')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'accounting'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>[F2] {t.posAdmin.tabAccounting}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'moa2009'}
              onClick={() => setActiveTab('moa2009')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'moa2009'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>[F3] {t.posAdmin.tabMoa2009}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>[F4] {t.posAdmin.tabInventory}</span>
              {lowStockItems.length > 0 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-400 text-black text-[10px] font-extrabold font-mono">
                  <AlertTriangle className="w-3 h-3" />
                  {lowStockItems.length}
                </span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'doctor-desk'}
              onClick={() => setActiveTab('doctor-desk')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'doctor-desk'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>[F5] Doctor Rx Approvals ({pendingDoctorCount})</span>
            </button>

            {currentStaff?.role === 'admin' && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'staff-access'}
                onClick={() => setActiveTab('staff-access')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                  activeTab === 'staff-access'
                    ? 'bg-[#14532d] border-[#052e16] text-white'
                    : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>[F6] Staff Logins &amp; Roles</span>
              </button>
            )}

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#14532d] border-[#052e16] text-white'
                  : 'bg-white border-[#86efac] text-[#14532d] hover:bg-emerald-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>[F7] {t.posAdmin.tabSettings}</span>
            </button>
          </div>

          <div className="p-3 sm:p-4 bg-[#06140d] text-[#f5f3ec]">
            {activeTab === 'marg-erp' && (
              <MargErpClinicWorkspace
                onLedgerChanged={triggerAnalyticsRefresh}
                onNavigateToPos={onNavigateToPos}
              />
            )}
            {activeTab === 'accounting' && (
              <AccountingDashboard refreshTrigger={analyticsRefreshTick} />
            )}
            {activeTab === 'moa2009' && (
              <Accounting2009Workspace onLedgerChanged={triggerAnalyticsRefresh} />
            )}
            {activeTab === 'inventory' && (
              <InventoryTracker onInventoryUpdated={triggerAnalyticsRefresh} />
            )}
            {activeTab === 'doctor-desk' && <DoctorConsultationQueuePanel />}
            {activeTab === 'staff-access' && currentStaff?.role === 'admin' && (
              <StaffAccessManagerPanel />
            )}
            {activeTab === 'settings' && (
              <SocialSettingsPanel onSettingsSaved={triggerAnalyticsRefresh} />
            )}
          </div>

          <div className="clinic-erp-shortcut-bar">
            <span>
              <span className="clinic-erp-key">F2</span> P&amp;L &amp; Revenue
            </span>
            <span>
              <span className="clinic-erp-key">F3</span> General Ledger
            </span>
            <span>
              <span className="clinic-erp-key">F4</span> Closing Stock
            </span>
            <span>
              <span className="clinic-erp-key">F5</span> Doctor Rx Queue
            </span>
            {currentStaff?.role === 'admin' && (
              <span>
                <span className="clinic-erp-key">F6</span> Grant Staff Access
              </span>
            )}
            <span>
              <span className="clinic-erp-key">F7</span> Clinic Settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
