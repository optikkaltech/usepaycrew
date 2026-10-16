'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  AppStrings,
  LogOutIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/assets';
import { MaskedField } from '@/components/ui/MaskedField';
import { DASHBOARD_NAV_ITEMS } from './sidebar.constants';

interface DashboardSidebarProps {
  user: any;
  logout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

export function DashboardSidebar({
  user,
  logout,
  isDark,
  toggleTheme,
  mounted,
  isPrivacyMode,
  togglePrivacyMode,
}: DashboardSidebarProps) {
  const pathname = usePathname();

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
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card/70 lg:backdrop-blur-md lg:px-4 lg:py-6 transition-colors duration-200 justify-between select-none">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Controls */}
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-emerald to-[#03b888] text-black font-black text-caption shadow-[0_0_14px_rgba(6,214,160,0.3)] transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-display-xs font-bold text-foreground tracking-tight">
              {AppStrings.appName}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                title="Toggle Theme"
              >
                {isDark ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={togglePrivacyMode}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
              title={isPrivacyMode ? 'Privacy Mode Active' : 'Enable Privacy Mode'}
            >
              {isPrivacyMode ? <EyeOffIcon className="h-3.5 w-3.5 text-brand-emerald" /> : <EyeIcon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Clean Menu Items */}
        <nav className="flex flex-col gap-1.5">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-label-sm transition-all min-h-[42px] border-0 outline-none',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <Icon className={clsx('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Logout */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-foreground font-bold text-caption shadow-xs">
              {avatarLetter}
            </div>
            <div className="overflow-hidden">
              <p className="text-label-sm text-foreground font-semibold truncate leading-none">
                {adminName}
              </p>
              <div className="mt-1">
                <MaskedField
                  value={user?.email || ''}
                  maskedValue={user?.maskedEmail}
                  type="email"
                  allowReveal
                  allowCopy
                  className="text-muted-foreground text-[11px]"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
            title={AppStrings.navigation.logout}
          >
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
