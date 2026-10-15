'use client';

import {
  BanknoteIcon,
  FileCheckIcon,
  HomeIcon,
  ShieldCheckIcon,
  SlidersIcon,
  UsersIcon,
  WalletIcon,
} from '@/assets';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const menuItems: SidebarItem[] = [
  { icon: HomeIcon, label: 'Overview', active: true },
  { icon: UsersIcon, label: 'Contractors' },
  { icon: BanknoteIcon, label: 'Payroll Runs' },
  { icon: WalletIcon, label: 'Treasury' },
  { icon: FileCheckIcon, label: 'Contracts & KYB' },
  { icon: ShieldCheckIcon, label: 'Approvals' },
  { icon: SlidersIcon, label: 'Settings' },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex w-44 flex-col border-r border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c0d10] p-3 transition-colors duration-200">
      <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#6b7280]">
        Menu
      </div>
      <nav className="mt-1 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-label-sm transition-colors cursor-pointer ${
                item.active
                  ? 'bg-black/[0.06] dark:bg-white/[0.08] font-semibold text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 hover:bg-black/[0.03] hover:text-gray-900 dark:text-[#8a8f98] dark:hover:bg-white/[0.04] dark:hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
