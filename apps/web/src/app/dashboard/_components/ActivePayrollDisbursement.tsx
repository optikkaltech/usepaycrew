'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BanknoteIcon,
  CreditCardIcon,
  InfoIcon,
  MoreHorizontalIcon,
  SparklesIcon,
  UsersIcon,
} from '@/assets';

interface ExpenseItem {
  name: string;
  amount: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  dotColor: string;
}

interface ActivePayrollDisbursementProps {
  totalDisbursedUsd?: number;
}

export function ActivePayrollDisbursement({ totalDisbursedUsd }: ActivePayrollDisbursementProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // If real total exists, scale proportionally, else use exact original numbers
  const hasRealData = totalDisbursedUsd && totalDisbursedUsd > 0;
  const base = hasRealData ? totalDisbursedUsd : 15300;

  const expenseItems: ExpenseItem[] = [
    {
      name: 'Engineering',
      amount: hasRealData ? `$${(base * 0.51).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$7,850.00',
      change: '+12.4%',
      isPositive: true,
      icon: UsersIcon,
      dotColor: 'bg-[#0b3d2e] dark:bg-brand-emerald',
    },
    {
      name: 'Design & UX',
      amount: hasRealData ? `$${(base * 0.21).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$3,200.00',
      change: '+5.2%',
      isPositive: true,
      icon: SparklesIcon,
      dotColor: 'bg-indigo-400',
    },
    {
      name: 'Ops & Support',
      amount: hasRealData ? `$${(base * 0.16).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$2,450.00',
      change: '+8.1%',
      isPositive: true,
      icon: BanknoteIcon,
      dotColor: 'bg-cyan-400',
    },
    {
      name: 'Marketing',
      amount: hasRealData ? `$${(base * 0.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$1,800.00',
      change: '+3.5%',
      isPositive: true,
      icon: CreditCardIcon,
      dotColor: 'bg-amber-400',
    },
  ];

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5 text-label-sm font-semibold text-gray-900 dark:text-white">
          <span>Active Payroll Disbursement</span>
          <span title="Disbursement breakdown across departments">
            <InfoIcon className="h-3 w-3 text-gray-400 dark:text-[#6b7280] cursor-help" />
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Options"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg text-body-xs">
              <Link
                href="/dashboard/payroll"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center px-3 py-1.5 rounded-lg hover:bg-secondary text-foreground font-medium"
              >
                New batch run
              </Link>
              <Link
                href="/dashboard/workers"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center px-3 py-1.5 rounded-lg hover:bg-secondary text-foreground font-medium"
              >
                Manage contractors
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {expenseItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href="/dashboard/workers"
              className="rounded-xl border border-black/[0.06] bg-white shadow-xs dark:border-white/[0.04] dark:bg-[#121317] p-3 transition-all hover:border-black/[0.12] dark:hover:border-white/[0.08] hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.dotColor}`} />
                  <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-[#9ca3af] shrink-0" />
                  <span className="text-[11px] text-gray-600 dark:text-[#8a8f98] truncate font-medium">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold shrink-0 ${
                    item.isPositive ? 'text-[#0b3d2e] dark:text-brand-emerald' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {item.isPositive ? '↑' : '↓'} {item.change}
                </span>
              </div>
              <div className="mt-2 text-label-md sm:text-label-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {item.amount}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
