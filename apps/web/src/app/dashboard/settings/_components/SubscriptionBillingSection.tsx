'use client';

import { useMutation } from '@tanstack/react-query';
import { AppStrings, CreditCardIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';

interface SubscriptionBillingSectionProps {
  summary?: any;
}

export function SubscriptionBillingSection({ summary }: SubscriptionBillingSectionProps) {
  const toast = useToast();

  const payMutation = useMutation({
    mutationFn: (method: 'CARD' | 'CRYPTO') =>
      http.post('/subscriptions/initiate', {
        currency: method === 'CARD' ? 'USD' : 'USDT',
        paymentMethod: method,
      }),
    onSuccess: (data: any) => {
      toast.success(
        data.paymentMethod === 'CARD'
          ? 'Card payment processed successfully'
          : `Deposit $${data.amount} USDT to ${data.depositAddress}`,
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to initiate payment');
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-display-sm font-bold text-foreground">
              {AppStrings.subscriptions.starterPlan}
            </h2>
            <p className="text-body-xs text-muted-foreground">
              {AppStrings.subscriptions.starterDescription}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-label-sm font-semibold text-success">
          <CheckCircleIcon className="h-4 w-4" />
          {summary?.status || AppStrings.subscriptions.activeStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 p-4 border border-border">
          <p className="text-caption text-muted-foreground">Monthly Base Billing</p>
          <p className="text-display-sm font-extrabold text-foreground mt-1">
            ₦15,000 <span className="text-body-sm font-normal text-muted-foreground">/ $10 USD</span>
          </p>
          <p className="mt-1 text-caption text-muted-foreground">Covers first 10 team members</p>
        </div>

        <div className="rounded-xl bg-secondary/50 p-4 border border-border">
          <p className="text-caption text-muted-foreground">Active Team Members</p>
          <p className="text-display-sm font-extrabold text-foreground mt-1">
            {summary?.activeWorkers || 0}{' '}
            <span className="text-body-sm font-normal text-muted-foreground">workers</span>
          </p>
          <p className="mt-1 text-caption text-muted-foreground">{AppStrings.subscriptions.extraWorkerRate}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={() => payMutation.mutate('CARD')}
          isLoading={payMutation.isPending}
          className="flex-1 min-h-[44px]"
        >
          {AppStrings.subscriptions.payWithCard}
        </Button>
        <Button
          variant="outline"
          onClick={() => payMutation.mutate('CRYPTO')}
          isLoading={payMutation.isPending}
          className="flex-1 min-h-[44px]"
        >
          {AppStrings.subscriptions.payWithCrypto}
        </Button>
      </div>
    </Card>
  );
}
