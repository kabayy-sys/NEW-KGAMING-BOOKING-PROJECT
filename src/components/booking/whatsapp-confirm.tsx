"use client";

import { Booking, PricingRule } from "@/types/database";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface WhatsAppConfirmProps {
  bookingResult: Booking | null;
  selectedDeviceName: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  selectedPackage: "PROMO" | "NORMAL" | null;
  selectedPayment: "DP" | "FULL" | null;
  totalPrice: number;
  selectedPricing: PricingRule | undefined;
  settings: {
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    booking_expiration_minutes: number;
  } | null;
}

export default function WhatsAppConfirm({
  bookingResult,
  selectedDeviceName,
  selectedDate,
  startTime,
  endTime,
  durationHours,
  selectedPackage,
  selectedPayment,
  totalPrice,
  selectedPricing,
  settings,
}: WhatsAppConfirmProps) {
  const s = settings || {
    bank_name: "BCA",
    bank_account_number: "7155450363",
    bank_account_holder: "Nanda A",
    booking_expiration_minutes: 15,
  };

  const paymentAmount = selectedPayment === "DP" 
    ? (selectedPricing?.hourly_price || totalPrice) 
    : totalPrice;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: "#22C55E" }}>
          Booking Submitted!
        </h1>

        {bookingResult && (
          <p className="mb-2 text-sm" style={{ color: "#A1A1AA" }}>
            Code: <span className="font-bold text-white">{bookingResult.booking_code}</span>
          </p>
        )}

        <p className="mb-6 text-sm" style={{ color: "#A1A1AA" }}>
          Status:{" "}
          <span className="text-yellow-400 font-semibold">Waiting Confirmation</span>
        </p>

        {/* Payment Info */}
        <div
          className="rounded-xl p-6 mb-6 text-left"
          style={{
            backgroundColor: "#1F2330",
            border: "2px solid #3F4452",
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Room</span>
              <span className="font-semibold text-white">{selectedDeviceName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Date</span>
              <span className="font-semibold text-white">
                {selectedDate ? formatDate(selectedDate) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Time</span>
              <span className="font-semibold text-white">{startTime} - {endTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Duration</span>
              <span className="font-semibold text-white">{durationHours} Hours</span>
            </div>
          </div>

          <div
            className="mt-4 pt-4 space-y-3"
            style={{ borderTop: "1px solid #2D3140" }}
          >
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Bank</span>
              <span className="font-semibold text-white">{s.bank_name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>Account No.</span>
              <span className="font-semibold text-white">{s.bank_account_number}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#A1A1AA" }}>A/N</span>
              <span className="font-semibold text-white">{s.bank_account_holder}</span>
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid #2D3140" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#A1A1AA" }}>
                  {selectedPayment === "DP" ? "DP Amount" : "Total Payment"}
                </span>
                <span className="text-xl font-black" style={{ color: "#F5B700" }}>
                  {formatPrice(paymentAmount)}
                </span>
              </div>
              {selectedPayment === "DP" && (
                <p className="text-xs mt-2" style={{ color: "#EAB308" }}>
                  Remaining balance to be paid at the venue
                </p>
              )}
            </div>
          </div>

          <div
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid #2D3140" }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: "#EAB308" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>
                Payment deadline:{" "}
                <strong>{s.booking_expiration_minutes} minutes</strong>
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp already opened in new tab */}
        <div
          className="rounded-xl p-4 mb-6 text-sm"
          style={{
            backgroundColor: "rgba(37, 211, 102, 0.08)",
            border: "1px solid rgba(37, 211, 102, 0.2)",
            color: "#25D366",
          }}
        >
          <div className="flex items-center gap-2 justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp opened with your booking details</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#F5B700" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}