import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { FeatureGrid } from '@/components/feature-grid';
import { Workflow } from '@/components/workflow';
import { PrivacySecurity } from '@/components/privacy-security';
import { CtaBanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureGrid />
        <Workflow />
        <PrivacySecurity />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
