import React, { useState, useEffect } from 'react';
import {
  Share2,
  Save,
  CheckCircle2,
  Sliders,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface SocialSettingsPanelProps {
  onSettingsSaved?: () => void;
}

export const SocialSettingsPanel: React.FC<SocialSettingsPanelProps> = ({ onSettingsSaved }) => {
  const { settings, saveSettings } = useClinicConfig();

  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl);
  const [overheadPercentage, setOverheadPercentage] = useState(String(settings.overheadPercentage));
  const [lowStockThreshold, setLowStockThreshold] = useState(String(settings.lowStockThreshold));
  const [ownerAlertEmail, setOwnerAlertEmail] = useState(settings.ownerAlertEmail);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFacebookUrl(settings.facebookUrl);
    setInstagramUrl(settings.instagramUrl);
    setWhatsappNumber(settings.whatsappNumber);
    setTwitterUrl(settings.twitterUrl);
    setOverheadPercentage(String(settings.overheadPercentage));
    setLowStockThreshold(String(settings.lowStockThreshold));
    setOwnerAlertEmail(settings.ownerAlertEmail);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await saveSettings({
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        whatsappNumber: whatsappNumber.trim(),
        twitterUrl: twitterUrl.trim(),
        overheadPercentage: Math.max(0, Math.min(80, Number(overheadPercentage) || 15)),
        lowStockThreshold: Math.max(1, Number(lowStockThreshold) || 20),
        ownerAlertEmail: ownerAlertEmail.trim(),
      });
      setSavedSuccess(true);
      onSettingsSaved?.();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save social/clinic settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social Media Channels Config */}
        <div className="p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1b3b2f]">
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                Social Media & Footer Channels
              </h3>
              <p className="text-[11px] text-[#8da396]">
                Dynamically updates site-wide Footer links and Dispensary product sharing buttons.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-[#d4af37]" /> Facebook Page URL
              </span>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#d4af37]" /> Instagram Profile URL
              </span>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Official WhatsApp Number
              </span>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] font-mono focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-[#d4af37]" /> Twitter / X Profile URL
              </span>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Accounting Overhead & Inventory Threshold Parameters */}
        <div className="p-6 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1b3b2f]">
            <Sliders className="w-4 h-4 text-[#d4af37]" />
            <div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                Accounting & Restock Alert Rules
              </h3>
              <p className="text-[11px] text-[#8da396]">
                Controls flat overhead deductions and proactive low-stock threshold alerts.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium">
                Flat Clinic Overhead Percentage (%)
              </span>
              <input
                type="number"
                min="0"
                max="80"
                step="0.5"
                value={overheadPercentage}
                onChange={(e) => setOverheadPercentage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] font-mono tabular-nums focus:outline-none"
              />
              <span className="text-[11px] text-[#8da396] block">
                Deducted alongside medicine COGS when computing Net Revenue on new ledger transactions.
              </span>
            </label>

            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium">
                Low-Stock Alert Threshold (Units)
              </span>
              <input
                type="number"
                min="1"
                max="200"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] font-mono tabular-nums focus:outline-none"
              />
              <span className="text-[11px] text-[#8da396] block">
                Triggers Yellow "Low Stock" indicators and owner warning banners below this level.
              </span>
            </label>

            <label className="block space-y-1">
              <span className="text-[#c9dad0] font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" /> Clinic Owner Alert Email
              </span>
              <input
                type="email"
                value={ownerAlertEmail}
                onChange={(e) => setOwnerAlertEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-[#f5f3ec] focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {savedSuccess ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Clinic social channels and accounting rules saved to PostgreSQL.</span>
          </div>
        ) : (
          <div className="text-xs text-[#8da396]">
            Changes apply immediately across the Footer, Dispensary Share links, and Restock monitors.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Configuration...' : 'Save Clinic Settings'}</span>
        </button>
      </div>
    </form>
  );
};
