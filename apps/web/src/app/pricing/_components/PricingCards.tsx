'use client';

import Link from 'next/link';
import { ArrowRightIcon, CheckIcon } from '@/assets';

interface PricingCardsProps {
  annual: boolean;
}

export function PricingCards({ annual }: PricingCardsProps) {
  const plans = [
    {
      name: 'Starter',
      badge: 'Startups & Emerging Teams',
      priceNaira: annual ? '₦12,000' : '₦15,000',
      priceUsd: annual ? '$8' : '$10',
      description: 'Ideal for small remote teams paying up to 10 contractors in stablecoins.',
      popular: false,
      ctaText: 'Start with Starter',
      ctaHref: '/register?plan=starter',
      features: [
        'Up to 10 active contractor seats',
        'Instant Card & Crypto Funding',
        'USDC & USDT wallet deposits (Base/TRON)',
        'Unlimited monthly payroll runs',
        'Instant contractor bank cashouts',
        'BVN & NIN identity verification',
        '1.0% flat disburse fee',
        'Extra seats: ₦1,500 / $1 per contractor/mo',
      ],
    },
    {
      name: 'Scale',
      badge: 'Most Popular',
      priceNaira: annual ? '₦36,000' : '₦45,000',
      priceUsd: annual ? '$24' : '$30',
      description: 'Designed for scaling African tech companies requiring compliance & dual controls.',
      popular: true,
      ctaText: 'Upgrade to Scale',
      ctaHref: '/register?plan=scale',
      features: [
        'Up to 50 active contractor seats',
        'Dual Maker-Checker approvals (CEO + CFO)',
        'Multi-currency payouts (USDC, USDT, NGN, KES)',
        'Automated contract generation & digital signing',
        'Discounted 0.75% disburse fee',
        'Slack & Email approval notifications',
        'Priority off-ramp liquidity routing',
        'Extra seats: ₦1,200 / $0.80 per contractor/mo',
      ],
    },
    {
      name: 'Enterprise',
      badge: 'Multinationals & High Volume',
      priceNaira: 'Custom',
      priceUsd: 'Starting at $150',
      description: 'Tailored infrastructure, OTC volume rates, and custom compliance workflows.',
      popular: false,
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/register?plan=enterprise',
      features: [
        'Unlimited contractors & full-time staff',
        'Up to 5-tier Maker-Checker approval matrix',
        'Dedicated compliance officer & account rep',
        'Volume OTC crypto-to-fiat rates (<0.5% fee)',
        'Custom REST API & ERP webhooks (QuickBooks/Xero)',
        'Custom SLAs & 24/7 dedicated telephone support',
        'Bespoke legal contract templates for 10+ countries',
      ],
    },
  ];

  return (
    <section className="relative px-4 pb-20 sm:pb-28 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'border-2 border-brand-emerald bg-white shadow-xl ring-1 ring-brand-emerald/30 dark:bg-[#0e1014] dark:shadow-[0_0_50px_rgba(6,214,160,0.15)] dark:ring-brand-emerald/40'
                  : 'border border-black/[0.08] bg-white shadow-sm hover:shadow-md dark:border-white/[0.08] dark:bg-[#0c0d10] dark:shadow-none'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black px-3.5 py-0.5 text-caption font-bold uppercase tracking-wider shadow-sm">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-display-xs font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <span className="text-[10px] text-gray-600 dark:text-[#8a8f98] rounded-full border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] px-2.5 py-0.5">
                    {plan.badge}
                  </span>
                </div>

                <p className="mt-3 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-display-md sm:text-display-lg font-black text-gray-900 dark:text-white tracking-tight">
                      {plan.priceNaira}
                    </span>
                    {plan.priceNaira !== 'Custom' && (
                      <span className="text-body-xs text-gray-500 dark:text-[#8a8f98]">/ month</span>
                    )}
                  </div>
                  <div className="text-caption text-gray-500 dark:text-[#8a8f98] mt-1">
                    {plan.priceUsd} {plan.priceNaira !== 'Custom' && 'USD equivalent'}
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-body-xs text-gray-700 dark:text-white/90">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-emerald/10 text-brand-emerald">
                        <CheckIcon className="h-3 w-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  prefetch={true}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-label-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-[#0b3d2e] hover:bg-[#0b3d2e]/90 text-white dark:bg-brand-emerald dark:hover:bg-brand-emerald/90 dark:text-black shadow-md shadow-brand-emerald/20 font-bold'
                      : 'bg-[#0f1115] hover:bg-[#1e2025] text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black shadow-sm'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
