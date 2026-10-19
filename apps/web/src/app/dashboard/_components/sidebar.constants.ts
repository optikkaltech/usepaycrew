import {
  AppStrings,
  LayersIcon,
  UsersIcon,
  CalendarIcon,
  WalletIcon,
  SlidersIcon,
} from '@/assets';

export interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: AppStrings.navigation.dashboard, icon: LayersIcon, exact: true },
  { href: '/dashboard/workers', label: AppStrings.navigation.workers, icon: UsersIcon },
  { href: '/dashboard/payroll', label: AppStrings.navigation.payroll, icon: CalendarIcon },
  { href: '/dashboard/wallet', label: AppStrings.navigation.wallet, icon: WalletIcon },
  { href: '/dashboard/settings', label: AppStrings.navigation.settings, icon: SlidersIcon },
];
