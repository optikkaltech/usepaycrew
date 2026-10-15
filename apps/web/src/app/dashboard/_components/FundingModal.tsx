'use client';

import { useState } from 'react';
import { AppStrings, CopyIcon, CheckIcon, XIcon, WalletIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundingInfo?: {
    depositWalletAddress?: string | null;
    virtualAccountBank?: string | null;
    virtualAccountNumber?: string | null;
  } | null;
}

export function FundingModal({ isOpen, onClose, fundingInfo }: FundingModalProps) {
  const toast = useToast();
  const [copiedWallet, setCopiedWallet] = useState(false);

  if (!isOpen) return null;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
    toast.success(AppStrings.dashboard.copiedNotice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">{AppStrings.dashboard.fundAccount}</h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {/* Crypto Stablecoin Deposit */}
          <Card className="flex flex-col gap-2 bg-secondary/50">
            <div className="flex items-center gap-2 text-brand-emerald">
              <WalletIcon className="h-5 w-5" />
              <span className="text-label-lg font-bold">{AppStrings.dashboard.stablecoinAddressTitle}</span>
            </div>
            <p className="text-body-xs text-muted-foreground">
              Send USDT / USDC via Polygon, TRON (TRC20), Base, or Ethereum (Quidax Instant Settlement)
            </p>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <div className="overflow-hidden mr-2">
                <p className="text-caption text-muted-foreground">Deposit Address</p>
                {fundingInfo?.depositWalletAddress ? (
                  <p className="text-label-sm font-mono truncate text-foreground">
                    {fundingInfo.depositWalletAddress}
                  </p>
                ) : (
                  <p className="text-body-xs text-muted-foreground mt-1">
                    No deposit address configured yet.
                  </p>
                )}
              </div>

              {fundingInfo?.depositWalletAddress && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyText(fundingInfo.depositWalletAddress!)}
                >
                  {copiedWallet ? <CheckIcon className="h-4 w-4 text-success" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            {AppStrings.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
