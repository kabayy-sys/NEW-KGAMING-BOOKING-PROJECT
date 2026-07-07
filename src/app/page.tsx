import HeroSection from "@/components/landing/hero-section";
import RoomShowcase from "@/components/landing/room-showcase";
import FacilitiesSection from "@/components/landing/facilities-section";
import BookingSteps from "@/components/landing/booking-steps";
import AboutSection from "@/components/landing/about-section";
import FinalCTA from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";
import StaffLoginLink from "@/components/landing/staff-login-link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <StaffLoginLink />
      <HeroSection />
      <RoomShowcase />
      <FacilitiesSection />
      <BookingSteps />
      <AboutSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}