"use client";

import { useState, useCallback, useMemo } from "react";
import { Device, PricingRule, Booking } from "@/types/database";
import { supabase } from "@/lib/supabase";
import {
  formatPrice,
  formatDate,
  calculateEndTime,
  generateTimeSlots,
  getDayName,
  getTodayDate,
  formatWhatsAppNumber,
  timeToMinutes,
  isSlotInBookingRange,
} from "@/lib/utils";

export type SlotStatus = "available" | "pending" | "booked" | "inuse" | "maintenance";

export interface TimeSlotInfo {
  time: string;
  status: SlotStatus;
  index: number;
}

export interface BookingFlowState {
  step: number;
  selectedDate: string;
  selectedDevice: Device | null;
  selectionStart: number | null;
  selectionEnd: number | null;
  selectedPackage: "PROMO" | "NORMAL" | null;
  selectedPayment: "DP" | "FULL" | null;
  customerName: string;
  agreedToTerms: boolean;
  isSubmitting: boolean;
  bookingResult: Booking | null;
  error: string;
}

const initialState: BookingFlowState = {
  step: 1,
  selectedDate: "",
  selectedDevice: null,
  selectionStart: null,
  selectionEnd: null,
  selectedPackage: null,
  selectedPayment: null,
  customerName: "",
  agreedToTerms: false,
  isSubmitting: false,
  bookingResult: null,
  error: "",
};

