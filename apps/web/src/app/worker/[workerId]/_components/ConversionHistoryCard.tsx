'use client';

import { TrendingUpIcon } from '@/assets';
import { formatCurrency, formatDate } from '@/utils';
import { usePrivacyStore } from '@/store';

interface ConversionHistoryCardProps {
  payments: any[];
  defaultBankName?: string;
  defaultBankLast4?: string;
  liveRate: number;
}

export function ConversionHistoryCard({
  payments = [],
  defaultBankName = 'Bank',
  defaultBankLast4 = '',
  liveRate = 1580.45,
}: ConversionHistoryCardProps) {
  const { isPrivacyMode } = usePrivacyStore();

  const completedPayments = payments.filter(
    (p) => p.status === 'COMPLETED' || p.status === 'PAID'
  );

  const displayItems = completedPayments.slice(0, 4).map((p) => {
    const usd = parseFloat(p.amount) || 0;
    const ngn = usd * (p.fxRate || liveRate);
    return {
      id: p.id,
      fromAmount: `${usd.toFixed(2)} USDT → NGN`,
      toAmount: formatCurrency(ngn, 'NGN'),
      bank: defaultBankName ? `${defaultBankName} ${defaultBankLast4 ? `••••${defaultBankLast4}` : ''}` : 'Local Bank',
      date: formatDate(p.createdAt || new Date()),
    };
  });

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-body-md sm:text-body-lg font-bold text-foreground">
        Conversion history
      </h3>

      {displayItems.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <TrendingUpIcon className="h-5 w-5" />
          </div>
          <p className="text-body-xs font-semibold text-foreground">No conversions yet</p>
          <p className="text-[11px] max-w-xs">
            When you convert USDT to Naira and withdraw to your bank account, your conversion receipts will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border/60">
          {displayItems.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-body-xs font-semibold text-foreground">
                  {isPrivacyMode ? '••••••' : item.fromAmount}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-[#0b3d2e] dark:text-brand-emerald border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0b3d2e] dark:bg-brand-emerald" />
                  Settled
                </span>
              </div>
              <div className="text-body-md font-bold text-foreground tracking-tight">
                {isPrivacyMode ? '••••••' : item.toAmount}
              </div>
              <div className="text-caption text-muted-foreground">
                {item.bank} · {item.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
