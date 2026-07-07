"use client";

import { SlotStatus } from "@/hooks/use-booking-flow";

interface ScheduleCellProps {
  time: string;
  status: SlotStatus;
  isSelected: boolean;
  isSelectionStart: boolean;
  isSelectionEnd: boolean;
  onTap: () => void;
}

export default function ScheduleCell({
  time,
  status,
  isSelected,
  isSelectionStart,
  isSelectionEnd,
  onTap,
}: ScheduleCellProps) {
  const getCellClass = () => {
    if (isSelected) return "cell-selected";
    switch (status) {
      case "available":
        return "cell-available";
      case "pending":
        return "cell-pending";
      case "booked":
        return "cell-booked";
      case "inuse":
        return "cell-inuse";
      case "maintenance":
        return "cell-maintenance";
      default:
        return "cell-available";
    }
  };

  const isClickable = status === "available" || isSelected;

  return (
    <button
      onClick={() => {
        if (isClickable) onTap();
      }}
      disabled={!isClickable}
      className={`relative rounded-xl min-h-[44px] flex items-center justify-center text-xs font-semibold transition-all duration-150 ${
        isClickable ? "active:scale-95 cursor-pointer" : "cursor-not-allowed"
      } ${getCellClass()}`}
      style={{
        borderRadius: "10px",
        padding: "2px 4px",
      }}
      aria-label={`${time} - ${isSelected ? "Selected" : status}`}
    >
      <span
        className={`leading-none text-center ${
          isSelected ? "font-bold text-sm" : "text-[10px] font-medium"
        }`}
      >
        {time}
      </span>
    </button>
  );
}