'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  BanknoteIcon,
  FileCheckIcon,
  HomeIcon,
  ShieldCheckIcon,
  SlidersIcon,
  UsersIcon,
  WalletIcon,
  ShieldIcon,
} from '@/assets';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  exact?: boolean;
}

const menuItems: SidebarItem[] = [
  { icon: HomeIcon, label: 'Overview', href: '/dashboard', exact: true },
  { icon: UsersIcon, label: 'Contractors', href: '/dashboard/workers' },
  { icon: BanknoteIcon, label: 'Payroll Runs', href: '/dashboard/payroll' },
  { icon: WalletIcon, label: 'Treasury', href: '/dashboard/wallet' },
  { icon: FileCheckIcon, label: 'Contracts & KYB', href: '/dashboard/settings' },
  { icon: ShieldCheckIcon, label: 'Approvals', href: '/dashboard/payroll' },
  { icon: SlidersIcon, label: 'Settings', href: '/dashboard/settings' },
];

interface DashboardSidebarProps {
  user?: any;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-44 xl:w-48 flex-col border-r border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c0d10] p-3 transition-colors duration-200 select-none shrink-0 justify-between">
      <div>
        <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#6b7280]">
          Menu
        </div>
        <nav className="mt-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-label-sm transition-colors cursor-pointer',
                  isActive
                    ? 'bg-black/[0.06] dark:bg-white/[0.08] font-semibold text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 hover:bg-black/[0.03] hover:text-gray-900 dark:text-[#8a8f98] dark:hover:bg-white/[0.04] dark:hover:text-white'
                )}
              >
                <Icon className={clsx('h-3.5 w-3.5 shrink-0', isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#9ca3af]')} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          {user?.role === 'PLATFORM_ADMIN' && (
            <Link
              href="/admin"
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-label-sm transition-colors mt-2 border border-brand-emerald/30',
                pathname.startsWith('/admin')
                  ? 'bg-brand-emerald/10 text-brand-emerald font-semibold'
                  : 'text-brand-emerald hover:bg-brand-emerald/10'
              )}
            >
              <ShieldIcon className="h-3.5 w-3.5 shrink-0" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Subtle user pill footer */}
      {user && (
        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] px-1 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold text-[10px] shrink-0">
            {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
              {user.fullName || user.email?.split('@')[0]}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-[#6b7280] truncate">
              {user.companyName || 'Verified Corp'}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
