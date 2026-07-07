"use client";

import { Device } from "@/types/database";
import { formatDate, formatPrice } from "@/lib/utils";

interface BookingSummaryProps {
  selectedDevice: Device | null;
  selectedDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  totalPrice: number;
  isSelectionValid: boolean;
}

export default function BookingSummary({
  selectedDevice,
  selectedDate,
  startTime,
  endTime,
  durationHours,
  totalPrice,
  isSelectionValid,
}: BookingSummaryProps) {
  if (!isSelectionValid) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{
          backgroundColor: "#1F2330",
          border: "2px solid #3F4452",
        }}
      >
        <p className="text-sm" style={{ color: "#A1A1AA" }}>
          Tap a room and select your time slots
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#1F2330",
        border: "2px solid #3F4452",
      }}
    >
      {/* Live indicator */}
      <div
        className="px-5 py-2 flex items-center gap-2"
        style={{
          backgroundColor: "rgba(245, 183, 0, 0.08)",
          borderBottom: "1px solid rgba(245, 183, 0, 0.1)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "#22C55E" }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#22C55E" }}>
          Live Summary
        </span>
      </div>

      <div className="p-5 space-y-3">
        <SummaryRow
          label="Room"
          value={selectedDevice?.name || "-"}
          highlight
        />
        <SummaryRow
          label="Date"
          value={selectedDate ? formatDate(selectedDate) : "-"}
        />
        <SummaryRow
          label="Start"
          value={startTime}
        />
        <SummaryRow
          label="End"
          value={endTime}
        />
        <SummaryRow
          label="Duration"
          value={`${durationHours} Hour${durationHours > 1 ? "s" : ""}`}
        />

        <div
          className="pt-3 mt-3"
          style={{ borderTop: "1px solid #2D3140" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#A1A1AA" }}>
              Total
            </span>
            <span
              className="text-xl font-black"
              style={{ color: "#F5B700" }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "#A1A1AA" }}>
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-gold-gradient" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}