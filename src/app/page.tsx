import Hero from '@/pages/Hero';
import Why from '@/pages/Why';
import Features from '@/pages/Features';
import TimelineSection from '@/pages/TimelineSection';
import Footer from '@/pages/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Why />
      <TimelineSection /> {/* Added Timeline section here */}
      <Footer />
    </main>
  );
}
