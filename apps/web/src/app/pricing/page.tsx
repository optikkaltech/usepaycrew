'use client';

import { useState } from 'react';
import { LandingNav } from '../_components/LandingNav';
import { LandingFooter } from '../_components/LandingFooter';
import { PricingHero } from './_components/PricingHero';
import { PricingCards } from './_components/PricingCards';
import { PricingFeeBreakdown } from './_components/PricingFeeBreakdown';
import { PricingFaq } from './_components/PricingFaq';
import { PricingCta } from './_components/PricingCta';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#fafbfc] text-[#0c1f1a] dark:bg-[#08090b] dark:text-[#f4f5f7] overflow-x-hidden selection:bg-brand-emerald/20 selection:text-brand-brunswick transition-colors duration-200">
      {/* Sleek navigation */}
      <LandingNav />

      {/* Main content flow */}
      <main>
        <PricingHero annual={annual} setAnnual={setAnnual} />
        <PricingCards annual={annual} />
        <PricingFeeBreakdown />
        <PricingFaq />
        <PricingCta />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
