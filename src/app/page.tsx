"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface HomeDevice {
  label: string;
  icon: string;
  price: number;
  id: string;
  description: string[];
}

const defaultDevices: HomeDevice[] = [
  {
    label: "VIP 1A",
    icon: "🌟",
    price: 30000,
    id: "",
    description: [
      "PS4 PRO & 2 Stick",
      "Nintendo Switch OLED",
      "Netflix",
      "TV 55 inch 4K QLED",
      "Sofa + Bantal",
      "Kapasitas 4-5 orang",
    ],
  },
  {
    label: "VIP 1B",
    icon: "🌟",
    price: 30000,
    id: "",
    description: [
      "PS4 PRO & 2 Stick",
      "Nintendo Switch OLED",
      "Netflix",
      "TV 55 inch 4K QLED",
      "Sofa + Bantal",
      "Kapasitas 4-5 orang",
    ],
  },
  {
    label: "VIP 2",
    icon: "👑",
    price: 35000,
    id: "",
    description: [
      "PS5 & 2 stick",
      "Nintendo Switch OLED",
      "TV 55 inch 4K QLED",
      "Sofa + Bantal",
      "Kapasitas 4-5 orang",
    ],
  },
];

export default function HomePage() {
  const [devices, setDevices] = useState<HomeDevice[]>(defaultDevices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const { data } = await supabase
          .from("devices")
          .select("id, name, hourly_price, category")
          .eq("active", true)
          .neq("category", "REGULAR")
          .order("name");

        if (data && data.length > 0) {
          // Map to predefined display devices with real IDs
          const mapped: HomeDevice[] = [];
          for (const d of data) {
            const existing = defaultDevices.find((dd) => dd.label === d.name);
            if (existing) {
              mapped.push({ ...existing, id: d.id, price: d.hourly_price });
            } else {
              // Unknown device from DB - still show it
              const icon = d.category === "VIP2" ? "👑" : "🌟";
              mapped.push({
                label: d.name,
                icon,
                price: d.hourly_price,
                id: d.id,
                description: [],
              });
            }
          }
          if (mapped.length > 0) setDevices(mapped);
        }
      } catch (e) {
        console.error("Gagal load devices:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  return (
    <div className="flex-1">
      {/* Staff Login Link */}
      <div className="fixed top-4 right-4 z-10">
        <Link
          href="/dashboard/login"
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#1F2330", color: "#A1A1AA", border: "1px solid #3F4452" }}
        >
          🔐 Staff Login
        </Link>
      </div>

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#F5B700" }}>
            K Gaming XCafe
          </h1>
          <p className="text-lg mb-1 font-semibold text-white">
            Booking PS Online Lebih Mudah
          </p>
          <p className="text-sm mb-6" style={{ color: "#A1A1AA" }}>
            Lihat ketersediaan device secara realtime dan lakukan booking hanya
            dalam beberapa langkah.
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-lg text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5B700" }}
          >
            Booking Sekarang
          </Link>
        </div>
      </section>

      {/* Devices Section */}
      <section id="devices" className="px-4 pb-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">
          Pilih Device Kamu
        </h2>

        {loading ? (
          <p className="text-center" style={{ color: "#A1A1AA" }}>Memuat device...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {devices.map((device) => (
              <div
                key={device.id || device.label}
                className="rounded-xl p-4 border border-gray-800"
                style={{ backgroundColor: "#1F2330" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">{device.label}</p>
                    <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                      {device.icon} {device.label}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: "#22C55E20",
                      color: "#22C55E",
                    }}
                  >
                    Ready
                  </span>
                </div>

                <p className="text-lg font-bold text-white mb-3">
                  {formatPrice(device.price)}
                  <span className="text-sm font-normal" style={{ color: "#A1A1AA" }}>
                    /Jam
                  </span>
                </p>

                {device.description.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {device.description.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs flex items-start gap-1.5"
                        style={{ color: "#A1A1AA" }}
                      >
                        <span className="mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {device.id ? (
                  <Link
                    href={`/booking?device=${device.id}`}
                    className="block w-full py-2 rounded-lg text-center font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#F5B700", color: "#000" }}
                  >
                    Booking
                  </Link>
                ) : (
                  <Link
                    href="/booking"
                    className="block w-full py-2 rounded-lg text-center font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#F5B700", color: "#000" }}
                  >
                    Booking
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

