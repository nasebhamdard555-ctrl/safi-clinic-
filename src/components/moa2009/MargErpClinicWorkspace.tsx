import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Truck,
  Landmark,
  Scale,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Stethoscope,
  Pill,
  ClipboardList,
  Calendar,
  Printer,
  Calculator,
  ChevronDown,
  X,
  Minimize2,
  Square,
  ShieldCheck,
  UserCheck,
  FolderOpen,
  DollarSign,
  Phone,
  QrCode,
  Building,
} from 'lucide-react';
import { useStaffPortal, StaffRole, PatientClinicalRouting } from '../../context/StaffPortalContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useClinicConfig } from '../../context/ClinicConfigContext';
import {
  StaffAccessManagerPanel,
  DoctorConsultationQueuePanel,
} from '../SastechLoginGate';

interface MargErpClinicWorkspaceProps {
  onLedgerChanged?: () => void;
  onNavigateToPos?: () => void;
}

type ActiveWindowType =
  | 'desktop'
  | 'ledger-accounts'
  | 'stock-valuation-dialog'
  | 'profit-and-loss'
  | 'doctor-desk'
  | 'reception-triage'
  | 'staff-access'
  | 'item-master'
  | 'stock-status'
  | 'cash-bank';

interface LedgerAccountRow {
  id: string;
  name: string;
  group: 'Sundry Debtors' | 'Sundry Creditors' | 'Cash & Bank' | 'Doctor Share' | 'Expenses' | 'Revenue';
  status: 'Debit' | 'Credit';
  balance: number;
  opening: number;
  debit: number;
  credit: number;
  bdc: number;
  address: string;
  area: string;
  phone: string;
  stNo: string;
}

const SAMPLE_LEDGER_ACCOUNTS: LedgerAccountRow[] = [
  {
    id: 'L-101',
    name: 'Gul Aziz IVA',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 4250.0,
    opening: 3500.0,
    debit: 1250.0,
    credit: 2000.0,
    bdc: 0,
    address: 'Shop 14, Jade Maiwand, Kabul',
    area: 'Jade Maiwand',
    phone: '+93 772 101 223',
    stNo: 'TIN-4491-IVA',
  },
  {
    id: 'L-102',
    name: 'Haji - REF: Pathan',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 1680.0,
    opening: 1200.0,
    debit: 520.0,
    credit: 1000.0,
    bdc: 0,
    address: 'Kabul Herbal Trading Center, Sarai Shahzada',
    area: 'Sarai Shahzada',
    phone: '+93 788 340 119',
    stNo: 'TIN-8891-AFG',
  },
  {
    id: 'L-103',
    name: 'Haji Romal',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 7541.0,
    opening: 6200.0,
    debit: 1659.0,
    credit: 3000.0,
    bdc: 0,
    address: 'Chowk-e-Madina, Kabul Afghanistan',
    area: 'Shar-e-Naw',
    phone: '+93 700 811 445',
    stNo: 'TIN-3320-KBL',
  },
  {
    id: 'L-104',
    name: 'Hakimzada Ltd',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 98142.0,
    opening: 85000.0,
    debit: 11858.0,
    credit: 25000.0,
    bdc: 0,
    address: 'Gul Bahar Center Floor 2, Kabul',
    area: 'Gul Bahar Center',
    phone: '+93 799 443 210',
    stNo: 'TIN-9081-HKM',
  },
  {
    id: 'L-105',
    name: 'HB Group',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 3180.0,
    opening: 2500.0,
    debit: 820.0,
    credit: 1500.0,
    bdc: 0,
    address: 'Kabul Industrial Zone, Bagrami',
    area: 'Bagrami',
    phone: '+93 786 554 990',
    stNo: 'TIN-6671-HBG',
  },
  {
    id: 'L-106',
    name: 'Hussain REF: Sahil',
    group: 'Sundry Debtors',
    status: 'Debit',
    balance: 2980.0,
    opening: 1800.0,
    debit: 1680.0,
    credit: 500.0,
    bdc: 0,
    address: 'Kabul Polyclinic Road, Kote Sangi',
    area: 'Kote Sangi',
    phone: '+93 773 992 110',
    stNo: 'TIN-1129-SAH',
  },
  {
    id: 'L-107',
    name: 'I-YA Mobile & Clinic Tech',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 9470.0,
    opening: 8100.0,
    debit: 2630.0,
    credit: 4000.0,
    bdc: 0,
    address: 'Office #C8, Gul Bahar Center Kabul',
    area: 'Gul Bahar Center',
    phone: '+93 789 556 800',
    stNo: 'TIN-IYA-1002',
  },
  {
    id: 'L-108',
    name: 'Idrees - Sahil Friend',
    group: 'Sundry Debtors',
    status: 'Debit',
    balance: 4950.0,
    opening: 4100.0,
    debit: 1850.0,
    credit: 1000.0,
    bdc: 0,
    address: 'Khair Khana Part 2, Kabul',
    area: 'Khair Khana',
    phone: '+93 700 120 448',
    stNo: 'TIN-4911-IDR',
  },
  {
    id: 'L-109',
    name: 'Irfan Shamim NBH',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 7850.0,
    opening: 6000.0,
    debit: 1150.0,
    credit: 3000.0,
    bdc: 0,
    address: 'Neda Bazaar, Kabul',
    area: 'Neda Bazaar',
    phone: '+93 774 291 300',
    stNo: 'TIN-9921-IRF',
  },
  {
    id: 'L-110',
    name: 'Istiqlal Mobiled & Supplies',
    group: 'Sundry Debtors',
    status: 'Debit',
    balance: 1420.0,
    opening: 1000.0,
    debit: 820.0,
    credit: 400.0,
    bdc: 0,
    address: 'Istiqlal Chowk, Kabul',
    area: 'Istiqlal',
    phone: '+93 799 101 884',
    stNo: 'TIN-7718-IST',
  },
  {
    id: 'L-111',
    name: 'Kaka Samad',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 850.0,
    opening: 850.0,
    debit: 0.0,
    credit: 0.0,
    bdc: 0,
    address: 'Karte Parwan, Kabul',
    area: 'Karte Parwan',
    phone: '+93 778 901 234',
    stNo: 'TIN-3319-KS',
  },
  {
    id: 'L-112',
    name: 'Orya Mobile & Pharma Logistics',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 3180.0,
    opening: 2500.0,
    debit: 320.0,
    credit: 1000.0,
    bdc: 0,
    address: 'Shop #C92 Gul Bahar Center Kabul',
    area: 'Gul Bahar Center',
    phone: '+93 771 990 441',
    stNo: 'TIN-8819-ORY',
  },
  {
    id: 'L-113',
    name: 'Saifuddin (Dispensary Herbs)',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 1960.0,
    opening: 1500.0,
    debit: 540.0,
    credit: 1000.0,
    bdc: 0,
    address: 'Panjshir Herbal Wholesalers, Kabul',
    area: 'Shar-e-Naw',
    phone: '+93 700 338 912',
    stNo: 'TIN-7440-SAIF',
  },
  {
    id: 'L-114',
    name: 'Ziyafat Mobile & Botanical Packs',
    group: 'Sundry Debtors',
    status: 'Debit',
    balance: 13355.0,
    opening: 11119.9,
    debit: 4235.1,
    credit: 2000.0,
    bdc: 0,
    address: 'Dehbori Square, Kabul',
    area: 'Dehbori',
    phone: '+93 780 441 228',
    stNo: 'TIN-1335-ZYF',
  },
  {
    id: 'L-115',
    name: 'Qawasim Mobile (Kabul Imports)',
    group: 'Sundry Creditors',
    status: 'Credit',
    balance: 13355.0,
    opening: 11119.9,
    debit: 1765.1,
    credit: 4000.0,
    bdc: 0,
    address: 'Sarai Shahzada Ground Floor, Kabul',
    area: 'Sarai Shahzada',
    phone: '+93 799 881 202',
    stNo: 'TIN-9901-QAW',
  },
  {
    id: 'L-116',
    name: 'Dr. Hafizullah Safi (Physician Share)',
    group: 'Doctor Share',
    status: 'Credit',
    balance: 18450.0,
    opening: 12000.0,
    debit: 3550.0,
    credit: 10000.0,
    bdc: 0,
    address: 'Safi Clinic Consulting Room 1, Gul Bahar Center',
    area: 'Kabul Center',
    phone: '+93 700 551 234',
    stNo: 'MD-KBL-8921',
  },
  {
    id: 'L-117',
    name: 'Dispensary Cash Drawer (Daily POS)',
    group: 'Cash & Bank',
    status: 'Debit',
    balance: 24890.0,
    opening: 15000.0,
    debit: 45890.0,
    credit: 36000.0,
    bdc: 0,
    address: 'Cash Counter #1, Ground Floor Dispensary',
    area: 'Gul Bahar Center',
    phone: '+93 789 556 800',
    stNo: 'CASH-DRAWER-01',
  },
  {
    id: 'L-118',
    name: 'Da Afghanistan Bank (Apothecary A/c)',
    group: 'Cash & Bank',
    status: 'Debit',
    balance: 142850.0,
    opening: 120000.0,
    debit: 38850.0,
    credit: 16000.0,
    bdc: 0,
    address: 'DAB Main Branch, Kabul Afghanistan',
    area: 'DAB Central',
    phone: '+93 20 210 0301',
    stNo: 'DAB-IBAN-AF09',
  },
];

