const steps = [
  {
    number: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Choose Date",
    description: "Pick your preferred date and time slot.",
  },
  {
    number: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Choose Schedule",
    description: "Select your room and duration.",
  },
  {
    number: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
        <path d="M8 18h8"/>
      </svg>
    ),
    title: "Payment",
    description: "Transfer to our bank account.",
  },
  {
    number: "04",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    title: "Play!",
    description: "Come and enjoy your gaming session.",
  },
];

export default function BookingSteps() {
  return (
    <section className="py-16 sm:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
            How to
            <br />
            <span className="text-gold-gradient">Book</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#A1A1AA" }}>
            Simple steps to start playing.
          </p>
        </div>

        {/* Steps - Vertical on mobile, Horizontal on desktop */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-6 sm:gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center w-full sm:w-auto">
              {/* Step Card */}
              <div className="flex items-center gap-4 sm:flex-col sm:text-center sm:px-6 w-full sm:w-auto">
                {/* Number */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "#1F2330",
                    border: "2px solid #3F4452",
                  }}
                >
                  <div className="flex flex-col items-center">
                    {step.icon}
                  </div>
                </div>

                {/* Text */}
                <div className="sm:mt-3">
                  <p className="text-sm font-bold text-white">{step.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A1A1AA" }}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Arrow (between steps) */}
              {i < steps.length - 1 && (
                <div className="hidden sm:flex items-center px-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3F4452" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}