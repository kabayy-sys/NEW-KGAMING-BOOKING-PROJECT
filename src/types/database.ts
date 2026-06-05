export type DeviceCategory = 'REGULAR' | 'VIP1' | 'VIP2';

export type BookingStatus =
  | 'PENDING'
  | 'WAITING_PAYMENT'
  | 'BOOKED'
  | 'IN_USE'
  | 'FINISHED'
  | 'EXPIRED'
  | 'REJECTED';

export type PackageType = 'PROMO' | 'NORMAL';

export type PaymentType = 'DP' | 'FULL';

export type DayName =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface StaffUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  hourly_price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_phone: string;
  device_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  package_type: PackageType;
  payment_type: PaymentType | null;
  payment_amount: number | null;
  total_price: number;
  status: BookingStatus;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  category: DeviceCategory;
  hourly_price: number;
  promo_2h_price: number;
  promo_3h_price: number;
  discount_4h_percent: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: string;
  day_name: DayName;
  open_time: string;
  close_time: string;
  active: boolean;
}

export interface Disclaimer {
  id: string;
  content: string;
  active: boolean;
  sort_order: number;
}

export interface Settings {
  id: string;
  whatsapp_number: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  booking_expiration_minutes: number;
  max_booking_days: number;
  created_at: string;
  updated_at: string;
}

// Helper types for booking flow
export interface TimeSlot {
  time: string; // Format: "HH:mm"
  available: boolean;
}

export interface BookingSummary {
  device: Device | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  packageType: PackageType | null;
  paymentType: PaymentType | null;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
}