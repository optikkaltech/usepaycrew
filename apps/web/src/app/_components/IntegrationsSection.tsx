import Link from 'next/link';
import { ArrowRightIcon, PlugIcon } from '@/assets';

export function IntegrationsSection() {
  const apps = [
    { name: 'Direct Settlement', bg: 'bg-[#002244]', text: 'DS', textColor: 'text-white' },
    { name: 'Quidax', bg: 'bg-[#0052FF]', text: 'Q', textColor: 'text-white' },
    { name: 'PayCrew', bg: 'bg-[#0b3d2e] dark:bg-brand-emerald', text: 'P', textColor: 'text-white dark:text-black', featured: true },
    { name: 'Base', bg: 'bg-[#0052FF]', text: 'Base', textColor: 'text-white' },
    { name: 'TRON', bg: 'bg-[#FF0018]', text: 'TRON', textColor: 'text-white' },
  ];

  return (
    <section className="relative px-4 py-20 sm:py-32 overflow-hidden transition-colors duration-200">
      <div className="mx-auto max-w-5xl text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6 shadow-sm">
          <PlugIcon className="h-3 w-3 text-brand-emerald" />
          <span>Financial Rails</span>
        </div>

        {/* Heading */}
        <h2 className="text-display-md sm:text-display-xl font-heading font-semibold tracking-tight text-glow-silver max-w-2xl mx-auto leading-tight">
          Connected to Africa&apos;s best
          <br />
          financial &amp; crypto rails
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
          Fund, disburse, and reconcile seamlessly across instant card &amp; direct bank transfer rails,
          Quidax OTC liquidity, and leading stablecoin networks.
        </p>

        {/* Grid of glowing apps with intense radial core lighting */}
        <div className="relative mt-16 py-12 flex flex-col items-center justify-center">
          {/* Intense radial underglow aura */}
          <div className="pointer-events-none absolute h-40 w-[520px] rounded-full bg-gradient-to-r from-purple-500/15 via-brand-emerald/25 to-cyan-500/20 blur-[60px]" />
          
          {/* Luminous reflective shelf line */}
          <div className="pointer-events-none absolute bottom-5 h-[1.5px] w-96 bg-gradient-to-r from-transparent via-brand-emerald/50 dark:via-white/50 to-transparent shadow-[0_0_15px_rgba(6,214,160,0.5)]" />

          <div className="relative flex items-center justify-center gap-4 sm:gap-8">
            {apps.map((app) => (
              <div
                key={app.name}
                className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-110 cursor-pointer ${
                  app.featured
                    ? `h-16 w-16 sm:h-20 sm:w-20 ${app.bg} shadow-md dark:shadow-[0_0_45px_rgba(57,255,20,0.5)] ring-2 ring-[#0b3d2e]/30 dark:ring-brand-emerald/50`
                    : `h-12 w-12 sm:h-16 sm:w-16 ${app.bg} opacity-90 hover:opacity-100 shadow-md dark:shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10`
                }`}
              >
                <span className={`text-label-sm sm:text-label-lg font-black ${app.textColor}`}>
                  {app.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA link */}
        <div className="mt-8">
          <Link
            href="/pricing"
            prefetch={true}
            className="inline-flex items-center gap-2 text-label-sm font-medium text-gray-900 hover:text-brand-emerald dark:text-white dark:hover:text-brand-emerald transition-colors"
          >
            <span>View transparent pricing &amp; fees</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
