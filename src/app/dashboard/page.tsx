"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Booking, Device } from "@/types/database";
import { formatPrice, getTodayDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    waitingPayment: 0,
    booked: 0,
    inUse: 0,
    todayRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = getTodayDate();

        // Fetch today's bookings
        const { data: todayBookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", today);

        if (todayBookings) {
          const waiting = todayBookings.filter((b: any) => b.status === "WAITING_PAYMENT").length;
          const booked = todayBookings.filter((b: any) => b.status === "BOOKED").length;
          const inUse = todayBookings.filter((b: any) => b.status === "IN_USE").length;
          const revenue = todayBookings
            .filter((b: any) => b.status !== "WAITING_PAYMENT" && b.status !== "EXPIRED")
            .reduce((sum: number, b: any) => sum + (b.payment_amount || 0), 0);

          setStats({ waitingPayment: waiting, booked, inUse, todayRevenue: revenue });
          setRecentBookings(todayBookings.slice(0, 10));
        }
      } catch {
        // Use mock data if Supabase not configured
        setStats({ waitingPayment: 0, booked: 0, inUse: 0, todayRevenue: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WAITING_PAYMENT": return "Waiting Payment";
      case "BOOKED": return "Booked";
      case "IN_USE": return "In Use";
      case "FINISHED": return "Finished";
      case "EXPIRED": return "Expired";
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          label="Waiting Payment"
          value={`${stats.waitingPayment} Booking`}
          color="#EAB308"
        />
        <SummaryCard
          label="Booked"
          value={`${stats.booked} Booking`}
          color="#EF4444"
        />
        <SummaryCard
          label="In Use"
          value={`${stats.inUse} Device`}
          color="#8B5CF6"
        />
        <SummaryCard
          label="Pendapatan Hari Ini"
          value={formatPrice(stats.todayRevenue)}
          color="#22C55E"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Link
          href="/dashboard/bookings?status=WAITING_PAYMENT"
          className="rounded-xl p-4 text-center transition-colors"
          style={{ backgroundColor: "#1F2330" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#EAB308" }}>
            ⏳ Waiting Payment
          </p>
          <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
            Lihat booking yang perlu diverifikasi
          </p>
        </Link>

        <Link
          href="/dashboard/bookings"
          className="rounded-xl p-4 text-center transition-colors"
          style={{ backgroundColor: "#1F2330" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#F5B700" }}>
            📋 Semua Booking
          </p>
          <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
            Kelola seluruh booking
          </p>
        </Link>

        <Link
          href="/dashboard/devices"
          className="rounded-xl p-4 text-center transition-colors"
          style={{ backgroundColor: "#1F2330" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>
            🎮 Status Device
          </p>
          <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
            Lihat status device saat ini
          </p>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-bold mb-3">Booking Hari Ini</h2>
        {loading ? (
          <p className="text-sm" style={{ color: "#A1A1AA" }}>
            Memuat data...
          </p>
        ) : recentBookings.length === 0 ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: "#1F2330" }}
          >
            <p style={{ color: "#A1A1AA" }}>Belum ada booking hari ini</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ backgroundColor: "#1F2330" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {booking.customer_name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                    {booking.booking_code} • {booking.start_time} - {booking.end_time}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium ml-3 whitespace-nowrap"
                  style={{
                    backgroundColor: getStatusColor(booking.status) + "20",
                    color: getStatusColor(booking.status),
                  }}
                >
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#1F2330" }}
    >
      <p className="text-xs mb-1" style={{ color: "#A1A1AA" }}>
        {label}
      </p>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}