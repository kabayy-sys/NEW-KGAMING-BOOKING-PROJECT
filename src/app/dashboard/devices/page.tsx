"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Device } from "@/types/database";
import { formatPrice } from "@/lib/utils";

const staticDevices: Device[] = [
  { id: "1", name: "Reguler 1", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Reguler 2", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Reguler 3", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Reguler 4", category: "REGULAR", hourly_price: 10000, active: true, created_at: "", updated_at: "" },
  { id: "5", name: "VIP 1A", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "6", name: "VIP 1B", category: "VIP1", hourly_price: 30000, active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VIP 2", category: "VIP2", hourly_price: 35000, active: true, created_at: "", updated_at: "" },
];

const statusColors: Record<string, string> = {
  Available: "#22C55E",
  "Waiting Payment": "#EAB308",
  Booked: "#EF4444",
  "In Use": "#8B5CF6",
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(staticDevices);
  const [deviceStatus, setDeviceStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: devData } = await supabase.from("devices").select("*").order("name");
        if (devData && devData.length > 0) setDevices(devData);
      } catch {}

      try {
        const today = new Date().toISOString().split("T")[0];
        const { data: bookings } = await supabase
          .from("bookings")
          .select("device_id, status")
          .eq("booking_date", today)
          .not("status", "in", '("FINISHED","EXPIRED")');

        if (bookings) {
          const statusMap: Record<string, string> = {};
          bookings.forEach((b: { device_id: string; status: string }) => {
            if (!statusMap[b.device_id] || b.status === "IN_USE" || b.status === "BOOKED") {
              statusMap[b.device_id] = b.status;
            }
          });
          setDeviceStatus(statusMap);
        }
      } catch {} finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusLabel = (deviceId: string) => {
    const status = deviceStatus[deviceId];
    if (!status) return "Available";
    switch (status) {
      case "WAITING_PAYMENT": return "Waiting Payment";
      case "BOOKED": return "Booked";
      case "IN_USE": return "In Use";
      default: return "Available";
    }
  };

  const getStatusColor = (deviceId: string) => {
    const label = getStatusLabel(deviceId);
    return statusColors[label] || "#6B7280";
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Device Management</h1>

      {loading ? (
        <p className="text-sm" style={{ color: "#A1A1AA" }}>Memuat data...</p>
      ) : (
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ backgroundColor: "#1F2330" }}
            >
              <div>
                <p className="font-semibold">{device.name}</p>
                <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                  {device.category} • {formatPrice(device.hourly_price)}/Jam
                </p>
              </div>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor: getStatusColor(device.id) + "20",
                  color: getStatusColor(device.id),
                }}
              >
                {getStatusLabel(device.id)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}