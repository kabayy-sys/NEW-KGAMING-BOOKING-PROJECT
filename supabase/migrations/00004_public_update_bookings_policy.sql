-- Allow public (anon) to update bookings (for staff dashboard)
-- Staff login doesn't use Supabase Auth, so we need this for dashboard operations
CREATE POLICY "Public can update bookings"
  ON bookings
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

-- Also ensure public can select all bookings (staff dashboard needs this)
-- If this policy already exists from a previous migration, it will be skipped
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Public can select bookings'
  ) THEN
    CREATE POLICY "Public can select bookings"
      ON bookings
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;
END
$$;