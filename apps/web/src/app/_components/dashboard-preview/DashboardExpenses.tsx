'use client';

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

const expenseItems: ExpenseItem[] = [
  {
    name: 'Engineering',
    amount: '$7,850.00',
    change: '+12.4%',
    isPositive: true,
    icon: UsersIcon,
    dotColor: 'bg-brand-emerald',
  },
  {
    name: 'Design & UX',
    amount: '$3,200.00',
    change: '+5.2%',
    isPositive: true,
    icon: SparklesIcon,
    dotColor: 'bg-indigo-400',
  },
  {
    name: 'Ops & Support',
    amount: '$2,450.00',
    change: '+8.1%',
    isPositive: true,
    icon: BanknoteIcon,
    dotColor: 'bg-cyan-400',
  },
  {
    name: 'Marketing',
    amount: '$1,800.00',
    change: '+3.5%',
    isPositive: true,
    icon: CreditCardIcon,
    dotColor: 'bg-amber-400',
  },
];

export function DashboardExpenses() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5 text-label-sm font-semibold text-gray-900 dark:text-white">
          <span>Active Payroll Disbursement</span>
          <InfoIcon className="h-3 w-3 text-gray-400 dark:text-[#6b7280]" />
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-900 dark:text-[#6b7280] dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Options"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {expenseItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="rounded-xl border border-black/[0.06] bg-white shadow-xs dark:border-white/[0.04] dark:bg-[#121317] p-3 transition-all hover:border-black/[0.12] dark:hover:border-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
                  <Icon className="h-3.5 w-3.5 text-gray-500 dark:text-[#9ca3af]" />
                  <span className="text-[11px] text-gray-600 dark:text-[#8a8f98] truncate font-medium">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    item.isPositive ? 'text-emerald-700 dark:text-brand-emerald' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {item.isPositive ? '↑' : '↓'} {item.change}
                </span>
              </div>
              <div className="mt-2 text-label-md sm:text-label-lg font-bold text-gray-900 dark:text-white">
                {item.amount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
