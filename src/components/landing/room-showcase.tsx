import RoomCard from "./room-card";

const rooms = [
  {
    name: "Regular",
    price: 10000,
    description:
      "Cocok untuk bermain santai bersama teman dengan pengalaman gaming yang nyaman dan harga paling terjangkau.",
    capacity: "Maks. 3 Orang",
    btnLabel: "Book Regular",
    btnHref: "/booking?name=Regular",
    gradient: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
  },
  {
    name: "VIP 1",
    price: 30000,
    note: "Room 1A & 1B",
    description:
      "Ruangan premium dengan PS4 Pro dan Nintendo Switch OLED, cocok untuk bermain bersama keluarga atau teman dalam suasana yang lebih eksklusif.",
    capacity: "4–5 Orang",
    btnLabel: "Book VIP 1",
    btnHref: "/booking?name=VIP%201",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
  },
  {
    name: "VIP 2",
    price: 35000,
    description:
      "Pengalaman gaming terbaik menggunakan PS5 dan Nintendo Switch OLED dengan kualitas visual premium untuk bermain maupun menikmati hiburan.",
    capacity: "4–5 Orang",
    btnLabel: "Book VIP 2",
    btnHref: "/booking?name=VIP%202",
    gradient: "linear-gradient(135deg, #F5B700, #B45309)",
  },
];

export default function RoomShowcase() {
  return (
    <section id="rooms" className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Choose Your
            <br className="sm:hidden" />{" "}
            <span className="text-gold-gradient">Room</span>
          </h2>
          <p
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            From casual to premium — pick the room that fits your vibe.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
          {rooms.map((room) => (
            <RoomCard key={room.name} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
}