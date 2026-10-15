'use client';

import { useState } from 'react';
import { ChevronDownIcon, HelpCircleIcon } from '@/assets';

const faqs = [
  {
    q: 'How do we fund our company treasury in Naira?',
    a: 'You can fund your treasury instantly via debit/credit card or by depositing stablecoins (USDT/USDC). Once processed, your treasury balance is credited immediately.',
  },
  {
    q: 'How do contractors cash out to Nigerian bank accounts?',
    a: 'When you disburse payroll in USDC or USDT, contractors can either retain their earnings in stablecoins or click "Withdraw to Bank". Funds are converted into Naira at real-time institutional OTC rates and deposited directly into any Nigerian bank account in under 30 seconds.',
  },
  {
    q: 'What is the Maker-Checker approval workflow?',
    a: 'Maker-Checker enforces two-tier authorization for payroll dispatches above your chosen limit. A team member (the "Maker") creates and prepares the contractor payroll batch, while authorized executives (the "Checker", like the CEO or CFO) review and approve it before funds are released.',
  },
  {
    q: 'What happens if our team grows beyond our plan limit?',
    a: 'You are never blocked from paying your contractors. Additional active contractor seats beyond your included tier limit are billed automatically at the prorated monthly rate (₦1,500/seat on Starter, ₦1,200/seat on Scale).',
  },
  {
    q: 'Are stablecoin payouts compliant with Nigerian regulatory guidelines?',
    a: 'Yes. PayCrew enforces strict BVN and NIN identity verification for all contractors, matches beneficiary bank account names to prevent third-party mismatch flags, and complies with all statutory regulations including the ₦50 statutory stamp duty.',
  },
];

export function PricingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative px-4 py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.04] transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-4 shadow-sm">
            <HelpCircleIcon className="h-3 w-3 text-brand-emerald" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-display-sm sm:text-display-md text-gray-900 dark:text-white font-normal tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#0c0d10] overflow-hidden transition-colors shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-label-md font-semibold text-gray-900 dark:text-white hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-gray-400 dark:text-[#8a8f98] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-emerald' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed border-t border-black/[0.04] dark:border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
