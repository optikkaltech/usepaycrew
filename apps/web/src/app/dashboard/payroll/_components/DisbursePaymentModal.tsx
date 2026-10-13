'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, XIcon, ShieldCheckIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { formatCurrency, normalizeError } from '@/utils';
import { Currency } from '@paycrew/shared-types';

const paymentSchema = z.object({
  workerId: z.string().min(1, 'Select a contractor'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid payment amount'),
  note: z.string().optional(),
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const watchAmount = watch('amount');

  if (!isOpen) return null;

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
    try {
      const idempotencyKey = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await http.post('/payments', {
        ...values,
        currency: Currency.USD,
        idempotencyKey,
      });
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
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-display-sm text-foreground">{AppStrings.dashboard.payWorker}</h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-foreground">{AppStrings.payments.chooseWorker}</label>
            <select
              {...register('workerId')}
              className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground"
            >
              <option value="">-- Choose Contractor --</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({formatCurrency(w.payAmount, w.payCurrency)})
                </option>
              ))}
            </select>
            {errors.workerId && <span className="text-caption text-destructive">{errors.workerId.message}</span>}
          </div>

          <Input
            label={AppStrings.payments.amount}
            placeholder="1500.00"
            error={errors.amount?.message}
            {...register('amount', { onBlur: handleAmountBlur })}
          />

          <Input label="Note or Invoice Reference" placeholder="October 2026 Milestone 1" {...register('note')} />

          {/* Live Fee Breakdown */}
          {feeData && (
            <Card className="bg-secondary/50 p-4">
              <div className="flex items-center gap-1.5 text-brand-sky mb-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span className="text-label-sm font-semibold">{AppStrings.payments.feeSummary}</span>
              </div>
              <div className="flex justify-between text-body-xs text-muted-foreground py-1">
                <span>Contractor Payout:</span>
                <span className="font-semibold text-foreground">{formatCurrency(feeData.amount, 'USD')}</span>
              </div>
              <div className="flex justify-between text-body-xs text-muted-foreground py-1">
                <span>{AppStrings.payments.feePercentage}:</span>
                <span className="font-semibold text-foreground">{formatCurrency(feeData.feeAmount, 'USD')}</span>
              </div>
              <div className="flex justify-between text-label-md font-bold text-foreground border-t border-border pt-2 mt-1">
                <span>{AppStrings.payments.totalCharged}:</span>
                <span className="text-primary">{formatCurrency(feeData.totalCharged, 'USD')}</span>
              </div>
            </Card>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              {AppStrings.common.cancel}
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {AppStrings.payments.confirmPayment}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
