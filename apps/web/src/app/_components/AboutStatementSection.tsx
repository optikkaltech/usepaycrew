import { BuildingIcon, CreditCardIcon, ShieldCheckIcon, ZapIcon } from '@/assets';

export function AboutStatementSection() {
  return (
    <section id="about" className="relative px-4 py-20 sm:py-32 scroll-mt-20 overflow-hidden">
      {/* Soft ambient center glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[300px] w-[600px] rounded-full bg-brand-emerald/[0.05] dark:bg-white/[0.03] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.1] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-8 shadow-sm">
          <ShieldCheckIcon className="h-3 w-3 text-brand-emerald" />
          <span>Why PayCrew</span>
        </div>

        {/* Big Statement with inline icon chips */}
        <h2 className="text-display-sm sm:text-display-md lg:text-display-lg font-heading font-semibold text-gray-900 dark:text-white leading-snug tracking-tight">
          PayCrew breaks cross-border barriers, empowering companies to fund with Naira{' '}
          <span className="inline-flex items-center justify-center align-middle mx-1 h-8 w-8 rounded-lg bg-[#0b3d2e]/10 border border-[#0b3d2e]/20 text-[#0b3d2e] dark:bg-brand-emerald/15 dark:border-brand-emerald/30 dark:text-brand-emerald shadow-xs dark:shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <BuildingIcon className="h-4 w-4" />
          </span>
          {', '}disburse payroll in stablecoins{' '}
          <span className="inline-flex items-center justify-center align-middle mx-1 h-8 w-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <ZapIcon className="h-4 w-4" />
          </span>
          {', '}and let remote contractors cash out directly into local bank accounts{' '}
          <span className="inline-flex items-center justify-center align-middle mx-1 h-8 w-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <CreditCardIcon className="h-4 w-4" />
          </span>
          {' '}with automated compliance.
        </h2>

        {/* Dimmer description text */}
        <p className="mt-8 text-body-md sm:text-body-lg text-gray-600 dark:text-[#525866] leading-relaxed max-w-3xl">
          Say goodbye to delayed SWIFT transfers, unfair parallel market exchange rates, and manual contractor payments.
          PayCrew provides automated Nigerian KYB, dual maker-checker authorization, and transparent ledger settlement.
        </p>
      </div>
    </section>
  );
}
