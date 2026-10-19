'use client';

import { formatCurrency, formatDate } from '@/utils';

interface ConversionHistoryCardProps {
  payments: any[];
  defaultBankName?: string;
  defaultBankLast4?: string;
  liveRate: number;
}

export function ConversionHistoryCard({
  payments = [],
  defaultBankName = 'GTBank',
  defaultBankLast4 = '6789',
  liveRate = 1580.45,
}: ConversionHistoryCardProps) {
  // Use settled payments or demo items matching the UI specification
  const completedPayments = payments.filter(
    (p) => p.status === 'COMPLETED' || p.status === 'PAID'
  );

  const displayItems =
    completedPayments.length > 0
      ? completedPayments.slice(0, 4).map((p) => {
          const usd = parseFloat(p.amount) || 0;
          const ngn = usd * (p.fxRate || liveRate);
          return {
            id: p.id,
            fromAmount: `${usd.toFixed(2)} QD`,
            toAmount: formatCurrency(ngn, 'NGN'),
            bank: `${defaultBankName} ••••${defaultBankLast4}`,
            date: formatDate(p.createdAt || new Date()),
          };
        })
      : [
          {
            id: 'mock-1',
            fromAmount: '800.00 QD → NGN',
            toAmount: '₦1,264,360.00',
            bank: `${defaultBankName} ••••${defaultBankLast4}`,
            date: '2 Oct, 14:30',
          },
          {
            id: 'mock-2',
            fromAmount: '369.99 QD → NGN',
            toAmount: '₦584,752.00',
            bank: `${defaultBankName} ••••${defaultBankLast4}`,
            date: '30 Sept, 09:18',
          },
        ];

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-body-md sm:text-body-lg font-bold text-foreground">
        Conversion history
      </h3>

      <div className="flex flex-col divide-y divide-border/60">
        {displayItems.map((item) => (
          <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-semibold text-foreground">
                {item.fromAmount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Settled
              </span>
            </div>
            <div className="text-body-md font-bold text-foreground tracking-tight">
              {item.toAmount}
            </div>
            <div className="text-caption text-muted-foreground">
              {item.bank} · {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
