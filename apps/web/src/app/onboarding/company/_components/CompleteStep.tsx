'use client';

import { useState } from 'react';
import { AppStrings, CheckCircleIcon, WalletIcon, CopyIcon, CheckIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CompleteStepProps {
  company: any;
  onGoToDashboard: () => void;
}

export function CompleteStep({ company, onGoToDashboard }: CompleteStepProps) {
  const [copied, setCopied] = useState(false);
  const depositAddress = company?.depositWalletAddress;

  const copyAddress = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
        <CheckCircleIcon className="h-8 w-8" />
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{AppStrings.onboarding.stepComplete}</h2>
        <p className="mt-1 text-body-xs text-muted-foreground">
          {company?.name || 'Your company'} is fully verified and ready for automated payroll disbursements.
        </p>
      </div>

      <div className="flex flex-col gap-3 text-left">
        <div className="rounded-xl border border-border bg-secondary/50 p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-brand-emerald">
              <WalletIcon className="h-4 w-4" />
              <span className="text-label-md font-bold text-foreground">Multi-Chain Stablecoin Deposit</span>
            </div>
            {depositAddress && (
              <button
                type="button"
                onClick={copyAddress}
                className="flex items-center gap-1 text-caption text-primary hover:underline font-medium cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3 w-3 text-success" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-body-xs text-muted-foreground">
            Supports TRON (TRC20), Polygon, Base, Ethereum &amp; Solana
          </p>
          {depositAddress ? (
            <p className="text-label-sm font-mono truncate text-foreground mt-2 bg-card/80 p-2.5 rounded-lg border border-border select-all">
              {depositAddress}
            </p>
          ) : (
            <p className="text-body-xs text-muted-foreground mt-2 bg-card/80 p-2.5 rounded-lg border border-border">
              Ready to fund via card or crypto deposit address from your dashboard treasury.
            </p>
          )}
        </div>
      </div>

      <Button onClick={onGoToDashboard} className="w-full min-h-[44px]">
        Launch Company Dashboard
      </Button>
    </Card>
  );
}
