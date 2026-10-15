import { useState } from 'react';
import { CopyIcon, CheckIcon, RefreshCwIcon, WalletIcon } from '@/assets';
import { useSubscriptionDeposit } from '@/hooks';
import { normalizeError } from '@/utils';

interface BillingCryptoTransferProps {
  amountUsd: number;
  planId: string;
  onConfirm: () => void;
  isLoading: boolean;
}

const NETWORKS = [
  { id: 'TRON', label: 'TRON (TRC20)' },
  { id: 'BEP20', label: 'BNB Chain (BEP20)' },
  { id: 'POLYGON', label: 'Polygon (MATIC)' },
];

export function BillingCryptoTransfer({ amountUsd, planId, onConfirm, isLoading }: BillingCryptoTransferProps) {
  const [network, setNetwork] = useState('TRON');
  const [copied, setCopied] = useState(false);

  const {
    data: depositData,
    isLoading: isFetchingAddress,
    error: fetchError,
  } = useSubscriptionDeposit(planId, network);

  const depositAddress = depositData?.depositAddress || '';
  const error = fetchError ? normalizeError(fetchError).message : null;

  const copyToClipboard = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-label-sm">
          <WalletIcon className="h-4 w-4" />
          <span>Dedicated Quidax USDT Deposit</span>
        </div>
        <span className="text-label-md font-extrabold text-foreground">${amountUsd} USDT</span>
      </div>

      <div>
        <label className="block text-caption font-semibold text-muted-foreground mb-1.5">
          Select Deposit Network
        </label>
        <div className="grid grid-cols-3 gap-2">
          {NETWORKS.map((net) => (
            <button
              key={net.id}
              type="button"
              onClick={() => setNetwork(net.id)}
              className={`py-1.5 px-2 rounded-lg text-caption font-semibold border transition-all text-center cursor-pointer ${
                network === net.id
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {net.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between text-caption text-muted-foreground mb-1">
          <span>Your Dedicated {network} Address</span>
          {depositAddress && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
            >
              {copied ? <CheckIcon className="h-3 w-3 text-success" /> : <CopyIcon className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {isFetchingAddress ? (
          <div className="flex items-center gap-2 py-2 text-caption text-muted-foreground">
            <RefreshCwIcon className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Generating dedicated Quidax address...</span>
          </div>
        ) : error ? (
          <p className="text-caption text-destructive py-1">{error}</p>
        ) : (
          <p className="font-mono text-label-xs text-foreground break-all select-all py-1 bg-secondary/50 px-2 rounded">
            {depositAddress}
          </p>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Transfer exactly <strong className="text-foreground">${amountUsd} USDT</strong> on the{' '}
        <strong className="text-foreground">{network}</strong> network. Deposits are automatically credited via Quidax OTC rails.
      </p>

      <button
        type="button"
        disabled={isLoading || isFetchingAddress || !depositAddress}
        onClick={onConfirm}
        className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-bold text-label-sm hover:opacity-95 transition shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCwIcon className="h-4 w-4 animate-spin" />
            <span>Verifying Transfer...</span>
          </>
        ) : (
          <span>I Have Transferred ${amountUsd} USDT</span>
        )}
      </button>
    </div>
  );
}
