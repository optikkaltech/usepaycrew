'use client';

import { useState } from 'react';
import { CopyIcon, CheckIcon, RefreshCwIcon, ShieldCheckIcon, SparklesIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { CompanyWallet } from '@/services';
import { useToast } from '@/hooks';

interface WalletAddressCardProps {
  wallet?: CompanyWallet;
  asset: string;
  network: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function WalletAddressCard({
  wallet,
  asset,
  network,
  isGenerating,
  onGenerate,
}: WalletAddressCardProps) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!wallet?.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Wallet address copied to clipboard');
  };

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-border bg-secondary/20 text-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <SparklesIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-label-md font-bold text-foreground">No Deposit Address Yet</p>
          <p className="text-caption text-muted-foreground mt-0.5 max-w-xs">
            Generate your dedicated {asset} deposit address on the {network} network to fund your company balance.
          </p>
        </div>
        <Button
          type="button"
          onClick={onGenerate}
          isLoading={isGenerating}
          className="mt-1 min-h-[44px] bg-primary text-primary-foreground font-bold px-6 shadow-brand cursor-pointer"
        >
          {isGenerating ? 'Generating Address...' : `Generate ${asset} Address`}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-xs">
      {/* QR Code + Address Block */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {wallet.qrCode && (
          <div className="shrink-0 p-2 rounded-xl border border-border bg-white shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wallet.qrCode} alt={`${asset} QR Code`} className="h-32 w-32 object-contain" />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full overflow-hidden">
          <div className="flex items-center justify-between text-caption font-semibold text-muted-foreground">
            <span>Deposit Address</span>
            <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded">
              Verified Rails
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-secondary/50 border border-border">
            <span className="font-mono text-body-xs text-foreground break-all select-all">
              {wallet.address}
            </span>
            <button
              type="button"
              onClick={copyAddress}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary cursor-pointer transition-colors"
              title="Copy Address"
            >
              {copied ? <CheckIcon className="h-4 w-4 text-success" /> : <CopyIcon className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-brand-emerald shrink-0" />
            <span>Send only <strong className="text-foreground">{asset}</strong> on <strong className="text-foreground">{network}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
