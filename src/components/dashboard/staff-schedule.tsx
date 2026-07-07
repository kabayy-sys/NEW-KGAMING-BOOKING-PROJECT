"use client";

import React, { useMemo } from "react";
import { Booking, Device } from "@/types/database";
import { generateTimeSlots, timeToMinutes, getTodayDate } from "@/lib/utils";

interface StaffScheduleProps {
  devices: Device[];
  bookings: Booking[];
  selectedDate: string;
}

type SlotStatus = "available" | "pending" | "booked" | "inuse" | "maintenance";

export default function StaffSchedule({ devices, bookings, selectedDate }: StaffScheduleProps) {
  const vipDevices = useMemo(
    () => devices.filter((d) => d.category === "VIP1" || d.category === "VIP2"),
    [devices]
  );

  // Generate time slots for a full day (10:00 - 03:00)
  const allTimeSlots = useMemo(() => {
    return generateTimeSlots("10:00", "03:00");
  }, []);

  // Compute status for each device at each time slot
  const deviceSlotStatuses = useMemo(() => {
    const result: Record<string, { time: string; status: SlotStatus }[]> = {};
    const today = getTodayDate();
    const now = new Date();

    for (const device of vipDevices) {
      result[device.id] = allTimeSlots.map((time) => {
        // Skip past slots for today
        if (selectedDate === today) {
          const [h, m] = time.split(":").map(Number);
          const slotMin = h * 60 + m;
          const nowMin = now.getHours() * 60 + now.getMinutes();
          if (slotMin <= nowMin) {
            return { time, status: "maintenance" as SlotStatus };
          }
        }

        const slotStartMin = timeToMinutes(time);

        for (const booking of bookings) {
          if (booking.device_id !== device.id) continue;
          if (booking.booking_date !== selectedDate) continue;
          if (
            booking.status === "EXPIRED" ||
            booking.status === "FINISHED" ||
            booking.status === "REJECTED"
          )
            continue;

          const bookingStartMin = timeToMinutes(booking.start_time);
          const bookingEndMin = timeToMinutes(booking.end_time);
          const slotStartsInside =
            slotStartMin >= bookingStartMin && slotStartMin < bookingEndMin;
          if (!slotStartsInside) continue;

          if (booking.status === "BOOKED") {
            return { time, status: "booked" as SlotStatus };
          }
          if (booking.status === "IN_USE") {
            return { time, status: "inuse" as SlotStatus };
          }
          if (
            booking.status === "PENDING" ||
            booking.status === "WAITING_PAYMENT"
          ) {
            return { time, status: "pending" as SlotStatus };
          }
        }

        return { time, status: "available" as SlotStatus };
      });
    }

    return result;
  }, [vipDevices, allTimeSlots, bookings, selectedDate]);

  const getCellStyle = (status: SlotStatus) => {
    switch (status) {
      case "available":
        return { backgroundColor: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.5)", color: "#A1A1AA" };
      case "pending":
        return { backgroundColor: "rgba(234, 179, 8, 0.15)", border: "1px solid #EAB308", color: "#FFFFFF" };
      case "booked":
        return { backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444", color: "#FFFFFF" };
      case "inuse":
        return { backgroundColor: "rgba(139, 92, 246, 0.15)", border: "1px solid #8B5CF6", color: "#FFFFFF" };
      case "maintenance":
        return { backgroundColor: "rgba(107, 114, 128, 0.08)", border: "1px solid #4B5563", color: "#6B7280" };
      default:
        return { backgroundColor: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.5)", color: "#A1A1AA" };
    }
  };

  if (vipDevices.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm" style={{ color: "#A1A1AA" }}>
          Tidak ada device VIP
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Room Headers */}
      <div className="grid grid-cols-3 gap-1.5 mb-1.5">
        {vipDevices.map((device) => (
          <div
            key={device.id}
            className="flex flex-col items-center justify-center min-h-[44px] rounded-lg font-bold text-xs"
            style={{
              backgroundColor: "#171923",
              border: "1px solid #3F4452",
              color: "#F5B700",
            }}
          >
            <span>{device.name}</span>
            <span className="text-[9px] font-normal" style={{ color: "#6B7280" }}>
              {device.category === "VIP1" ? "VIP" : "VIP+"}
            </span>
          </div>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {allTimeSlots.map((time) => (
          <React.Fragment key={time}>
            {vipDevices.map((device) => {
              const deviceStatuses = deviceSlotStatuses[device.id] || [];
              const slotInfo = deviceStatuses.find((s) => s.time === time);
              const status = slotInfo?.status || "available";
              const cellStyle = getCellStyle(status);

              return (
                <div
                  key={`${time}-${device.id}`}
                  className="flex items-center justify-center min-h-[36px] rounded-lg text-[10px] font-medium"
                  style={{
                    backgroundColor: cellStyle.backgroundColor,
                    border: cellStyle.border,
                    color: cellStyle.color,
                    padding: "2px 4px",
                  }}
                >
                  {time}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3" style={{ borderTop: "1px solid #2D3140" }}>
        <LegendItem color="#22C55E" label="Available" />
        <LegendItem color="#EAB308" label="Pending" />
        <LegendItem color="#EF4444" label="Booked" />
        <LegendItem color="#8B5CF6" label="In Use" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-[9px]" style={{ color: "#6B7280" }}>
        {label}
      </span>
    </div>
  );
}