"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Booking, Device } from "@/types/database";
import { getTodayDate } from "@/lib/utils";
import StaffSchedule from "@/components/dashboard/staff-schedule";

export default function DashboardHome() {
  const today = getTodayDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [stats, setStats] = useState({
    waitingPayment: 0,
    booked: 0,
    inUse: 0,
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch all devices
        const { data: devicesData } = await supabase.from("devices").select("*");
        if (devicesData) setDevices(devicesData);

        // Fetch bookings for selected date
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", selectedDate);

        if (bookingsData) {
          const waiting = bookingsData.filter(
            (b: any) => b.status === "WAITING_PAYMENT"
          ).length;
          const booked = bookingsData.filter(
            (b: any) => b.status === "BOOKED"
          ).length;
          const inUse = bookingsData.filter(
            (b: any) => b.status === "IN_USE"
          ).length;

          setStats({ waitingPayment: waiting, booked, inUse });
          setBookings(bookingsData);
        }
      } catch {
        setStats({ waitingPayment: 0, booked: 0, inUse: 0 });
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [selectedDate]);

  const goToDate = (days: number) => {
    const date = new Date(selectedDate + "T12:00:00");
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
  };

  return (
    <div>
      {/* Header with Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToDate(-1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: "#1F2330", color: "#A1A1AA" }}
          >
            ◀
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-center outline-none"
            style={{
              backgroundColor: "#1F2330",
              color: "#F5B700",
              border: "1px solid #3F4452",
            }}
          />

          <button
            onClick={() => goToDate(1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: "#1F2330", color: "#A1A1AA" }}
          >
            ▶
          </button>

          {selectedDate !== today && (
            <button
              onClick={() => setSelectedDate(today)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
              style={{ backgroundColor: "#3F4452", color: "#FFF" }}
            >
              Hari Ini
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard
          label="Waiting Payment"
          value={`${stats.waitingPayment}`}
          color="#EAB308"
        />
        <SummaryCard
          label="Booked"
          value={`${stats.booked}`}
          color="#EF4444"
        />
        <SummaryCard
          label="In Use"
          value={`${stats.inUse}`}
          color="#8B5CF6"
        />
      </div>

      {/* Schedule Grid */}
      <div>
        <h2 className="text-lg font-bold mb-3">
          Jadwal VIP
          <span className="text-sm font-normal ml-2" style={{ color: "#A1A1AA" }}>
            {selectedDate === today ? "Hari Ini" : selectedDate}
          </span>
        </h2>

        {loading ? (
          <p className="text-sm py-8 text-center" style={{ color: "#A1A1AA" }}>
            Loading...
          </p>
        ) : (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#1F2330" }}
          >
            <StaffSchedule
              devices={devices}
              bookings={bookings}
              selectedDate={selectedDate}
            />
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
      className="rounded-xl p-4 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "#1F2330" }}
    >
      <p className="text-2xl font-black" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] mt-1 font-medium" style={{ color: "#A1A1AA" }}>
        {label}
      </p>
    </div>
  );
}

