-- K Gaming XCafe Booking System - Initial Schema
-- Database: Supabase (PostgreSQL)

-- ============================================
-- Table: staff_users
-- ============================================
CREATE TABLE IF NOT EXISTS staff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- Table: devices
-- ============================================
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('REGULAR', 'VIP1', 'VIP2')),
  hourly_price NUMERIC NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devices_category ON devices(category);

-- ============================================
-- Table: bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_id UUID NOT NULL REFERENCES devices(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours INTEGER NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('PROMO', 'NORMAL')),
  payment_type TEXT CHECK (payment_type IN ('DP', 'FULL')),
  payment_amount NUMERIC,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'WAITING_PAYMENT' CHECK (status IN ('WAITING_PAYMENT', 'BOOKED', 'IN_USE', 'FINISHED', 'EXPIRED')),
  expires_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_device_id ON bookings(device_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_code ON bookings(booking_code);

-- ============================================
-- Table: pricing_rules
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('REGULAR', 'VIP1', 'VIP2')),
  hourly_price NUMERIC NOT NULL,
  promo_2h_price NUMERIC NOT NULL,
  promo_3h_price NUMERIC NOT NULL,
  discount_4h_percent NUMERIC DEFAULT 20,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- Table: business_hours
-- ============================================
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_name TEXT NOT NULL CHECK (day_name IN ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  active BOOLEAN DEFAULT true
);

-- ============================================
-- Table: disclaimers
-- ============================================
CREATE TABLE IF NOT EXISTS disclaimers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL
);

-- ============================================
-- Table: settings
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_account_holder TEXT NOT NULL,
  booking_expiration_minutes INTEGER DEFAULT 15,
  max_booking_days INTEGER DEFAULT 7,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclaimers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies: Public Read-Only
-- ============================================
CREATE POLICY "Public can read active devices"
  ON devices FOR SELECT
  USING (active = true);

CREATE POLICY "Public can read pricing"
  ON pricing_rules FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Public can read business hours"
  ON business_hours FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Public can read active disclaimers"
  ON disclaimers FOR SELECT
  USING (active = true);

-- ============================================
-- RLS Policies: Authenticated Staff Full Access
-- ============================================
CREATE POLICY "Staff full access to bookings"
  ON bookings
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to devices"
  ON devices
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to pricing"
  ON pricing_rules
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to business_hours"
  ON business_hours
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to disclaimers"
  ON disclaimers
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to settings"
  ON settings
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff full access to staff_users"
  ON staff_users
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Seed Data
-- ============================================

-- Devices
INSERT INTO devices (name, category, hourly_price) VALUES
  ('Reguler 1', 'REGULAR', 10000),
  ('Reguler 2', 'REGULAR', 10000),
  ('Reguler 3', 'REGULAR', 10000),
  ('Reguler 4', 'REGULAR', 10000),
  ('VIP 1A', 'VIP1', 30000),
  ('VIP 1B', 'VIP1', 30000),
  ('VIP 2', 'VIP2', 35000);

-- Pricing Rules
INSERT INTO pricing_rules (category, hourly_price, promo_2h_price, promo_3h_price, discount_4h_percent) VALUES
  ('REGULAR', 10000, 18000, 25000, 20),
  ('VIP1', 30000, 55000, 80000, 20),
  ('VIP2', 35000, 65000, 90000, 20);

-- Business Hours
INSERT INTO business_hours (day_name, open_time, close_time, active) VALUES
  ('SUNDAY', '10:00', '01:00', true),
  ('MONDAY', '10:00', '01:00', true),
  ('TUESDAY', '10:00', '01:00', true),
  ('WEDNESDAY', '10:00', '01:00', true),
  ('THURSDAY', '10:00', '01:00', true),
  ('FRIDAY', '10:00', '03:00', true),
  ('SATURDAY', '10:00', '03:00', true);

-- Disclaimers
INSERT INTO disclaimers (content, active, sort_order) VALUES
  ('Booking dianggap aktif setelah pembayaran diverifikasi staff.', true, 1),
  ('Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.', true, 2),
  ('Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.', true, 3),
  ('Keterlambatan pelanggan tidak menambah durasi bermain.', true, 4),
  ('Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.', true, 5);

-- Settings
INSERT INTO settings (whatsapp_number, bank_name, bank_account_number, bank_account_holder) VALUES
  ('082152425391', 'BCA', '7155450363', 'Nanda A');

-- Staff User (default: staff / kgaming2026)
INSERT INTO staff_users (username, password_hash) VALUES
  ('staff', 'c3RhZmY6a2dhbWluZzIwMjY=');