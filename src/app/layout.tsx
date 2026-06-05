import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K Gaming XCafe - Booking PS Online",
  description:
    "Booking PS online di K Gaming XCafe. Lihat ketersediaan device secara realtime dan lakukan booking hanya dalam beberapa langkah.",
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