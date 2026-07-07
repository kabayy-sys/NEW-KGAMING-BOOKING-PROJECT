import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K Gaming XCafe - Premium PlayStation Gaming Lounge",
  description:
    "Premium PlayStation gaming lounge di K Gaming XCafe. Nikmati pengalaman bermain PS4, PS5, dan Nintendo Switch dengan nyaman. Booking online mudah dan cepat.",
  keywords: ["K Gaming XCafe", "PS Booking", "PlayStation Lounge", "Gaming Cafe", "PS4", "PS5", "Nintendo Switch", "Booking PS Online"],
  openGraph: {
    title: "K Gaming XCafe - Premium PlayStation Gaming Lounge",
    description: "Premium PlayStation gaming lounge. Booking PS online mudah dan cepat.",
    type: "website",
    locale: "id_ID",
    siteName: "K Gaming XCafe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
