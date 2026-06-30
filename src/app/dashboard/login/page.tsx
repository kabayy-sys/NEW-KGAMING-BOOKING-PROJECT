"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinCode = pin.join("");
    if (pinCode.length !== 4) {
      setError("Masukkan 4 digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate a small delay
    await new Promise((r) => setTimeout(r, 300));

    if (pinCode === "2019") {
      localStorage.setItem("staff_authenticated", "true");
      localStorage.setItem("staff_username", "staff");
      router.push("/dashboard");
    } else {
      setError("PIN salah");
      setPin(["", "", "", ""]);
      document.getElementById("pin-0")?.focus();
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
          className="rounded-xl p-6 space-y-6"
          style={{ backgroundColor: "#1F2330" }}
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-4 text-center"
              style={{ color: "#A1A1AA" }}
            >
              Masukkan PIN 4 Digit
            </label>
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-bold rounded-lg text-white outline-none"
                  style={{
                    backgroundColor: "#171923",
                    border: "2px solid",
                    borderColor: digit ? "#F5B700" : "#3F4452",
                    caretColor: "#F5B700",
                  }}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || pin.join("").length !== 4}
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