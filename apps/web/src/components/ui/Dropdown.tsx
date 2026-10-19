'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@/assets';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger?: React.ReactNode;
  label?: string;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  label = 'Actions',
  items,
  align = 'right',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={clsx('relative inline-block text-left', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-label-sm font-medium text-foreground hover:bg-secondary cursor-pointer min-h-[40px] shadow-xs"
          >
            <span>{label}</span>
            <ChevronDownIcon className={clsx('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={clsx(
            'absolute z-50 mt-1.5 min-w-[180px] rounded-xl border border-border bg-card p-1 shadow-md animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={clsx(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label-sm transition-colors text-left cursor-pointer min-h-[36px]',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                  item.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-foreground hover:bg-secondary',
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
