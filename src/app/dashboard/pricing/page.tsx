"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PricingRule } from "@/types/database";
import { formatPrice } from "@/lib/utils";

const staticPricing: PricingRule[] = [
  { id: "2", category: "VIP1", hourly_price: 30000, promo_2h_price: 55000, promo_3h_price: 80000, discount_4h_percent: 20, created_at: "", updated_at: "" },
  { id: "3", category: "VIP2", hourly_price: 35000, promo_2h_price: 65000, promo_3h_price: 90000, discount_4h_percent: 20, created_at: "", updated_at: "" },
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
            category: rule.category,
            hourly_price: rule.hourly_price,
            promo_2h_price: rule.promo_2h_price,
            promo_3h_price: rule.promo_3h_price,
            discount_4h_percent: rule.discount_4h_percent,
          })
          .eq("id", rule.id);
      }
      setMessage("Harga berhasil disimpan!");
    } catch {
      setMessage("Gagal menyimpan harga");
    } finally {
      setSaving(false);
    }
  };

  const updatePricing = (index: number, field: keyof PricingRule, value: number) => {
    setPricing((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pricing Management</h1>

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
        <div className="space-y-4">
          {pricing.map((rule, index) => (
            <div
              key={rule.id}
              className="rounded-xl p-5"
              style={{ backgroundColor: "#1F2330" }}
            >
              <h3 className="font-bold mb-3" style={{ color: "#F5B700" }}>
                {rule.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                    Harga per Jam
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
                    Promo 2 Jam
                  </label>
                  <input
                    type="number"
                    value={rule.promo_2h_price}
                    onChange={(e) => updatePricing(index, "promo_2h_price", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white"
                    style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                    Promo 3 Jam
                  </label>
                  <input
                    type="number"
                    value={rule.promo_3h_price}
                    onChange={(e) => updatePricing(index, "promo_3h_price", Number(e.target.value))}
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
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan Harga"}
          </button>
        </div>
      )}
    </div>
  );
}