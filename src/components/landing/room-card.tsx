import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface RoomCardProps {
  name: string;
  price: number;
  description: string;
  capacity: string;
  note?: string;
  btnLabel: string;
  btnHref: string;
  gradient: string;
}

export default function RoomCard({
  name,
  price,
  description,
  capacity,
  note,
  btnLabel,
  btnHref,
  gradient,
}: RoomCardProps) {
  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
      style={{
        backgroundColor: "#1F2330",
        border: "1px solid rgba(63, 68, 82, 0.4)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Gradient top accent */}
      <div className="h-1.5 w-full flex-shrink-0" style={{ background: gradient }} />

      {/* Content */}
      <div className="flex flex-col flex-1 p-7 sm:p-8">
        {/* Name & Price */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {name}
          </h3>
          {note && (
            <p className="text-xs mt-0.5" style={{ color: "#A1A1AA" }}>
              {note}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 mb-5">
          <span
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: "#F5B700" }}
          >
            {formatPrice(price)}
          </span>
          <span className="text-xs" style={{ color: "#A1A1AA" }}>
            /jam
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6 flex-1"
          style={{ color: "#D4D4D8" }}
        >
          {description}
        </p>

        {/* Capacity */}
        <div
          className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg w-fit"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(63, 68, 82, 0.3)",
          }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "#F5B700" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <span className="text-sm font-medium text-white">{capacity}</span>
        </div>

        {/* CTA Button */}
        <Link
          href={btnHref}
          className="block w-full py-3 rounded-xl text-center font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
          style={{
            backgroundColor: gradient,
            color: "#000",
            fontWeight: 700,
          }}
        >
          {btnLabel}
        </Link>
      </div>
    </div>
  );
}