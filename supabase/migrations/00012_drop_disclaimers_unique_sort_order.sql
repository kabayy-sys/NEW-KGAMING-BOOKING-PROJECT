-- ============================================
-- Migration: Drop unique constraint on sort_order
-- Description: Allow flexible reordering and CRUD operations without unique constraint errors
-- ============================================

ALTER TABLE disclaimers
  DROP CONSTRAINT IF EXISTS disclaimers_sort_order_unique;
