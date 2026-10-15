'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { AppStrings, LogOutIcon, XIcon } from '@/assets';

interface DashboardMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: Array<{ href: string; label: string; icon: any }>;
  onLogout: () => void;
}

export function DashboardMobileDrawer({
  isOpen,
  onClose,
  pathname,
  navItems,
  onLogout,
}: DashboardMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background p-6 lg:hidden animate-in fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <span className="text-display-sm font-bold text-foreground">{AppStrings.appName}</span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-label-lg transition-colors min-h-[44px]',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-brand'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-label-lg text-destructive hover:bg-destructive/10 min-h-[44px] cursor-pointer"
        >
          <LogOutIcon className="h-5 w-5" />
          <span>{AppStrings.navigation.logout}</span>
        </button>
      </div>
    </div>
  );
}
