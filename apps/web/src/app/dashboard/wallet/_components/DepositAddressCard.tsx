'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  AppStrings,
  CopyIcon,
  CheckIcon,
  PlusIcon,
} from '@/assets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks';

interface WalletEntity {
  id: string;
  currency: string;
  network: string;
  address: string;
  qrCode?: string | null;
}

interface DepositAddressCardProps {
  wallets: WalletEntity[];
  selectedWalletId: string | null;
  onSelectWallet: (id: string) => void;
  onOpenGenerateModal: () => void;
}

export function DepositAddressCard({
  wallets,
  selectedWalletId,
  onSelectWallet,
  onOpenGenerateModal,
}: DepositAddressCardProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const activeWallet =
    wallets.find((w) => w.id === selectedWalletId) ||
    wallets[0] ||
    null;

  const handleCopy = () => {
    if (!activeWallet?.address) return;
    navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(AppStrings.wallet.addressCopied);
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 p-6 border-border h-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-display-xs text-foreground font-bold">
              {AppStrings.wallet.depositAddress}
            </h3>
            <p className="mt-1 text-body-xs text-muted-foreground">
              {AppStrings.wallet.depositAddressSubtitle}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenGenerateModal}
            className="h-8 px-2.5 text-caption font-semibold shrink-0"
            title="Generate address for another network"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add Network
          </Button>
        </div>

        {/* Network & Address Switcher Dropdown */}
        {wallets.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Select Generated Address ({wallets.length})
            </label>
            <select
              value={activeWallet?.id || ''}
              onChange={(e) => onSelectWallet(e.target.value)}
              className="min-h-[42px] w-full rounded-xl border border-border bg-card dark:bg-[#121316] text-foreground px-3.5 py-2 text-body-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 cursor-pointer shadow-xs"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id} className="bg-card dark:bg-[#121316] text-foreground py-1.5">
                  {w.currency} on {w.network} — {w.address.slice(0, 8)}...{w.address.slice(-6)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* QR Code Container */}
      <div className="flex items-center justify-center p-5 rounded-2xl bg-secondary/40 border border-border">
        {activeWallet?.qrCode ? (
          <div className="relative h-44 w-44 rounded-xl overflow-hidden bg-white p-2 shadow-sm">
            <Image
              src={activeWallet.qrCode}
              alt={`${activeWallet.network} Deposit QR Code`}
              width={176}
              height={176}
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-44 w-44 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground text-center p-4">
            <span className="text-caption">No address generated yet. Click &quot;Add Network&quot; above.</span>
          </div>
        )}
      </div>

      {/* Address & Copy Action */}
      <div className="flex flex-col gap-2.5">
        <span className="text-caption text-muted-foreground font-medium">
          {activeWallet?.currency || 'USDT'} Deposit Address ({activeWallet?.network || 'TRON'})
        </span>
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-secondary/60 border border-border">
          <span className="font-mono text-body-xs font-semibold text-foreground truncate select-all">
            {activeWallet?.address || 'No address available'}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!activeWallet?.address}
            className="h-8 px-2.5 shrink-0"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-success" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Network Info */}
        <div className="flex items-center justify-between text-body-xs pt-1">
          <span className="text-muted-foreground">{AppStrings.wallet.network}</span>
          <span className="font-semibold text-foreground px-2 py-0.5 rounded-md bg-secondary border border-border">
            {activeWallet?.network || 'None'}
          </span>
        </div>
      </div>
    </Card>
  );
}
