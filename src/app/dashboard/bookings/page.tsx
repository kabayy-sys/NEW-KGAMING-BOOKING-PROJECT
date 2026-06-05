"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Booking, Device } from "@/types/database";
import { formatPrice, getTodayDate } from "@/lib/utils";

const staticDevices: Device[] = [
  { id: "1", name: "Reguler 1", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Reguler 2", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Reguler 3", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Reguler 4", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "5", name: "VIP 1A", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "6", name: "VIP 1B", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VIP 2", category: "VIP2", hourly_price: 35000, active: true, created_at: "", updated_at: "" },
];

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [devices, setDevices] = useState<Device[]>(staticDevices);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(statusFilter || "ALL");

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
      await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus as any } : b
        )
      );
    } catch {}
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find((d) => d.id === deviceId)?.name || deviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING_PAYMENT": return "#EAB308";
      case "BOOKED": return "#EF4444";
      case "IN_USE": return "#8B5CF6";
      case "FINISHED": return "#6B7280";
      case "EXPIRED": return "#4B5563";
      default: return "#6B7280";
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Booking Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["ALL", "WAITING_PAYMENT", "BOOKED", "IN_USE", "FINISHED", "EXPIRED"].map((f) => (
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
                  <button
                    onClick={() => handleStatusChange(booking.id, "IN_USE")}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "#8B5CF6", color: "#FFF" }}
                  >
                    ▶️ Mark In Use
                  </button>
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
    </div>
  );
}