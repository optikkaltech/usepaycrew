'use client';

import Link from 'next/link';
import clsx from 'clsx';
import {
  AppStrings,
  LogOutIcon,
  XIcon,
  ShieldIcon,
} from '@/assets';
import { DASHBOARD_NAV_ITEMS } from './sidebar.constants';

interface DashboardMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  onLogout: () => void;
  user?: any;
}

export function DashboardMobileDrawer({
  isOpen,
  onClose,
  pathname,
  onLogout,
  user,
}: DashboardMobileDrawerProps) {
  if (!isOpen) return null;

  const adminName = user?.fullName || (user?.email ? user.email.split('@')[0] : 'Admin');
  const avatarLetter = (user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
    : adminName.charAt(0)
  ).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl p-5 lg:hidden animate-in fade-in select-none">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-emerald text-black font-black text-caption shadow-[0_0_12px_rgba(6,214,160,0.4)]">
            P
          </div>
          <span className="text-display-sm font-bold text-foreground">{AppStrings.appName}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-2 overflow-y-auto flex-1">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-colors min-h-[44px]',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className={clsx('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user?.role === 'PLATFORM_ADMIN' && (
          <Link
            href="/admin"
            onClick={onClose}
            className={clsx(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-colors min-h-[44px] border border-brand-emerald/30',
              pathname.startsWith('/admin')
                ? 'bg-brand-emerald/15 text-brand-emerald font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <ShieldIcon className="h-5 w-5 text-brand-emerald" />
            <span>Platform Admin</span>
          </Link>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-foreground font-bold text-caption">
            {avatarLetter}
          </div>
          <div className="overflow-hidden">
            <p className="text-label-sm font-semibold text-foreground truncate">{adminName}</p>
            <p className="text-caption text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-label-md text-destructive hover:bg-destructive/10 min-h-[44px] cursor-pointer"
        >
          <LogOutIcon className="h-4 w-4" />
          <span>{AppStrings.navigation.logout}</span>
        </button>
      </div>
    </div>
  );
}
