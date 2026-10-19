'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { SearchIcon, ChevronDownIcon, CheckIcon, XIcon } from '@/assets';

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function SearchableSelect({
  label,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  options,
  value,
  onChange,
  disabled = false,
  error,
  className,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => options.find((opt) => opt.value === value), [options, value]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const lower = query.toLowerCase().trim();
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(lower) || (opt.subLabel && opt.subLabel.toLowerCase().includes(lower)),
    );
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={clsx('relative flex w-full flex-col gap-1.5', className)}>
      {label && <label className="text-[12px] font-medium text-foreground/80">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'flex min-h-[44px] w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-left text-body-xs sm:text-body-sm transition-colors duration-150',
          error
            ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive'
            : isOpen
            ? 'border-primary ring-1 ring-primary'
            : 'border-input hover:border-muted-foreground/40',
          disabled && 'cursor-not-allowed opacity-50',
          !selectedOption && 'text-muted-foreground',
          selectedOption && 'text-foreground',
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon
          className={clsx('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {error && <span className="text-caption text-destructive">{error}</span>}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 flex w-full flex-col rounded-lg border border-border bg-card shadow-lg animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Integrated Search Input */}
          <div className="p-2 border-b border-border">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 rounded-md bg-secondary/50 pl-8 pr-7 text-caption text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 text-body-xs">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-caption text-muted-foreground">
                {options.length === 0 ? 'Loading options...' : 'No matches found'}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={clsx(
                      'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-caption transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted/60',
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
