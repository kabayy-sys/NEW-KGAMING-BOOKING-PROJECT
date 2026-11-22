-- ============================================
-- Migration: Fix dashboard permissions & RLS policies
-- Description: Allow public (PIN-based staff session) full access to dashboard tables
-- ============================================

-- 1. Disclaimers
CREATE TABLE IF NOT EXISTS disclaimers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL
);
ALTER TABLE disclaimers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active disclaimers" ON disclaimers;
DROP POLICY IF EXISTS "Staff full access to disclaimers" ON disclaimers;
DROP POLICY IF EXISTS "Allow all access to disclaimers" ON disclaimers;
CREATE POLICY "Allow all access to disclaimers"
  ON disclaimers FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- 2. Settings
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff full access to settings" ON settings;
DROP POLICY IF EXISTS "Allow all access to settings" ON settings;
CREATE POLICY "Allow all access to settings"
  ON settings FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- 3. Pricing Rules
ALTER TABLE IF EXISTS pricing_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read pricing" ON pricing_rules;
DROP POLICY IF EXISTS "Staff full access to pricing" ON pricing_rules;
DROP POLICY IF EXISTS "Allow all access to pricing" ON pricing_rules;
CREATE POLICY "Allow all access to pricing"
  ON pricing_rules FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- 4. Business Hours
ALTER TABLE IF EXISTS business_hours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read business hours" ON business_hours;
DROP POLICY IF EXISTS "Staff full access to business_hours" ON business_hours;
DROP POLICY IF EXISTS "Allow all access to business_hours" ON business_hours;
CREATE POLICY "Allow all access to business_hours"
  ON business_hours FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- 5. Devices
ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active devices" ON devices;
DROP POLICY IF EXISTS "Staff full access to devices" ON devices;
DROP POLICY IF EXISTS "Allow all access to devices" ON devices;
CREATE POLICY "Allow all access to devices"
  ON devices FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Seed data jika belum ada
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
