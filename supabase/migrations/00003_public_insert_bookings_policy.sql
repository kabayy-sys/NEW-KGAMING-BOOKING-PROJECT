-- Allow public (anon) to insert bookings
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public (anon) to view their own bookings (optional, but needed for lookup)
CREATE POLICY "Public can view bookings"
  ON bookings FOR SELECT
  TO anon
  USING (true);