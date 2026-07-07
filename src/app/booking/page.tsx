"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Booking } from "@/types/database";
import { useBookingData } from "@/hooks/use-booking-data";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import DateSelector from "@/components/booking/date-selector";
import VipSchedule from "@/components/booking/vip-schedule";
import BookingSummary from "@/components/booking/booking-summary";
import PackageSelector from "@/components/booking/package-selector";
import CustomerInfo from "@/components/booking/customer-info";
import WhatsAppConfirm from "@/components/booking/whatsapp-confirm";

const STEPS = [
  { id: 1, label: "Date" },
  { id: 2, label: "Schedule" },
  { id: 3, label: "Package" },
  { id: 4, label: "Confirm" },
];

function BookingContent() {
  const searchParams = useSearchParams();
  const deviceNameParam = searchParams.get("name");

  // Data hook - needs selectedDate from flow, but flow needs data
  // Solution: use local state for selectedDate to break circular dependency
  const [localDate, setLocalDate] = useState("");

  const {
    devices,
    pricingRules,
    settings,
    disclaimers,
    businessHours,
    bookings,
    loading,
    addBooking,
  } = useBookingData(localDate || null);

  const flow = useBookingFlow(
    devices,
    pricingRules,
    businessHours,
    bookings,
    settings,
    useCallback((booking: Booking) => addBooking(booking), [addBooking])
  );

  // Sync localDate with flow's selectedDate
  if (flow.selectedDate && flow.selectedDate !== localDate) {
    setLocalDate(flow.selectedDate);
  }

  // Set initial device from URL param
  if (deviceNameParam && !flow.selectedDevice && !loading) {
    const device = devices.find((d) => d.name === deviceNameParam);
    if (device) {
      setTimeout(() => flow.setSelectedDevice(device), 0);
    }
  }

  // Step 5: Success/Confirm screen
  if (flow.step === 5) {
    return (
      <WhatsAppConfirm
        bookingResult={flow.bookingResult}
        selectedDeviceName={flow.selectedDevice?.name || ""}
        selectedDate={flow.selectedDate}
        startTime={flow.startTime}
        endTime={flow.endTime}
        durationHours={flow.durationHours}
        selectedPackage={flow.selectedPackage}
        selectedPayment={flow.selectedPayment}
        totalPrice={flow.totalPrice}
        selectedPricing={flow.selectedPricing}
        settings={settings}
      />
    );
  }

  return (
    <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-tight">
          Book Your
          <br />
          <span className="text-gold-gradient">Session</span>
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s) => {
            const isActive = s.id === flow.step;
            const isDone = s.id < flow.step;
            return (
              <div
                key={s.id}
                className="flex items-center gap-2"
                style={{ width: `${100 / STEPS.length}%` }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? "#F5B700"
                      : isDone
                      ? "#22C55E"
                      : "#1F2330",
                    color: isActive || isDone ? "#000" : "#A1A1AA",
                    border: `2px solid ${
                      isActive ? "#F5B700" : isDone ? "#22C55E" : "#3F4452"
                    }`,
                  }}
                >
                  {isDone ? "✓" : s.id}
                </div>
                <span
                  className="text-[10px] font-medium hidden sm:block"
                  style={{
                    color: isActive
                      ? "#F5B700"
                      : isDone
                      ? "#22C55E"
                      : "#A1A1AA",
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#1F2330" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: "#F5B700",
              width: `${((flow.step - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Error */}
      {flow.error && (
        <div
          className="mb-4 p-4 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#EF4444",
          }}
        >
          {flow.error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div
            className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin mx-auto mb-4"
            style={{
              borderColor: "#3F4452",
              borderTopColor: "#F5B700",
            }}
          />
          <p className="text-sm" style={{ color: "#A1A1AA" }}>
            Loading...
          </p>
        </div>
      )}

      {/* Step 1: Date Selection */}
      {!loading && flow.step === 1 && (
        <div>
          <div className="mb-6">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 hover:opacity-70"
              style={{ color: "#A1A1AA" }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </a>
          </div>
          <h2 className="text-lg font-bold mb-4">Choose Date</h2>
          <p className="text-sm mb-5" style={{ color: "#A1A1AA" }}>
            Select your preferred gaming date
          </p>
          <DateSelector
            selectedDate={flow.selectedDate}
            onSelect={flow.setSelectedDate}
            maxDays={settings?.max_booking_days || 7}
          />
        </div>
      )}

      {/* Step 2: VIP Schedule */}
      {!loading && flow.step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-1">Select Schedule</h2>
          <p className="text-sm mb-5" style={{ color: "#A1A1AA" }}>
            Tap a room, then tap your start and end times
          </p>

          <VipSchedule
            devices={devices}
            selectedDevice={flow.selectedDevice}
            allTimeSlots={flow.allTimeSlots}
            selectionStart={flow.selectionStart}
            selectionEnd={flow.selectionEnd}
            onSelectDevice={flow.setSelectedDevice}
            onSlotTap={flow.handleSlotTap}
            bookings={bookings}
            selectedDate={flow.selectedDate}
          />

          {/* Live Summary */}
          <div className="mt-6">
            <BookingSummary
              selectedDevice={flow.selectedDevice}
              selectedDate={flow.selectedDate}
              startTime={flow.startTime}
              endTime={flow.endTime}
              durationHours={flow.durationHours}
              totalPrice={flow.totalPrice}
              isSelectionValid={flow.isSelectionValid}
            />
          </div>

          {/* Continue Button */}
          {flow.isSelectionValid && (
            <button
              onClick={() => flow.goToStep(3)}
              className="w-full min-h-[52px] mt-4 rounded-xl font-bold text-base text-black transition-all duration-200 active:scale-[0.98]"
              style={{ backgroundColor: "#F5B700" }}
            >
              Continue to Package
            </button>
          )}
        </div>
      )}

      {/* Step 3: Package Selection */}
      {!loading && flow.step === 3 && (
        <div>
          <h2 className="text-lg font-bold mb-1">Choose Package</h2>
          <p className="text-sm mb-5" style={{ color: "#A1A1AA" }}>
            Select your pricing package
          </p>

          <PackageSelector
            selectedPackage={flow.selectedPackage}
            selectedPayment={flow.selectedPayment}
            selectedPricing={flow.selectedPricing}
            isPromoAvailable={flow.isPromoAvailable}
            durationHours={flow.durationHours}
            totalPrice={flow.totalPrice}
            onSelectPackage={flow.setSelectedPackage}
            onSelectPayment={flow.setSelectedPayment}
            onContinue={() => flow.goToStep(4)}
          />
        </div>
      )}

      {/* Step 4: Customer Info */}
      {!loading && flow.step === 4 && (
        <div>
          <h2 className="text-lg font-bold mb-1">Final Step</h2>
          <p className="text-sm mb-5" style={{ color: "#A1A1AA" }}>
            Enter your details and confirm
          </p>

          <CustomerInfo
            customerName={flow.customerName}
            agreedToTerms={flow.agreedToTerms}
            disclaimers={disclaimers}
            error={flow.error}
            isSubmitting={flow.isSubmitting}
            onNameChange={flow.setCustomerName}
            onAgreeChange={flow.setAgreedToTerms}
            onSubmit={flow.submitBooking}
          />
        </div>
      )}

      {/* Back Button */}
      {flow.step > 1 && flow.step < 5 && (
        <button
          onClick={() => flow.goToStep(flow.step - 1)}
          className="w-full mt-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: "#1F2330",
            color: "#A1A1AA",
            border: "2px solid #3F4452",
          }}
        >
          Back
        </button>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin"
            style={{
              borderColor: "#3F4452",
              borderTopColor: "#F5B700",
            }}
          />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}