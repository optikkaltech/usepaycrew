'use client';

import { useState } from 'react';
import { BuildingIcon, ZapIcon, WalletIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ExistingPayoutSelector, ExistingPayoutMethodItem } from './ExistingPayoutSelector';
import { NewBankForm, BankFormData } from './NewBankForm';

interface BankStepProps {
  workerId: string;
  existingPayoutMethods?: ExistingPayoutMethodItem[];
  onComplete: (autoCashout: boolean, bankData?: BankFormData, existingMethodId?: string) => Promise<void>;
  isLoading: boolean;
}

export function BankStep({
  workerId: _workerId,
  existingPayoutMethods = [],
  onComplete,
  isLoading,
}: BankStepProps) {
  const hasExisting = existingPayoutMethods.length > 0;
  const [autoCashout, setAutoCashout] = useState(true);
  const [showNewForm, setShowNewForm] = useState(!hasExisting);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    existingPayoutMethods[0]?.id || null
  );

  const handleLinkExisting = async () => {
    if (!selectedMethodId) return;
    await onComplete(autoCashout, undefined, selectedMethodId);
  };

  const handleNewBankSubmit = async (bankData: BankFormData) => {
    await onComplete(autoCashout, bankData);
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BuildingIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-display-xs font-bold text-foreground">Payout Preference &amp; Bank</h2>
          <p className="text-body-xs text-muted-foreground">
            Configure how you wish to receive wage disbursements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAutoCashout(true)}
          className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
            autoCashout
              ? 'border-primary bg-primary/5 shadow-brand font-semibold text-foreground'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ZapIcon className="h-4 w-4 text-brand-emerald" />
            <span className="text-label-md">Auto Cashout (Naira)</span>
          </div>
          <span className="text-caption text-muted-foreground">
            Automatically convert USDT at live OTC rates and transfer directly to your Naira bank account on payday.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAutoCashout(false)}
          className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
            !autoCashout
              ? 'border-primary bg-primary/5 shadow-brand font-semibold text-foreground'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <WalletIcon className="h-4 w-4 text-primary" />
            <span className="text-label-md">Hold USDT in Wallet</span>
          </div>
          <span className="text-caption text-muted-foreground">
            Keep your salary denominated in stablecoins (USDT). Convert to Naira or withdraw on-chain at your own timing.
          </span>
        </button>
      </div>

      <div className="pt-2 border-t border-border">
        {hasExisting && !showNewForm ? (
          <div className="flex flex-col gap-4">
            <ExistingPayoutSelector
              methods={existingPayoutMethods}
              selectedId={selectedMethodId}
              onSelect={setSelectedMethodId}
              onAddNew={() => setShowNewForm(true)}
            />
            <Button
              type="button"
              disabled={!selectedMethodId}
              isLoading={isLoading}
              onClick={handleLinkExisting}
              className="mt-2 w-full min-h-[44px]"
            >
              Use Selected Payout Method &amp; Finish
            </Button>
          </div>
        ) : (
          <NewBankForm
            onSubmit={handleNewBankSubmit}
            onCancel={hasExisting ? () => setShowNewForm(false) : undefined}
            isLoading={isLoading}
          />
        )}
      </div>
    </Card>
  );
}
