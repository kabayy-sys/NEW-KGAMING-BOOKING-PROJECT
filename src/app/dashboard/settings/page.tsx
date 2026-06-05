"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Settings } from "@/types/database";

const defaultSettings: Settings = {
  id: "1",
  whatsapp_number: "082152425391",
  bank_name: "BCA",
  bank_account_number: "7155450363",
  bank_account_holder: "Nanda A",
  booking_expiration_minutes: 15,
  max_booking_days: 7,
  created_at: "",
  updated_at: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from("settings").select("*").single();
        if (data) setSettings(data);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      await supabase.from("settings").upsert({
        whatsapp_number: settings.whatsapp_number,
        bank_name: settings.bank_name,
        bank_account_number: settings.bank_account_number,
        bank_account_holder: settings.bank_account_holder,
        booking_expiration_minutes: settings.booking_expiration_minutes,
        max_booking_days: settings.max_booking_days,
      });
      setMessage("Pengaturan berhasil disimpan!");
    } catch {
      setMessage("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Settings</h1>

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
          {/* WhatsApp */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-bold mb-3">WhatsApp</h3>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                Nomor WhatsApp Admin
              </label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm text-white"
                style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
              />
            </div>
          </div>

          {/* Bank Info */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-bold mb-3">Informasi Bank</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={settings.bank_name}
                  onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={settings.bank_account_number}
                  onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                  Atas Nama
                </label>
                <input
                  type="text"
                  value={settings.bank_account_holder}
                  onChange={(e) => setSettings({ ...settings, bank_account_holder: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
            </div>
          </div>

          {/* Booking Config */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1F2330" }}>
            <h3 className="font-bold mb-3">Konfigurasi Booking</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                  Expired (menit)
                </label>
                <input
                  type="number"
                  value={settings.booking_expiration_minutes}
                  onChange={(e) => setSettings({ ...settings, booking_expiration_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#A1A1AA" }}>
                  Maks Booking (hari)
                </label>
                <input
                  type="number"
                  value={settings.max_booking_days}
                  onChange={(e) => setSettings({ ...settings, max_booking_days: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      )}
    </div>
  );
}