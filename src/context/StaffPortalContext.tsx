import React, { createContext, useContext, useState, useEffect } from 'react';

export type StaffRole = 'admin' | 'doctor' | 'pharmacist' | 'receptionist' | 'accountant';

export interface StaffAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: StaffRole;
  specialtyOrDept: string;
  active: boolean;
  createdAt: string;
}

export interface PatientClinicalRouting {
  id: string;
  patientName: string;
  qrToken: string;
  phone: string;
  age?: string;
  gender?: string;
  mizaj: string;
  symptoms: string;
  assignedDoctor: string;
  prescribedMedicines: string[];
  prescriptionNotes: string;
  status: 'Waiting for Doctor' | 'Approved by Doctor' | 'Dispensed';
  approvedBy?: string;
  approvedAt?: string;
  registeredAt: string;
  isDemo?: boolean;
}

interface StaffPortalContextType {
  currentStaff: StaffAccount | null;
  isDemoMode: boolean;
  accounts: StaffAccount[];
  routingQueue: PatientClinicalRouting[];
  loginStaff: (username: string, password: string) => { ok: boolean; error?: string };
  enterCustomerDemo: (role?: StaffRole) => void;
  logoutStaff: () => void;
  createStaffAccount: (acct: Omit<StaffAccount, 'id' | 'createdAt' | 'active'>) => void;
  toggleStaffActive: (id: string) => void;
  removeStaffAccount: (id: string) => void;
  routePatientFromReception: (
    data: Omit<PatientClinicalRouting, 'id' | 'status' | 'registeredAt'>
  ) => PatientClinicalRouting;
  doctorApprovePrescription: (
    routingId: string,
    medicines: string[],
    notes: string,
    approverName: string
  ) => void;
  markDispensed: (routingId: string) => void;
  isPrescriptionApprovedForPatient: (patientNameOrToken: string) => PatientClinicalRouting | undefined;
}

const DEFAULT_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-admin-1',
    username: 'admin',
    password: '123',
    fullName: 'Sastech System Administrator',
    role: 'admin',
    specialtyOrDept: 'Clinic Director & IT Governance',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'staff-doc-1',
    username: 'doctor',
    password: '123',
    fullName: 'Dr. Hafizullah Safi',
    role: 'doctor',
    specialtyOrDept: 'Chief Unani & Botanical Physician',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'staff-pharm-1',
    username: 'pharmacy',
    password: '123',
    fullName: 'Dispensary Pharmacist',
    role: 'pharmacist',
    specialtyOrDept: 'Clinical Apothecary & Medicine Counter',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'staff-recep-1',
    username: 'reception',
    password: '123',
    fullName: 'Reception & Triage Desk',
    role: 'receptionist',
    specialtyOrDept: 'Patient Intake & Queue Management',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'staff-acct-1',
    username: 'accountant',
    password: '123',
    fullName: 'Mirwais Shinwari',
    role: 'accountant',
    specialtyOrDept: 'Marg Accounts & Finance',
    active: true,
    createdAt: '2026-01-01',
  },
];

const DEMO_ROUTING_QUEUE: PatientClinicalRouting[] = [
  {
    id: 'RT-1001',
    patientName: 'Tariq Wardak',
    qrToken: 'SNC-PAT-84920',
    phone: '+93 780 112 233',
    age: '38',
    gender: 'Male',
    mizaj: 'Sanguine (Damavi)',
    symptoms: 'Seasonal respiratory fatigue, mild joint stiffness',
    assignedDoctor: 'Dr. Hafizullah Safi',
    prescribedMedicines: ['Black Seed & Honey Elixir', 'Saffron Nerve & Calm Tea'],
    prescriptionNotes: '5ml elixir twice daily after meals; 1 cup saffron infusion before sleep.',
    status: 'Approved by Doctor',
    approvedBy: 'Dr. Hafizullah Safi',
    approvedAt: '09:42 AM',
    registeredAt: '09:20 AM',
    isDemo: true,
  },
  {
    id: 'RT-1002',
    patientName: 'Maryam Popalzai',
    qrToken: 'SNC-PAT-51209',
    phone: '+93 700 441 890',
    age: '29',
    gender: 'Female',
    mizaj: 'Bilious (Safravi)',
    symptoms: 'Digestive acidity, post-meal bloating, sleep disruption',
    assignedDoctor: 'Dr. Hafizullah Safi',
    prescribedMedicines: ['Damask Rose & Cardamom Digestive Tonic'],
    prescriptionNotes: 'Awaiting doctor review & prescription sign-off.',
    status: 'Waiting for Doctor',
    registeredAt: '10:05 AM',
    isDemo: true,
  },
];

