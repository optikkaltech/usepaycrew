import {
  BanknoteIcon,
  BuildingIcon,
  CheckCircleIcon,
  DatabaseIcon,
  FileCheckIcon,
  KeyIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCheckIcon,
} from '@/assets';

export function HowItWorksSection() {
  const steps = [
    {
      title: 'Fund Company Treasury',
      desc: 'Deposit funds via instant card payment or send USDT/USDC on Base or TRON with zero deposit fees.',
      active: true,
      icon: BuildingIcon,
    },
    {
      title: 'Onboard & Verify Contractors',
      desc: 'Contractors verify their BVN/NIN identity, link their local bank account, and digitally sign consulting agreements.',
      active: false,
      icon: UserCheckIcon,
    },
    {
      title: '1-Click Disburse & Cashout',
      desc: 'Run payroll with dual maker-checker security. Contractors receive stablecoins or instant Naira in local banks in seconds.',
      active: false,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <section id="use-cases" className="relative px-4 py-20 sm:py-32 overflow-hidden scroll-mt-20">
      {/* 3D Perspective Grid Floor & Ambient Lighting Plume */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center">
        <div className="h-[300px] w-[700px] rounded-full bg-brand-emerald/[0.05] dark:bg-white/[0.03] blur-[120px]" />
        <div className="absolute -bottom-16 h-72 w-[1100px] opacity-25 [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_50%,transparent_100%)] [transform:perspective(500px)_rotateX(60deg)]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.1] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6 backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald shadow-[0_0_8px_#06D6A0]" />
            <span>How it works</span>
          </div>

          <h2 className="text-display-md sm:text-display-xl font-heading font-semibold tracking-tight text-glow-silver max-w-2xl mx-auto leading-tight">
            Streamline contractor payroll
            <br />
            in 4 simple steps
          </h2>

          <p className="mt-4 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
            From Naira treasury deposit to contractor bank cashout, PayCrew coordinates stablecoin rails,
            regulatory compliance, and instant local payouts.
          </p>
        </div>

        {/* 3 Step Top Highlights with Illuminated Active Line */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-black/[0.06] dark:border-white/[0.06] pb-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative pt-4">
                {step.active && (
                  <div className="absolute top-0 left-0 w-28 h-0.5 bg-brand-emerald shadow-[0_0_15px_rgba(6,214,160,0.6)]" />
                )}
                <div className="flex items-center gap-2 text-label-md font-semibold text-gray-900 dark:text-white">
                  <Icon className="h-4 w-4 text-gray-500 dark:text-[#9ca3af]" />
                  <span>{step.title}</span>
                </div>
                <p className="mt-2 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Big Split Showcase Card */}
        <div className="mt-10 rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-10 shadow-lg dark:border-white/[0.06] dark:bg-[#0c0d10]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 4 Steps */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-emerald/10 text-brand-emerald">
                  <BanknoteIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-label-md font-semibold text-gray-900 dark:text-white">Contractor Payout Lifecycle</h3>
                  <span className="text-caption text-gray-500 dark:text-[#8a8f98]">Automated from treasury to bank</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.04] dark:bg-[#121317] p-3">
                  <BuildingIcon className="h-4 w-4 text-gray-500 dark:text-[#9ca3af] mb-2" />
                  <div className="text-[11px] font-medium text-gray-900 dark:text-white">1. Fund via NUBAN / Crypto</div>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.04] dark:bg-[#121317] p-3">
                  <KeyIcon className="h-4 w-4 text-gray-500 dark:text-[#9ca3af] mb-2" />
                  <div className="text-[11px] font-medium text-gray-900 dark:text-white">2. Verify BVN / NIN ID</div>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.04] dark:bg-[#121317] p-3">
                  <ShieldCheckIcon className="h-4 w-4 text-brand-emerald mb-2" />
                  <div className="text-[11px] font-medium text-gray-900 dark:text-white">3. Dual Maker-Checker</div>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.04] dark:bg-[#121317] p-3">
                  <DatabaseIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mb-2" />
                  <div className="text-[11px] font-medium text-gray-900 dark:text-white">4. Instant Bank Credit</div>
                </div>
              </div>
            </div>

            {/* Right Column: Connection Modal Preview */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-black/[0.08] bg-[#f8fafc] dark:border-white/[0.08] dark:bg-[#14151a] p-5 sm:p-6 shadow-xl max-w-md mx-auto">
                {/* Connecting nodes */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-emerald text-black font-bold text-xs shadow-[0_0_12px_rgba(6,214,160,0.4)]">
                    P
                  </div>
                  <span className="text-brand-emerald text-xs">••••••</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0052FF] text-white font-bold text-xs">
                    NGN
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h4 className="text-label-md font-semibold text-gray-900 dark:text-white">
                    Automated Contractor Disburse &amp; Cashout
                  </h4>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.04] p-3 shadow-xs">
                    <div className="text-label-sm font-semibold text-gray-900 dark:text-white">Instant Local Settlement</div>
                    <p className="mt-1 text-[11px] text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                      Contractors can hold in USDC or receive instant local bank credits (NGN) with zero parallel market markups.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.04] p-3 shadow-xs">
                    <div className="text-label-sm font-semibold text-gray-900 dark:text-white">CBN Regulatory Identity Matching</div>
                    <p className="mt-1 text-[11px] text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                      Third-party mismatch protection ensures funds are only routed to bank accounts verified with the contractor&apos;s legal BVN/NIN.
                    </p>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <span className="text-[11px] text-brand-emerald font-semibold">
                    ✓ Verified Bank Transfer: GTBank, Zenith, Access, Kuda
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
