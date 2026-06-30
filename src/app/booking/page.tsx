"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Device,
  PricingRule,
  Disclaimer,
  Settings,
  Booking,
} from "@/types/database";
import {
  formatPrice,
  formatDate,
  calculateEndTime,
  generateTimeSlots,
  getDayName,
  getTodayDate,
  formatWhatsAppNumber,
  timeToMinutes,
} from "@/lib/utils";
import Link from "next/link";

// Booking flow steps (no device step when pre-selected from URL)
const STEPS = [
  { id: 1, label: "Tanggal" },
  { id: 2, label: "Jam" },
  { id: 3, label: "Durasi" },
  { id: 4, label: "Paket" },
  { id: 5, label: "Ringkasan" },
  { id: 6, label: "Konfirmasi" },
];

// Static fallback data (VIP only - no REGULAR)
const staticDevices: Device[] = [
  { id: "5", name: "VIP 1A", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "6", name: "VIP 1B", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VIP 2", category: "VIP2", hourly_price: 35000, active: true, created_at: "", updated_at: "" },
];

const staticPricing: PricingRule[] = [
  { id: "2", category: "VIP1", hourly_price: 30000, promo_2h_price: 55000, promo_3h_price: 80000, discount_4h_percent: 20, created_at: "", updated_at: "" },
  { id: "3", category: "VIP2", hourly_price: 35000, promo_2h_price: 65000, promo_3h_price: 90000, discount_4h_percent: 20, created_at: "", updated_at: "" },
];

const staticSettings: Settings = {
  id: "1",
  whatsapp_number: "082152425391",
  bank_name: "BCA",
  bank_account_number: "7155450363",
  bank_account_holder: "Nanda A",
  booking_expiration_minutes: 15,
  max_booking_days: 7,
  created_at: "",
  updated_at: "",
};

const staticDisclaimers: Disclaimer[] = [
  { id: "1", content: "Booking dianggap aktif setelah pembayaran diverifikasi staff.", active: true, sort_order: 1 },
  { id: "2", content: "Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.", active: true, sort_order: 2 },
  { id: "3", content: "Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.", active: true, sort_order: 3 },
  { id: "4", content: "Keterlambatan pelanggan tidak menambah durasi bermain.", active: true, sort_order: 4 },
  { id: "5", content: "Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.", active: true, sort_order: 5 },
  { id: "6", content: "Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.", active: true, sort_order: 6 },
  { id: "7", content: "Uang booking yang sudah dibayarkan tidak dapat dikembalikan.", active: true, sort_order: 7 },
];

const staticBusinessHours: Record<string, { open: string; close: string }> = {
  SUNDAY: { open: "10:00", close: "01:00" },
  MONDAY: { open: "10:00", close: "01:00" },
  TUESDAY: { open: "10:00", close: "01:00" },
  WEDNESDAY: { open: "10:00", close: "01:00" },
  THURSDAY: { open: "10:00", close: "01:00" },
  FRIDAY: { open: "10:00", close: "03:00" },
  SATURDAY: { open: "10:00", close: "03:00" },
};

// Device icon helper
const getDeviceIcon = (category: string) => {
  switch (category) {
    case "VIP1": return "🌟";
    case "VIP2": return "👑";
    default: return "🎮";
  }
};

// Component that uses useSearchParams
function BookingContent() {
  const searchParams = useSearchParams();
  const deviceIdParam = searchParams.get("device");
  const deviceNameParam = searchParams.get("name");

  // State: device pre-selection phase
  const [needsDeviceSelection, setNeedsDeviceSelection] = useState(!deviceIdParam && !deviceNameParam);

  // State
  const [step, setStep] = useState(1);
  const [devices, setDevices] = useState<Device[]>(staticDevices);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(staticPricing);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [disclaimers, setDisclaimers] = useState<Disclaimer[]>(staticDisclaimers);
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string }>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // Selected values
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<"PROMO" | "NORMAL" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"DP" | "FULL" | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  // Computed values
  const selectedPricing = pricingRules.find((p) => p.category === selectedDevice?.category);
  const endTime = selectedStartTime && selectedDuration
    ? calculateEndTime(selectedStartTime, selectedDuration)
    : "";

  // Calculate price
  const calculatePrice = useCallback(() => {
    if (!selectedPricing || !selectedDuration) return 0;
    const dayName = selectedDate ? getDayName(new Date(selectedDate + "T12:00:00")) : "";
    const isPromoDay = dayName ? ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"].includes(dayName) : false;

    if (selectedPackage === "PROMO" && isPromoDay) {
      if (selectedDuration === 2) return selectedPricing.promo_2h_price;
      if (selectedDuration === 3) return selectedPricing.promo_3h_price;
      if (selectedDuration >= 4) {
        return Math.round(selectedPricing.hourly_price * selectedDuration * (1 - selectedPricing.discount_4h_percent / 100));
      }
      return selectedPricing.hourly_price * selectedDuration;
    }

    // Normal price
    if (selectedDuration >= 4 && isPromoDay) {
      return Math.round(selectedPricing.hourly_price * selectedDuration * (1 - selectedPricing.discount_4h_percent / 100));
    }
    return selectedPricing.hourly_price * selectedDuration;
  }, [selectedPricing, selectedDuration, selectedPackage, selectedDate]);

  const totalPrice = calculatePrice();

  // Get business hours for selected date
  const getDayHours = useCallback(() => {
    if (!selectedDate) return { open: "10:00", close: "01:00" };
    const dayName = getDayName(new Date(selectedDate + "T12:00:00"));
    return businessHours[dayName] || { open: "10:00", close: "01:00" };
  }, [selectedDate, businessHours]);

  // Generate available dates
  const getAvailableDates = () => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();
    const set = settings || staticSettings;
    const maxDays = set.max_booking_days;

    for (let i = 0; i <= maxDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const label = formatDate(value);
      dates.push({ value, label });
    }

    return dates;
  };

  type SlotInfo = { time: string; status: "available" | "booked" | "pending" };

  // Generate time slots with status (available/booked/pending) - all slots shown
  const getTimeSlots = useCallback((): SlotInfo[] => {
    if (!selectedDate || !selectedDevice) return [];

    const hours = getDayHours();
    const allSlots = generateTimeSlots(hours.open, hours.close);

    // If today, filter out past slots
    const today = getTodayDate();
    const now = new Date();

    const slots: SlotInfo[] = [];

    allSlots.forEach((slot: string) => {
      // Skip past slots for today
      if (selectedDate === today) {
        const [slotH, slotM] = slot.split(":").map(Number);
        const slotMinutes = slotH * 60 + slotM;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (slotMinutes <= nowMinutes) return;
      }

      const slotStartMin = timeToMinutes(slot);
      const slotEndMin = timeToMinutes(calculateEndTime(slot, 1));

      // Check conflicts with existing bookings for this device+date
      let slotStatus: "available" | "booked" | "pending" = "available";

      for (const booking of bookings) {
        if (booking.device_id !== selectedDevice.id) continue;
        if (booking.booking_date !== selectedDate) continue;
        if (booking.status === "EXPIRED" || booking.status === "FINISHED" || booking.status === "REJECTED") continue;

        // Check time overlap using numeric minute comparison
        // This handles cases where end_time has seconds (e.g. "15:00:00") vs slot without seconds ("15:00")
        // Slot is blocked only if it starts BEFORE the booking ends
        const bookingStartMin = timeToMinutes(booking.start_time);
        const bookingEndMin = timeToMinutes(booking.end_time);
        const hasOverlap = slotStartMin < bookingEndMin && slotEndMin > bookingStartMin;
        if (!hasOverlap) continue;

        // Determine status based on booking status
        if (booking.status === "BOOKED" || booking.status === "IN_USE") {
          slotStatus = "booked";
          break; // Booked takes priority
        }
        if (booking.status === "PENDING" || booking.status === "WAITING_PAYMENT") {
          slotStatus = "pending";
          break; // Pending juga stop loop, tidak perlu cek booking lain
        }
      }

      slots.push({ time: slot, status: slotStatus });
    });

    return slots;
  }, [selectedDate, selectedDevice, bookings, getDayHours]);

  // Generate duration options
  const getDurationOptions = () => {
    if (!selectedStartTime || !selectedDate) return [];

    const hours = getDayHours();
    const [startH, startM] = selectedStartTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;

    let [closeH, closeM] = hours.close.split(":").map(Number);
    let closeMinutes = closeH * 60 + closeM;

    // Overnight: if close is < start, it means next day (e.g. close 01:00, start 23:00)
    // If close === start (e.g. close 03:00, start 03:00), no duration available
    if (closeMinutes < startMinutes) closeMinutes += 24 * 60;

    const maxDuration = Math.floor((closeMinutes - startMinutes) / 60);
    const durations: number[] = [];
    for (let d = 1; d <= maxDuration; d++) {
      durations.push(d);
    }
    return durations;
  };

  // Check if promo is available
  const isPromoAvailable = selectedDate
    ? (() => {
        const day = new Date(selectedDate + "T12:00:00").getDay();
        return day >= 1 && day <= 4;
      })()
    : false;

  // Simple UUID check: must have dashes (e.g. "d290f1ee-6c54-4b01-90e6-d701748f0851")
  const isValidUUID = (id: string) => id.includes("-");

  // Initialize - fetch data from Supabase
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      // Fetch devices
      try {
        const { data: devData } = await supabase.from("devices").select("*").eq("active", true).order("name");
        if (!cancelled && devData && devData.length > 0) {
          const realDevices = devData.filter((d: Device) => d.category !== "REGULAR");
          setDevices(realDevices);
        }
      } catch (e) {
        console.error("Gagal load devices:", e);
      }

      // Fetch pricing
      try {
        const { data: priceData } = await supabase.from("pricing_rules").select("*");
        if (!cancelled && priceData && priceData.length > 0) setPricingRules(priceData);
      } catch (e) {
        console.error("Gagal load pricing:", e);
      }

      // Fetch settings
      try {
        const { data: settingData } = await supabase.from("settings").select("*").single();
        if (!cancelled && settingData) setSettings(settingData);
      } catch (e) {
        console.error("Gagal load settings:", e);
      }

      // Fetch business hours
      try {
        const { data: hoursData } = await supabase.from("business_hours").select("*");
        if (!cancelled && hoursData && hoursData.length > 0) {
          const hoursMap: Record<string, { open: string; close: string }> = {};
          hoursData.forEach((h: any) => {
            if (h.active) {
              hoursMap[h.day_name] = { open: h.open_time, close: h.close_time };
            }
          });
          if (Object.keys(hoursMap).length > 0) setBusinessHours(hoursMap);
        }
      } catch (e) {
        console.error("Gagal load hours:", e);
      }

      if (!cancelled) setDataReady(true);
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Fetch bookings when date/device changes
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchBookings() {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", selectedDate)
          .not("status", "in", '("EXPIRED","FINISHED","REJECTED")');

        if (data) setBookings(data);
      } catch {}
    }

    fetchBookings();
  }, [selectedDate, selectedDevice]);

  // Set initial device from URL param (check Supabase devices first, then static fallback)
  useEffect(() => {
    if (deviceIdParam) {
      const device = devices.find((d) => d.id === deviceIdParam) ||
                     staticDevices.find((d) => d.id === deviceIdParam);
      if (device) {
        setSelectedDevice(device);
        setNeedsDeviceSelection(false);
        setStep(1);
      } else if (devices.length > 0) {
        // Devices loaded but device ID not found in either source — show selection
        setNeedsDeviceSelection(true);
      }
      // If devices haven't loaded yet, wait for them (the effect will re-run)
    } else if (deviceNameParam) {
      // Find device by name (from homepage cards)
      const device = devices.find((d) => d.name === deviceNameParam) ||
                     staticDevices.find((d) => d.name === deviceNameParam);
      if (device) {
        setSelectedDevice(device);
        setNeedsDeviceSelection(false);
        setStep(1);
      } else if (devices.length > 0) {
        // Devices loaded but name not found — show selection
        setNeedsDeviceSelection(true);
      }
      // If devices haven't loaded yet, wait for them (the effect will re-run)
    }
  }, [deviceIdParam, deviceNameParam, devices]);

  // Handlers
  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setNeedsDeviceSelection(false);
    setStep(1);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedStartTime("");
    setSelectedDuration(0);
    setSelectedPackage(null);
    setSelectedPayment(null);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedStartTime(time);
    setSelectedDuration(0);
    setSelectedPackage(null);
    setSelectedPayment(null);
    setStep(3);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setSelectedPackage(null);
    setSelectedPayment(null);
    if (isPromoAvailable) {
      setStep(4);
    } else {
      setSelectedPackage("NORMAL");
      setSelectedPayment(null);
      setStep(5);
    }
  };

  const handlePackageSelect = (pkg: "PROMO" | "NORMAL") => {
    setSelectedPackage(pkg);
    if (pkg === "PROMO") {
      setSelectedPayment("FULL");
    } else {
      setSelectedPayment(null);
    }
    setStep(5);
  };

  const handleGoToConfirm = () => {
    if (!selectedPayment && selectedPackage === "NORMAL") {
      setSelectedPayment("FULL");
    }
    setStep(6);
  };

  const handleSubmit = async () => {
    if (!selectedDevice || !selectedDate || !selectedStartTime || !selectedDuration || !selectedPackage || !selectedPayment || !customerName) {
      setError("Mohon lengkapi semua data");
      return;
    }

    if (!agreedToTerms) {
      setError("Mohon setujui disclaimer terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Fallback settings jika belum terload
    const s = settings || staticSettings;

    // Hitung DP (harga 1 jam) atau Lunas (total)
    const dpAmount = selectedPricing?.hourly_price || totalPrice;
    const paymentLabel = selectedPayment === "DP" ? "DP" : "Lunas";
    const paymentAmount = selectedPayment === "DP" ? dpAmount : totalPrice;

    // Generate WhatsApp URL dulu (synchronously, dari event klik user langsung)
    const waNumber = formatWhatsAppNumber(s.whatsapp_number);
    const waMessage = encodeURIComponent(
      `Halo Admin K Gaming XCafe\n\nSaya ingin melakukan booking.\n\nNama:\n${customerName}\n\nDevice:\n${selectedDevice.name}\n\nTanggal:\n${formatDate(selectedDate)}\n\nJam Mulai:\n${selectedStartTime}\n\nJam Selesai:\n${endTime}\n\nDurasi:\n${selectedDuration} Jam\n\nPaket:\n${selectedPackage === "PROMO" ? "Promo Weekday" : "Harga Normal"}\n\nMetode Pembayaran:\n${selectedPayment === "DP" ? "DP" : "Lunas"}\n\n${paymentLabel}:\n${formatPrice(paymentAmount)}\n\nTransfer ke:\n${s.bank_name} - ${s.bank_account_number}\na/n ${s.bank_account_holder}\n\nSaya sudah membaca dan menyetujui seluruh ketentuan booking.`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    // Buka WhatsApp SEKARANG (synchronously, langsung dari event klik user)
    // Ini pasti tidak diblokir popup blocker di HP maupun desktop
    window.open(waUrl, '_blank');

    // Generate booking code
    const code = `KG-${selectedDate.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + s.booking_expiration_minutes);

    const bookingData = {
      booking_code: code,
      customer_name: customerName,
      customer_phone: "",
      device_id: selectedDevice.id,
      booking_date: selectedDate,
      start_time: selectedStartTime,
      end_time: endTime,
      duration_hours: selectedDuration,
      package_type: selectedPackage,
      payment_type: selectedPayment,
      payment_amount: selectedPayment === "DP" ? selectedPricing?.hourly_price || totalPrice : totalPrice,
      total_price: totalPrice,
      status: "WAITING_PAYMENT",
      expires_at: expiresAt.toISOString(),
    };

    // Simpan booking
    try {
      const { data, error } = await supabase.from("bookings").insert(bookingData).select().single();
      
      if (error) {
        console.error("Insert booking gagal:", error.message);
        setError("Gagal menyimpan booking: " + error.message + ". Silakan hubungi staff melalui WhatsApp.");
        setIsSubmitting(false);
        return;
      }
      
      if (data) {
        setBookingResult(data);
        setBookings((prev) => [...prev, data]);
      }
    } catch (e) {
      console.error("Insert booking error:", e);
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  // Success state
  const s = settings || staticSettings;
  if (bookingResult) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#22C55E" }}>
            Booking Berhasil!
          </h1>
          <p className="mb-2" style={{ color: "#A1A1AA" }}>
            Kode Booking:{" "}
            <span className="font-bold text-white">{bookingResult.booking_code}</span>
          </p>
          <p className="mb-6" style={{ color: "#A1A1AA" }}>
            Status:{" "}
            <span className="text-yellow-400 font-semibold">Menunggu Konfirmasi Staff</span>
          </p>

          {/* Payment Info */}
          <div
            className="rounded-xl p-6 mb-6 text-left"
            style={{ backgroundColor: "#1F2330" }}
          >
            <h3 className="font-bold mb-3">Informasi Pembayaran</h3>
            <p style={{ color: "#A1A1AA" }}>Bank: {s.bank_name}</p>
            <p style={{ color: "#A1A1AA" }}>
              No. Rekening: {s.bank_account_number}
            </p>
            <p style={{ color: "#A1A1AA" }}>
              A/N: {s.bank_account_holder}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p style={{ color: "#A1A1AA" }}>
                Total Pembayaran ({selectedPayment === "DP" ? "DP" : "Lunas"}):
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "#F5B700" }}
              >
                {selectedPayment === "DP" ? formatPrice(selectedPricing?.hourly_price || totalPrice) : formatPrice(totalPrice)}
              </p>
            </div>
            {selectedPayment === "DP" && (
              <p className="mt-2 text-sm" style={{ color: "#EAB308" }}>
                ⚠️ Lakukan pelunasan saat datang ke K Gaming X Cafe
              </p>
            )}
            <p className="mt-2 text-sm" style={{ color: "#EAB308" }}>
              ⏱ Batas pembayaran {s.booking_expiration_minutes} menit
            </p>
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5B700" }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // DEVICE SELECTION PRE-STEP (shown only when no device is pre-selected from URL)
  if (needsDeviceSelection) {
    const availableDevices = devices.length > 0 ? devices : staticDevices;
    return (
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#F5B700" }}>
            K Gaming XCafe
          </h1>
          <p className="text-sm" style={{ color: "#A1A1AA" }}>
            Pilih device yang ingin kamu booking
          </p>
        </div>

        {!dataReady && devices.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg" style={{ color: "#A1A1AA" }}>Memuat data...</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableDevices.map((device) => (
            <button
              key={device.id}
              onClick={() => handleDeviceSelect(device)}
              className="rounded-xl p-5 border-2 text-left transition-all hover:border-yellow-600 hover:scale-[1.02]"
              style={{ backgroundColor: "#1F2330", borderColor: "#3F4452" }}
            >
              <p className="text-lg font-bold">{device.name}</p>
              <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                {getDeviceIcon(device.category)} {device.category === "VIP1" ? "VIP 1" : "VIP 2"}
              </p>
              <p className="text-sm font-bold mt-3" style={{ color: "#F5B700" }}>
                {formatPrice(device.hourly_price)}
                <span className="text-xs font-normal" style={{ color: "#A1A1AA" }}>/Jam</span>
              </p>
              <div className="mt-3 w-full py-2 rounded-lg text-center font-medium text-sm" style={{ backgroundColor: "#F5B700", color: "#000" }}>
                Pilih {device.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Main booking flow
  return (
    <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
      {/* Device Summary Bar */}
      {selectedDevice && (
        <div className="rounded-xl p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: "#1F2330", border: "1px solid #3F4452" }}>
          <div className="flex items-center gap-2">
            <span>{getDeviceIcon(selectedDevice.category)}</span>
            <div>
              <p className="font-semibold text-sm">{selectedDevice.name}</p>
              <p className="text-xs" style={{ color: "#A1A1AA" }}>
                {formatPrice(selectedDevice.hourly_price)}/Jam
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: "#A1A1AA" }}>
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={`text-center ${
                s.id === step ? "font-bold" : ""
              }`}
              style={{
                color: s.id === step ? "#F5B700" : s.id < step ? "#22C55E" : "#A1A1AA",
                width: `${100 / STEPS.length}%`,
              }}
            >
              {s.id < step ? "✓" : s.id}
              <span className="hidden sm:inline"> {s.label}</span>
            </span>
          ))}
        </div>
        <div className="w-full h-1 rounded-full" style={{ backgroundColor: "#3F4452" }}>
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: "#F5B700",
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Pilih Tanggal */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pilih Tanggal</h2>
          <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
            {selectedDevice?.name} — Pilih tanggal bermain
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {getAvailableDates().map((date) => (
              <button
                key={date.value}
                onClick={() => handleDateSelect(date.value)}
                className="rounded-xl p-3 border text-left text-sm transition-all"
                style={{
                  backgroundColor: "#1F2330",
                  borderColor: selectedDate === date.value ? "#F5B700" : "#3F4452",
                }}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Pilih Jam */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pilih Jam Bermain</h2>
          <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
            {selectedDevice?.name} - {selectedDate ? formatDate(selectedDate) : ""}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {getTimeSlots().map((slot) => {
              const isDisabled = slot.status !== "available";
              return (
                <button
                  key={slot.time}
                  onClick={() => {
                    if (!isDisabled) handleTimeSelect(slot.time);
                  }}
                  disabled={isDisabled}
                  className="py-3 rounded-lg text-center font-medium transition-all disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      selectedStartTime === slot.time
                        ? "#F5B700"
                        : slot.status === "booked"
                        ? "#EF444420"
                        : slot.status === "pending"
                        ? "#EAB30820"
                        : "#1F2330",
                    color:
                      slot.status === "booked"
                        ? "#EF4444"
                        : slot.status === "pending"
                        ? "#EAB308"
                        : selectedStartTime === slot.time
                        ? "#000"
                        : "#FFF",
                    border: "1px solid",
                    borderColor:
                      selectedStartTime === slot.time
                        ? "#F5B700"
                        : slot.status === "booked"
                        ? "#EF4444"
                        : slot.status === "pending"
                        ? "#EAB308"
                        : "#3F4452",
                  }}
                >
                  {slot.time}
                  {slot.status === "booked" && <span className="block text-[10px]">🔴 Booked</span>}
                  {slot.status === "pending" && <span className="block text-[10px]">🟡 Pending</span>}
                </button>
              );
            })}
            {getTimeSlots().length === 0 && (
              <p className="col-span-full text-center py-8" style={{ color: "#A1A1AA" }}>
                Tidak ada slot tersedia untuk tanggal ini
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Pilih Durasi */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pilih Durasi</h2>
          <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
            {selectedDevice?.name} - {selectedStartTime}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {getDurationOptions().map((dur) => (
              <button
                key={dur}
                onClick={() => handleDurationSelect(dur)}
                className="py-3 rounded-lg text-center font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedDuration === dur ? "#F5B700" : "#1F2330",
                  color: selectedDuration === dur ? "#000" : "#FFF",
                  border: "1px solid",
                  borderColor:
                    selectedDuration === dur ? "#F5B700" : "#3F4452",
                }}
              >
                {dur} Jam
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Pilih Paket */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">🎉 Pilih Paket</h2>
          <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
            Promo Weekday tersedia!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Promo */}
            <button
              onClick={() => handlePackageSelect("PROMO")}
              className="rounded-xl p-6 border-2 text-left transition-all"
              style={{
                backgroundColor: "#1F2330",
                borderColor: selectedPackage === "PROMO" ? "#F5B700" : "#3F4452",
              }}
            >
              <p className="text-lg font-bold" style={{ color: "#F5B700" }}>
                🎉 Promo Weekday
              </p>
              <p className="text-sm font-semibold mt-2">Lebih Murah</p>
              <ul className="mt-2 text-sm space-y-1" style={{ color: "#A1A1AA" }}>
                <li>✅ Harga spesial</li>
                <li>✅ Diskon 20% untuk 4 Jam+</li>
                <li>❌ Tidak bisa DP</li>
                <li>❌ Wajib Lunas</li>
              </ul>
              <p className="mt-3 text-sm font-semibold" style={{ color: "#F5B700" }}>
                Hemat hingga puluhan ribu!
              </p>
            </button>

            {/* Normal */}
            <button
              onClick={() => handlePackageSelect("NORMAL")}
              className="rounded-xl p-6 border-2 text-left transition-all"
              style={{
                backgroundColor: "#1F2330",
                borderColor: selectedPackage === "NORMAL" ? "#F5B700" : "#3F4452",
              }}
            >
              <p className="text-lg font-bold">Harga Normal</p>
              <p className="text-sm font-semibold mt-2">Lebih Fleksibel</p>
              <ul className="mt-2 text-sm space-y-1" style={{ color: "#A1A1AA" }}>
                <li>✅ Harga per jam standar</li>
                <li>✅ Bisa DP</li>
                <li>✅ Bisa Lunas</li>
              </ul>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Ringkasan */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Ringkasan Booking</h2>

          <div className="rounded-xl p-5 mb-6 space-y-3" style={{ backgroundColor: "#1F2330" }}>
            <Row label="Device" value={selectedDevice?.name || "-"} />
            <Row label="Tanggal" value={selectedDate ? formatDate(selectedDate) : "-"} />
            <Row label="Jam Mulai" value={selectedStartTime || "-"} />
            <Row label="Jam Selesai" value={endTime || "-"} />
            <Row label="Durasi" value={`${selectedDuration} Jam`} />
            <Row
              label="Paket"
              value={selectedPackage === "PROMO" ? "Promo Weekday" : "Harga Normal"}
            />

            {selectedPackage === "NORMAL" && (
              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm mb-2" style={{ color: "#A1A1AA" }}>
                  Metode Pembayaran
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPayment("FULL")}
                    className="flex-1 py-2 rounded-lg text-center font-medium text-sm transition-all"
                    style={{
                      backgroundColor: selectedPayment === "FULL" ? "#F5B700" : "#3F4452",
                      color: selectedPayment === "FULL" ? "#000" : "#FFF",
                    }}
                  >
                    Lunas
                  </button>
                  <button
                    onClick={() => setSelectedPayment("DP")}
                    className="flex-1 py-2 rounded-lg text-center font-medium text-sm transition-all"
                    style={{
                      backgroundColor: selectedPayment === "DP" ? "#F5B700" : "#3F4452",
                      color: selectedPayment === "DP" ? "#000" : "#FFF",
                    }}
                  >
                    DP ({formatPrice(selectedPricing?.hourly_price || 0)})
                  </button>
                </div>
                {selectedPayment === "DP" && (
                  <p className="text-xs mt-2" style={{ color: "#EAB308" }}>
                    Minimal DP: {formatPrice(selectedPricing?.hourly_price || 0)}
                  </p>
                )}
              </div>
            )}

            {selectedPackage === "PROMO" && (
              <div className="pt-3 border-t border-gray-700">
                <Row label="Metode Pembayaran" value="Lunas (Wajib)" />
              </div>
            )}

            <div className="pt-3 border-t border-gray-700">
              <p className="text-sm" style={{ color: "#A1A1AA" }}>
                Total Pembayaran
              </p>
              <p className="text-2xl font-bold" style={{ color: "#F5B700" }}>
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          <button
            onClick={handleGoToConfirm}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5B700" }}
          >
            Lanjut ke Konfirmasi
          </button>
        </div>
      )}

      {/* Step 6: Konfirmasi */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Konfirmasi Booking</h2>

          {/* Data Pelanggan */}
          <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-semibold mb-3">Data Pelanggan</h3>
            <input
              type="text"
              placeholder="Nama Kamu"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg mb-3 text-white placeholder-gray-500 outline-none"
              style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
            />
          </div>

          {/* Ringkasan */}
          <div className="rounded-xl p-5 mb-4 space-y-2" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-semibold mb-3">Ringkasan</h3>
            <Row label="Device" value={selectedDevice?.name || "-"} />
            <Row label="Tanggal" value={selectedDate ? formatDate(selectedDate) : "-"} />
            <Row label="Jam" value={`${selectedStartTime} - ${endTime}`} />
            <Row label="Durasi" value={`${selectedDuration} Jam`} />
            <Row label="Paket" value={selectedPackage === "PROMO" ? "Promo Weekday" : "Harga Normal"} />
            <Row label="Pembayaran" value={selectedPayment === "FULL" ? "Lunas" : "DP"} />
            <Row label="Total" value={formatPrice(totalPrice)} highlight />
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-semibold mb-3">Syarat & Ketentuan</h3>
            <ul className="space-y-2">
              {disclaimers.map((d) => (
                <li key={d.id} className="text-sm flex items-start gap-2" style={{ color: "#A1A1AA" }}>
                  <span>☑</span>
                  <span>{d.content}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded"
                style={{ accentColor: "#F5B700" }}
              />
              <span className="text-sm">
                Saya menyetujui seluruh ketentuan booking
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!agreedToTerms || !customerName || isSubmitting}
            className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: agreedToTerms && customerName ? "#25D366" : "#3F4452",
              color: agreedToTerms && customerName ? "#000" : "#6B7280",
            }}
          >
            {isSubmitting ? "Memproses..." : "Lanjut ke WhatsApp"}
          </button>
        </div>
      )}

      {/* Back Button */}
      {step > 1 && !bookingResult && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 w-full py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#3F4452", color: "#FFF" }}
        >
          Kembali
        </button>
      )}
    </div>
  );
}

// Helper component
function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: "#A1A1AA" }}>
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-lg" : ""
        }`}
        style={{ color: highlight ? "#F5B700" : "#FFF" }}
      >
        {value}
      </span>
    </div>
  );
}

// Main export with Suspense boundary
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-lg" style={{ color: "#A1A1AA" }}>Memuat...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}