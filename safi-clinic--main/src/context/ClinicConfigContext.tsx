import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ClinicConfigSettings,
  MedicineInventoryItem,
  InventoryAlertLog,
} from '../types/clinic';

interface ClinicConfigContextType {
  settings: ClinicConfigSettings;
  medicines: MedicineInventoryItem[];
  lowStockItems: MedicineInventoryItem[];
  alerts: InventoryAlertLog[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  saveSettings: (updates: Partial<ClinicConfigSettings>) => Promise<ClinicConfigSettings>;
  getProductInventory: (productId: string) => MedicineInventoryItem | undefined;
}

const DEFAULT_SETTINGS: ClinicConfigSettings = {
  clinicName: 'Safi Natural Care Clinic',
  facebookUrl: 'https://facebook.com/safinaturalcare',
  instagramUrl: 'https://instagram.com/safinaturalcare',
  whatsappNumber: '+93780299299',
  twitterUrl: 'https://x.com/safinaturalcare',
  overheadPercentage: 15,
  lowStockThreshold: 20,
  ownerAlertEmail: 'info@safihealthcare.com',
};

const ClinicConfigContext = createContext<ClinicConfigContextType>({
  settings: DEFAULT_SETTINGS,
  medicines: [],
  lowStockItems: [],
  alerts: [],
  loading: true,
  refreshAll: async () => {},
  refreshInventory: async () => {},
  saveSettings: async () => DEFAULT_SETTINGS,
  getProductInventory: () => undefined,
});

export const ClinicConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicConfigSettings>(DEFAULT_SETTINGS);
  const [medicines, setMedicines] = useState<MedicineInventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<MedicineInventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlertLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/medicines');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMedicines(data.medicines || []);
          setLowStockItems(data.lowStockItems || []);
          setAlerts(data.alerts || []);
        }
      }
    } catch (err) {
      console.warn('Unable to fetch pharmacy inventory:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes] = await Promise.all([
        fetch('/api/settings/social'),
        refreshInventory(),
      ]);
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn('Unable to fetch clinic config:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshInventory]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const saveSettings = async (updates: Partial<ClinicConfigSettings>): Promise<ClinicConfigSettings> => {
    const res = await fetch('/api/settings/social', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error('Failed to save clinic settings');
    }
    const data = await res.json();
    setSettings(data.settings);
    await refreshInventory();
    return data.settings;
  };

  const getProductInventory = useCallback(
    (productId: string) => medicines.find((m) => m.productId === productId),
    [medicines]
  );

  return (
    <ClinicConfigContext.Provider
      value={{
        settings,
        medicines,
        lowStockItems,
        alerts,
        loading,
        refreshAll,
        refreshInventory,
        saveSettings,
        getProductInventory,
      }}
    >
      {children}
    </ClinicConfigContext.Provider>
  );
};

export const useClinicConfig = () => useContext(ClinicConfigContext);
