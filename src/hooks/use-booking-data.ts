"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Device, PricingRule, Disclaimer, Settings, Booking, BusinessHour } from "@/types/database";

interface BusinessHoursMap {
  [dayName: string]: { open: string; close: string };
}

interface BookingData {
  devices: Device[];
  pricingRules: PricingRule[];
  settings: Settings | null;
  disclaimers: Disclaimer[];
  businessHours: BusinessHoursMap;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const VIP_DEVICE_IDS = ["5", "6", "7"]; // VIP 1A, VIP 1B, VIP 2

const fallbackDevices: Device[] = [
  { id: "5", name: "VIP 1A", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "6", name: "VIP 1B", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VIP 2", category: "VIP2", hourly_price: 35000, active: true, created_at: "", updated_at: "" },
];

const fallbackPricing: PricingRule[] = [
  { id: "2", category: "VIP1", hourly_price: 30000, promo_2h_price: 55000, promo_3h_price: 80000, discount_4h_percent: 20, created_at: "", updated_at: "" },
  { id: "3", category: "VIP2", hourly_price: 35000, promo_2h_price: 65000, promo_3h_price: 90000, discount_4h_percent: 20, created_at: "", updated_at: "" },
];

const fallbackSettings: Settings = {
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

const fallbackDisclaimers: Disclaimer[] = [
  { id: "1", content: "Booking dianggap aktif setelah pembayaran diverifikasi staff.", active: true, sort_order: 1 },
  { id: "2", content: "Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.", active: true, sort_order: 2 },
  { id: "3", content: "Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.", active: true, sort_order: 3 },
  { id: "4", content: "Keterlambatan pelanggan tidak menambah durasi bermain.", active: true, sort_order: 4 },
  { id: "5", content: "Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.", active: true, sort_order: 5 },
  { id: "6", content: "Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.", active: true, sort_order: 6 },
  { id: "7", content: "Uang booking yang sudah dibayarkan tidak dapat dikembalikan.", active: true, sort_order: 7 },
];

const fallbackBusinessHours: BusinessHoursMap = {
  SUNDAY: { open: "10:00", close: "01:00" },
  MONDAY: { open: "10:00", close: "01:00" },
  TUESDAY: { open: "10:00", close: "01:00" },
  WEDNESDAY: { open: "10:00", close: "01:00" },
  THURSDAY: { open: "10:00", close: "01:00" },
  FRIDAY: { open: "10:00", close: "03:00" },
  SATURDAY: { open: "10:00", close: "03:00" },
};

export function useBookingData(selectedDate: string | null) {
  const [data, setData] = useState<BookingData>({
    devices: fallbackDevices,
    pricingRules: fallbackPricing,
    settings: fallbackSettings,
    disclaimers: fallbackDisclaimers,
    businessHours: fallbackBusinessHours,
    bookings: [],
    loading: true,
    error: null,
  });

  // Fetch static data once
  useEffect(() => {
    let cancelled = false;

    async function fetchStatic() {
      try {
        const [devicesRes, pricingRes, settingsRes, disclaimersRes, hoursRes] = await Promise.all([
          supabase.from("devices").select("*").eq("active", true).order("name"),
          supabase.from("pricing_rules").select("*"),
          supabase.from("settings").select("*").single(),
          supabase.from("disclaimers").select("*").order("sort_order"),
          supabase.from("business_hours").select("*"),
        ]);

        if (cancelled) return;

        // Devices - filter only VIP
        if (devicesRes.data && devicesRes.data.length > 0) {
          const vipDevices = devicesRes.data.filter(
            (d: Device) => d.category === "VIP1" || d.category === "VIP2"
          );
          if (vipDevices.length > 0) {
            setData((prev) => ({ ...prev, devices: vipDevices }));
          }
        }

        // Pricing
        if (pricingRes.data && pricingRes.data.length > 0) {
          setData((prev) => ({ ...prev, pricingRules: pricingRes.data }));
        }

        // Settings
        if (settingsRes.data) {
          setData((prev) => ({ ...prev, settings: settingsRes.data }));
        }

        // Disclaimers
        if (disclaimersRes.data && disclaimersRes.data.length > 0) {
          setData((prev) => ({ ...prev, disclaimers: disclaimersRes.data }));
        }

        // Business hours
        if (hoursRes.data && hoursRes.data.length > 0) {
          const hoursMap: BusinessHoursMap = {};
          hoursRes.data.forEach((h: BusinessHour) => {
            if (h.active) {
              hoursMap[h.day_name] = { open: h.open_time.slice(0, 5), close: h.close_time.slice(0, 5) };
            }
          });
          if (Object.keys(hoursMap).length > 0) {
            setData((prev) => ({ ...prev, businessHours: hoursMap }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch booking data:", e);
      } finally {
        if (!cancelled) {
          setData((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchStatic();
    return () => { cancelled = true; };
  }, []);

  // Fetch bookings when date changes + realtime subscription
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchBookings() {
      try {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", selectedDate)
          .not("status", "in", '("EXPIRED","FINISHED","REJECTED")');

        if (bookings) {
          setData((prev) => ({ ...prev, bookings }));
        }
      } catch {}
    }

    fetchBookings();

    // Realtime subscription for this date
    const channel = supabase
      .channel(`bookings-${selectedDate}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `booking_date=eq.${selectedDate}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const addBooking = useCallback((booking: Booking) => {
    setData((prev) => ({
      ...prev,
      bookings: [...prev.bookings, booking],
    }));
  }, []);

  return { ...data, addBooking };
}