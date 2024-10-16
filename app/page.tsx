import Container from "@/components/ui/container";
import LandingBackground from "./_components/HeroSection/LandingBackground";
import LandingNav from "./_components/Nav/LandingNav";
import DashboardTabs from "./_components/FeatureSection/DashboardTabs";
import HeroSection from "./_components/HeroSection/HeroSection";
import BenefitSection from "./_components/BenefitSection/BenefitSection";

export default function Home() {
  return (
    <div className="h-screen">
      <Container>
        <LandingBackground />
        <LandingNav />
        <HeroSection />
        <DashboardTabs />
        <BenefitSection />
      </Container>
    </div>
  );
}