export const MargErpClinicWorkspace: React.FC<MargErpClinicWorkspaceProps> = ({
  onLedgerChanged,
  onNavigateToPos,
}) => {
  const { currentStaff, routingQueue, routePatientFromReception } = useStaffPortal();
  const { formatPrice } = useCurrency();
  const { settings } = useClinicConfig();

  // Active sub-window / popup
  const [activeWindow, setActiveWindow] = useState<ActiveWindowType>('desktop');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Selected ledger row in ledger accounts screen
  const [selectedLedgerIndex, setSelectedLedgerIndex] = useState(3); // Hakimzada Ltd by default (matches video)
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Stock Valuation state
  const [stockValuationOption, setStockValuationOption] = useState<'CURRENT DATE' | 'ALL DAYS'>('CURRENT DATE');

  // Reception quick patient state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [patientMizaj, setPatientMizaj] = useState('Damavi (Sanguine)');
  const [receptionNotice, setReceptionNotice] = useState<string | null>(null);

  // Keyboard navigation for Marg ERP (Esc = close, F2 = P&L, F3 = Ledger, F4 = Stock Val)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openDropdown) {
          setOpenDropdown(null);
        } else if (activeWindow !== 'desktop') {
          setActiveWindow('desktop');
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActiveWindow('profit-and-loss');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActiveWindow('ledger-accounts');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveWindow('stock-valuation-dialog');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActiveWindow('doctor-desk');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setActiveWindow('reception-triage');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindow, openDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    const closeMenu = () => setOpenDropdown(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const filteredLedgers = useMemo(() => {
    const q = ledgerSearch.toLowerCase().trim();
    if (!q) return SAMPLE_LEDGER_ACCOUNTS;
    return SAMPLE_LEDGER_ACCOUNTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.stNo.toLowerCase().includes(q)
    );
  }, [ledgerSearch]);

  const currentLedger = filteredLedgers[selectedLedgerIndex] || filteredLedgers[0];

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    const res = routePatientFromReception({
      patientName: patientName.trim(),
      phone: patientPhone.trim() || '+93 700 000 000',
      age: patientAge.trim() || '30',
      gender: 'Male',
      mizaj: patientMizaj,
      symptoms: patientSymptoms.trim() || 'General weakness & clinical consultation',
      assignedDoctor: 'Dr. Hafizullah Safi',
      prescribedMedicines: [],
      prescriptionNotes: 'Patient routed from Marg ERP reception desk.',
      qrToken: `SNC-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setReceptionNotice(`Patient ${res.patientName} (${res.qrToken}) routed to Dr. Hafizullah Safi.`);
    setPatientName('');
    setPatientPhone('');
    setPatientAge('');
    setPatientSymptoms('');
  };

  const handleToggleMenu = (e: React.MouseEvent, menuName: string) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div className="clinic-erp font-mono select-none rounded border-2 border-[#166534] bg-[#eef3ee] text-[#111827] shadow-2xl overflow-hidden text-xs">
      {/* 1. Classic Windows / Marg ERP 9+ Title Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#14532d] via-[#166534] to-[#0f391f] text-white px-2 py-1 border-b border-[#052e16] font-sans font-bold text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#facc15] text-[#052e16] rounded-sm flex items-center justify-center font-black text-[9px]">
            M
          </div>
          <span>
            MARG ERP 9+ (A1+) · [{settings.clinicName.toUpperCase()} · C93 GUL BAHAR CENTER KABUL] · [FY: Oct 2026 - Sep 2027]
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-[#86efac] font-mono mr-2">
            User: {currentStaff?.fullName} ({currentStaff?.role.toUpperCase()})
          </span>
          <button
            type="button"
            onClick={() => setActiveWindow('desktop')}
            title="Minimize to Desktop"
            className="w-5 h-4 bg-[#14532d] hover:bg-[#15803d] border border-[#86efac]/40 flex items-center justify-center cursor-pointer"
          >
            <Minimize2 className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => {}}
            title="Maximize"
            className="w-5 h-4 bg-[#14532d] hover:bg-[#15803d] border border-[#86efac]/40 flex items-center justify-center cursor-pointer"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveWindow('desktop')}
            title="Close Window"
            className="w-5 h-4 bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Marg ERP Menu Bar with Interactive Drop-Down Menus ("Drop the Army news") */}
      <div className="relative flex flex-wrap items-center bg-[#f0f4f0] border-b border-[#9ca3af] text-[11px] font-sans font-semibold text-[#111827]">
        {/* Masters */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'masters')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'masters' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span><u>M</u>asters</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'masters' && (
            <div className="absolute top-full left-0 z-50 w-56 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('ledger-accounts');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Ledger Master (Accounts)</span>
                <span className="text-[10px] text-gray-400 font-mono">F3</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('item-master');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Item Master (Medicines &amp; Herbs)</span>
                <span className="text-[10px] text-gray-400 font-mono">Alt+I</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('doctor-desk');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Doctor / Practitioner Master</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('reception-triage');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Patient Master (Outpatient Registry)</span>
                <span className="text-[10px] text-gray-400 font-mono">F6</span>
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('stock-valuation-dialog');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Opening Stock Entry</span>
                <span className="text-[10px] text-gray-400 font-mono">F4</span>
              </button>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'transactions')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'transactions' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span><u>T</u>ransactions</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'transactions' && (
            <div className="absolute top-full left-0 z-50 w-64 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  onNavigateToPos?.();
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <span>Dispensary Medicine Sale (POS)</span>
                <span className="text-[10px] bg-yellow-300 text-black px-1 rounded font-mono">SALE</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('doctor-desk');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Doctor Consultation &amp; Fee Billing</span>
                <span className="text-[10px] text-gray-400 font-mono">F5</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('ledger-accounts');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Purchase Bill (Herbal Suppliers)</span>
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('cash-bank');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Receipt &amp; Payment Voucher</span>
              </button>
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'accounts')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'accounts' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span><u>A</u>ccounts</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'accounts' && (
            <div className="absolute top-full left-0 z-50 w-60 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('ledger-accounts');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <span>Ledger Accounts (Interactive)</span>
                <span className="text-[10px] text-emerald-800 font-mono">F3</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('cash-bank');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Cash &amp; Bank Book</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('ledger-accounts');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Outstanding Receivables / Payables</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('profit-and-loss');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Daily Analysis (MIS)</span>
              </button>
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'stock')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'stock' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span><u>S</u>tock</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'stock' && (
            <div className="absolute top-full left-0 z-50 w-64 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('stock-status');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Stock Status (Realtime Balances)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('stock-valuation-dialog');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <span>Stock Valuation (Update P&amp;L Stock)</span>
                <span className="text-[10px] text-gray-400 font-mono">F4</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('item-master');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Botanical Batch &amp; Expiry Monitor</span>
              </button>
            </div>
          )}
        </div>

        {/* Final Reports */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'reports')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'reports' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span><u>F</u>inal Reports</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'reports' && (
            <div className="absolute top-full left-0 z-50 w-60 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('profit-and-loss');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <span>Profit &amp; Loss Account</span>
                <span className="text-[10px] text-emerald-800 font-mono">F2</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('profit-and-loss');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Balance Sheet</span>
                <span className="text-[10px] text-gray-400 font-mono">F3</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('profit-and-loss');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <span>Today's Gross Profit</span>
              </button>
            </div>
          )}
        </div>

        {/* Clinic Staff Only (No Hospital Size Clutter) */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleToggleMenu(e, 'staff')}
            className={`px-3 py-1 hover:bg-[#d1fae5] border-r border-[#d1d5db] flex items-center gap-1 cursor-pointer ${
              openDropdown === 'staff' ? 'bg-[#bbf7d0] font-bold text-[#14532d]' : ''
            }`}
          >
            <span className="text-[#14532d] font-bold"><u>C</u>linic Staff</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {openDropdown === 'staff' && (
            <div className="absolute top-full left-0 z-50 w-64 bg-white border-2 border-[#166534] shadow-2xl py-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('doctor-desk');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#14532d]" />
                  <span>Doctor Consultation &amp; Rx Approvals</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">F5</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWindow('reception-triage');
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-[#14532d]" />
                  <span>Reception Desk &amp; Patient Intake</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">F6</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToPos?.();
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#14532d]" />
                  <span>Dispensary Counter (Medicine Seller)</span>
                </div>
              </button>
              {currentStaff?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveWindow('staff-access');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#14532d] hover:text-white flex items-center justify-between border-t border-gray-200 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#14532d]" />
                    <span>Staff Directory &amp; Roles</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Exit / Desktop */}
        <button
          type="button"
          onClick={() => setActiveWindow('desktop')}
          className="px-3 py-1 hover:bg-[#fee2e2] text-rose-800 font-semibold cursor-pointer ml-auto"
        >
          <span>E<u>x</u>it to Desktop</span>
        </button>
      </div>

      {/* 3. Marg ERP Main Body: Left Sidebar + Central Work Area + Right eRetail Drawer */}
      <div className="grid grid-cols-12 min-h-[520px] bg-[#f8faf8]">
        {/* Left Sidebar: "Most viewed reports" (Exact replica of video at 00:00-00:05) */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 bg-[#f1f5f1] border-r border-[#9ca3af] p-2 flex flex-col justify-between">
          <div>
            <div className="bg-[#14532d] text-white px-2 py-1 font-sans font-bold text-[11px] uppercase tracking-wider mb-1.5 border border-[#052e16]">
              Most viewed reports
            </div>
            <div className="space-y-0.5 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setActiveWindow('item-master')}
                className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer ${
                  activeWindow === 'item-master' ? 'bg-[#15803d] text-white font-bold' : 'text-[#1f2937]'
                }`}
              >
                Item Master
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('profit-and-loss')}
                className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer ${
                  activeWindow === 'profit-and-loss' ? 'bg-[#15803d] text-white font-bold' : 'text-[#1f2937]'
                }`}
              >
                Profit &amp; Loss
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('stock-status')}
                className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer ${
                  activeWindow === 'stock-status' ? 'bg-[#15803d] text-white font-bold' : 'text-[#1f2937]'
                }`}
              >
                Stock Status
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('stock-valuation-dialog')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Stock Openings
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('ledger-accounts')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Credit Note
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('ledger-accounts')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Debit Note
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('ledger-accounts')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Party wise reports
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('ledger-accounts')}
                className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer font-bold ${
                  activeWindow === 'ledger-accounts' ? 'bg-[#15803d] text-white' : 'text-[#14532d]'
                }`}
              >
                Ledger Accounts
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('ledger-accounts')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Outstanding
              </button>
              <button
                type="button"
                onClick={() => onNavigateToPos?.()}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Sale &amp; Sales Analysis
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('profit-and-loss')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Daily Analysis (MIS)
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('profit-and-loss')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Today&apos;s Gross Profit
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('cash-bank')}
                className="w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white text-[#1f2937] cursor-pointer"
              >
                Cash &amp; Bank Book
              </button>
              <div className="border-t border-[#9ca3af] my-1 pt-1">
                <div className="text-[10px] font-bold text-[#14532d] uppercase px-1 mb-0.5">
                  Clinic Operations
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('doctor-desk')}
                  className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer flex items-center justify-between ${
                    activeWindow === 'doctor-desk' ? 'bg-[#15803d] text-white font-bold' : 'text-[#1f2937]'
                  }`}
                >
                  <span>Doctor Rx Queue</span>
                  <span className="text-[10px] bg-amber-400 text-black px-1 rounded font-bold">
                    {routingQueue.filter((r) => r.status === 'Waiting for Doctor').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveWindow('reception-triage')}
                  className={`w-full text-left px-2 py-1 rounded-xs hover:bg-[#15803d] hover:text-white cursor-pointer ${
                    activeWindow === 'reception-triage' ? 'bg-[#15803d] text-white font-bold' : 'text-[#1f2937]'
                  }`}
                >
                  Reception Triage
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#9ca3af] text-[10px] text-gray-500 font-sans">
            <div>Marg ERP A1+ Enterprise</div>
            <div>Silver Edition v2026</div>
          </div>
        </div>

        {/* Center Main Work Window */}
        <div className="col-span-12 md:col-span-6 lg:col-span-8 p-3 flex flex-col justify-between overflow-x-auto relative">
          {/* WINDOW A: DESKTOP WALLPAPER / HERO (Matches Video 00:01-00:04) */}
          {activeWindow === 'desktop' && (
            <div className="space-y-4">
              {/* Marg ERP Branded Banner matching the Dell Laptop Screen in Video */}
              <div className="border-2 border-[#166534] bg-white rounded p-4 shadow-md text-center space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-xs rounded">
                      MARG
                    </span>
                    <span className="font-extrabold text-[#14532d] text-sm tracking-wide">
                      MARG ERP A1+ · CLINIC MANAGEMENT BACKBONE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-sans">
                    <span className="px-1.5 py-0.5 bg-sky-100 text-sky-900 border border-sky-400 font-bold rounded">
                      CMMI Level 3
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold rounded">
                      ISO 9001:2015
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center py-2">
                  <div className="text-left space-y-1 font-sans text-xs">
                    <div className="font-bold text-[#14532d] text-sm">
                      {settings.clinicName}
                    </div>
                    <div className="text-gray-700 text-[11px]">
                      C93 Gul Bahar Center Kabul Afghanistan
                    </div>
                    <div className="text-gray-500 text-[10px] font-mono">
                      Period: Oct. 2026 – Sep. 2027
                    </div>
                    <div className="text-emerald-800 font-semibold text-[11px] pt-1">
                      Direct WhatsApp Order / Rx Service
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-emerald-50 to-green-100 border border-emerald-300 rounded">
                    <div className="w-16 h-16 rounded-full bg-[#14532d] border-2 border-[#facc15] flex items-center justify-center text-white font-black text-xl shadow">
                      MARG
                    </div>
                    <span className="text-[10px] font-bold text-[#14532d] uppercase tracking-wider mt-1">
                      Certified Clinical System
                    </span>
                    <span className="text-[9px] text-gray-600 font-sans">
                      Apothecary &amp; Doctor Desk
                    </span>
                  </div>

                  <div className="space-y-1.5 text-right font-sans text-xs">
                    <div className="inline-block px-2 py-0.5 bg-[#facc15] text-[#052e16] font-extrabold text-[10px] uppercase rounded">
                      FREE AMC ACTIVE
                    </div>
                    <div className="text-[11px] text-gray-800 font-bold">
                      M-SOFT TECHNOLOGIES
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">
                      Help Line: +93 774 291 300
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">
                      msoft.kabul@margerp.com
                    </div>
                  </div>
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveWindow('ledger-accounts')}
                    className="p-2.5 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#86efac] rounded text-left transition cursor-pointer"
                  >
                    <div className="text-emerald-900 font-bold text-xs flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#14532d]" />
                      <span>Ledger Accounts</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">HotKey: F3</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWindow('stock-valuation-dialog')}
                    className="p-2.5 bg-[#fefce8] hover:bg-[#fef9c3] border border-[#fde047] rounded text-left transition cursor-pointer"
                  >
                    <div className="text-amber-900 font-bold text-xs flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-amber-700" />
                      <span>Stock Valuation</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">HotKey: F4</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWindow('profit-and-loss')}
                    className="p-2.5 bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#6ee7b7] rounded text-left transition cursor-pointer"
                  >
                    <div className="text-emerald-950 font-bold text-xs flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Profit &amp; Loss</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">HotKey: F2</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWindow('doctor-desk')}
                    className="p-2.5 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#7dd3fc] rounded text-left transition cursor-pointer"
                  >
                    <div className="text-sky-950 font-bold text-xs flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-sky-800" />
                      <span>Doctor Rx Queue</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">HotKey: F5</div>
                  </button>
                </div>
              </div>

              {/* Clinic Outpatient Queue Summary (Strictly Clinic Staff) */}
              <div className="border border-[#166534] bg-white rounded p-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-[#14532d] border-b border-gray-200 pb-1">
                  <span>OUTPATIENT CLINIC STATUS · TODAY</span>
                  <span className="font-mono text-[10px] text-gray-500">
                    Queue: {routingQueue.length} Patients Registered
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-amber-50 border border-amber-300 rounded">
                    <div className="text-amber-900 font-bold">Waiting for Doctor</div>
                    <div className="text-lg font-bold font-mono text-amber-800">
                      {routingQueue.filter((r) => r.status === 'Waiting for Doctor').length}
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded">
                    <div className="text-emerald-900 font-bold">Doctor Approved (Rx)</div>
                    <div className="text-lg font-bold font-mono text-emerald-800">
                      {routingQueue.filter((r) => r.status === 'Approved by Doctor').length}
                    </div>
                  </div>
                  <div className="p-2 bg-sky-50 border border-sky-300 rounded">
                    <div className="text-sky-900 font-bold">Dispensed at Pharmacy</div>
                    <div className="text-lg font-bold font-mono text-sky-800">
                      {routingQueue.filter((r) => r.status === 'Dispensed').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WINDOW B: LEDGER ACCOUNTS (Exact replica of video 00:07-00:20) */}
          {activeWindow === 'ledger-accounts' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              {/* Header */}
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-[#facc15]">LEDGER ACCOUNTS</span>
                  <span className="text-white/80 font-normal">|</span>
                  <span className="text-xs">AYAN MOBLIE-MOBILE · {settings.clinicName.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-1.5 bg-[#dcfce7] border-b border-[#86efac] flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#14532d]" />
                <span className="text-xs font-bold text-[#14532d]">Tab=Search Party:</span>
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => {
                    setLedgerSearch(e.target.value);
                    setSelectedLedgerIndex(0);
                  }}
                  placeholder="Type party / ledger name (e.g. Hakimzada, Sahil, IVA)..."
                  className="flex-1 px-2 py-0.5 bg-white border border-[#166534] text-xs font-mono outline-none"
                />
              </div>

              {/* Split Screen Table + Detail Card */}
              <div className="grid grid-cols-12 flex-1 overflow-hidden">
                {/* Account List Table */}
                <div className="col-span-12 lg:col-span-8 overflow-y-auto max-h-[360px] border-r border-[#d1d5db]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#e5e7eb] text-[#111827] border-b border-[#9ca3af] sticky top-0 font-bold">
                        <th className="p-1 border-r border-[#d1d5db]">Account Name</th>
                        <th className="p-1 border-r border-[#d1d5db]">Group</th>
                        <th className="p-1 text-right">Current Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLedgers.map((acc, idx) => {
                        const isSelected = idx === selectedLedgerIndex;
                        return (
                          <tr
                            key={acc.id}
                            onClick={() => setSelectedLedgerIndex(idx)}
                            className={`border-b border-[#e5e7eb] cursor-pointer transition ${
                              isSelected
                                ? 'bg-[#166534] text-white font-bold'
                                : 'hover:bg-emerald-50 text-[#111827]'
                            }`}
                          >
                            <td className="p-1 border-r border-[#d1d5db] font-mono">
                              {isSelected ? `▶ ${acc.name}` : `  ${acc.name}`}
                            </td>
                            <td className="p-1 border-r border-[#d1d5db] text-[11px] opacity-90">
                              {acc.group}
                            </td>
                            <td className="p-1 text-right font-mono tabular-nums">
                              {acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {acc.status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Account Details Card (Exact replica of video right side) */}
                <div className="col-span-12 lg:col-span-4 bg-[#f9fafb] p-3 text-xs flex flex-col justify-between border-t lg:border-t-0 border-[#d1d5db]">
                  <div className="space-y-2">
                    <div className="border-b border-gray-300 pb-1">
                      <div className="font-bold text-sm text-[#14532d]">{currentLedger?.name}</div>
                      <div className="text-[11px] text-gray-600">{currentLedger?.group}</div>
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Status:</span>
                        <span className="font-bold text-[#14532d]">{currentLedger?.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Opening:</span>
                        <span>{currentLedger?.opening.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debit:</span>
                        <span className="text-emerald-800">{currentLedger?.debit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit:</span>
                        <span className="text-amber-800">{currentLedger?.credit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-1 font-bold">
                        <span>Net Balance:</span>
                        <span className="text-[#14532d]">
                          {currentLedger?.balance.toFixed(2)} {currentLedger?.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-2 space-y-1 text-[10px] font-sans">
                      <div>
                        <span className="font-bold text-gray-700">Address: </span>
                        <span>{currentLedger?.address}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">Area: </span>
                        <span>{currentLedger?.area}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">Phone: </span>
                        <span className="font-mono">{currentLedger?.phone}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">ST. No: </span>
                        <span className="font-mono">{currentLedger?.stNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-300 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveWindow('profit-and-loss')}
                      className="flex-1 py-1 bg-[#14532d] hover:bg-[#166534] text-white font-bold rounded text-center cursor-pointer"
                    >
                      View P&amp;L
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveWindow('desktop')}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotkey Footer (Exact replica of video bottom bar) */}
              <div className="bg-[#1e293b] text-white px-2 py-1 flex flex-wrap gap-2 text-[10px] font-mono border-t border-black">
                <span><span className="bg-[#facc15] text-black px-1 font-bold">Alt+F1</span> Others</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F2</span> Date</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F3</span> Envelope</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F4</span> Interest</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F8</span> Adjust</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F9</span> PDC</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">Tab</span> Search</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F10</span> Filter</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">Ctrl+F1</span> Summary</span>
              </div>
            </div>
          )}

          {/* WINDOW C: STOCK VALUATION MODAL (Exact replica of video 00:29-00:32) */}
          {activeWindow === 'stock-valuation-dialog' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md bg-[#eef3ee] border-2 border-[#166534] shadow-2xl overflow-hidden font-mono text-xs">
                {/* Modal Title */}
                <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                  <span>STOCK VALUATION</span>
                  <button
                    type="button"
                    onClick={() => setActiveWindow('desktop')}
                    className="text-white hover:text-rose-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 text-center space-y-6 bg-white">
                  <div className="text-sm font-bold text-[#14532d] uppercase tracking-wide">
                    Update Profit &amp; Loss Stock ?
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveWindow('desktop')}
                      className="px-5 py-2 border-2 border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold uppercase cursor-pointer"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStockValuationOption('CURRENT DATE');
                        setActiveWindow('profit-and-loss');
                      }}
                      className="px-5 py-2 border-2 border-[#14532d] bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#14532d] font-bold uppercase shadow cursor-pointer"
                    >
                      CURRENT DATE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStockValuationOption('ALL DAYS');
                        setActiveWindow('profit-and-loss');
                      }}
                      className="px-5 py-2 border-2 border-[#14532d] bg-[#14532d] hover:bg-[#166534] text-white font-bold uppercase shadow cursor-pointer"
                    >
                      ALL DAYS
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-500 font-sans">
                    Closing stock of herbs, dispensary elixirs, and raw botanicals will be factored into the Profit &amp; Loss statement.
                  </div>
                </div>

                <div className="bg-[#f0fdf4] border-t border-[#86efac] px-3 py-1 text-[11px] text-right font-mono text-[#14532d]">
                  ENTER=Select · ESC=Cancel
                </div>
              </div>
            </div>
          )}

          {/* WINDOW D: PROFIT & LOSS ACCOUNT (Exact replica of video 00:35-00:37) */}
          {activeWindow === 'profit-and-loss' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              {/* Header */}
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-[#facc15]">PROFIT &amp; LOSS A/C UPTO: 14/11/2026</span>
                  <span className="text-white/80 font-normal">|</span>
                  <span className="text-xs">AYAN MOBLIE-MOBILE · {settings.clinicName.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>

              {/* Sub-header / Stock update tag */}
              <div className="bg-[#dcfce7] border-b border-[#86efac] px-3 py-1 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#14532d]">
                  Valuation Mode: [{stockValuationOption}] · Double-Entry Ledger Synchronized
                </span>
                <span className="font-mono text-gray-700">Office: #C93 GUL BAHAR CENTER KABUL</span>
              </div>

              {/* Split T-Ledger Columns (Matches exact numbers in video) */}
              <div className="grid grid-cols-12 flex-1 divide-x divide-[#d1d5db] text-xs font-mono">
                {/* Left Column: Dr. Amount */}
                <div className="col-span-6 flex flex-col justify-between">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#e5e7eb] border-b border-[#9ca3af] font-bold">
                        <th className="p-1.5">Particulars (Debit)</th>
                        <th className="p-1.5 text-right">Dr. Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Opening Stock</td>
                        <td className="p-1.5 text-right">20,651.00</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Purchase A/c</td>
                        <td className="p-1.5 text-right font-bold text-rose-900">206,510.80</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Expenses (Direct)</td>
                        <td className="p-1.5 text-right">1,312.65</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="p-1.5 font-bold text-[#14532d]">Gross Profit (13.95 %)</td>
                        <td className="p-1.5 text-right font-bold text-[#14532d]">21,060.64</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t-2 border-black p-1.5 bg-[#f3f4f6] flex justify-between font-black text-sm">
                    <span>Total</span>
                    <span>230,892.09</span>
                  </div>
                </div>

                {/* Right Column: Cr. Amount */}
                <div className="col-span-6 flex flex-col justify-between">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#e5e7eb] border-b border-[#9ca3af] font-bold">
                        <th className="p-1.5">Particulars (Credit)</th>
                        <th className="p-1.5 text-right">Cr. Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Sales A/c (Dispensary + Consult)</td>
                        <td className="p-1.5 text-right font-bold text-[#14532d]">151,008.40</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Closing Stock</td>
                        <td className="p-1.5 text-right text-emerald-900">71,119.90</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold text-gray-800">Income (Direct)</td>
                        <td className="p-1.5 text-right">8,763.79</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="p-1.5 font-bold text-[#14532d]">Gross Profit c/f</td>
                        <td className="p-1.5 text-right font-bold text-[#14532d]">21,060.64</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t-2 border-black p-1.5 bg-[#f3f4f6] flex justify-between font-black text-sm">
                    <span>Total</span>
                    <span>230,892.09</span>
                  </div>
                </div>
              </div>

              {/* Net Profit Summary Strip (Exact replica of video at 00:35) */}
              <div className="bg-[#14532d] text-white p-2 flex items-center justify-between font-bold border-t-2 border-black">
                <div className="flex items-center gap-3">
                  <span className="text-[#facc15] text-sm">Net Profit:</span>
                  <span className="text-base text-white font-mono">13.95 %</span>
                  <span className="text-white/60">=</span>
                  <span className="text-base text-[#facc15] font-mono">21,060.64</span>
                </div>
                <div className="font-mono text-sm">
                  Total: 21,060.64
                </div>
              </div>

              {/* Hotkey Footer */}
              <div className="bg-[#1e293b] text-white px-2 py-1 flex flex-wrap gap-3 text-[10px] font-mono border-t border-black">
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F2</span> Month wise P&amp;L A/c</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">F3</span> Balance Sheet</span>
                <span><span className="bg-[#facc15] text-black px-1 font-bold">Esc</span> Close P&amp;L</span>
              </div>
            </div>
          )}

          {/* WINDOW E: DOCTOR CONSULTATION QUEUE & RX APPROVALS */}
          {activeWindow === 'doctor-desk' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#facc15]" />
                  <span>DOCTOR CONSULTATION &amp; PRESCRIPTION APPROVAL (OUTPATIENT DESK)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>
              <div className="p-3 overflow-y-auto max-h-[460px]">
                <DoctorConsultationQueuePanel />
              </div>
            </div>
          )}

          {/* WINDOW F: RECEPTION DESK & OUTPATIENT TRIAGE */}
          {activeWindow === 'reception-triage' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#facc15]" />
                  <span>RECEPTION INTAKE &amp; PATIENT ROUTING DESK</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto max-h-[460px]">
                {receptionNotice && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-500 text-emerald-950 font-bold text-xs flex justify-between items-center">
                    <span>{receptionNotice}</span>
                    <button
                      type="button"
                      onClick={() => setReceptionNotice(null)}
                      className="underline text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleRegisterPatient}
                  className="p-3 bg-[#f0fdf4] border border-[#86efac] rounded space-y-3"
                >
                  <div className="font-bold text-xs text-[#14532d] uppercase">
                    Register New Outpatient for Doctor Consultation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="block">
                      <span className="block text-[11px] font-bold text-gray-700 mb-0.5">Patient Full Name *</span>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Ahmad Shah"
                        className="w-full px-2 py-1 bg-white border border-gray-400 text-xs font-mono"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-bold text-gray-700 mb-0.5">Phone Number</span>
                      <input
                        type="text"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+93 700 ..."
                        className="w-full px-2 py-1 bg-white border border-gray-400 text-xs font-mono"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-bold text-gray-700 mb-0.5">Age</span>
                      <input
                        type="text"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="35"
                        className="w-full px-2 py-1 bg-white border border-gray-400 text-xs font-mono"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="block">
                      <span className="block text-[11px] font-bold text-gray-700 mb-0.5">Mizaj / Constitution</span>
                      <select
                        value={patientMizaj}
                        onChange={(e) => setPatientMizaj(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-gray-400 text-xs font-sans"
                      >
                        <option value="Damavi (Sanguine - Hot/Moist)">Damavi (Sanguine - Hot/Moist)</option>
                        <option value="Safravi (Bilious - Hot/Dry)">Safravi (Bilious - Hot/Dry)</option>
                        <option value="Balghami (Phlegmatic - Cold/Moist)">Balghami (Phlegmatic - Cold/Moist)</option>
                        <option value="Saudavi (Melancholic - Cold/Dry)">Saudavi (Melancholic - Cold/Dry)</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-bold text-gray-700 mb-0.5">Presenting Symptoms</span>
                      <input
                        type="text"
                        value={patientSymptoms}
                        onChange={(e) => setPatientSymptoms(e.target.value)}
                        placeholder="e.g. Digestive reflux, joint fatigue, headache"
                        className="w-full px-2 py-1 bg-white border border-gray-400 text-xs font-mono"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer shadow"
                  >
                    Send to Dr. Hafizullah Safi Consultation Queue
                  </button>
                </form>

                {/* Patient Queue List */}
                <div className="border border-[#86efac] overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#dcfce7] text-[#14532d] font-bold border-b border-[#86efac]">
                        <th className="p-1.5">Token ID</th>
                        <th className="p-1.5">Patient Name</th>
                        <th className="p-1.5">Phone</th>
                        <th className="p-1.5">Status</th>
                        <th className="p-1.5">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {routingQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-50">
                          <td className="p-1.5 font-mono font-bold">{item.qrToken}</td>
                          <td className="p-1.5 font-bold">{item.patientName}</td>
                          <td className="p-1.5 font-mono">{item.phone}</td>
                          <td className="p-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Waiting for Doctor'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-400'
                                  : item.status === 'Approved by Doctor'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                                  : 'bg-sky-100 text-sky-900 border border-sky-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-1.5 font-mono text-gray-500">{item.registeredAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WINDOW G: STAFF ACCESS & LOGINS */}
          {activeWindow === 'staff-access' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#facc15]" />
                  <span>CLINIC STAFF DIRECTORY &amp; LOGIN PERMISSIONS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>
              <div className="p-3 overflow-y-auto max-h-[460px]">
                <StaffAccessManagerPanel />
              </div>
            </div>
          )}

          {/* WINDOW H: ITEM MASTER (Medicines & Herbs) */}
          {activeWindow === 'item-master' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-[#facc15]" />
                  <span>ITEM MASTER · APOTHECARY DISPENSARY REMEDIES</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>
              <div className="p-3 space-y-2 overflow-y-auto max-h-[420px]">
                <table className="w-full text-left text-xs border border-gray-300">
                  <thead className="bg-[#e5e7eb] font-bold">
                    <tr>
                      <th className="p-1.5 border">Item Code</th>
                      <th className="p-1.5 border">Remedy / Herbal Item Name</th>
                      <th className="p-1.5 border">Category</th>
                      <th className="p-1.5 border text-right">Rate</th>
                      <th className="p-1.5 border text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-1.5 border font-mono">HERB-101</td>
                      <td className="p-1.5 border font-bold">Black Seed &amp; Honey Elixir (Nigella Sativa)</td>
                      <td className="p-1.5 border">Elixir / Immune</td>
                      <td className="p-1.5 border text-right font-mono">$18.00</td>
                      <td className="p-1.5 border text-right font-mono text-emerald-800 font-bold">84 Units</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border font-mono">HERB-102</td>
                      <td className="p-1.5 border font-bold">Saffron Nerve &amp; Calm Infusion (Herat Saffron)</td>
                      <td className="p-1.5 border">Herbal Tea</td>
                      <td className="p-1.5 border text-right font-mono">$32.00</td>
                      <td className="p-1.5 border text-right font-mono text-emerald-800 font-bold">42 Units</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border font-mono">HERB-103</td>
                      <td className="p-1.5 border font-bold">Damask Rose &amp; Cardamom Digestive Tonic</td>
                      <td className="p-1.5 border">Tonic / Digestive</td>
                      <td className="p-1.5 border text-right font-mono">$14.50</td>
                      <td className="p-1.5 border text-right font-mono text-emerald-800 font-bold">110 Units</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border font-mono">HERB-104</td>
                      <td className="p-1.5 border font-bold">Wild Rue &amp; Frankincense Purifying Balm</td>
                      <td className="p-1.5 border">Ointment / Topical</td>
                      <td className="p-1.5 border text-right font-mono">$21.00</td>
                      <td className="p-1.5 border text-right font-mono text-emerald-800 font-bold">65 Units</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WINDOW I: CASH & BANK BOOK */}
          {activeWindow === 'cash-bank' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#facc15]" />
                  <span>CASH &amp; BANK BOOK · CLINIC RECEIPTS &amp; PAYMENTS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>
              <div className="p-3 space-y-2 overflow-y-auto max-h-[420px]">
                <table className="w-full text-left text-xs border border-gray-300">
                  <thead className="bg-[#e5e7eb] font-bold">
                    <tr>
                      <th className="p-1.5 border">Date</th>
                      <th className="p-1.5 border">Particulars</th>
                      <th className="p-1.5 border">Vch Type</th>
                      <th className="p-1.5 border text-right">Debit ($)</th>
                      <th className="p-1.5 border text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-mono">
                    <tr>
                      <td className="p-1.5 border">14/11/2026</td>
                      <td className="p-1.5 border font-bold">Dispensary Daily Cash Drawer Sale</td>
                      <td className="p-1.5 border">Receipt</td>
                      <td className="p-1.5 border text-right text-emerald-800 font-bold">2,450.00</td>
                      <td className="p-1.5 border text-right">-</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border">14/11/2026</td>
                      <td className="p-1.5 border font-bold">Dr. Hafizullah Safi - Consultation Share</td>
                      <td className="p-1.5 border">Payment</td>
                      <td className="p-1.5 border text-right">-</td>
                      <td className="p-1.5 border text-right text-rose-800 font-bold">600.00</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border">14/11/2026</td>
                      <td className="p-1.5 border font-bold">Hakimzada Ltd - Raw Herbal Supplies</td>
                      <td className="p-1.5 border">Payment</td>
                      <td className="p-1.5 border text-right">-</td>
                      <td className="p-1.5 border text-right text-rose-800 font-bold">1,850.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WINDOW J: STOCK STATUS */}
          {activeWindow === 'stock-status' && (
            <div className="border-2 border-[#166534] bg-white shadow-xl flex flex-col h-full">
              <div className="bg-[#14532d] text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#facc15]" />
                  <span>STOCK STATUS · CLOSING VALUATION REPORT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWindow('desktop')}
                  className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-mono cursor-pointer"
                >
                  ESC=Exit
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto max-h-[420px]">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded flex justify-between items-center">
                  <span className="font-bold text-[#14532d]">Total Closing Stock Value on 14/11/2026:</span>
                  <span className="text-base font-bold font-mono text-[#14532d]">71,119.90 AFN / USD Eq.</span>
                </div>
                <p className="text-xs text-gray-600">
                  Realtime inventory synced with Dispensary POS counter and Doctor consultation prescriptions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: "Benefits of eRetail App" (Exact replica of video 00:03-00:05) */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 bg-[#f0f9ff] border-l border-[#9ca3af] p-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="bg-rose-600 text-white text-center py-1 px-2 font-bold text-xs uppercase tracking-wider rounded-sm shadow">
              Benefits of eRetail App
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              <div className="p-2 bg-white border border-sky-300 rounded shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-sky-900 font-bold text-[11px]">
                  <Search className="w-3.5 h-3.5 text-sky-700" />
                  <span>24x7 Order Placement</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Receive orders &amp; refill requests straight from patients via app or WhatsApp.
                </p>
              </div>

              <div className="p-2 bg-white border border-emerald-300 rounded shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                  <Pill className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Drug &amp; Herbal Info</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Comprehensive authentic botanical formulas &amp; active constituent guide.
                </p>
              </div>

              <div className="p-2 bg-white border border-amber-300 rounded shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                  <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                  <span>Digital Payments</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Direct ledger posting for cash, bank transfers &amp; Hawala settlement.
                </p>
              </div>

              <div className="p-2 bg-white border border-indigo-300 rounded shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px]">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Accounts Updates</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Realtime balance updates with party-wise SMS / WhatsApp statement dispatch.
                </p>
              </div>

              <div className="p-2 bg-white border border-purple-300 rounded shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-purple-700" />
                  <span>Stock Distribution</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Supplier deliveries from Sarai Shahzada &amp; Dubai wholesale distribution.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-sky-200">
            <span className="text-[10px] text-gray-500">Google Play &amp; App Store Ready</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Company Info & Function Key Bar (Exact replica of video bottom bar) */}
      <div className="bg-[#14532d] border-t-2 border-[#052e16] p-1.5 text-white flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-3">
          <span className="bg-[#facc15] text-[#052e16] px-1.5 py-0.5 rounded font-black text-[10px] font-mono uppercase">
            {settings.clinicName}
          </span>
          <span className="text-[11px] text-emerald-100 font-mono hidden sm:inline">
            C93 GUL BAHAR CENTER KABUL AFGHANISTAN · PIN 1002
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#facc15] font-mono">
          <span>Reg Mobile: +93 789 556 800</span>
          <span>·</span>
          <span>Reg Email: safi.clinic@margerp.com</span>
        </div>
      </div>

      {/* Bottom Function Key Strip */}
      <div className="bg-[#0f2918] text-[#86efac] px-2 py-1 flex flex-wrap gap-2 text-[10px] font-mono border-t border-black">
        <button
          type="button"
          onClick={() => setActiveWindow('desktop')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F1</span> Company Care
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('staff-access')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">Alt+U</span> User
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('item-master')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F2</span> Item Master
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('ledger-accounts')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F3</span> Ledger Accounts
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('stock-valuation-dialog')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F4</span> Stock Valuation
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('doctor-desk')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F5</span> Doctor Queue
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('reception-triage')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F6</span> Reception
        </button>
        <button
          type="button"
          onClick={() => setActiveWindow('profit-and-loss')}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F10</span> Calendar / P&amp;L
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="hover:underline cursor-pointer"
        >
          <span className="bg-[#facc15] text-black px-1 font-bold">F11</span> Printer
        </button>
      </div>
    </div>
  );
};
