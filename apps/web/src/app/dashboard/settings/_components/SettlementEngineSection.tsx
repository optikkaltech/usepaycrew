'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheckIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
import { useToast } from '@/hooks';

interface SettlementEngineSectionProps {
  currentProvider?: string;
}

export function SettlementEngineSection({ currentProvider = 'QUIDAX' }: SettlementEngineSectionProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedRamp, setSelectedRamp] = useState(currentProvider);

  const providerMutation = useMutation({
    mutationFn: (activeRampProvider: string) =>
      http.patch('/companies/providers', { activeRampProvider }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      toast.success('Ramp provider updated successfully');
    },
  });

  return (
    <Card className="flex flex-col gap-4 border-border">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
          <ShieldCheckIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-label-lg font-bold text-foreground">Active Settlement &amp; Ramp Engine</h3>
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
            USDT &amp; USDC across TRON (TRC20), Polygon, Base, Ethereum &amp; Solana
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
  );
}
