-- Add PENDING and REJECTED status to bookings
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('PENDING', 'WAITING_PAYMENT', 'BOOKED', 'IN_USE', 'FINISHED', 'EXPIRED', 'REJECTED'));