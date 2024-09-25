import Container from "@/components/ui/container";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="h-screen">
      <Container>
        <Header />
        <Hero />
      </Container>
    </div>
  );
}
