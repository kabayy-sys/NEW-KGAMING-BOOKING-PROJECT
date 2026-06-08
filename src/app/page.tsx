"use client";

import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const REGULAR_HOURLY_PRICE = 10000;

// Device info for homepage display (grouped by category)
const homepageDevices = [
  {
    label: "Reguler",
    icon: "🎮",
    category: "REGULAR",
    price: REGULAR_HOURLY_PRICE,
    count: 4,
    href: "/booking?category=REGULAR",
  },
  {
    label: "VIP 1A",
    icon: "🌟",
    price: 30000,
    id: "5",
    href: "/booking?device=5",
  },
  {
    label: "VIP 1B",
    icon: "🌟",
    price: 30000,
    id: "6",
    href: "/booking?device=6",
  },
  {
    label: "VIP 2",
    icon: "👑",
    price: 35000,
    id: "7",
    href: "/booking?device=7",
  },
];

export default function HomePage() {
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
          <a
            href="#devices"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-lg text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5B700" }}
          >
            Booking Sekarang
          </a>
        </div>
      </section>

      {/* Devices Section */}
      <section id="devices" className="px-4 pb-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">
          Pilih Device Kamu
        </h2>

        <>
          {/* Device Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {homepageDevices.map((device) => (
              <div
                key={device.id || device.category}
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

                <Link
                  href={device.href}
                  className="block w-full py-2 rounded-lg text-center font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#F5B700", color: "#000" }}
                >
                  Booking
                </Link>
              </div>
            ))}
          </div>
        </>
      </section>
    </div>
  );
}

