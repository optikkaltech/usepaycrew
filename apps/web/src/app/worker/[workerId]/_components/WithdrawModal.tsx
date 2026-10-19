'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppStrings, XIcon, ShieldCheckIcon, CheckCircleIcon, ArrowDownLeftIcon, RefreshCwIcon } from '@/assets';
import { Button, Input, Card } from '@/components/ui';
import { PayoutService } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';
import { Currency } from '@paycrew/shared-types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workerId: string;
  defaultMethod?: any;
  availableBalance?: number;
  initialAmount?: string;
}

export function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  workerId,
  defaultMethod,
  availableBalance = 0,
  initialAmount,
}: WithdrawModalProps) {
  const toast = useToast();
  const [amount, setAmount] = useState(initialAmount || '');
  const [pin, setPin] = useState('');
  const [estimate, setEstimate] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [lockSeconds, setLockSeconds] = useState(30);

  useEffect(() => {
    if (isOpen && initialAmount) {
      setAmount(initialAmount);
    }
  }, [isOpen, initialAmount]);

  useEffect(() => {
    if (!isOpen || !estimate) return;
    setLockSeconds(30);
    const interval = setInterval(() => {
      setLockSeconds((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, estimate]);

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return PayoutService.executeWithdrawal({
        workerId,
        amount,
        currency: Currency.USD,
        payoutMethodId: defaultMethod?.id,
        otpOrPin: pin,
      });
    },
    onSuccess: (res) => {
      setReceipt(res);
      toast.success('Withdrawal dispatched to your bank');
      onSuccess();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen) return null;

  const handleAmountChange = async (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      try {
        const est = await PayoutService.getWithdrawalEstimate(val, 'USD');
        setEstimate(est);
      } catch {
        setEstimate(null);
      }
    } else {
      setEstimate(null);
    }
  };

  const setPercentage = (pct: number) => {
    const calculated = (availableBalance * pct).toFixed(2);
    handleAmountChange(calculated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-display-xs font-bold text-foreground">
              {receipt ? 'Withdrawal Receipt' : 'Convert & Withdraw to Bank'}
            </h2>
            <p className="text-body-xs text-muted-foreground mt-0.5">
              Instant Quidax OTC liquidity to Nigerian bank accounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {receipt ? (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircleIcon className="h-6 w-6" />
              <p className="text-label-lg font-bold">Transfer In Transit to Bank</p>
            </div>
            <Card className="bg-secondary/40 flex flex-col gap-2 p-4 text-body-xs border-border">
              <div className="flex justify-between"><span className="text-muted-foreground">Receipt Ref:</span><span className="font-mono font-bold text-foreground">{receipt.receiptId || 'REC-' + Date.now()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Destination Bank:</span><span className="font-semibold text-foreground">{receipt.bankName || defaultMethod?.bankName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Account:</span><span className="font-semibold text-foreground">{receipt.accountNumber || defaultMethod?.accountReference}</span></div>
              <div className="flex justify-between border-t border-border pt-2 mt-1"><span className="text-muted-foreground">Net Credited:</span><span className="font-extrabold text-success text-label-lg">{formatCurrency(receipt.netAmount || (estimate?.netPayoutNaira || 0), 'NGN')}</span></div>
            </Card>
            <Button onClick={onClose} className="w-full mt-2 min-h-[44px]">Close</Button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-label-sm text-foreground">Amount to Convert (USDT)</span>
                <span className="text-caption text-muted-foreground">Available: ${availableBalance.toFixed(2)}</span>
              </div>
              <Input
                placeholder="100.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPercentage(pct)}
                    className="flex-1 py-1 rounded-lg border border-border bg-secondary/50 text-caption font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    {pct === 1 ? 'Max' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>

            {estimate && (
              <Card className="bg-secondary/30 p-4 flex flex-col gap-1.5 text-body-xs border-border">
                <div className="flex items-center justify-between text-brand-emerald font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Live Quidax Rate Quote</span>
                  </div>
                  <span className="text-[10px] bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                    Rate locked: {lockSeconds}s
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground"><span>Gross Naira (₦{estimate.exchangeRate}/USDT):</span><span className="font-semibold text-foreground">{formatCurrency(estimate.grossAmount, 'NGN')}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Banking &amp; Stamp Duty:</span><span className="font-semibold text-foreground">₦{estimate.flatFee + (estimate.stampDuty || 0)}</span></div>
                <div className="flex justify-between text-label-md font-bold text-foreground border-t border-border pt-2 mt-1"><span>You Receive:</span><span className="text-success text-label-lg font-extrabold">{formatCurrency(estimate.netPayoutNaira, 'NGN')}</span></div>
              </Card>
            )}

            <Input
              label="Transaction PIN or 2FA Code"
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              hint="Authorization required before dispatching local funds"
            />

            <Button
              onClick={() => withdrawMutation.mutate()}
              isLoading={withdrawMutation.isPending}
              disabled={!estimate || pin.length < 4 || parseFloat(amount) > availableBalance}
              className="w-full min-h-[44px]"
            >
              <ArrowDownLeftIcon className="mr-2 h-4 w-4" />
              Confirm &amp; Disburse Naira
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
