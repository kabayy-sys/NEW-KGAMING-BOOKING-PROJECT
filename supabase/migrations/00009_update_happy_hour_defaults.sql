-- Migration: Update existing pricing_rules with November Happy Hour defaults
UPDATE pricing_rules SET 
  happy_hour_enabled = true,
  happy_hour_start = '10:00',
  happy_hour_end = '16:00',
  promo_days = ARRAY[1,2,3,4,5],
  happy_hour_price = CASE 
    WHEN category = 'VIP1' THEN 25000
    WHEN category = 'VIP2' THEN 30000
    ELSE hourly_price
  END;
