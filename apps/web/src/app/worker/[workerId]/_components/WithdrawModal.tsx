'use client';

import { useState } from 'react';
import { AppStrings, XIcon, ShieldCheckIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';
import { Currency } from '@paycrew/shared-types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workerId: string;
  defaultMethod?: any;
}

export function WithdrawModal({ isOpen, onClose, onSuccess, workerId, defaultMethod }: WithdrawModalProps) {
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [estimate, setEstimate] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAmountChange = async (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      try {
        const est = await http.get(`/withdrawals/estimate?amount=${val}&currency=USD`);
        setEstimate(est);
      } catch {
        setEstimate(null);
      }
    } else {
      setEstimate(null);
    }
  };

  const handleExecute = async () => {
    if (!defaultMethod) {
      toast.error('Please add a bank account first');
      return;
    }
    setLoading(true);
    try {
      const res = await http.post('/withdrawals/execute', {
        workerId,
        amount,
        currency: Currency.USD,
        payoutMethodId: defaultMethod.id,
        otpOrPin: pin,
      });
      setReceipt(res);
      toast.success('Withdrawal dispatched successfully');
      onSuccess();
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">
            {receipt ? AppStrings.withdrawals.receiptTitle : AppStrings.withdrawals.title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {receipt ? (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircleIcon className="h-6 w-6" />
              <p className="text-label-lg font-bold">Transfer In Transit to Bank</p>
            </div>
            <Card className="bg-secondary/50 flex flex-col gap-2 p-4 text-body-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receipt ID:</span>
                <span className="font-mono font-bold text-foreground">{receipt.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-semibold text-foreground">{receipt.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account:</span>
                <span className="font-semibold text-foreground">{receipt.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Naira:</span>
                <span className="font-extrabold text-success text-label-lg">
                  {formatCurrency(receipt.netAmount, 'NGN')}
                </span>
              </div>
            </Card>
            <Button onClick={onClose} className="w-full mt-2">
              {AppStrings.common.close}
            </Button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <Input
              label="USD Amount to Cash Out"
              placeholder="500.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />

            {estimate && (
              <Card className="bg-secondary/50 p-4 flex flex-col gap-1.5 text-body-xs">
                <div className="flex items-center gap-1 text-brand-sky font-semibold mb-1">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Statutory Fee &amp; Exchange Breakdown</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Gross Naira (1 USD = ₦{estimate.exchangeRate}):</span>
                  <span className="font-semibold text-foreground">{formatCurrency(estimate.grossAmount, 'NGN')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{AppStrings.withdrawals.partnerFee}:</span>
                  <span className="font-semibold text-foreground">₦{estimate.partnerFee}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{AppStrings.withdrawals.flatFee}:</span>
                  <span className="font-semibold text-foreground">₦{estimate.flatFee}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{AppStrings.withdrawals.stampDuty}:</span>
                  <span className="font-semibold text-foreground">₦{estimate.stampDuty}</span>
                </div>
                <div className="flex justify-between text-label-md font-bold text-foreground border-t border-border pt-2 mt-1">
                  <span>{AppStrings.withdrawals.netAmount}:</span>
                  <span className="text-success">{formatCurrency(estimate.netPayoutNaira, 'NGN')}</span>
                </div>
              </Card>
            )}

            <Input
              label="Enter Security PIN or OTP (4-6 digits)"
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <Button onClick={handleExecute} isLoading={loading} disabled={!estimate || pin.length < 4}>
              {AppStrings.withdrawals.confirmButton}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
