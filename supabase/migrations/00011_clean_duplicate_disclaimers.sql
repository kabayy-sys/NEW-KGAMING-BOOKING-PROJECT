-- ============================================
-- Migration: Clean duplicate disclaimers and add unique constraint
-- ============================================

-- 1. Hapus disclaimer duplikat, hanya simpan 1 baris per sort_order
DELETE FROM disclaimers
WHERE id NOT IN (
  SELECT DISTINCT ON (sort_order) id
  FROM disclaimers
  ORDER BY sort_order, id
);

-- 2. Tambahkan UNIQUE constraint pada sort_order agar tidak bisa duplikat lagi
ALTER TABLE disclaimers
  DROP CONSTRAINT IF EXISTS disclaimers_sort_order_unique;

ALTER TABLE disclaimers
  ADD CONSTRAINT disclaimers_sort_order_unique UNIQUE (sort_order);
