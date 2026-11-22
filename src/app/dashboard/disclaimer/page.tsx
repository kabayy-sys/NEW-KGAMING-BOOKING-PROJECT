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
  { id: "6", content: "Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.", active: true, sort_order: 6 },
  { id: "7", content: "Uang booking yang sudah dibayarkan tidak dapat dikembalikan.", active: true, sort_order: 7 },
];

export default function DisclaimerPage() {
  const [disclaimers, setDisclaimers] = useState<Disclaimer[]>(staticDisclaimers);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("disclaimers")
        .select("*")
        .order("sort_order");

      if (error) {
        console.error("Error fetching disclaimers:", error);
      } else if (data && data.length > 0) {
        setDisclaimers(data);
      }
    } catch (err) {
      console.error("Fetch exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateDisclaimer = (index: number, field: "content" | "active", value: string | boolean) => {
    setDisclaimers((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handleAddDisclaimer = () => {
    const nextOrder = disclaimers.length > 0 ? Math.max(...disclaimers.map((d) => d.sort_order)) + 1 : 1;
    setDisclaimers((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        content: "",
        active: true,
        sort_order: nextOrder,
      },
    ]);
  };

  const handleDeleteDisclaimer = async (index: number) => {
    const target = disclaimers[index];
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target.id);

    if (isUuid) {
      const { error } = await supabase.from("disclaimers").delete().eq("id", target.id);
      if (error) {
        setMessage(`Gagal menghapus disclaimer: ${error.message}`);
        return;
      }
    }

    setDisclaimers((prev) => prev.filter((_, i) => i !== index));
    setMessage("Disclaimer dihapus (simpan untuk memperbarui nomor urut)");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (let i = 0; i < disclaimers.length; i++) {
        const d = disclaimers[i];
        const sortOrder = i + 1;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);

        let result;
        if (isUuid) {
          result = await supabase
            .from("disclaimers")
            .update({
              content: d.content,
              active: d.active,
              sort_order: sortOrder,
            })
            .eq("id", d.id);
        } else {
          // Cek apakah ada record di DB dengan sort_order yang sama
          const { data: existing } = await supabase
            .from("disclaimers")
            .select("id")
            .eq("sort_order", sortOrder)
            .maybeSingle();

          if (existing?.id) {
            result = await supabase
              .from("disclaimers")
              .update({
                content: d.content,
                active: d.active,
                sort_order: sortOrder,
              })
              .eq("id", existing.id);
          } else {
            result = await supabase
              .from("disclaimers")
              .insert({
                content: d.content,
                active: d.active,
                sort_order: sortOrder,
              });
          }
        }

        if (result?.error) {
          throw new Error(result.error.message);
        }
      }

      setMessage("Disclaimer berhasil disimpan!");
      await fetchData();
    } catch (err: any) {
      console.error("Save disclaimers error:", err);
      setMessage(err?.message ? `Gagal menyimpan: ${err.message}` : "Gagal menyimpan disclaimer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Disclaimer Management</h1>
        <button
          onClick={handleAddDisclaimer}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#F5B700" }}
        >
          + Tambah Disclaimer
        </button>
      </div>

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
              key={d.id || index}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#1F2330" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold mt-2" style={{ color: "#F5B700" }}>
                  {index + 1}.
                </span>
                <textarea
                  value={d.content}
                  onChange={(e) => updateDisclaimer(index, "content", e.target.value)}
                  placeholder="Isi ketentuan / disclaimer..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-white resize-none"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  rows={2}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateDisclaimer(index, "active", !d.active)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      d.active ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {d.active ? "Aktif" : "Nonaktif"}
                  </button>
                  <button
                    onClick={() => handleDeleteDisclaimer(index)}
                    className="px-2 py-1 rounded text-xs font-medium bg-red-900/50 text-red-400 hover:bg-red-800/60"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50 mt-4"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Disclaimer"}
          </button>
        </div>
      )}
    </div>
  );
}