export function useBookingFlow(
  devices: Device[],
  pricingRules: PricingRule[],
  businessHours: Record<string, { open: string; close: string }>,
  bookings: Booking[],
  settings: { whatsapp_number: string; bank_name: string; bank_account_number: string; bank_account_holder: string; booking_expiration_minutes: number } | null,
  onBookingCreated: (booking: Booking) => void
) {
  const [state, setState] = useState<BookingFlowState>(initialState);

  // --- Computed values ---

  const selectedPricing = useMemo(
    () => pricingRules.find((p) => p.category === state.selectedDevice?.category),
    [pricingRules, state.selectedDevice]
  );

  const dayHours = useMemo(() => {
    if (!state.selectedDate) return { open: "10:00", close: "01:00" };
    const dayName = getDayName(new Date(state.selectedDate + "T12:00:00"));
    return businessHours[dayName] || { open: "10:00", close: "01:00" };
  }, [state.selectedDate, businessHours]);

  const allTimeSlots = useMemo(() => {
    if (!state.selectedDate) return [];
    return generateTimeSlots(dayHours.open, dayHours.close);
  }, [state.selectedDate, dayHours]);

  const slotStatuses = useMemo((): TimeSlotInfo[] => {
    const currentDevice = state.selectedDevice;
    if (!state.selectedDate || !currentDevice || allTimeSlots.length === 0) return [];

    const today = getTodayDate();
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // Check if this is an overnight schedule (close <= open, e.g. 10:00 - 01:00)
    const isOvernight = timeToMinutes(dayHours.close) <= timeToMinutes(dayHours.open);

    return allTimeSlots.map((time, index) => {
      // Skip past slots for today (handle overnight correctly)
      if (state.selectedDate === today) {
        const [h, m] = time.split(":").map(Number);
        const slotMin = h * 60 + m;

        // For overnight schedules, slots before opening time (like 00:00, 01:00)
        // belong to the "next day" session and should NOT be marked as past
        if (isOvernight && slotMin < timeToMinutes(dayHours.open)) {
          // These are after-midnight slots for the overnight session
          // They are only "past" if the current time has passed closing time
          // E.g., if close is 01:00 and now is 12:00, these slots are NOT past
          // But if now is 02:00 and close is 01:00, the overnight session has ended
          if (nowMin >= timeToMinutes(dayHours.close) + 24 * 60) {
            return { time, status: "maintenance" as const, index };
          }
        } else {
          // Normal daytime slot - check if it's already past
          if (slotMin <= nowMin) return { time, status: "maintenance" as const, index };
        }
      }

      // Check if selected
      if (state.selectionStart !== null && state.selectionEnd !== null) {
        const minIdx = Math.min(state.selectionStart, state.selectionEnd);
        const maxIdx = Math.max(state.selectionStart, state.selectionEnd);
        if (index >= minIdx && index <= maxIdx) {
          return { time, status: "available" as const, index }; // Will be overridden by selected visual
        }
      }

      // Check conflicts with existing bookings
      for (const booking of bookings) {
        if (booking.device_id !== currentDevice.id) continue;
        if (booking.booking_date !== state.selectedDate) continue;
        if (booking.status === "EXPIRED" || booking.status === "FINISHED" || booking.status === "REJECTED") continue;

        // Use overnight-aware conflict detection (handles cross-midnight bookings)
        if (!isSlotInBookingRange(time, booking.start_time, booking.end_time)) continue;

        if (booking.status === "BOOKED" || booking.status === "IN_USE") {
          return { time, status: "booked" as const, index };
        }
        if (booking.status === "PENDING" || booking.status === "WAITING_PAYMENT") {
          return { time, status: "pending" as const, index };
        }
      }

      return { time, status: "available" as const, index };
    });
  }, [state.selectedDate, state.selectedDevice, state.selectionStart, state.selectionEnd, allTimeSlots, bookings]);

  const startTime = useMemo(() => {
    if (state.selectionStart === null) return "";
    return allTimeSlots[state.selectionStart] || "";
  }, [state.selectionStart, allTimeSlots]);

  const durationHours = useMemo(() => {
    if (state.selectionStart === null || state.selectionEnd === null) return 0;
    const diff = Math.abs(state.selectionEnd - state.selectionStart);
    // Each slot is 1 jam, diff langsung = durasi dalam jam (no +1 because end time is exclusive)
    return diff;
  }, [state.selectionStart, state.selectionEnd]);

  const endTime = useMemo(() => {
    if (state.selectionStart === null || !durationHours) return "";
    const startSlot = allTimeSlots[state.selectionStart];
    if (!startSlot) return "";
    return calculateEndTime(startSlot, durationHours);
  }, [state.selectionStart, durationHours, allTimeSlots]);

  const isPromoAvailable = useMemo(() => {
    if (!state.selectedDate || !selectedPricing) return false;
    const day = new Date(state.selectedDate + "T12:00:00").getDay();
    const promoDays = selectedPricing.promo_days || [1, 2, 3, 4, 5];
    return promoDays.includes(day);
  }, [state.selectedDate, selectedPricing]);

  const totalPrice = useMemo(() => {
    if (!selectedPricing || !durationHours || state.selectionStart === null) return 0;

    let total = 0;
    const day = state.selectedDate ? new Date(state.selectedDate + "T12:00:00").getDay() : 1;
    const promoDays = selectedPricing.promo_days || [1, 2, 3, 4, 5];
    const isPromoDay = promoDays.includes(day);
    const hhEnabled = selectedPricing.happy_hour_enabled ?? true;
    const hhStartMin = timeToMinutes(selectedPricing.happy_hour_start || "10:00");
    const hhEndMin = timeToMinutes(selectedPricing.happy_hour_end || "16:00");
    const normalPrice = Number(selectedPricing.hourly_price || 0);
    let hhPrice = Number(selectedPricing.happy_hour_price || 0);
    if (hhPrice <= 0) {
      if (selectedPricing.category === "VIP1") hhPrice = 25000;
      else if (selectedPricing.category === "VIP2") hhPrice = 30000;
      else hhPrice = normalPrice;
    }

    for (let i = 0; i < durationHours; i++) {
      const slotIndex = state.selectionStart + i;
      const slotTime = allTimeSlots[slotIndex];
      if (!slotTime) {
        total += normalPrice;
        continue;
      }
      const slotMin = timeToMinutes(slotTime);

      let slotPrice = normalPrice;
      if (hhEnabled && isPromoDay && hhPrice > 0) {
        if (slotMin >= hhStartMin && slotMin < hhEndMin) {
          slotPrice = hhPrice;
        }
      }
      total += slotPrice;
    }

    // Apply 4h+ discount if applicable on promo days
    if (durationHours >= 4 && isPromoDay && selectedPricing.discount_4h_percent) {
      const rawSum = normalPrice * durationHours;
      return Math.round(rawSum * (1 - selectedPricing.discount_4h_percent / 100));
    }

    return total;
  }, [selectedPricing, durationHours, state.selectionStart, state.selectedDate, allTimeSlots]);

  const isSelectionValid = useMemo(() => {
    if (state.selectionStart === null || state.selectionEnd === null || durationHours < 1) return false;

    // Validate that end time doesn't exceed closing time
    if (startTime && dayHours) {
      const end = calculateEndTime(startTime, durationHours);

      // For overnight schedules (e.g., close at 01:00 next day):
      // end time must not exceed close time + 24h (meaning next day's close)
      const startMin = timeToMinutes(startTime);
      const endMin = timeToMinutes(end);
      const closeMin = timeToMinutes(dayHours.close);
      const openMin = timeToMinutes(dayHours.open);

      const isOvernight = closeMin <= openMin;
      const adjustedCloseMin = isOvernight ? closeMin + 24 * 60 : closeMin;
      const adjustedEndMin = endMin < openMin ? endMin + 24 * 60 : endMin;

      if (adjustedEndMin > adjustedCloseMin) {
        return false;
      }
    }

    return true;
  }, [state.selectionStart, state.selectionEnd, durationHours, startTime, dayHours]);

  // --- Actions ---

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const setSelectedDate = useCallback((date: string) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
      selectionStart: null,
      selectionEnd: null,
      selectedPackage: null,
      selectedPayment: null,
      step: 2,
    }));
  }, []);

  const setSelectedDevice = useCallback((device: Device) => {
    setState((prev) => ({
      ...prev,
      selectedDevice: device,
      selectionStart: null,
      selectionEnd: null,
      selectedPackage: null,
      selectedPayment: null,
    }));
  }, []);

  const handleSlotTap = useCallback((index: number) => {
    setState((prev) => {
      // If no selection yet, set start
      if (prev.selectionStart === null) {
        return { ...prev, selectionStart: index, selectionEnd: index };
      }

      // If tapping same slot, deselect
      if (prev.selectionStart === index && prev.selectionEnd === index) {
        return { ...prev, selectionStart: null, selectionEnd: null };
      }

      // Set end (continuous selection)
      return { ...prev, selectionEnd: index };
    });
  }, []);

  const setSelectedPackage = useCallback((pkg: "PROMO" | "NORMAL") => {
    setState((prev) => ({
      ...prev,
      selectedPackage: pkg,
      selectedPayment: pkg === "PROMO" ? "FULL" : null,
      // Promo langsung lanjut (wajib FULL), Normal tetap di step 3 sampai pilih DP/Full
      step: pkg === "PROMO" ? 4 : prev.step,
    }));
  }, []);

  const setSelectedPayment = useCallback((payment: "DP" | "FULL") => {
    setState((prev) => ({ ...prev, selectedPayment: payment }));
  }, []);

  const setCustomerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, customerName: name }));
  }, []);

  const setAgreedToTerms = useCallback((agreed: boolean) => {
    setState((prev) => ({ ...prev, agreedToTerms: agreed }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const submitBooking = useCallback(async () => {
    const s = state;
    if (!s.selectedDevice || !s.selectedDate || !startTime || !endTime || !durationHours || !s.selectedPackage || !s.selectedPayment || !s.customerName) {
      setState((prev) => ({ ...prev, error: "Mohon lengkapi semua data" }));
      return;
    }

    if (!s.agreedToTerms) {
      setState((prev) => ({ ...prev, error: "Mohon setujui disclaimer terlebih dahulu" }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: "" }));

    const dpAmount = selectedPricing?.hourly_price || totalPrice;
    const paymentAmount = s.selectedPayment === "DP" ? dpAmount : totalPrice;

    // Generate WhatsApp URL
    const waNumber = formatWhatsAppNumber(settings?.whatsapp_number || "082152425391");
    const waMessage = encodeURIComponent(
      `Halo Admin K Gaming XCafe\n\nSaya ingin melakukan booking.\n\nNama:\n${s.customerName}\n\nDevice:\n${s.selectedDevice.name}\n\nTanggal:\n${formatDate(s.selectedDate)}\n\nJam Mulai:\n${startTime}\n\nJam Selesai:\n${endTime}\n\nDurasi:\n${durationHours} Jam\n\nPaket:\n${s.selectedPackage === "PROMO" ? "Promo Weekday" : "Harga Normal"}\n\nMetode Pembayaran:\n${s.selectedPayment === "DP" ? "DP" : "Lunas"}\n\n${s.selectedPayment === "DP" ? "DP" : "Pembayaran"}:\n${formatPrice(paymentAmount)}\n\nTransfer ke:\n${settings?.bank_name || "BCA"} - ${settings?.bank_account_number || "7155450363"}\na/n ${settings?.bank_account_holder || "Nanda A"}\n\nSaya sudah membaca dan menyetujui seluruh ketentuan booking.`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    // Open WhatsApp
    window.open(waUrl, "_blank");

    // Generate booking code
    const code = `KG-${s.selectedDate.replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (settings?.booking_expiration_minutes || 15));

    const bookingData = {
      booking_code: code,
      customer_name: s.customerName,
      customer_phone: "",
      device_id: s.selectedDevice.id,
      booking_date: s.selectedDate,
      start_time: startTime,
      end_time: endTime,
      duration_hours: durationHours,
      package_type: s.selectedPackage,
      payment_type: s.selectedPayment,
      payment_amount: paymentAmount,
      total_price: totalPrice,
      status: "WAITING_PAYMENT",
      expires_at: expiresAt.toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        setState((prev) => ({
          ...prev,
          error: "Gagal menyimpan booking: " + error.message,
          isSubmitting: false,
        }));
        return;
      }

      if (data) {
        setState((prev) => ({
          ...prev,
          bookingResult: data,
          isSubmitting: false,
          step: 5,
        }));
        onBookingCreated(data);
      }
    } catch (e) {
      setState((prev) => ({
        ...prev,
        error: "Terjadi kesalahan koneksi. Silakan coba lagi.",
        isSubmitting: false,
      }));
    }
  }, [state, startTime, endTime, durationHours, totalPrice, selectedPricing, settings, onBookingCreated]);

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    ...state,
    // Computed
    selectedPricing,
    dayHours,
    allTimeSlots,
    slotStatuses,
    startTime,
    endTime,
    durationHours,
    isPromoAvailable,
    totalPrice,
    isSelectionValid,
    // Actions
    setStep,
    setSelectedDate,
    setSelectedDevice,
    handleSlotTap,
    setSelectedPackage,
    setSelectedPayment,
    setCustomerName,
    setAgreedToTerms,
    goToStep,
    submitBooking,
    resetFlow,
  };
}

