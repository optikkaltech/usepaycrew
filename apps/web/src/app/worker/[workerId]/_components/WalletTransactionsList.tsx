'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@/assets';
import { formatCurrency, formatDate } from '@/utils';

interface WalletTransactionsListProps {
  payments: any[];
  liveRate: number;
  defaultBankName?: string;
}

type FilterType = 'all' | 'incoming' | 'outgoing';

export function WalletTransactionsList({
  payments = [],
  liveRate = 1580.45,
  defaultBankName = 'GTBank',
}: WalletTransactionsListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const formatCompact = (val: number) => {
    if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `₦${(val / 1_000).toFixed(2)}K`;
    return formatCurrency(val, 'NGN');
  };

  // Build items from real payments or use mock matching design
  const items = payments.length > 0
    ? payments.map((p) => {
        const isIncoming = p.type !== 'WITHDRAWAL' && p.type !== 'CONVERSION';
        const usd = parseFloat(p.amount) || 0;
        const ngn = usd * (p.fxRate || liveRate);
        return {
          id: p.id,
          type: isIncoming ? ('incoming' as const) : ('outgoing' as const),
          title: isIncoming ? `Salary — ${formatDate(p.createdAt || new Date())}` : `Converted to NGN → ${defaultBankName}`,
          date: formatDate(p.createdAt || new Date()),
          amountText: isIncoming ? `+${usd >= 1000 ? `${(usd / 1000).toFixed(1)}K` : usd.toFixed(2)} QD` : `-${usd.toFixed(2)} QD`,
          nairaText: formatCompact(ngn),
        };
      })
    : [
        {
          id: 'tx-1',
          type: 'incoming' as const,
          title: 'Salary — September 2026',
          date: '30 Sept, 09:12',
          amountText: '+1.2K',
          nairaText: '₦1.85M',
        },
        {
          id: 'tx-2',
          type: 'outgoing' as const,
          title: `Converted to NGN → ${defaultBankName}`,
          date: '2 Oct, 14:30',
          amountText: '-800.00 QD',
          nairaText: '₦1.26M',
        },
        {
          id: 'tx-3',
          type: 'incoming' as const,
          title: 'Salary — August 2026',
          date: '31 Aug, 09:10',
          amountText: '+1.2K',
          nairaText: '₦1.85M',
        },
        {
          id: 'tx-4',
          type: 'outgoing' as const,
          title: 'Auto-convert to NGN',
          date: '30 Sept, 09:18',
          amountText: '-369.99 QD',
          nairaText: '₦584.8K',
        },
      ];

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header with segmented filter buttons */}
      <div className="flex items-center justify-between">
        <h3 className="text-body-md sm:text-display-xs font-bold text-foreground">
          Transactions
        </h3>

        <div className="flex items-center p-1 rounded-xl bg-secondary/50 border border-border/60">
          {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={clsx(
                'px-3.5 py-1.5 rounded-lg text-body-xs font-bold capitalize transition-all cursor-pointer',
                filter === tab
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list container */}
      <div className="bg-card border border-border/80 shadow-xs rounded-2xl divide-y divide-border/60 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-body-xs text-muted-foreground">
            No transactions found for this filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={clsx(
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                    item.type === 'incoming'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {item.type === 'incoming' ? (
                    <ArrowDownLeftIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUpRightIcon className="h-5 w-5" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-body-xs sm:text-body-sm font-bold text-foreground truncate">
                    {item.title}
                  </span>
                  <span className="text-caption text-muted-foreground mt-0.5">
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span
                  className={clsx(
                    'text-body-xs sm:text-body-sm font-bold tracking-tight',
                    item.type === 'incoming'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-foreground'
                  )}
                >
                  {item.amountText}
                </span>
                <span className="text-caption text-muted-foreground mt-0.5">
                  {item.nairaText}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
