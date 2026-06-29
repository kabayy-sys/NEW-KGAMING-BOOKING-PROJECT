/**
 * Utility functions
 */

/**
 * Merge class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian format
 * Example: Sabtu, 12 Juni 2026
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Generate booking code
 * Format: KG-YYYYMMDD-XXX
 */
export function generateBookingCode(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');

  return `KG-${year}${month}${day}-${seq}`;
}

/**
 * Check if a day is weekday (Monday-Thursday) for promo
 */
export function isWeekdayPromo(date: Date): boolean {
  const day = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  return day >= 1 && day <= 4; // Monday - Thursday
}

/**
 * Get day name from Date
 */
export function getDayName(date: Date): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
}

/**
 * Convert time string "HH:mm" or "HH:mm:ss" or "HH:mm:ss+offset" to total minutes (numeric)
 * Example: "13:30" => 810, "15:00:00" => 900, "15:00:00+07" => 900
 */
export function timeToMinutes(time: string): number {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + (isNaN(minutes) ? 0 : minutes);
}

/**
 * Calculate end time based on start time and duration
 */
export function calculateEndTime(startTime: string, durationHours: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationHours * 60;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Generate time slots (30-minute intervals)
 * For overnight hours (close <= open), close is treated as next day.
 * The closing hour itself is excluded (e.g. if close=01:00, last slot is 00:30).
 */
export function generateTimeSlots(
  openTime: string,
  closeTime: string
): string[] {
  const slots: string[] = [];
  const [openHours, openMinutes] = openTime.split(':').map(Number);
  let [closeHours, closeMinutes] = closeTime.split(':').map(Number);

  let currentMinutes = openHours * 60 + openMinutes;
  const closeTotalMinutes = closeHours * 60 + closeMinutes;

  // Handle overnight (e.g., close at 01:00 means next day)
  // Closing hour itself is excluded (use < not <=)
  const adjustedCloseMinutes =
    closeTotalMinutes <= currentMinutes
      ? closeTotalMinutes + 24 * 60
      : closeTotalMinutes;

  while (currentMinutes < adjustedCloseMinutes) {
    const hours = Math.floor(currentMinutes / 60) % 24;
    const minutes = currentMinutes % 60;
    slots.push(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    );
    currentMinutes += 30;
  }

  return slots;
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format nomor WhatsApp ke format internasional
 * Contoh: 082152425391 → 6282152425391
 */
export function formatWhatsAppNumber(phone: string): string {
  // Hapus semua karakter non-digit
  let cleaned = phone.replace(/\D/g, '');
  
  // Jika mulai dengan '0', ganti dengan '62'
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  // Jika mulai dengan '62' sudah benar
  else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}