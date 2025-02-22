import HeroBottom from "@/components/hero-bottom";
import Hero from "@/pages/Hero";
import Features from "@/pages/Features";
import Why from "@/pages/Why";  // Make sure this path is correct
import Footer from "@/pages/Footer";

export default function Home() {
  return (
    <div>
      <Hero/>
      <HeroBottom/>
      <Features/>
      <Why/>
      <Footer/>
    </div>
  );
}
