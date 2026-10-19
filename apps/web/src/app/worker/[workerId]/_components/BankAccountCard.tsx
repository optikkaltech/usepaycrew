'use client';

import { useState } from 'react';
import { BuildingIcon, MoreHorizontalIcon, CheckIcon } from '@/assets';

interface BankAccountCardProps {
  method: any;
  workerName?: string;
  onSetDefault?: (methodId: string) => void;
  onDelete?: (methodId: string) => void;
}

export function BankAccountCard({
  method,
  workerName = 'Adaeze Okonkwo',
  onSetDefault,
  onDelete,
}: BankAccountCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all hover:shadow-sm">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-[#008774] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-body-md font-bold text-foreground">
              {method.bankName || 'Bank'}
            </h3>
            <span className="text-caption text-muted-foreground">
              {method.accountName || workerName}
            </span>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 w-36 rounded-xl bg-card border border-border shadow-md py-1.5 z-20 flex flex-col text-body-xs">
              {!method.isDefault && onSetDefault && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSetDefault(method.id);
                  }}
                  className="px-3 py-1.5 text-left hover:bg-secondary cursor-pointer font-medium"
                >
                  Set as default
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(method.id);
                  }}
                  className="px-3 py-1.5 text-left hover:bg-secondary text-destructive cursor-pointer font-medium"
                >
                  Remove account
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account Number */}
      <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-wider my-6 font-mono">
        {method.accountReference}
      </div>

      {/* Bottom Status Row */}
      <div className="flex items-center justify-between pt-1">
        {method.isDefault ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#008774] text-white">
            <CheckIcon className="h-3 w-3" />
            Default account
          </span>
        ) : (
          <span className="text-caption font-semibold text-muted-foreground">
            Secondary
          </span>
        )}

        <span className="text-caption font-medium text-muted-foreground">
          Verified
        </span>
      </div>
    </div>
  );
}
