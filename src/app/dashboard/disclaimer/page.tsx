"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Disclaimer } from "@/types/database";

const staticDisclaimers: Disclaimer[] = [
  { id: "1", content: "Booking dianggap aktif setelah pembayaran diverifikasi staff.", active: true, sort_order: 1 },
  { id: "2", content: "Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.", active: true, sort_order: 2 },
  { id: "3", content: "Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.", active: true, sort_order: 3 },
  { id: "4", content: "Keterlambatan pelanggan tidak menambah durasi bermain.", active: true, sort_order: 4 },
  { id: "5", content: "Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.", active: true, sort_order: 5 },
];

export default function DisclaimerPage() {
  const [disclaimers, setDisclaimers] = useState<Disclaimer[]>(staticDisclaimers);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase
          .from("disclaimers")
          .select("*")
          .order("sort_order");

        if (data && data.length > 0) setDisclaimers(data);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateDisclaimer = (index: number, field: "content" | "active", value: string | boolean) => {
    setDisclaimers((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (const d of disclaimers) {
        await supabase.from("disclaimers").upsert({
          content: d.content,
          active: d.active,
          sort_order: d.sort_order,
        }).eq("id", d.id);
      }
      setMessage("Disclaimer berhasil disimpan!");
    } catch {
      setMessage("Gagal menyimpan disclaimer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Disclaimer Management</h1>

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
        <div className="space-y-3">
          {disclaimers.map((d, index) => (
            <div
              key={d.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#1F2330" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold mt-2" style={{ color: "#F5B700" }}>
                  {d.sort_order}.
                </span>
                <textarea
                  value={d.content}
                  onChange={(e) => updateDisclaimer(index, "content", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-white resize-none"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  rows={2}
                />
                <button
                  onClick={() => updateDisclaimer(index, "active", !d.active)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    d.active ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {d.active ? "Aktif" : "Nonaktif"}
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Disclaimer"}
          </button>
        </div>
      )}
    </div>
  );
}