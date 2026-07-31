"use client";

import React, { useMemo } from "react";
import { Booking, Device } from "@/types/database";
import { generateTimeSlots, timeToMinutes, getTodayDate, isSlotInBookingRange } from "@/lib/utils";

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
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // Determine if this is an overnight schedule (close <= open, e.g. 10:00 - 03:00)
    // by checking if the last slot time is less than the first slot time
    const isOvernight = allTimeSlots.length > 0 && timeToMinutes(allTimeSlots[allTimeSlots.length - 1]) < timeToMinutes(allTimeSlots[0]);
    const firstSlotMin = allTimeSlots.length > 0 ? timeToMinutes(allTimeSlots[0]) : 600;
    const lastSlotMin = allTimeSlots.length > 0 ? timeToMinutes(allTimeSlots[allTimeSlots.length - 1]) : 0;
    const closeMin = lastSlotMin + 60;

    for (const device of vipDevices) {
      result[device.id] = allTimeSlots.map((time) => {
        // Skip past slots for today (handle overnight correctly)
        if (selectedDate === today) {
          const [h, m] = time.split(":").map(Number);
          const slotMin = h * 60 + m;

          // For overnight schedules, slots before opening time (like 00:00, 01:00, 02:00)
          // belong to the "next day" session and should NOT be marked as past
          if (isOvernight && slotMin < firstSlotMin) {
            // After-midnight slots - only "past" if now has passed next day's closing time
            const adjustedCloseMin = closeMin + 24 * 60;
            if (nowMin >= adjustedCloseMin) {
              return { time, status: "maintenance" as SlotStatus };
            }
          } else {
            // Normal daytime slot - check if it's already past
            if (slotMin <= nowMin) {
              return { time, status: "maintenance" as SlotStatus };
            }
          }
        }

        for (const booking of bookings) {
          if (booking.device_id !== device.id) continue;
          if (booking.booking_date !== selectedDate) continue;
          if (
            booking.status === "EXPIRED" ||
            booking.status === "FINISHED" ||
            booking.status === "REJECTED"
          )
            continue;

          // Use overnight-aware conflict detection (handles cross-midnight bookings)
          if (!isSlotInBookingRange(time, booking.start_time, booking.end_time)) continue;

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