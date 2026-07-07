"use client";

import { Disclaimer } from "@/types/database";

interface CustomerInfoProps {
  customerName: string;
  agreedToTerms: boolean;
  disclaimers: Disclaimer[];
  error: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onAgreeChange: (agreed: boolean) => void;
  onSubmit: () => void;
}

export default function CustomerInfo({
  customerName,
  agreedToTerms,
  disclaimers,
  error,
  isSubmitting,
  onNameChange,
  onAgreeChange,
  onSubmit,
}: CustomerInfoProps) {
  return (
    <div className="space-y-5">
      {/* Error */}
      {error && (
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#EF4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Customer Name */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "#1F2330",
          border: "2px solid #3F4452",
        }}
      >
        <label
          className="block text-xs font-semibold mb-2 uppercase tracking-wider"
          style={{ color: "#A1A1AA" }}
        >
          Your Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-lg text-base text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-gold"
          style={{
            backgroundColor: "#171923",
            border: "2px solid",
            borderColor: customerName ? "#F5B700" : "#3F4452",
            caretColor: "#F5B700",
          }}
          autoComplete="name"
        />
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "#1F2330",
          border: "2px solid #3F4452",
        }}
      >
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span>📋</span>
          Terms & Conditions
        </h3>
        <ul className="space-y-2.5">
          {disclaimers.map((d) => (
            <li
              key={d.id}
              className="text-xs flex items-start gap-2 leading-relaxed"
              style={{ color: "#A1A1AA" }}
            >
              <span className="mt-0.5 flex-shrink-0">☑</span>
              <span>{d.content}</span>
            </li>
          ))}
        </ul>

        {/* Agree Checkbox */}
        <label
          className="flex items-center gap-3 mt-5 pt-4 cursor-pointer select-none"
          style={{ borderTop: "1px solid #2D3140" }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: agreedToTerms ? "#F5B700" : "transparent",
              border: `2px solid ${agreedToTerms ? "#F5B700" : "#3F4452"}`,
            }}
          >
            {agreedToTerms && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-white">
            I agree to all terms and conditions
          </span>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreeChange(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={!customerName || !agreedToTerms || isSubmitting}
        className="w-full min-h-[56px] rounded-xl font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          backgroundColor: customerName && agreedToTerms ? "#25D366" : "#3F4452",
          color: customerName && agreedToTerms ? "#000" : "#6B7280",
        }}
      >
        {isSubmitting ? (
          <>
            <span
              className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin"
            />
            Processing...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Book via WhatsApp
          </>
        )}
      </button>
    </div>
  );
}