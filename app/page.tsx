import Container from "@/components/ui/container";
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

export default function Home() {
  return (
    <div className="h-screen">
      <Container>
        <LandingBackground />
        <LandingNav />
        <MobileLandingNav />
        <HeroSection />
        <DashboardTabs />
        <BenefitSection />
        <QASection />
        <CallToActionSection />
        <FooterSection />
      </Container>
    </div>
  );
}
