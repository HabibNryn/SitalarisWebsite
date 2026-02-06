import Hero from "../components/Hero";
import LayananSection from "../components/LayananSection";
import Footer from "../components/Footer";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <LayananSection />
      <Footer />
    </main>
  );
}
