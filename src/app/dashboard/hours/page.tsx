"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const defaultHours = [
  { day: "SUNDAY", label: "Minggu", open: "10:00", close: "01:00" },
  { day: "MONDAY", label: "Senin", open: "10:00", close: "01:00" },
  { day: "TUESDAY", label: "Selasa", open: "10:00", close: "01:00" },
  { day: "WEDNESDAY", label: "Rabu", open: "10:00", close: "01:00" },
  { day: "THURSDAY", label: "Kamis", open: "10:00", close: "01:00" },
  { day: "FRIDAY", label: "Jumat", open: "10:00", close: "03:00" },
  { day: "SATURDAY", label: "Sabtu", open: "10:00", close: "03:00" },
];

export default function HoursPage() {
  const [hours, setHours] = useState(defaultHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchHours() {
      try {
        const { data } = await supabase.from("business_hours").select("*");
        if (data && data.length > 0) {
          const merged = hours.map((h) => {
            const found = data.find((d: any) => d.day_name === h.day);
            return found ? { ...h, open: found.open_time.slice(0, 5), close: found.close_time.slice(0, 5) } : h;
          });
          setHours(merged);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchHours();
  }, []);

  const updateHour = (index: number, field: "open" | "close", value: string) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (const h of hours) {
        await supabase.from("business_hours").upsert({
          day_name: h.day,
          open_time: h.open + ":00",
          close_time: h.close + ":00",
          active: true,
        });
      }
      setMessage("Jam operasional berhasil disimpan!");
    } catch {
      setMessage("Gagal menyimpan jam operasional");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Jam Operasional</h1>

      {message && (
        <div
          className="p-3 rounded-lg mb-4 text-sm"
          style={{
            backgroundColor: message.includes("berhasil") ? "#22C55E20" : "#EF444420",
            color: message.includes("berhasil") ? "#22C55E" : "#EF4444",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: "#A1A1AA" }}>Memuat data...</p>
      ) : (
        <div className="space-y-2">
          {hours.map((h, index) => (
            <div
              key={h.day}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: "#1F2330" }}
            >
              <span className="w-16 font-semibold text-sm">{h.label}</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => updateHour(index, "open", e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg text-sm text-white text-center"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
                <span style={{ color: "#A1A1AA" }}>-</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => updateHour(index, "close", e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg text-sm text-white text-center"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Jam Operasional"}
          </button>
        </div>
      )}
    </div>
  );
}