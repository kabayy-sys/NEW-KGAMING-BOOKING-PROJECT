-- Migration: Add flexible Happy Hour promo configuration to pricing_rules
ALTER TABLE pricing_rules
  ADD COLUMN IF NOT EXISTS happy_hour_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS happy_hour_start TEXT DEFAULT '10:00',
  ADD COLUMN IF NOT EXISTS happy_hour_end TEXT DEFAULT '16:00',
  ADD COLUMN IF NOT EXISTS happy_hour_price NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS promo_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5];
