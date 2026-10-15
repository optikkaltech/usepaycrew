import { LandingNav } from './_components/LandingNav';
import { HeroSection } from './_components/HeroSection';
import { DashboardPreview } from './_components/DashboardPreview';
import { AboutStatementSection } from './_components/AboutStatementSection';
import { CommandCenterSection } from './_components/CommandCenterSection';
import { PowerfulToolsSection } from './_components/PowerfulToolsSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { IntegrationsSection } from './_components/IntegrationsSection';
import { TestimonialsSection } from './_components/TestimonialsSection';
import { PreFooterHorizonCta } from './_components/PreFooterHorizonCta';
import { LandingFooter } from './_components/LandingFooter';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] overflow-x-hidden selection:bg-brand-emerald/20 selection:text-brand-brunswick transition-colors duration-200">
      {/* Sleek floating capsule navigation with theme toggle */}
      <LandingNav />

      {/* Main landing flow */}
      <main>
        <HeroSection />
        <DashboardPreview />
        <AboutStatementSection />
        <CommandCenterSection />
        <PowerfulToolsSection />
        <HowItWorksSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <PreFooterHorizonCta />
      </main>

      {/* Full modern footer with giant watermark */}
      <LandingFooter />
    </div>
  );
}
