import LandingBackground from "./_components/HeroSection/LandingBackground";
import LandingNav from "./_components/Nav/LandingNav";
import DashboardTabs from "./_components/FeatureSection/DashboardTabs";
import HeroSection from "./_components/HeroSection/HeroSection";
import BenefitSection from "./_components/BenefitSection/BenefitSection";
import QASection from "./_components/QASection/QASection";
import CallToActionSection from "./_components/CallToActionSection/CallToActionSection";
import FooterSection from "./_components/FooterSection/FooterSection";
import MobileLandingNav from "./_components/Nav/MobileLandingNav";
import MobileFeatureCarousel from "./_components/FeatureSection/MobileFeatureCarousel";
import "@/css/app.css";
import "@/css/embla.css";

export default function Home() {
  return (
    <main className="h-screen">
      <LandingBackground />
      <LandingNav />
      <MobileLandingNav />
      <HeroSection />
      <DashboardTabs />
      <MobileFeatureCarousel />
      <BenefitSection />
      <QASection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
}
