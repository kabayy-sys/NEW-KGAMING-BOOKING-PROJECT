"use client";

import { useMemo } from "react";
import { formatDate, getTodayDate } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  maxDays?: number;
}

export default function DateSelector({ selectedDate, onSelect, maxDays = 7 }: DateSelectorProps) {
  const dates = useMemo(() => {
    const result: { value: string; label: string; shortLabel: string }[] = [];
    const today = new Date();

    for (let i = 0; i <= maxDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const fullLabel = formatDate(value);

      // Short label: "Hari ini", "Besok", or day name
      let shortLabel: string;
      if (i === 0) {
        shortLabel = "Hari ini";
      } else if (i === 1) {
        shortLabel = "Besok";
      } else {
        const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        shortLabel = days[date.getDay()];
      }

      result.push({ value, label: fullLabel, shortLabel });
    }

    return result;
  }, [maxDays]);

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {dates.map((date) => {
          const isSelected = selectedDate === date.value;
          return (
            <button
              key={date.value}
              onClick={() => onSelect(date.value)}
              className="rounded-xl p-4 text-center transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: isSelected ? "#F5B700" : "#1F2330",
                border: `2px solid ${isSelected ? "#F5B700" : "#3F4452"}`,
                minHeight: "72px",
              }}
            >
              <p
                className={`text-sm font-bold ${
                  isSelected ? "text-black" : "text-white"
                }`}
              >
                {date.shortLabel}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isSelected ? "text-black/70" : ""
                }`}
                style={{ color: isSelected ? "rgba(0,0,0,0.7)" : "#A1A1AA" }}
              >
                {date.value.split("-").slice(1).reverse().join("/")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}