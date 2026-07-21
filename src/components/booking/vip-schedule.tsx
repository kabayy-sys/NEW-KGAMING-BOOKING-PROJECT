"use client";

import { useMemo } from "react";
import { Device, Booking } from "@/types/database";
import { TimeSlotInfo } from "@/hooks/use-booking-flow";
import { timeToMinutes, getTodayDate } from "@/lib/utils";
import ScheduleCell from "./schedule-cell";

interface VipScheduleProps {
  devices: Device[];
  selectedDevice: Device | null;
  allTimeSlots: string[];
  selectionStart: number | null;
  selectionEnd: number | null;
  onSelectDevice: (device: Device) => void;
  onSlotTap: (index: number) => void;
  bookings: Booking[];
  selectedDate: string;
}

export default function VipSchedule({
  devices,
  selectedDevice,
  allTimeSlots,
  selectionStart,
  selectionEnd,
  onSelectDevice,
  onSlotTap,
  bookings,
  selectedDate,
}: VipScheduleProps) {
  // Only show VIP devices
  const vipDevices = useMemo(
    () => devices.filter((d) => d.category === "VIP1" || d.category === "VIP2"),
    [devices]
  );

  // Compute status for each device at each time slot
  const deviceSlotStatuses = useMemo(() => {
    const result: Record<string, TimeSlotInfo[]> = {};
    const today = getTodayDate();
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // Determine if this is an overnight schedule (close <= open, e.g. 10:00 - 01:00)
    // by checking if the last slot time is less than the first slot time
    const isOvernight = allTimeSlots.length > 0 && timeToMinutes(allTimeSlots[allTimeSlots.length - 1]) < timeToMinutes(allTimeSlots[0]);

    // Calculate closing time (last slot + 1 hour)
    const firstSlotMin = allTimeSlots.length > 0 ? timeToMinutes(allTimeSlots[0]) : 600;
    const lastSlotMin = allTimeSlots.length > 0 ? timeToMinutes(allTimeSlots[allTimeSlots.length - 1]) : 0;
    const closeMin = isOvernight ? lastSlotMin + 60 : lastSlotMin + 60;

    for (const device of vipDevices) {
      result[device.id] = allTimeSlots.map((time, index) => {
        // Skip past slots for today (handle overnight correctly)
        if (selectedDate === today) {
          const [h, m] = time.split(":").map(Number);
          const slotMin = h * 60 + m;

          // For overnight schedules, slots before opening time (like 00:00, 01:00)
          // belong to the "next day" session and should NOT be marked as past
          if (isOvernight && slotMin < firstSlotMin) {
            // These are after-midnight slots - only "past" if now has passed next day's closing time
            // E.g., if close is 01:00, then 00:00 is only past if now >= 01:00 + 24h = 25:00 (1500 min)
            const adjustedCloseMin = closeMin + 24 * 60;
            if (nowMin >= adjustedCloseMin) {
              return { time, status: "maintenance" as const, index };
            }
          } else {
            // Normal daytime slot - check if it's already past
            if (slotMin <= nowMin) {
              return { time, status: "maintenance" as const, index };
            }
          }
        }

        // Check conflicts with existing bookings for THIS device
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
          // Slot is blocked if it starts WITHIN the booking range
          // The end time itself is NOT blocked (slotStartMin < bookingEndMin, not <=)
          const slotStartsInside =
            slotStartMin >= bookingStartMin && slotStartMin < bookingEndMin;
          if (!slotStartsInside) continue;

          if (booking.status === "BOOKED" || booking.status === "IN_USE") {
            return { time, status: "booked" as const, index };
          }
          if (
            booking.status === "PENDING" ||
            booking.status === "WAITING_PAYMENT"
          ) {
            return { time, status: "pending" as const, index };
          }
        }

        return { time, status: "available" as const, index };
      });
    }

    return result;
  }, [vipDevices, allTimeSlots, bookings, selectedDate]);

  if (vipDevices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: "#A1A1AA" }}>
          No VIP rooms available
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Room Headers */}
      <div className="schedule-grid mb-2">
        {/* Room column headers */}
        {vipDevices.map((device) => {
          const isActive = selectedDevice?.id === device.id;
          return (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className={`room-header ${
                isActive ? "room-header-active" : "room-header-inactive"
              }`}
            >
              <div className="flex flex-col items-center leading-tight">
                <span>{device.name}</span>
                <span
                  className="text-[10px] font-normal mt-0.5"
                  style={{ color: isActive ? "#F5B700" : "#6B7280" }}
                >
                  {device.category === "VIP1" ? "VIP" : "VIP+"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div className="schedule-grid">
        {allTimeSlots.map((time, index) => {
          const isSelected =
            selectionStart !== null &&
            selectionEnd !== null &&
            index >= Math.min(selectionStart, selectionEnd) &&
            index <= Math.max(selectionStart, selectionEnd);

          return (
            <div key={time} className="contents">
              {/* Cells for each room */}
              {vipDevices.map((device) => {
                const deviceStatuses = deviceSlotStatuses[device.id] || [];
                const slotInfo = deviceStatuses[index];
                const isThisDeviceSelected =
                  selectedDevice?.id === device.id && isSelected;

                // If this is the selected device, use the selection range
                // Otherwise, show the device's own status
                const isClickable =
                  slotInfo?.status === "available" ||
                  (selectedDevice?.id === device.id && isSelected);

                return (
                  <ScheduleCell
                    key={`${time}-${device.id}`}
                    time={time}
                    status={
                      selectedDevice?.id === device.id
                        ? slotInfo?.status || "maintenance"
                        : slotInfo?.status || "maintenance"
                    }
                    isSelected={isThisDeviceSelected}
                    isSelectionStart={
                      selectedDevice?.id === device.id &&
                      selectionStart === index
                    }
                    isSelectionEnd={
                      selectedDevice?.id === device.id &&
                      selectionEnd === index
                    }
                    onTap={() => {
                      // Select this device first, then tap the slot
                      if (selectedDevice?.id !== device.id) {
                        onSelectDevice(device);
                      }
                      // Small delay to let device selection propagate
                      setTimeout(() => onSlotTap(index), 0);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center gap-4 mt-6 pt-4"
        style={{ borderTop: "1px solid #2D3140" }}
      >
        <LegendItem color="#22C55E" label="Available" />
        <LegendItem color="#F5B700" label="Selected" />
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
      <div
        className="w-2.5 h-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px]" style={{ color: "#6B7280" }}>
        {label}
      </span>
    </div>
  );
}