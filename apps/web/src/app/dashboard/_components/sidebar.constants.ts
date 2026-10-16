import {
  AppStrings,
  LayersIcon,
  UsersIcon,
  CreditCardIcon,
  BuildingIcon,
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
  { href: '/dashboard/payroll', label: AppStrings.navigation.payroll, icon: CreditCardIcon },
  { href: '/dashboard/settings', label: AppStrings.navigation.settings, icon: BuildingIcon },
];
