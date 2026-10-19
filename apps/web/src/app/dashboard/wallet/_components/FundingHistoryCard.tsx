'use client';

import {
  AppStrings,
  DownloadIcon,
} from '@/assets';
import { Card } from '@/components/ui/Card';

interface FundingItem {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: string;
}

interface FundingHistoryCardProps {
  entries?: any[];
}

export function FundingHistoryCard({ entries = [] }: FundingHistoryCardProps) {
  const displayItems: FundingItem[] = entries.map((e) => ({
    id: e.id,
    title: `Deposit via ${e.currency || 'USDT'} (${e.reference || 'Network'})`,
    date: new Date(e.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    amount: `+${parseFloat(e.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: 'Confirmed',
  }));

  return (
    <Card variant="elevated" className="flex flex-col gap-5 p-6 border-border h-full justify-between">
      <div>
        <h3 className="text-display-xs text-foreground font-bold">
          {AppStrings.wallet.fundingHistory}
        </h3>
        <p className="mt-1 text-body-xs text-muted-foreground">
          Recent blockchain treasury deposits
        </p>
      </div>

      {displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-secondary/30 border border-dashed border-border flex-1 my-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3 border border-border">
            <DownloadIcon className="h-6 w-6" />
          </div>
          <p className="text-label-md font-semibold text-foreground">
            {AppStrings.wallet.noHistory}
          </p>
          <p className="text-body-xs text-muted-foreground mt-1 max-w-xs">
            {AppStrings.wallet.noHistorySubtitle}
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border overflow-y-auto max-h-[360px]">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald/15 text-brand-emerald shrink-0">
                  <DownloadIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-label-md font-semibold text-foreground">{item.title}</p>
                  <p className="text-caption text-muted-foreground mt-0.5">{item.date}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-label-md font-extrabold text-brand-emerald font-mono">
                  {item.amount}
                </span>
                <span className="text-[11px] font-semibold text-brand-emerald px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
