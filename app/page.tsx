import Container from "@/components/ui/container";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <div className="h-screen">
      <Container>
        <Navbar />
        <Hero />
      </Container>
    </div>
  );
}
