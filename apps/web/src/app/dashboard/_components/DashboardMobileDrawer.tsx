'use client';

import Link from 'next/link';
import clsx from 'clsx';
import {
  BanknoteIcon,
  FileCheckIcon,
  HomeIcon,
  LogOutIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SlidersIcon,
  UsersIcon,
  WalletIcon,
  XIcon,
} from '@/assets';

interface DashboardMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  onLogout: () => void;
  user?: any;
}

const mobileNavItems = [
  { icon: HomeIcon, label: 'Overview', href: '/dashboard', exact: true },
  { icon: UsersIcon, label: 'Contractors', href: '/dashboard/workers' },
  { icon: BanknoteIcon, label: 'Payroll Runs', href: '/dashboard/payroll' },
  { icon: WalletIcon, label: 'Treasury', href: '/dashboard/wallet' },
  { icon: FileCheckIcon, label: 'Contracts & KYB', href: '/dashboard/settings' },
  { icon: ShieldCheckIcon, label: 'Approvals', href: '/dashboard/payroll' },
  { icon: SlidersIcon, label: 'Settings', href: '/dashboard/settings' },
];

export function DashboardMobileDrawer({
  isOpen,
  onClose,
  pathname,
  onLogout,
  user,
}: DashboardMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl p-5 lg:hidden animate-in fade-in select-none">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b3d2e] text-white dark:bg-brand-emerald dark:text-black font-black text-[11px] shadow-sm">
            P
          </div>
          <span className="text-label-sm font-bold text-[#0b3d2e] dark:text-white tracking-tight">
            PayCrew
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-5 flex flex-col gap-1.5 overflow-y-auto flex-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-body-sm transition-all',
                isActive
                  ? 'bg-black/[0.06] dark:bg-white/[0.08] font-bold text-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              )}
            >
              <Icon className={clsx('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user?.role === 'PLATFORM_ADMIN' && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-body-sm text-brand-emerald border border-brand-emerald/30 mt-2"
          >
            <ShieldIcon className="h-4 w-4" />
            <span>Admin Console</span>
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-border mt-auto">
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-body-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOutIcon className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
