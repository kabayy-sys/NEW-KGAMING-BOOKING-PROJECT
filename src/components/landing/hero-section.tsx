import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -20%, rgba(245, 183, 0, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(31, 35, 48, 0.6) 0%, transparent 100%),
            linear-gradient(180deg, #0F1117 0%, #171923 100%)
          `,
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#F5B700 1px, transparent 1px), linear-gradient(90deg, #F5B700 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 text-xs font-medium tracking-wider uppercase"
          style={{
            backgroundColor: "rgba(245, 183, 0, 0.1)",
            color: "#F5B700",
            border: "1px solid rgba(245, 183, 0, 0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
          Premium Gaming Lounge
        </div>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.9] mb-4">
          <span className="text-white">K Gaming</span>
          <br />
          <span
            className="text-gold-gradient"
          >
            XCafe
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg mt-6 mb-10 leading-relaxed" style={{ color: "#A1A1AA" }}>
          Premium PlayStation gaming lounge.
          <br />
          Book your session in seconds, play in style.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/booking"
            className="w-full sm:w-auto min-h-[52px] px-10 py-3.5 rounded-lg font-bold text-base sm:text-lg text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: "#F5B700" }}
          >
            Book Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>

          <a
            href="#rooms"
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-lg font-medium text-base transition-all duration-200 hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              backgroundColor: "transparent",
              color: "#A1A1AA",
              border: "2px solid #3F4452",
            }}
          >
            Explore Rooms
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#3F4452" }}>
            Scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F4452" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
      </div>
    </section>
  );
}