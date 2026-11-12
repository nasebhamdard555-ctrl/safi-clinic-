import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  Sliders,
  QrCode,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { AccountingDashboard } from '../components/AccountingDashboard';
import { InventoryTracker } from '../components/InventoryTracker';
import { SocialSettingsPanel } from '../components/SocialSettingsPanel';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface AdminDashboardPageProps {
  onNavigateToPos: () => void;
}

type AdminTab = 'accounting' | 'inventory' | 'settings';

/**
 * AdminDashboardPage
 * ----------------------------------------------------------------------------
 * Executive Clinic Management Hub unifying:
 *   1. Real-Time Financial & Accounting Analytics + Automated Ledger
 *   2. Smart Dispensary Inventory Tracker & Proactive Low-Stock Alerts
 *   3. Configurable Social Media Channels & Overhead Deduction Parameters
 */
export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateToPos,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('accounting');
  const [analyticsRefreshTick, setAnalyticsRefreshTick] = useState(0);
  const { lowStockItems } = useClinicConfig();

  const triggerAnalyticsRefresh = () => {
    setAnalyticsRefreshTick((prev) => prev + 1);
  };

  return (
    <div className="pt-28 md:pt-36 pb-20 min-h-screen bg-[#04110b] text-[#f5f3ec]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1b3b2f]">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block">
              Safi Natural Care Clinic · Executive Operations
            </span>
            <h1 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#f5f3ec]">
              Clinical Accounting & Inventory Console
            </h1>
            <p className="text-xs sm:text-sm text-[#a6b6ad] max-w-2xl">
              Live P&L analytics across Kabul outpatient consultations and dispensary sales, automated COGS ledgering, stock monitoring, and site-wide channel settings.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToPos}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Open POS & QR Triage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Admin Dashboard Sections"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'accounting'}
            onClick={() => setActiveTab('accounting')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'accounting'
                ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                : 'bg-[#07160f] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Financial Analytics & Ledger</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                : 'bg-[#07160f] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Restock Alerts</span>
            {lowStockItems.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold font-mono tabular-nums">
                <AlertTriangle className="w-3 h-3" />
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                : 'bg-[#07160f] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Social & Overhead Settings</span>
          </button>
        </div>

        {/* Active Panel */}
        <div>
          {activeTab === 'accounting' && (
            <AccountingDashboard refreshTrigger={analyticsRefreshTick} />
          )}
          {activeTab === 'inventory' && (
            <InventoryTracker onInventoryUpdated={triggerAnalyticsRefresh} />
          )}
          {activeTab === 'settings' && (
            <SocialSettingsPanel onSettingsSaved={triggerAnalyticsRefresh} />
          )}
        </div>
      </div>
    </div>
  );
};
