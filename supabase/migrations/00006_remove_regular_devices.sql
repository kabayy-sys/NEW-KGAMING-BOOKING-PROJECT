-- ============================================
-- Migration: Remove REGULAR Devices & Pricing
-- Description: Menghapus device Reguler 1-4 dan
-- pricing REGULAR dari database sesuai permintaan
-- client (hanya menyisakan VIP)
-- ============================================

-- Hapus pricing REGULAR
DELETE FROM pricing_rules WHERE category = 'REGULAR';

-- Hapus device REGULAR
DELETE FROM devices WHERE category = 'REGULAR';
