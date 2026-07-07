"use client";

import Link from "next/link";

export default function StaffLoginLink() {
  return (
    <Link
      href="/dashboard/login"
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80 active:scale-95"
      style={{
        backgroundColor: "rgba(31, 35, 48, 0.8)",
        color: "#A1A1AA",
        border: "1px solid #3F4452",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Staff
      </span>
    </Link>
  );
}