"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple staff auth using localStorage (will be replaced with Supabase Auth later)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try Supabase auth first, fallback to local
      const { supabase } = await import("@/lib/supabase");
      const { data, error: authError } = await supabase
        .from("staff_users")
        .select("*")
        .eq("username", username)
        .single();

      if (data && data.password_hash === btoa(password)) {
        localStorage.setItem("staff_authenticated", "true");
        localStorage.setItem("staff_username", username);
        router.push("/dashboard");
        return;
      }
    } catch {}

    // Fallback: hardcoded staff credentials
    if (username === "staff" && password === "kgaming2026") {
      localStorage.setItem("staff_authenticated", "true");
      localStorage.setItem("staff_username", username);
      router.push("/dashboard");
    } else {
      setError("Username atau password salah");
    }

    setLoading(false);
  };

  return (
    <div
      className="flex-1 flex items-center justify-center px-4"
      style={{ backgroundColor: "#0F1117" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#F5B700" }}>
            Staff Login
          </h1>
          <p className="text-sm mt-2" style={{ color: "#A1A1AA" }}>
            K Gaming XCafe Dashboard
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: "#1F2330" }}
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#A1A1AA" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
              style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#A1A1AA" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
              style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#F5B700" }}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}