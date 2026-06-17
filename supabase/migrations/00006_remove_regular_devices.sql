-- ============================================
-- Migration: Remove REGULAR Devices & Pricing
-- Description: Menghapus device Reguler 1-4 dan
-- pricing REGULAR dari database sesuai permintaan
-- client (hanya menyisakan VIP)
-- ============================================

-- Hapus booking yang mereference device REGULAR (FK constraint)
-- Booking REGULAR tidak relevan karena device sudah tidak dipakai
DELETE FROM bookings WHERE device_id IN (SELECT id FROM devices WHERE category = 'REGULAR');

-- Hapus pricing REGULAR
DELETE FROM pricing_rules WHERE category = 'REGULAR';

-- Hapus device REGULAR
DELETE FROM devices WHERE category = 'REGULAR';
