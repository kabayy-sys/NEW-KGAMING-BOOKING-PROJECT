import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 50%, rgba(245, 183, 0, 0.06) 0%, transparent 100%),
            linear-gradient(180deg, #0F1117 0%, #171923 100%)
          `,
        }}
      />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #F5B700 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">
          Ready to
          <br />
          <span className="text-gold-gradient">Play?</span>
        </h2>

        <p className="text-base sm:text-lg mb-10 leading-relaxed" style={{ color: "#A1A1AA" }}>
          Book your room now and experience premium gaming
          <br className="hidden sm:block" />
          at K Gaming XCafe.
        </p>

        <Link
          href="/booking"
          className="inline-flex items-center gap-3 min-h-[56px] px-12 py-4 rounded-lg font-bold text-lg text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#F5B700" }}
        >
          Book Now
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}