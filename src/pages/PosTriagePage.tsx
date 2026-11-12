import React, { useState } from 'react';
import { QrCode, ShoppingCart, UserCheck, BarChart3, ArrowRight } from 'lucide-react';
import { PosScanner } from '../components/PosScanner';
import { PatientCrmPanel } from '../components/PatientCrmPanel';

interface PosTriagePageProps {
  onNavigateToAdmin: () => void;
}

type OperationsTab = 'pos' | 'triage';

/**
 * PosTriagePage
 * ----------------------------------------------------------------------------
 * Front-Desk & Apothecary Operations Desk combining:
 *   1. Pharmacy POS Terminal & QR/Barcode Bottle Scanner (`PosScanner`)
 *   2. Patient CRM Registration, QR Badge Issuance & Instant Arrival Triage (`PatientCrmPanel`)
 */
export const PosTriagePage: React.FC<PosTriagePageProps> = ({
  onNavigateToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<OperationsTab>('pos');

  return (
    <div className="pt-28 md:pt-36 pb-20 min-h-screen bg-[#04140e] text-[#f5f3ec]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1b3b2f]">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              Safi Natural Care Clinic · Front Desk & Pharmacy
            </span>
            <h1 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#f5f3ec]">
              POS Pharmacy & Patient QR Triage
            </h1>
            <p className="text-xs sm:text-sm text-[#a6b6ad] max-w-2xl">
              Scan dispensary medicine barcodes for instant POS checkout or scan a patient's SNC-PAT QR identity card to pull their medical dossier and log arrival.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0a2117] border border-[#d4af37]/60 text-[#d4af37] font-bold text-xs uppercase tracking-wider hover:bg-[#113123] transition-colors cursor-pointer shrink-0"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Accounting Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div
          role="tablist"
          aria-label="POS and Triage Operations"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pos'}
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'pos'
                ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                : 'bg-[#07160f] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Pharmacy POS & Bottle Scanner</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'triage'}
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'triage'
                ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                : 'bg-[#07160f] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Patient CRM & QR Identity Triage</span>
          </button>
        </div>

        {/* Active View */}
        <div>
          {activeTab === 'pos' ? <PosScanner /> : <PatientCrmPanel />}
        </div>
      </div>
    </div>
  );
};
