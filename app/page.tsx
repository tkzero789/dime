import LandingBackground from "./_components/HeroSection/LandingBackground";
import LandingNav from "./_components/Nav/LandingNav";
import DashboardTabs from "./_components/FeatureSection/DashboardTabs";
import HeroSection from "./_components/HeroSection/HeroSection";
import BenefitSection from "./_components/BenefitSection/BenefitSection";
import QASection from "./_components/QASection/QASection";
import CallToActionSection from "./_components/CallToActionSection/CallToActionSection";
import FooterSection from "./_components/FooterSection/FooterSection";
import "@/css/app.css";
import MobileLandingNav from "./_components/Nav/MobileLandingNav";
import MobileCarousel from "./_components/FeatureSection/MobileCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "@/css/embla.css";

export default function Home() {
  const OPTIONS: EmblaOptionsType = { containScroll: false };

  return (
    <main className="h-screen">
      <LandingBackground />
      <LandingNav />
      <MobileLandingNav />
      <HeroSection />
      <DashboardTabs />
      <MobileCarousel options={OPTIONS} />
      <BenefitSection />
      <QASection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
}
