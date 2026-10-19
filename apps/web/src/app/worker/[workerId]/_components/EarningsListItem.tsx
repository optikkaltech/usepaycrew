'use client';

import clsx from 'clsx';
import { ArrowUpRightIcon } from '@/assets';

export interface EarningsItem {
  id: string;
  title: string;
  employer: string;
  date: string;
  status: 'settled' | 'holding';
  isAutoConverted: boolean;
  qdAmount: string;
  ngnAmount: string;
  rateText: string;
}

interface EarningsListItemProps {
  item: EarningsItem;
  employerInitials: string;
}

export function EarningsListItem({ item, employerInitials }: EarningsListItemProps) {
  return (
    <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-12 w-12 rounded-full bg-[#008774] text-white font-bold text-body-sm flex items-center justify-center shrink-0">
          {employerInitials}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-body-sm font-bold text-foreground truncate">
            {item.title}
          </span>
          <span className="text-caption text-muted-foreground">
            {item.employer} · {item.date}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                item.status === 'settled'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              )}
            >
              <span
                className={clsx(
                  'h-1.5 w-1.5 rounded-full',
                  item.status === 'settled' ? 'bg-emerald-500' : 'bg-blue-500'
                )}
              />
              {item.status === 'settled' ? 'Settled' : 'Sent'}
            </span>

            {item.isAutoConverted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#008774] text-white">
                <ArrowUpRightIcon className="h-3 w-3" />
                Auto-converted
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-muted-foreground">
                Held in QDASH
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-body-sm sm:text-body-md font-bold text-[#008774] dark:text-emerald-400 tracking-tight">
          {item.qdAmount}
        </span>
        <span className="text-caption font-semibold text-muted-foreground mt-0.5">
          {item.ngnAmount}
        </span>
        <span className="text-caption text-muted-foreground mt-0.5">
          {item.rateText}
        </span>
      </div>
    </div>
  );
}
