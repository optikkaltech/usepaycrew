'use client';

import clsx from 'clsx';
import {
  LayersIcon,
  BanknoteIcon,
  WalletIcon,
  TrendingUpIcon,
  CreditCardIcon,
  SlidersIcon,
  XIcon,
} from '@/assets';
import { ContractorTab } from './contractor.types';

interface ContractorSidebarProps {
  activeTab: ContractorTab;
  onTabChange: (tab: ContractorTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: Array<{ id: ContractorTab; label: string; icon: any }> = [
  { id: 'overview', label: 'Overview', icon: LayersIcon },
  { id: 'earnings', label: 'Earnings', icon: BanknoteIcon },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  { id: 'convert', label: 'Convert & Withdraw', icon: TrendingUpIcon },
  { id: 'banks', label: 'Bank Accounts', icon: CreditCardIcon },
  { id: 'settings', label: 'Settings', icon: SlidersIcon },
];

export function ContractorSidebar({
  activeTab,
  onTabChange,
  isOpen = false,
  onClose,
}: ContractorSidebarProps) {
  const content = (
    <div className="flex flex-col h-full p-4 sm:p-5">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Contractor
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (onClose) onClose();
              }}
              className={clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-xs sm:text-body-sm font-medium transition-all text-left cursor-pointer min-h-[44px]',
                isActive
                  ? 'bg-[#008774]/10 text-[#008774] dark:bg-[#008774]/20 dark:text-emerald-400 border border-[#008774]/30 font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              <Icon
                className={clsx(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-[#008774] dark:text-emerald-400' : 'text-muted-foreground'
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex w-60 xl:w-64 flex-col border-r border-border bg-card/40 shrink-0 sticky top-0 h-screen">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-card border-r border-border shadow-xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
