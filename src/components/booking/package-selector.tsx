"use client";

import { PricingRule } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface PackageSelectorProps {
  selectedPackage: "PROMO" | "NORMAL" | null;
  selectedPayment: "DP" | "FULL" | null;
  selectedPricing: PricingRule | undefined;
  isPromoAvailable: boolean;
  durationHours: number;
  totalPrice: number;
  onSelectPackage: (pkg: "PROMO" | "NORMAL") => void;
  onSelectPayment: (payment: "DP" | "FULL") => void;
  onContinue: () => void;
}

export default function PackageSelector({
  selectedPackage,
  selectedPayment,
  selectedPricing,
  isPromoAvailable,
  durationHours,
  totalPrice,
  onSelectPackage,
  onSelectPayment,
  onContinue,
}: PackageSelectorProps) {
  return (
    <div className="space-y-5">
      {/* Package Selection */}
      {isPromoAvailable ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-semibold" style={{ color: "#F5B700" }}>
              Promo Weekday Available!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Promo Card */}
            <button
              onClick={() => onSelectPackage("PROMO")}
              className="rounded-xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: "#1F2330",
                border: `2px solid ${selectedPackage === "PROMO" ? "#F5B700" : "#3F4452"}`,
              }}
            >
              <p className="text-base font-bold" style={{ color: "#F5B700" }}>
                🎉 Promo
              </p>
              <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                Best value for your session
              </p>
              <div className="mt-3 space-y-1">
                {durationHours === 2 && selectedPricing && (
                  <p className="text-sm font-bold text-white">
                    {formatPrice(selectedPricing.promo_2h_price)}
                  </p>
                )}
                {durationHours === 3 && selectedPricing && (
                  <p className="text-sm font-bold text-white">
                    {formatPrice(selectedPricing.promo_3h_price)}
                  </p>
                )}
                {durationHours >= 4 && (
                  <p className="text-sm font-bold text-white">
                    {formatPrice(totalPrice)} (20% off)
                  </p>
                )}
                <p className="text-[10px]" style={{ color: "#EAB308" }}>
                  Full payment required
                </p>
              </div>
            </button>

            {/* Normal Card */}
            <button
              onClick={() => onSelectPackage("NORMAL")}
              className="rounded-xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: "#1F2330",
                border: `2px solid ${selectedPackage === "NORMAL" ? "#F5B700" : "#3F4452"}`,
              }}
            >
              <p className="text-base font-bold text-white">Normal</p>
              <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                Standard pricing
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-bold text-white">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-[10px]" style={{ color: "#22C55E" }}>
                  DP or Full payment
                </p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm mb-4" style={{ color: "#A1A1AA" }}>
            Standard pricing applies for weekends.
          </p>
          <button
            onClick={() => onSelectPackage("NORMAL")}
            className="w-full rounded-xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: "#1F2330",
              border: `2px solid ${selectedPackage === "NORMAL" ? "#F5B700" : "#3F4452"}`,
            }}
          >
            <p className="text-sm font-bold text-white">Harga Normal</p>
            <p className="text-lg font-black mt-2" style={{ color: "#F5B700" }}>
              {formatPrice(totalPrice)}
            </p>
          </button>
        </div>
      )}

      {/* Payment Method (only for Normal) */}
      {selectedPackage === "NORMAL" && (
        <div>
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#A1A1AA" }}>
            Payment Method
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelectPayment("FULL")}
              className="rounded-xl py-4 text-center transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: selectedPayment === "FULL" ? "#F5B700" : "#1F2330",
                border: `2px solid ${selectedPayment === "FULL" ? "#F5B700" : "#3F4452"}`,
                color: selectedPayment === "FULL" ? "#000" : "#FFF",
              }}
            >
              <p className="text-sm font-bold">Full</p>
              <p className="text-[10px] mt-0.5" style={{ color: selectedPayment === "FULL" ? "rgba(0,0,0,0.7)" : "#A1A1AA" }}>
                {formatPrice(totalPrice)}
              </p>
            </button>
            <button
              onClick={() => onSelectPayment("DP")}
              className="rounded-xl py-4 text-center transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: selectedPayment === "DP" ? "#F5B700" : "#1F2330",
                border: `2px solid ${selectedPayment === "DP" ? "#F5B700" : "#3F4452"}`,
                color: selectedPayment === "DP" ? "#000" : "#FFF",
              }}
            >
              <p className="text-sm font-bold">DP</p>
              <p className="text-[10px] mt-0.5" style={{ color: selectedPayment === "DP" ? "rgba(0,0,0,0.7)" : "#A1A1AA" }}>
                {formatPrice(selectedPricing?.hourly_price || 0)}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={!selectedPackage || (selectedPackage === "NORMAL" && !selectedPayment)}
        className="w-full min-h-[52px] rounded-xl font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: selectedPackage && (selectedPackage === "PROMO" || selectedPayment) ? "#F5B700" : "#3F4452",
          color: selectedPackage && (selectedPackage === "PROMO" || selectedPayment) ? "#000" : "#6B7280",
        }}
      >
        Continue
      </button>
    </div>
  );
}