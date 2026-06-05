"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Bookings", href: "/dashboard/bookings", icon: "📋" },
  { label: "Devices", href: "/dashboard/devices", icon: "🎮" },
  { label: "Pricing", href: "/dashboard/pricing", icon: "💰" },
  { label: "Jam Operasional", href: "/dashboard/hours", icon: "🕐" },
  { label: "Disclaimer", href: "/dashboard/disclaimer", icon: "📝" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("staff_authenticated");
    if (auth !== "true") {
      router.push("/dashboard/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Don't show sidebar on login page
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("staff_authenticated");
    localStorage.removeItem("staff_username");
    router.push("/dashboard/login");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full w-64 z-30 transform transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#171923", borderRight: "1px solid #2D3140" }}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm" style={{ color: "#F5B700" }}>
                K Gaming XCafe
              </h2>
              <p className="text-xs" style={{ color: "#A1A1AA" }}>
                Staff Dashboard
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "#1F2330" : "transparent",
                  color: isActive ? "#F5B700" : "#A1A1AA",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: "#3F4452", color: "#EF4444" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: "#171923", borderColor: "#2D3140" }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-xl"
          >
            ☰
          </button>
          <h2 className="text-sm font-bold" style={{ color: "#F5B700" }}>
            Dashboard
          </h2>
          <div className="w-6" />
        </div>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}