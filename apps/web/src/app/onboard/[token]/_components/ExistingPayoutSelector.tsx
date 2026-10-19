'use client';

import { BuildingIcon, WalletIcon, CheckCircleIcon, PlusIcon } from '@/assets';
import { PayoutMethodType } from '@paycrew/shared-types';

export interface ExistingPayoutMethodItem {
  id: string;
  type: PayoutMethodType;
  bankName?: string;
  accountName?: string;
  accountReference?: string;
  network?: string;
  isDefault?: boolean;
}

interface ExistingPayoutSelectorProps {
  methods: ExistingPayoutMethodItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

export function ExistingPayoutSelector({
  methods,
  selectedId,
  onSelect,
  onAddNew,
}: ExistingPayoutSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-label-md font-semibold text-foreground">
          Saved Payout Methods
        </label>
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-1.5 text-caption font-semibold text-primary hover:underline cursor-pointer"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span>Add new account</span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {methods.map((method) => {
          const isSelected = selectedId === method.id;
          const isBank = method.type === PayoutMethodType.BANK_ACCOUNT;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-brand text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isBank ? <BuildingIcon className="h-4 w-4" /> : <WalletIcon className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-label-md font-bold text-foreground">
                      {isBank ? method.bankName || 'Bank Account' : `${method.network || 'USDT'} Wallet`}
                    </span>
                    {method.isDefault && (
                      <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-brand-emerald">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-body-xs text-muted-foreground font-mono">
                    {method.accountName} {method.accountReference ? `• ${method.accountReference}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-brand-emerald text-caption font-semibold">
                <CheckCircleIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Verified</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
