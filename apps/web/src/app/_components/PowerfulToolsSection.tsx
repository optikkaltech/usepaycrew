import {
  BuildingIcon,
  CreditCardIcon,
  FileCheckIcon,
  GemIcon,
  ShieldIcon,
  ZapIcon,
} from '@/assets';

export function PowerfulToolsSection() {
  return (
    <section id="products" className="relative px-4 py-20 sm:py-32 overflow-hidden scroll-mt-20">
      {/* Volumetric Horizon Spotlight Cone matching reference */}
      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center z-0">
        {/* Crisp horizontal horizon slit */}
        <div className="h-[2px] w-72 sm:w-96 bg-gradient-to-r from-transparent via-brand-emerald/70 dark:via-white to-transparent lighting-horizon-slit" />
        {/* Volumetric trapezoid spotlight beam */}
        <div className="lighting-spotlight-cone h-64 sm:h-80 w-[420px] sm:w-[620px] opacity-90 blur-[0.5px]" />
        {/* Star specks inside beam */}
        <div className="absolute top-8 h-40 w-80 bg-[radial-gradient(circle,rgba(6,214,160,0.25)_1px,transparent_1px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.12] dark:bg-white/[0.04] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6 backdrop-blur-md shadow-sm">
            <GemIcon className="h-3 w-3 text-brand-emerald" />
            <span>Built for African Tech Teams</span>
          </div>

          <h2 className="text-display-md sm:text-display-xl font-heading font-semibold tracking-tight text-glow-silver max-w-2xl mx-auto leading-tight">
            Essential tools for global
            <br />
            contractor operations
          </h2>

          <p className="mt-4 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
            Built from the ground up to eliminate cross-border payroll friction, currency volatility,
            and compliance headaches for African companies.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Multi-chain stablecoin payroll */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm hover:shadow-md dark:border-white/[0.08] dark:bg-[#0c0d10] dark:shadow-none hover:border-black/[0.15] dark:hover:border-white/[0.16] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-label-lg font-semibold text-gray-900 dark:text-white">Multi-Chain Stablecoin Payroll</h3>
              <p className="mt-2 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                Disburse USDC and USDT on Base, TRON, or Ethereum with 1-click batch runs,
                sub-second finality, and negligible network gas costs.
              </p>
            </div>
            {/* Visual widget */}
            <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.05] dark:bg-[#121317] p-4">
              <div className="flex items-center justify-between text-caption text-gray-500 dark:text-[#8a8f98]">
                <span>Batch Payroll Run</span>
                <span className="rounded border border-black/[0.08] dark:border-white/[0.08] px-1.5 py-0.5 text-[10px]">USDC Base + TRON</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-display-xs text-gray-900 dark:text-white font-bold">$16,278.00</span>
                <span className="text-caption font-semibold text-brand-emerald">24 Contractors</span>
              </div>
              <div className="relative mt-4 h-24 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                  <path d="M0,60 Q50,65 100,50 T200,30 T300,20" fill="none" stroke="#39FF14" strokeWidth="2" />
                  <circle cx="200" cy="30" r="4" fill="#39FF14" className="animate-pulse" />
                </svg>
                <div className="absolute left-[62%] top-3 -translate-x-1/2 rounded bg-gray-900 text-white dark:bg-[#1e2029] border border-black/10 dark:border-white/10 px-2 py-0.5 text-[10px] shadow-lg">
                  Instant Dispatch
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Instant Nigerian Bank Cashouts */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm hover:shadow-md dark:border-white/[0.08] dark:bg-[#0c0d10] dark:shadow-none hover:border-black/[0.15] dark:hover:border-white/[0.16] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-label-lg font-semibold text-gray-900 dark:text-white">Instant Local Bank Cashouts</h3>
              <p className="mt-2 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                Contractors convert stablecoins directly to Naira in GTBank, Access, Zenith, Kuda, or any
                NUBAN account within 30 seconds at institutional rates.
              </p>
            </div>
            {/* Visual widget */}
            <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.05] dark:bg-[#121317] p-4">
              <div className="flex items-center justify-between text-caption text-gray-500 dark:text-[#8a8f98]">
                <span>Contractor Cashout</span>
                <span className="rounded border border-black/[0.08] dark:border-white/[0.08] px-1.5 py-0.5 text-[10px]">Instant Bank Transfer</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-display-xs text-gray-900 dark:text-white font-bold">₦1,250,000</span>
                <span className="text-caption font-semibold text-brand-emerald">Credited in 14s</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-caption border-b border-black/[0.04] dark:border-white/[0.04] pb-2">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <BuildingIcon className="h-3.5 w-3.5 text-gray-500 dark:text-[#9ca3af]" />
                    <span>Beneficiary Bank</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">GTBank (0123****89)</span>
                </div>
                <div className="flex items-center justify-between text-caption">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CreditCardIcon className="h-3.5 w-3.5 text-gray-500 dark:text-[#9ca3af]" />
                    <span>Statutory Fee</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">₦50 Stamp Duty Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Maker-Checker Security with Concentric Radar Lighting */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm hover:shadow-md dark:border-white/[0.08] dark:bg-[#0c0d10] dark:shadow-none hover:border-black/[0.15] dark:hover:border-white/[0.16] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-label-lg font-semibold text-gray-900 dark:text-white">Maker-Checker Approvals</h3>
              <p className="mt-2 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                Enterprise compliance with dual authorization for high-value payouts, automated
                BVN/NIN identity matching, and CBN-compliant ledger records.
              </p>
            </div>
            {/* Shield emblem with concentric radar rings & glowing specular lighting */}
            <div className="mt-6 h-40 rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.05] dark:bg-[#121317] flex items-center justify-center relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-10 font-mono text-[9px] text-gray-600 dark:text-[#8a8f98] p-3 leading-tight select-none">
                BVN_VERIFIED: 22198034*** NIN_VERIFIED: 93898049*** MAKER_AUTH: CFO_APPROVED CHECKER_AUTH: CEO_APPROVED LEDGER_HASH: 0x7F4A89C
              </div>
              {/* Concentric radar rings matching reference */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border border-black/[0.06] dark:border-white/[0.08]" />
                <div className="absolute h-36 w-36 rounded-full border border-black/[0.04] dark:border-white/[0.05]" />
                <div className="absolute h-48 w-48 rounded-full border border-black/[0.02] dark:border-white/[0.03]" />
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-brand-emerald/15 via-white/50 to-transparent dark:from-white/20 dark:via-white/5 border border-brand-emerald/30 dark:border-white/30 shadow-[0_0_35px_rgba(6,214,160,0.25)] dark:shadow-[0_0_35px_rgba(255,255,255,0.25)]">
                <ShieldIcon className="h-10 w-10 text-emerald-800 dark:text-white fill-brand-emerald/10" />
              </div>
            </div>
          </div>

          {/* Card 4: Dedicated Naira Treasury with Radial Connections */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm hover:shadow-md dark:border-white/[0.08] dark:bg-[#0c0d10] dark:shadow-none hover:border-black/[0.15] dark:hover:border-white/[0.16] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-label-lg font-semibold text-gray-900 dark:text-white">Instant Treasury &amp; Card Funding</h3>
              <p className="mt-2 text-body-xs text-gray-600 dark:text-[#8a8f98] leading-relaxed">
                Fund payroll directly from your corporate cards or crypto stablecoins
                with automated zero-fee treasury balance updates.
              </p>
            </div>
            {/* Radial hub diagram */}
            <div className="mt-6 h-40 rounded-xl border border-black/[0.06] bg-[#f8fafc] dark:border-white/[0.05] dark:bg-[#121317] flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 160">
                <line x1="80" y1="50" x2="150" y2="80" stroke="rgba(0,0,0,0.12)" className="dark:stroke-white/[0.15]" strokeWidth="1.5" />
                <line x1="80" y1="110" x2="150" y2="80" stroke="rgba(0,0,0,0.12)" className="dark:stroke-white/[0.15]" strokeWidth="1.5" />
                <line x1="220" y1="50" x2="150" y2="80" stroke="rgba(0,0,0,0.12)" className="dark:stroke-white/[0.15]" strokeWidth="1.5" />
                <line x1="220" y1="110" x2="150" y2="80" stroke="rgba(0,0,0,0.12)" className="dark:stroke-white/[0.15]" strokeWidth="1.5" />
              </svg>
              <div className="relative z-10 flex items-center gap-1.5 rounded-full border border-black/15 bg-white text-gray-900 dark:border-white/20 dark:bg-[#1c1e26] px-3 py-1 text-[11px] font-semibold dark:text-white shadow-md">
                <span>✦ PayCrew Treasury</span>
              </div>
              <div className="absolute left-10 top-9 h-7 w-7 rounded-full bg-white dark:bg-[#18191f] border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] text-gray-900 dark:text-white shadow-xs">NGN</div>
              <div className="absolute left-10 bottom-9 h-7 w-7 rounded-full bg-white dark:bg-[#18191f] border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] text-gray-900 dark:text-white shadow-xs">USDC</div>
              <div className="absolute right-10 top-9 h-7 w-7 rounded-full bg-white dark:bg-[#18191f] border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] text-gray-900 dark:text-white shadow-xs">USDT</div>
              <div className="absolute right-10 bottom-9 h-7 w-7 rounded-full bg-white dark:bg-[#18191f] border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] text-gray-900 dark:text-white shadow-xs">BANK</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
