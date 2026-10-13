'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AppStrings,
  BuildingIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  WalletIcon,
  CheckCircleIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { formatCurrency } from '@/utils';
import { useToast } from '@/hooks';

export default function SettingsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedRamp, setSelectedRamp] = useState<'QUIDAX' | 'YELLOWCARD'>('QUIDAX');

  const { data: summary } = useQuery({
    queryKey: ['subscriptionSummary'],
    queryFn: () => http.get('/subscriptions/summary'),
  });

  const { data: company } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: () => http.get('/companies/me'),
  });

  const payMutation = useMutation({
    mutationFn: (method: 'KORAPAY' | 'CRYPTO') =>
      http.post('/subscriptions/initiate', {
        currency: method === 'KORAPAY' ? 'NGN' : 'USDT',
        paymentMethod: method,
      }),
    onSuccess: (data: any) => {
      toast.success(
        data.paymentMethod === 'KORAPAY'
          ? `Pay ₦${data.amount?.toLocaleString()} to ${data.virtualAccount?.bankName} (${data.virtualAccount?.accountNumber})`
          : `Deposit $${data.amount} USDT to ${data.depositAddress}`,
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to initiate payment');
    },
  });

  const providerMutation = useMutation({
    mutationFn: (activeRampProvider: string) =>
      http.patch('/companies/providers', { activeRampProvider }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      toast.success('Ramp provider updated successfully');
    },
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl">
      <div>
        <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.subscriptions.title}</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Manage company subscription, Korapay settlement, and crypto providers
        </p>
      </div>

      {/* Subscription Card */}
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
            onClick={() => payMutation.mutate('KORAPAY')}
            isLoading={payMutation.isPending}
            className="flex-1 min-h-[44px]"
          >
            {AppStrings.subscriptions.payWithKorapay}
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

      {/* Provider Switcher Card */}
      <Card className="flex flex-col gap-4 border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sky/10 text-brand-sky">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-label-lg font-bold text-foreground">Active Settlement & Ramp Engine</h3>
            <p className="text-body-xs text-muted-foreground">
              Quidax primary with instant local liquidity, or Yellow Card African regional corridor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRamp('QUIDAX');
              providerMutation.mutate('QUIDAX');
            }}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all min-h-[44px] ${
              selectedRamp === 'QUIDAX'
                ? 'border-primary bg-primary/5 shadow-brand'
                : 'border-border bg-card hover:bg-secondary/50'
            }`}
          >
            <span className="text-label-md font-bold text-foreground">Quidax (Primary Engine)</span>
            <span className="text-caption text-muted-foreground mt-1">
              USDT & USDC across TRON (TRC20), Polygon, Base, Ethereum & Solana
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRamp('YELLOWCARD');
              providerMutation.mutate('YELLOWCARD');
            }}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all min-h-[44px] ${
              selectedRamp === 'YELLOWCARD'
                ? 'border-primary bg-primary/5 shadow-brand'
                : 'border-border bg-card hover:bg-secondary/50'
            }`}
          >
            <span className="text-label-md font-bold text-foreground">Yellow Card (Africa Corridor)</span>
            <span className="text-caption text-muted-foreground mt-1">
              Cross-border stablecoin corridors across Nigeria, Kenya, Ghana, SA
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
}
