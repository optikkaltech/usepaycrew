import { BanknoteIcon, CheckCircleIcon, ShieldCheckIcon } from '@/assets';

export function PricingFeeBreakdown() {
  const feeItems = [
    {
      operation: 'Treasury Deposit via Korapay NUBAN',
      cost: '₦0 (Free)',
      notes: 'Instant automatic crediting from any Nigerian corporate bank account',
    },
    {
      operation: 'Crypto Treasury Deposit (Base, TRON, ETH)',
      cost: '0% Platform Fee',
      notes: 'You only cover standard network gas fee (negligible on Base/TRON)',
    },
    {
      operation: 'Payroll Disburse Processing Fee',
      cost: '1.0% flat (down to 0.5%)',
      notes: 'Transparent volume-based fee with no hidden intermediary commissions',
    },
    {
      operation: 'Contractor Local Bank Cashout (NGN)',
      cost: 'Statutory ₦50 Stamp Duty Only',
      notes: 'Direct CBN statutory stamp duty per credit; zero extra hidden surcharges',
    },
    {
      operation: 'Currency Conversion (USDC/USDT to NGN)',
      cost: '0% Spread Markup',
      notes: 'Real-time mid-market institutional liquidity powered by Quidax OTC',
    },
  ];

  return (
    <section className="relative px-4 py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.04] transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-4 shadow-sm">
            <ShieldCheckIcon className="h-3 w-3 text-brand-emerald" />
            <span>Zero Hidden Fees</span>
          </div>
          <h2 className="text-display-sm sm:text-display-md text-gray-900 dark:text-white font-normal tracking-tight">
            Transparent fee structure. No surprises.
          </h2>
          <p className="mt-3 text-body-sm text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto">
            Traditional banks charge 3-5% in hidden FX markups and $35 per SWIFT wire.
            Here is exactly how PayCrew saves you up to 70% in cross-border payroll costs.
          </p>
        </div>

        {/* Breakdown Card */}
        <div className="rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#0c0d10] p-6 sm:p-8 overflow-hidden shadow-sm dark:shadow-xl">
          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {feeItems.map((item) => (
              <div
                key={item.operation}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-label-md font-semibold text-gray-900 dark:text-white">
                    {item.operation}
                  </div>
                  <div className="text-body-xs text-gray-500 dark:text-[#8a8f98] mt-0.5">
                    {item.notes}
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-flex items-center rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1 text-label-sm font-bold text-emerald-800 dark:text-brand-emerald">
                    {item.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
