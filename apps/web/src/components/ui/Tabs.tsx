'use client';

import React, { useRef } from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
  fullWidth?: boolean;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
  fullWidth = false,
}: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    onChange(nextTab.id);
    const realIndex = tabs.findIndex((t) => t.id === nextTab.id);
    tabRefs.current[realIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Navigation tabs"
      className={clsx(
        fullWidth
          ? 'grid grid-flow-col auto-cols-fr w-full overflow-hidden'
          : 'flex items-center overflow-x-auto scrollbar-none',
        variant === 'pills' &&
          'p-1.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#141519] border border-black/[0.08] dark:border-white/[0.08] shadow-xs gap-1.5',
        variant === 'underline' && 'border-b border-black/[0.08] dark:border-white/[0.08] gap-2',
        className,
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[idx] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-body-xs sm:text-label-sm font-semibold transition-all duration-150 cursor-pointer select-none',
              'outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl',
              tab.disabled && 'opacity-40 cursor-not-allowed',
              variant === 'pills' &&
                (isActive
                  ? 'bg-white dark:bg-[#1e2025] text-foreground font-semibold shadow-xs border-0'
                  : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border-0'),
              variant === 'underline' &&
                (isActive
                  ? 'text-foreground font-semibold border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'),
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0 text-current" />}
            <span className="truncate">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'bg-secondary/80 text-muted-foreground',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
