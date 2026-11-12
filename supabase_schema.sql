-- ============================================================================
-- Safi Natural Care Clinic — Clinical Management, POS Pharmacy & Accounting
-- Production PostgreSQL / Supabase SQL Schema with Foreign Keys & Triggers
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PATIENTS (CRM & Unique QR Identity)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_token TEXT NOT NULL UNIQUE, -- e.g. 'SNC-PAT-84019' encoded into QR badge
  user_uid TEXT,                      -- Optional link to Auth user
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  mizaj TEXT NOT NULL DEFAULT 'Balanced / Under Assessment',
  medical_history TEXT,
  current_protocols TEXT,
  total_visits INTEGER NOT NULL DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_qr_token ON public.patients(qr_code_token);

-- 2. MEDICINES (Smart Inventory & POS Barcode/QR Catalog)
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  barcode_qr TEXT NOT NULL UNIQUE,    -- Scannable bottle barcode/QR payload
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  cogs_price NUMERIC(10, 2) NOT NULL CHECK (cogs_price >= 0), -- Wholesale/Compounding COGS
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 20,
  status TEXT GENERATED ALWAYS AS (
    CASE
      WHEN stock_quantity <= 0 THEN 'Out of Stock'
      WHEN stock_quantity < low_stock_threshold THEN 'Low Stock'
      ELSE 'In Stock'
    END
  ) STORED,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicines_barcode ON public.medicines(barcode_qr);

-- 3. APPOINTMENTS (Clinical Scheduling linked to Patient CRM)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  practitioner_id TEXT NOT NULL,
  practitioner_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  health_concerns TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  total_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PATIENT VISITS (Instant QR Triage Arrival Logs)
CREATE TABLE IF NOT EXISTS public.patient_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  practitioner_name TEXT NOT NULL,
  visit_type TEXT NOT NULL DEFAULT 'In-Clinic Consultation',
  consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 140.00,
  notes TEXT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TRANSACTIONS (Centralized Automated Accounting Ledger)
-- Every consultation fee and pharmacy POS checkout writes atomically here.
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'pharmacy_sale', 'expense')),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  patient_name TEXT,
  description TEXT NOT NULL,
  gross_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cogs_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  overhead_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  -- Net Revenue Formula: Gross Revenue - COGS - Flat Overhead
  net_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'Cash / Clinic Desk',
  items_json JSONB,
  created_by_uid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- 6. INVENTORY ALERTS (Automated Low-Stock Owner Notification Log)
CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  remaining_stock INTEGER NOT NULL,
  threshold INTEGER NOT NULL,
  alert_status TEXT NOT NULL DEFAULT 'Pending Restock',
  dispatched_to_email TEXT NOT NULL DEFAULT 'info@safihealthcare.com',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CLINIC SETTINGS (Dynamic Social Media URLs & Overhead Configuration)
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id SERIAL PRIMARY KEY,
  clinic_name TEXT NOT NULL DEFAULT 'Safi Natural Care Clinic',
  facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com/safinaturalcare',
  instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/safinaturalcare',
  whatsapp_number TEXT NOT NULL DEFAULT '+93780299299',
  twitter_url TEXT NOT NULL DEFAULT 'https://x.com/safinaturalcare',
  overhead_percentage NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  low_stock_threshold INTEGER NOT NULL DEFAULT 20,
  owner_alert_email TEXT NOT NULL DEFAULT 'info@safihealthcare.com',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic Low-Stock Alert Trigger Function (Supabase / PostgreSQL)
CREATE OR REPLACE FUNCTION public.notify_low_stock()
RETURNS TRIGGER AS $$
DECLARE
  alert_email TEXT;
BEGIN
  IF NEW.stock_quantity < NEW.low_stock_threshold
     AND (OLD.stock_quantity IS NULL OR OLD.stock_quantity >= NEW.low_stock_threshold) THEN
    SELECT owner_alert_email INTO alert_email FROM public.clinic_settings LIMIT 1;
    INSERT INTO public.inventory_alerts (
      medicine_id, medicine_name, remaining_stock, threshold, dispatched_to_email
    ) VALUES (
      NEW.id, NEW.name, NEW.stock_quantity, NEW.low_stock_threshold, COALESCE(alert_email, 'info@safihealthcare.com')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_medicines_low_stock ON public.medicines;
CREATE TRIGGER trg_medicines_low_stock
AFTER UPDATE OF stock_quantity ON public.medicines
FOR EACH ROW
EXECUTE FUNCTION public.notify_low_stock();
