-- ============================================
-- Migration: Fix all policies to be idempotent
-- Description: Drop existing policies first, then recreate
-- Safe to run multiple times without errors
-- ============================================

-- ============================================
-- 1. Fix bookings status constraint (add PENDING, REJECTED)
-- ============================================
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('PENDING', 'WAITING_PAYMENT', 'BOOKED', 'IN_USE', 'FINISHED', 'EXPIRED', 'REJECTED'));

-- ============================================
-- 2. Drop existing policies on bookings
-- ============================================
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Public can view bookings" ON bookings;
DROP POLICY IF EXISTS "Public can select bookings" ON bookings;
DROP POLICY IF EXISTS "Public can update bookings" ON bookings;
DROP POLICY IF EXISTS "Staff full access to bookings" ON bookings;

-- ============================================
-- 3. Recreate policies on bookings (for PUBLIC)
-- ============================================
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Public can select bookings"
  ON bookings FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Public can update bookings"
  ON bookings FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. Drop existing policies on other tables
-- ============================================
DROP POLICY IF EXISTS "Public can read active devices" ON devices;
DROP POLICY IF EXISTS "Staff full access to devices" ON devices;
DROP POLICY IF EXISTS "Public can read pricing" ON pricing_rules;
DROP POLICY IF EXISTS "Staff full access to pricing" ON pricing_rules;
DROP POLICY IF EXISTS "Public can read business hours" ON business_hours;
DROP POLICY IF EXISTS "Staff full access to business_hours" ON business_hours;
DROP POLICY IF EXISTS "Public can read active disclaimers" ON disclaimers;
DROP POLICY IF EXISTS "Staff full access to disclaimers" ON disclaimers;
DROP POLICY IF EXISTS "Staff full access to settings" ON settings;
DROP POLICY IF EXISTS "Staff full access to staff_users" ON staff_users;

-- ============================================
-- 5. Recreate policies on other tables
-- ============================================
CREATE POLICY "Public can read active devices"
  ON devices FOR SELECT
  TO PUBLIC
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
  TO PUBLIC
  USING (active = true);

-- ============================================
-- 6. Ensure RLS is enabled on all tables
-- ============================================
ALTER TABLE IF EXISTS staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS disclaimers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. Seed data (only if not exists)
-- ============================================

-- Devices
INSERT INTO devices (name, category, hourly_price)
SELECT 'Reguler 1', 'REGULAR', 10000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'Reguler 1');

INSERT INTO devices (name, category, hourly_price)
SELECT 'Reguler 2', 'REGULAR', 10000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'Reguler 2');

INSERT INTO devices (name, category, hourly_price)
SELECT 'Reguler 3', 'REGULAR', 10000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'Reguler 3');

INSERT INTO devices (name, category, hourly_price)
SELECT 'Reguler 4', 'REGULAR', 10000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'Reguler 4');

INSERT INTO devices (name, category, hourly_price)
SELECT 'VIP 1A', 'VIP1', 30000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'VIP 1A');

INSERT INTO devices (name, category, hourly_price)
SELECT 'VIP 1B', 'VIP1', 30000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'VIP 1B');

INSERT INTO devices (name, category, hourly_price)
SELECT 'VIP 2', 'VIP2', 35000
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE name = 'VIP 2');

-- Pricing Rules
INSERT INTO pricing_rules (category, hourly_price, promo_2h_price, promo_3h_price, discount_4h_percent)
SELECT 'REGULAR', 10000, 18000, 25000, 20
WHERE NOT EXISTS (SELECT 1 FROM pricing_rules WHERE category = 'REGULAR');

INSERT INTO pricing_rules (category, hourly_price, promo_2h_price, promo_3h_price, discount_4h_percent)
SELECT 'VIP1', 30000, 55000, 80000, 20
WHERE NOT EXISTS (SELECT 1 FROM pricing_rules WHERE category = 'VIP1');

INSERT INTO pricing_rules (category, hourly_price, promo_2h_price, promo_3h_price, discount_4h_percent)
SELECT 'VIP2', 35000, 65000, 90000, 20
WHERE NOT EXISTS (SELECT 1 FROM pricing_rules WHERE category = 'VIP2');

-- Business Hours
INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'SUNDAY', '10:00', '01:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'SUNDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'MONDAY', '10:00', '01:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'MONDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'TUESDAY', '10:00', '01:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'TUESDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'WEDNESDAY', '10:00', '01:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'WEDNESDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'THURSDAY', '10:00', '01:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'THURSDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'FRIDAY', '10:00', '03:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'FRIDAY');

INSERT INTO business_hours (day_name, open_time, close_time, active)
SELECT 'SATURDAY', '10:00', '03:00', true
WHERE NOT EXISTS (SELECT 1 FROM business_hours WHERE day_name = 'SATURDAY');

-- Disclaimers
INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Booking dianggap aktif setelah pembayaran diverifikasi staff.', true, 1
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 1);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.', true, 2
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 2);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.', true, 3
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 3);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Keterlambatan pelanggan tidak menambah durasi bermain.', true, 4
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 4);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.', true, 5
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 5);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.', true, 6
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 6);

INSERT INTO disclaimers (content, active, sort_order)
SELECT 'Uang booking yang sudah dibayarkan tidak dapat dikembalikan.', true, 7
WHERE NOT EXISTS (SELECT 1 FROM disclaimers WHERE sort_order = 7);

-- Settings
INSERT INTO settings (whatsapp_number, bank_name, bank_account_number, bank_account_holder)
SELECT '082152425391', 'BCA', '7155450363', 'Nanda A'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Staff User (PIN-based login, no longer used but kept for reference)
INSERT INTO staff_users (username, password_hash)
SELECT 'staff', 'c3RhZmY6a2dhbWluZzIwMjY='
WHERE NOT EXISTS (SELECT 1 FROM staff_users WHERE username = 'staff');