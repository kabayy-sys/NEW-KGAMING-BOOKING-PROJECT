"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Device } from "@/types/database";
import { formatPrice, getTodayDate } from "@/lib/utils";
import Link from "next/link";

// Static device data for preview when Supabase is not connected
const staticDevices: Device[] = [
  {
    id: "1",
    name: "Reguler 1",
    category: "REGULAR",
    hourly_price: 10000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Reguler 2",
    category: "REGULAR",
    hourly_price: 10000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "Reguler 3",
    category: "REGULAR",
    hourly_price: 10000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    name: "Reguler 4",
    category: "REGULAR",
    hourly_price: 10000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    name: "VIP 1A",
    category: "VIP1",
    hourly_price: 30000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    name: "VIP 1B",
    category: "VIP1",
    hourly_price: 30000,
    active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "7",
    name: "VIP 2",
    category: "VIP2",
    hourly_price: 35000,
    active: true,
    created_at: "",
    updated_at: "",
  },
];

const categoryIcons: Record<string, string> = {
  REGULAR: "🎮",
  VIP1: "🌟",
  VIP2: "👑",
};

const categoryLabels: Record<string, string> = {
  REGULAR: "Reguler",
  VIP1: "VIP 1",
  VIP2: "VIP 2",
};

export default function HomePage() {
  const [devices, setDevices] = useState<Device[]>(staticDevices);
  const [loading, setLoading] = useState(true);
  const [deviceStatuses, setDeviceStatuses] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    async function fetchDevices() {
      try {
        const { data } = await supabase
          .from("devices")
          .select("*")
          .eq("active", true)
          .order("name");

        if (data && data.length > 0) {
          setDevices(data);
        }
      } catch {
        // Use static data if Supabase is not configured
      } finally {
        setLoading(false);
      }
    }

    async function fetchStatuses() {
      try {
        const today = getTodayDate();
        const { data: bookings } = await supabase
          .from("bookings")
          .select("device_id, status")
          .eq("booking_date", today)
          .in("status", ["WAITING_PAYMENT", "BOOKED", "IN_USE"]);

        if (bookings) {
          const statusMap: Record<string, string> = {};
          bookings.forEach((b: { device_id: string; status: string }) => {
            if (
              !statusMap[b.device_id] ||
              b.status === "IN_USE" ||
              b.status === "BOOKED"
            ) {
              statusMap[b.device_id] = b.status;
            }
          });
          setDeviceStatuses(statusMap);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchDevices();
    fetchStatuses();
  }, []);

  const getStatusInfo = (deviceId: string) => {
    const status = deviceStatuses[deviceId];
    if (!status) return { label: "Available", color: "#22C55E" };
    switch (status) {
      case "WAITING_PAYMENT":
        return { label: "Waiting Payment", color: "#EAB308" };
      case "BOOKED":
        return { label: "Booked", color: "#EF4444" };
      case "IN_USE":
        return { label: "In Use", color: "#8B5CF6" };
      default:
        return { label: "Available", color: "#22C55E" };
    }
  };

  // Group devices by category
  const regularDevices = devices.filter((d) => d.category === "REGULAR");
  const vip1Devices = devices.filter((d) => d.category === "VIP1");
  const vip2Devices = devices.filter((d) => d.category === "VIP2");

  return (
    <div className="flex-1">
      {/* Staff Login Link */}
      <div className="fixed top-4 right-4 z-10">
        <Link
          href="/dashboard/login"
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#1F2330", color: "#A1A1AA", border: "1px solid #3F4452" }}
        >
          🔐 Staff Login
        </Link>
      </div>

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#F5B700" }}>
            K Gaming XCafe
          </h1>
          <p className="text-lg mb-1 font-semibold text-white">
            Booking PS Online Lebih Mudah
          </p>
          <p className="text-sm mb-6" style={{ color: "#A1A1AA" }}>
            Lihat ketersediaan device secara realtime dan lakukan booking hanya
            dalam beberapa langkah.
          </p>
          <a
            href="#devices"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-lg text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5B700" }}
          >
            Booking Sekarang
          </a>
        </div>
      </section>

      {/* Devices Section */}
      <section id="devices" className="px-4 pb-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">
          Pilih Device Kamu
        </h2>

        {loading ? (
          <p className="text-center" style={{ color: "#A1A1AA" }}>
            Memuat device...
          </p>
        ) : (
          <>
            {/* Regular Devices */}
            {regularDevices.length > 0 && (
              <DeviceCategorySection
                title="Reguler"
                icon="🎮"
                devices={regularDevices}
                getStatusInfo={getStatusInfo}
              />
            )}

            {/* VIP 1 Devices */}
            {vip1Devices.length > 0 && (
              <DeviceCategorySection
                title="VIP 1"
                icon="🌟"
                devices={vip1Devices}
                getStatusInfo={getStatusInfo}
              />
            )}

            {/* VIP 2 Devices */}
            {vip2Devices.length > 0 && (
              <DeviceCategorySection
                title="VIP 2"
                icon="👑"
                devices={vip2Devices}
                getStatusInfo={getStatusInfo}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function DeviceCategorySection({
  title,
  icon,
  devices,
  getStatusInfo,
}: {
  title: string;
  icon: string;
  devices: Device[];
  getStatusInfo: (id: string) => { label: string; color: string };
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">
        {icon} {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {devices.map((device) => {
          const statusInfo = getStatusInfo(device.id);
          const isAvailable = statusInfo.label === "Available";

          return (
            <div
              key={device.id}
              className="rounded-xl p-4 border border-gray-800"
              style={{ backgroundColor: "#1F2330" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">{device.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                    {icon} {title}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: statusInfo.color + "20",
                    color: statusInfo.color,
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>

              <p className="text-lg font-bold text-white mb-3">
                {formatPrice(device.hourly_price)}
                <span className="text-sm font-normal" style={{ color: "#A1A1AA" }}>
                  /Jam
                </span>
              </p>

              {isAvailable ? (
                <Link
                  href={`/booking?device=${device.id}`}
                  className="block w-full py-2 rounded-lg text-center font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#F5B700", color: "#000" }}
                >
                  Booking
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-2 rounded-lg text-center font-medium cursor-not-allowed"
                  style={{ backgroundColor: "#3F4452", color: "#6B7280" }}
                >
                  Tidak Tersedia
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}