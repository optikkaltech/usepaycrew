'use client';

import { useState } from 'react';
import { AppStrings, ShieldCheckIcon, ShieldAlertIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { KycService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { KycCheckType } from '@paycrew/shared-types';

import { useMutation } from '@tanstack/react-query';

interface KycSectionProps {
  workerId: string;
  isVerified: boolean;
  onSuccess: () => void;
}

export function KycSection({ workerId, isVerified, onSuccess }: KycSectionProps) {
  const toast = useToast();
  const [bvn, setBvn] = useState('');

  const kycMutation = useMutation({
    mutationFn: async () => {
      return KycService.submitWorkerKyc(workerId, {
        checkType: KycCheckType.BVN,
        identifier: bvn,
      });
    },
    onSuccess: () => {
      toast.success(AppStrings.kyc.verified);
      onSuccess();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  const loading = kycMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bvn.length !== 11) {
      toast.error('Please enter a valid 11-digit BVN or NIN');
      return;
    }
    kycMutation.mutate();
  };

  if (isVerified) {
    return (
      <Card className="flex items-center gap-3 bg-success/10 border-success/30 p-4">
        <ShieldCheckIcon className="h-6 w-6 text-success flex-shrink-0" />
        <div>
          <p className="text-label-md font-bold text-success">Identity Verified (Level 1 KYC)</p>
          <p className="text-caption text-muted-foreground">Compliant with Central Bank &amp; SEC identity guidelines</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-warning">
        <ShieldAlertIcon className="h-5 w-5" />
        <h3 className="text-label-lg font-bold text-foreground">{AppStrings.kyc.title}</h3>
      </div>
      <p className="text-body-xs text-muted-foreground">{AppStrings.kyc.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Enter 11-digit BVN or NIN"
          value={bvn}
          maxLength={11}
          onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
          hint="Encrypted at rest (AES-256). Never shared with employers."
        />
        <Button type="submit" isLoading={loading} className="w-full">
          {AppStrings.kyc.submit}
        </Button>
      </form>
    </Card>
  );
}
