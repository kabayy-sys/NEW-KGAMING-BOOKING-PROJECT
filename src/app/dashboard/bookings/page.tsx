"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Booking, Device } from "@/types/database";
import { formatPrice, getTodayDate, calculateEndTime, generateTimeSlots, getDayName, formatDate } from "@/lib/utils";

const staticDevices: Device[] = [
  { id: "5", name: "VIP 1A", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "6", name: "VIP 1B", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VIP 2", category: "VIP2", hourly_price: 35000, active: true, created_at: "", updated_at: "" },
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

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [devices, setDevices] = useState<Device[]>(staticDevices);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(statusFilter || "ALL");
  const [businessHours, setBusinessHours] = useState(staticBusinessHours);

  // Reschedule modal state
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  useEffect(() => {
    async function fetchInitial() {
      try {
        const { data: hoursData } = await supabase.from("business_hours").select("*");
        if (hoursData && hoursData.length > 0) {
          const hoursMap: Record<string, { open: string; close: string }> = {};
          hoursData.forEach((h: any) => {
            if (h.active) hoursMap[h.day_name] = { open: h.open_time, close: h.close_time };
          });
          if (Object.keys(hoursMap).length > 0) setBusinessHours(hoursMap);
        }
      } catch {}
    }
    fetchInitial();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: devData } = await supabase.from("devices").select("*").eq("active", true);
        if (devData && devData.length > 0) setDevices(devData);
      } catch {}

      try {
        let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (filter !== "ALL") {
          query = query.eq("status", filter);
        }
        const { data } = await query;
        if (data) setBookings(data);
      } catch {} finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filter]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (error) {
        console.error("Failed to update status:", error.message);
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus as any } : b
        )
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Open reschedule modal
  const openReschedule = (booking: Booking) => {
    setRescheduleBooking(booking);
    setRescheduleDate(booking.booking_date);
    setRescheduleTime("");
    setRescheduleSlots([]);
    setRescheduleError("");
  };

  const closeReschedule = () => {
    setRescheduleBooking(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleSlots([]);
    setRescheduleError("");
  };

  // Fetch available slots when date changes for reschedule
  useEffect(() => {
    if (!rescheduleBooking || !rescheduleDate) {
      setRescheduleSlots([]);
      return;
    }

    const bookId = rescheduleBooking!.id;
    const bookDeviceId = rescheduleBooking!.device_id;
    const bookDuration = rescheduleBooking!.duration_hours;

    async function fetchSlots() {
      setRescheduleLoading(true);
      setRescheduleTime("");
      setRescheduleError("");

      const dayName = getDayName(new Date(rescheduleDate + "T12:00:00"));
      const hours = businessHours[dayName] || { open: "10:00", close: "01:00" };

      // Generate all time slots
      const allSlots = generateTimeSlots(hours.open, hours.close);

      // Fetch existing bookings for this device+date (excluding current booking)
      try {
        const { data: existingBookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("device_id", bookDeviceId)
          .eq("booking_date", rescheduleDate)
          .not("status", "in", '("EXPIRED","FINISHED","REJECTED")');

        // Filter out slots that overlap with existing bookings
        const availableSlots = allSlots.filter((slot) => {
          const slotEnd = calculateEndTime(slot, bookDuration);

          // For each existing booking (excluding current one), check overlap
          for (const existing of existingBookings || []) {
            if (existing.id === bookId) continue; // skip current booking

            const hasOverlap = slot < existing.end_time && slotEnd > existing.start_time;
            if (hasOverlap) return false;
          }

          return true;
        });

        setRescheduleSlots(availableSlots);
      } catch {
        setRescheduleError("Gagal memuat slot");
      } finally {
        setRescheduleLoading(false);
      }
    }

    fetchSlots();
  }, [rescheduleDate, rescheduleBooking, businessHours]);

  // Confirm reschedule
  const handleRescheduleConfirm = async () => {
    if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) return;

    const bookId = rescheduleBooking!.id;
    const bookDuration = rescheduleBooking!.duration_hours;
    const endTime = calculateEndTime(rescheduleTime, bookDuration);

    setRescheduleError("");

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          booking_date: rescheduleDate,
          start_time: rescheduleTime,
          end_time: endTime,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookId);

      if (error) {
        setRescheduleError("Gagal reschedule: " + error.message);
        return;
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? { ...b, booking_date: rescheduleDate, start_time: rescheduleTime, end_time: endTime }
            : b
        )
      );

      closeReschedule();
    } catch (err: any) {
      setRescheduleError("Gagal reschedule: " + err.message);
    }
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find((d) => d.id === deviceId)?.name || deviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "#F97316";
      case "WAITING_PAYMENT": return "#EAB308";
      case "BOOKED": return "#EF4444";
      case "IN_USE": return "#8B5CF6";
      case "FINISHED": return "#6B7280";
      case "EXPIRED": return "#4B5563";
      case "REJECTED": return "#991B1B";
      default: return "#6B7280";
    }
  };

  const getAvailableDates = () => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const label = `${dayNames[date.getDay()]}, ${date.getDate()}`;
      dates.push({ value, label });
    }
    return dates;
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Booking Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
          {["ALL", "PENDING", "WAITING_PAYMENT", "BOOKED", "IN_USE", "FINISHED", "EXPIRED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: filter === f ? "#F5B700" : "#1F2330",
              color: filter === f ? "#000" : "#A1A1AA",
            }}
          >
            {f === "ALL" ? "Semua" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <p className="text-sm" style={{ color: "#A1A1AA" }}>Memuat data...</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: "#1F2330" }}>
          <p style={{ color: "#A1A1AA" }}>Tidak ada booking</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#1F2330" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{booking.customer_name}</p>
                  <p className="text-xs" style={{ color: "#A1A1AA" }}>
                    {booking.booking_code}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: getStatusColor(booking.status) + "20",
                    color: getStatusColor(booking.status),
                  }}
                >
                  {booking.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3" style={{ color: "#A1A1AA" }}>
                <span>Device: {getDeviceName(booking.device_id)}</span>
                <span>Tanggal: {booking.booking_date}</span>
                <span>Jam: {booking.start_time} - {booking.end_time}</span>
                <span>Durasi: {booking.duration_hours} Jam</span>
                <span>Pembayaran: {formatPrice(booking.total_price)}</span>
                <span>Status: {booking.payment_type === "DP" ? `DP (${formatPrice(booking.payment_amount || 0)})` : "Lunas"}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                {booking.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking.id, "BOOKED")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#22C55E", color: "#000" }}
                    >
                      ✅ Setujui
                    </button>
                    <button
                      onClick={() => openReschedule(booking)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#3B82F6", color: "#FFF" }}
                    >
                      📅 Reschedule
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, "REJECTED")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#EF4444", color: "#FFF" }}
                    >
                      ❌ Tolak
                    </button>
                  </>
                )}
                {booking.status === "WAITING_PAYMENT" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking.id, "BOOKED")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#22C55E", color: "#000" }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, "EXPIRED")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#EF4444", color: "#FFF" }}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                {booking.status === "BOOKED" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking.id, "IN_USE")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#8B5CF6", color: "#FFF" }}
                    >
                      ▶️ Mark In Use
                    </button>
                    <button
                      onClick={() => openReschedule(booking)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#3B82F6", color: "#FFF" }}
                    >
                      📅 Reschedule
                    </button>
                  </>
                )}
                {booking.status === "IN_USE" && (
                  <button
                    onClick={() => handleStatusChange(booking.id, "FINISHED")}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "#6B7280", color: "#FFF" }}
                  >
                    ✅ Mark Finished
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBooking && (() => {
        const rb = rescheduleBooking!;
        return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={closeReschedule}
        >
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ backgroundColor: "#1F2330" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">Reschedule Booking</h3>
            <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
              {rb.customer_name} — {getDeviceName(rb.device_id)}
              <br />
              Durasi: {rb.duration_hours} Jam
            </p>

            {rescheduleError && (
              <div className="mb-3 p-2 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-xs">
                {rescheduleError}
              </div>
            )}

            {/* Pilih Tanggal */}
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#A1A1AA" }}>
              Pilih Tanggal Baru
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {getAvailableDates().map((date) => (
                <button
                  key={date.value}
                  onClick={() => setRescheduleDate(date.value)}
                  className="py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: rescheduleDate === date.value ? "#F5B700" : "#171923",
                    color: rescheduleDate === date.value ? "#000" : "#FFF",
                    border: "1px solid",
                    borderColor: rescheduleDate === date.value ? "#F5B700" : "#3F4452",
                  }}
                >
                  {date.label}
                </button>
              ))}
            </div>

            {/* Pilih Jam */}
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#A1A1AA" }}>
              Pilih Jam Baru
            </label>
            {rescheduleLoading ? (
              <p className="text-xs py-4 text-center" style={{ color: "#A1A1AA" }}>Memuat slot...</p>
            ) : rescheduleSlots.length === 0 && rescheduleDate ? (
              <p className="text-xs py-4 text-center" style={{ color: "#EF4444" }}>
                Tidak ada slot tersedia untuk tanggal ini
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-4 max-h-40 overflow-y-auto">
                {rescheduleSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setRescheduleTime(slot)}
                    className="py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: rescheduleTime === slot ? "#F5B700" : "#171923",
                      color: rescheduleTime === slot ? "#000" : "#FFF",
                      border: "1px solid",
                      borderColor: rescheduleTime === slot ? "#F5B700" : "#3F4452",
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={closeReschedule}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#3F4452", color: "#FFF" }}
              >
                Batal
              </button>
              <button
                onClick={handleRescheduleConfirm}
                disabled={!rescheduleDate || !rescheduleTime}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{
                  backgroundColor: rescheduleDate && rescheduleTime ? "#3B82F6" : "#3F4452",
                  color: rescheduleDate && rescheduleTime ? "#FFF" : "#6B7280",
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      );
      })()}
    </div>
  );
}