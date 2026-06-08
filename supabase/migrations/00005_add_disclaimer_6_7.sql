-- ============================================
-- Migration: Add Disclaimer 6 & 7
-- Description: Menambahkan 2 disclaimer baru
-- (reschedule H-6 jam + uang tidak bisa dikembalikan)
-- ============================================

-- Tambah Disclaimer No 6: Reschedule
INSERT INTO disclaimers (id, content, active, sort_order)
VALUES (
  gen_random_uuid(),
  'Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.',
  true,
  6
);

-- Tambah Disclaimer No 7: Uang tidak bisa dikembalikan
INSERT INTO disclaimers (id, content, active, sort_order)
VALUES (
  gen_random_uuid(),
  'Uang booking yang sudah dibayarkan tidak dapat dikembalikan.',
  true,
  7
);