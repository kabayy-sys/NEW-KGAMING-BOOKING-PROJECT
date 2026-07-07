const facilities = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <circle cx="8" cy="12" r="1" fill="#F5B700"/>
        <circle cx="16" cy="12" r="1" fill="#F5B700"/>
        <path d="M10 12h4"/>
      </svg>
    ),
    label: "PlayStation 4 & 5",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    label: "Nintendo Switch",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
        <path d="M2 12h20"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <circle cx="12" cy="16" r="2"/>
        <path d="M10 16h4"/>
      </svg>
    ),
    label: "Comfortable Sofa",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13a10 10 0 0 1 14 0"/>
        <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
        <circle cx="12" cy="21" r="1" fill="#F5B700"/>
        <line x1="12" y1="11" x2="12" y2="14"/>
      </svg>
    ),
    label: "Air Conditioner",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <circle cx="12" cy="20" r="1" fill="#F5B700"/>
      </svg>
    ),
    label: "WiFi Super Cepat",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    label: "Food & Drinks",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    label: "Parking Area",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    label: "Karaoke",
  },
];

export default function FacilitiesSection() {
  return (
    <section className="py-16 sm:py-24 px-6" style={{ backgroundColor: "#171923" }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
            Everything You
            <br />
            <span className="text-gold-gradient">Need</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#A1A1AA" }}>
            Premium facilities for the ultimate gaming experience.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facilities.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]"
              style={{
                backgroundColor: "#1F2330",
                border: "2px solid #3F4452",
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-center leading-tight text-white">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}