const STORAGE_KEYS = {
  SESSION: 'sastech_clinic_staff_session_v1',
  DEMO: 'sastech_clinic_demo_mode_v1',
  ACCOUNTS: 'sastech_clinic_staff_accounts_v1',
  ROUTING: 'sastech_clinic_routing_queue_v1',
};

const StaffPortalContext = createContext<StaffPortalContextType | undefined>(undefined);

export const StaffPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ACCOUNTS;
  });

  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEMO) === 'true';
    } catch {
      return false;
    }
  });

  const [routingQueue, setRoutingQueue] = useState<PatientClinicalRouting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTING);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEMO_ROUTING_QUEUE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  useEffect(() => {
    try {
      if (currentStaff) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentStaff));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch {}
  }, [currentStaff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO, isDemoMode ? 'true' : 'false');
    } catch {}
  }, [isDemoMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTING, JSON.stringify(routingQueue));
    } catch {}
  }, [routingQueue]);

  const loginStaff = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const matched = accounts.find(
      (a) => a.username.trim().toLowerCase() === cleanUser && a.password === password
    );
    if (!matched) {
      return { ok: false, error: 'Invalid Staff ID or Password. Check credentials with Admin.' };
    }
    if (!matched.active) {
      return { ok: false, error: 'This staff login has been disabled by the Clinic Administrator.' };
    }
    setCurrentStaff(matched);
    setIsDemoMode(false);
    return { ok: true };
  };

  const enterCustomerDemo = (role: StaffRole = 'admin') => {
    const template = accounts.find((a) => a.role === role) || DEFAULT_ACCOUNTS[0];
    setCurrentStaff({
      ...template,
      fullName: `${template.fullName} (Customer Demo)`,
    });
    setIsDemoMode(true);
    setRoutingQueue((prev) => (prev.length > 0 ? prev : DEMO_ROUTING_QUEUE));
  };

  const logoutStaff = () => {
    setCurrentStaff(null);
    setIsDemoMode(false);
  };

  const createStaffAccount = (acct: Omit<StaffAccount, 'id' | 'createdAt' | 'active'>) => {
    const newAcct: StaffAccount = {
      ...acct,
      id: `staff-${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAccounts((prev) => [...prev, newAcct]);
  };

  const toggleStaffActive = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const removeStaffAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const routePatientFromReception = (
    data: Omit<PatientClinicalRouting, 'id' | 'status' | 'registeredAt'>
  ): PatientClinicalRouting => {
    const entry: PatientClinicalRouting = {
      ...data,
      id: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Waiting for Doctor',
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setRoutingQueue((prev) => [entry, ...prev]);
    return entry;
  };

  const doctorApprovePrescription = (
    routingId: string,
    medicines: string[],
    notes: string,
    approverName: string
  ) => {
    setRoutingQueue((prev) =>
      prev.map((item) =>
        item.id === routingId
          ? {
              ...item,
              prescribedMedicines: medicines.length > 0 ? medicines : item.prescribedMedicines,
              prescriptionNotes: notes || item.prescriptionNotes,
              status: 'Approved by Doctor',
              approvedBy: approverName,
              approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
  };

  const markDispensed = (routingId: string) => {
    setRoutingQueue((prev) =>
      prev.map((item) =>
        item.id === routingId ? { ...item, status: 'Dispensed' } : item
      )
    );
  };

  const isPrescriptionApprovedForPatient = (patientNameOrToken: string) => {
    const needle = patientNameOrToken.trim().toLowerCase();
    if (!needle) return undefined;
    return routingQueue.find(
      (r) =>
        (r.status === 'Approved by Doctor' || r.status === 'Dispensed') &&
        (r.patientName.toLowerCase().includes(needle) ||
          r.qrToken.toLowerCase() === needle ||
          r.id.toLowerCase() === needle)
    );
  };

  return (
    <StaffPortalContext.Provider
      value={{
        currentStaff,
        isDemoMode,
        accounts,
        routingQueue,
        loginStaff,
        enterCustomerDemo,
        logoutStaff,
        createStaffAccount,
        toggleStaffActive,
        removeStaffAccount,
        routePatientFromReception,
        doctorApprovePrescription,
        markDispensed,
        isPrescriptionApprovedForPatient,
      }}
    >
      {children}
    </StaffPortalContext.Provider>
  );
};

export const useStaffPortal = () => {
  const ctx = useContext(StaffPortalContext);
  if (!ctx) {
    throw new Error('useStaffPortal must be used within StaffPortalProvider');
  }
  return ctx;
};
