'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { AppStrings, XIcon, ShieldCheckIcon, LockIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';
import { Currency } from '@paycrew/shared-types';
import { TreasuryBalanceAlert } from './TreasuryBalanceAlert';
import { WorkerReadinessCheck } from './WorkerReadinessCheck';
import { FundingModal } from '../../_components/FundingModal';

const paymentSchema = z.object({
  workerId: z.string().min(1, 'Select a contractor'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid payment amount'),
  note: z.string().optional(),
  twoFactorToken: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface DisbursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workers: any[];
}

export function DisbursePaymentModal({ isOpen, onClose, onSuccess, workers }: DisbursePaymentModalProps) {
  const toast = useToast();
  const [feeData, setFeeData] = useState<any>(null);
  const [fundModalOpen, setFundModalOpen] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['companyBalance'],
    queryFn: () => http.get('/ledger/company-balance?currency=USD'),
    enabled: isOpen,
  });

  const { data: fundingInfo } = useQuery({
    queryKey: ['fundingInfo'],
    queryFn: () => http.get('/companies/funding-info'),
    enabled: isOpen,
  });

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const watchWorkerId = watch('workerId');
  const watchAmount = watch('amount');
  const selectedWorker = workers.find((w) => w.id === watchWorkerId);

  if (!isOpen) return null;

  const availableBalance = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const totalChargedNum = feeData?.totalCharged ? parseFloat(feeData.totalCharged) : 0;
  const isInsufficient = feeData && availableBalance < totalChargedNum;
  const requires2fa = totalChargedNum >= 1000;

  const handleAmountBlur = async () => {
    if (watchAmount && parseFloat(watchAmount) > 0) {
      try {
        const est = await http.get(`/payments/fee-estimate?amount=${watchAmount}&currency=USD`);
        setFeeData(est);
      } catch {
        setFeeData(null);
      }
    }
  };

  const onSubmit = async (values: PaymentFormValues) => {
    if (isInsufficient) {
      toast.error('Insufficient treasury balance. Please fund your account.');
      return;
    }
    try {
      const idempotencyKey = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await http.post('/payments', { ...values, currency: Currency.USD, idempotencyKey });
      toast.success(AppStrings.payments.paymentSuccess);
      reset();
      setFeeData(null);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">{AppStrings.dashboard.payWorker}</h2>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-foreground">{AppStrings.payments.chooseWorker}</label>
            <select {...register('workerId')} className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground">
              <option value="">-- Choose Contractor --</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>{w.name} ({formatCurrency(w.payAmount, w.payCurrency)})</option>
              ))}
            </select>
          </div>

          <WorkerReadinessCheck worker={selectedWorker} />

          <Input label={AppStrings.payments.amount} placeholder="1500.00" error={errors.amount?.message} {...register('amount', { onBlur: handleAmountBlur })} />
          <Input label="Note or Milestone Reference" placeholder="October 2026 Milestone 1" {...register('note')} />

          {feeData && (
            <Card className="bg-secondary/50 p-4">
              <div className="flex items-center gap-1.5 text-brand-emerald mb-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span className="text-label-sm font-semibold">{AppStrings.payments.feeSummary}</span>
              </div>
              <div className="flex justify-between text-body-xs text-muted-foreground py-0.5">
                <span>Contractor Payout:</span>
                <span className="font-semibold text-foreground">{formatCurrency(feeData.amount, 'USD')}</span>
              </div>
              <div className="flex justify-between text-body-xs text-muted-foreground py-0.5">
                <span>{AppStrings.payments.feePercentage}:</span>
                <span className="font-semibold text-foreground">{formatCurrency(feeData.feeAmount, 'USD')}</span>
              </div>
              <div className="flex justify-between text-label-md font-bold text-foreground border-t border-border pt-2 mt-1">
                <span>{AppStrings.payments.totalCharged}:</span>
                <span className="text-primary">{formatCurrency(feeData.totalCharged, 'USD')}</span>
              </div>
            </Card>
          )}

          <TreasuryBalanceAlert availableBalance={availableBalance} totalCharged={totalChargedNum} onOpenFundModal={() => setFundModalOpen(true)} />

          {requires2fa && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <LockIcon className="h-4 w-4" />
                <span className="text-label-sm font-bold">{AppStrings.checkers.makerCheckerTitle}</span>
              </div>
              <p className="text-caption text-muted-foreground">{AppStrings.checkers.twoFactorHint}</p>
              <Input label={AppStrings.checkers.twoFactorRequired} placeholder="123456" maxLength={6} {...register('twoFactorToken')} />
            </div>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>{AppStrings.common.cancel}</Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isInsufficient || (selectedWorker && selectedWorker.status === 'INVITED')}>
              {AppStrings.payments.confirmPayment}
            </Button>
          </div>
        </form>

        <FundingModal isOpen={fundModalOpen} onClose={() => setFundModalOpen(false)} fundingInfo={fundingInfo} />
      </div>
    </div>
  );
}
