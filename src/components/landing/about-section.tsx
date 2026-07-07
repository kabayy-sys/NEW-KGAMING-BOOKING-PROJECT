export default function AboutSection() {
  return (
    <section className="py-16 sm:py-24 px-6" style={{ backgroundColor: "#171923" }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Left: Visual */}
          <div
            className="relative rounded-xl overflow-hidden h-64 sm:h-80"
            style={{
              background: "linear-gradient(135deg, #1F2330 0%, rgba(245, 183, 0, 0.05) 50%, #1F2330 100%)",
              border: "2px solid #3F4452",
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl sm:text-9xl opacity-10 select-none">🎮</span>
            </div>
            <div
              className="absolute bottom-4 left-4 right-4 p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(15, 17, 23, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(245, 183, 0, 0.15)",
              }}
            >
              <p className="text-xs font-medium" style={{ color: "#F5B700" }}>
                Est. 2024
              </p>
              <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                K Gaming XCafe
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-6">
              More Than Just
              <br />
              <span className="text-gold-gradient">Gaming</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "#A1A1AA" }}>
              K Gaming XCafe is Bandung's premier gaming lounge, offering premium PlayStation
              and Nintendo Switch experiences in a comfortable, air-conditioned environment.
            </p>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
              Whether you're a casual player or a competitive gamer, our lounge provides
              the perfect setting for unforgettable gaming sessions with friends.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div>
                <p className="text-2xl font-black" style={{ color: "#F5B700" }}>7+</p>
                <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>Gaming Rooms</p>
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "#F5B700" }}>4K</p>
                <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>QLED Displays</p>
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "#F5B700" }}>PS5</p>
                <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>Next-Gen Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}