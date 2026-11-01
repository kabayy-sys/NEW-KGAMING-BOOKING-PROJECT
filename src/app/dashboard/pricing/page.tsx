"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PricingRule } from "@/types/database";
import { formatPrice } from "@/lib/utils";

const staticPricing: PricingRule[] = [
  { id: "2", category: "VIP1", hourly_price: 30000, promo_2h_price: 55000, promo_3h_price: 80000, discount_4h_percent: 20, happy_hour_enabled: true, happy_hour_start: "10:00", happy_hour_end: "16:00", happy_hour_price: 25000, promo_days: [1,2,3,4,5], created_at: "", updated_at: "" },
  { id: "3", category: "VIP2", hourly_price: 35000, promo_2h_price: 65000, promo_3h_price: 90000, discount_4h_percent: 20, happy_hour_enabled: true, happy_hour_start: "10:00", happy_hour_end: "16:00", happy_hour_price: 30000, promo_days: [1,2,3,4,5], created_at: "", updated_at: "" },
];

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingRule[]>(staticPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPricing() {
      try {
        const { data } = await supabase.from("pricing_rules").select("*");
        if (data && data.length > 0) setPricing(data);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (const rule of pricing) {
        await supabase
          .from("pricing_rules")
          .upsert({
            id: rule.id,
            category: rule.category,
            hourly_price: rule.hourly_price,
            promo_2h_price: rule.promo_2h_price,
            promo_3h_price: rule.promo_3h_price,
            discount_4h_percent: rule.discount_4h_percent,
            happy_hour_enabled: rule.happy_hour_enabled ?? false,
            happy_hour_start: rule.happy_hour_start ?? "10:00",
            happy_hour_end: rule.happy_hour_end ?? "16:00",
            happy_hour_price: rule.happy_hour_price ?? 0,
            promo_days: rule.promo_days ?? [1,2,3,4,5],
          })
          .eq("id", rule.id);
      }
      setMessage("Konfigurasi harga & Happy Hour berhasil disimpan!");
    } catch (err: any) {
      setMessage("Gagal menyimpan harga: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const updatePricing = (index: number, field: keyof PricingRule, value: any) => {
    setPricing((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pricing & Happy Hour Management</h1>

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
        <div className="space-y-6">
          {pricing.map((rule, index) => (
            <div
              key={rule.id}
              className="rounded-xl p-5 space-y-4"
              style={{ backgroundColor: "#1F2330", border: "1px solid #3F4452" }}
            >
              <h3 className="font-bold text-lg" style={{ color: "#F5B700" }}>
                {rule.category}
              </h3>

              {/* Normal & Package Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                    Harga Normal per Jam (Rp)
                  </label>
                  <input
                    type="number"
                    value={rule.hourly_price}
                    onChange={(e) => updatePricing(index, "hourly_price", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white"
                    style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                    Diskon 4 Jam+ (%)
                  </label>
                  <input
                    type="number"
                    value={rule.discount_4h_percent}
                    onChange={(e) => updatePricing(index, "discount_4h_percent", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white"
                    style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  />
                </div>
              </div>

              {/* Happy Hour Settings */}
              <div className="pt-3 border-t border-[#3F4452] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Happy Hour Promo (November)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.happy_hour_enabled ?? false}
                      onChange={(e) => updatePricing(index, "happy_hour_enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#171923] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5B700]"></div>
                  </label>
                </div>

                {rule.happy_hour_enabled && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                        Tarif Happy Hour (Rp/Jam)
                      </label>
                      <input
                        type="number"
                        value={rule.happy_hour_price ?? 0}
                        onChange={(e) => updatePricing(index, "happy_hour_price", Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                        style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                        Jam Mulai
                      </label>
                      <input
                        type="text"
                        value={rule.happy_hour_start ?? "10:00"}
                        onChange={(e) => updatePricing(index, "happy_hour_start", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                        style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                        Jam Selesai
                      </label>
                      <input
                        type="text"
                        value={rule.happy_hour_end ?? "16:00"}
                        onChange={(e) => updatePricing(index, "happy_hour_end", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                        style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan Harga & Happy Hour"}
          </button>
        </div>
      )}
    </div>
  );
}
