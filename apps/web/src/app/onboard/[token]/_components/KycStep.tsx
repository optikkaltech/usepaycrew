'use client';

import { useState } from 'react';
import { ShieldCheckIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { KycCheckType } from '@paycrew/shared-types';

interface KycStepProps {
  onSubmit: (checkType: KycCheckType, identifier: string) => Promise<void>;
  onSkip: () => void;
  isLoading: boolean;
  hasVerifiedKyc?: boolean;
}

export function KycStep({ onSubmit, onSkip, isLoading, hasVerifiedKyc = false }: KycStepProps) {
  const [checkType, setCheckType] = useState<KycCheckType>(KycCheckType.BVN);
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (hasVerifiedKyc) {
    return (
      <Card variant="elevated" className="flex flex-col gap-6 p-6 sm:p-8 border-border text-center items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-emerald/15 text-brand-emerald shadow-sm">
          <CheckCircleIcon className="h-8 w-8" />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-display-xs font-bold text-foreground">Identity Already Verified</h2>
          <p className="text-body-xs text-muted-foreground">
            Your regulatory identity (BVN/NIN) is already verified and on file with PayCrew. You do not need to re-verify for this company.
          </p>
        </div>

        <div className="w-full pt-2">
          <Button onClick={onSkip} className="w-full min-h-[44px]">
            Continue to Payout Method
          </Button>
        </div>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || identifier.trim().length !== 11) {
      setError(`Please enter a valid 11-digit ${checkType}`);
      return;
    }
    setError(null);
    onSubmit(checkType, identifier.trim());
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
          <ShieldCheckIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-display-xs font-bold text-foreground">Identity Verification</h2>
          <p className="text-body-xs text-muted-foreground">
            Fast, secure Prembly identity verification for local compliance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setCheckType(KycCheckType.BVN);
            setError(null);
          }}
          className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
            checkType === KycCheckType.BVN
              ? 'border-primary bg-primary/5 shadow-brand font-semibold text-foreground'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
          }`}
        >
          <span className="text-label-md">Bank Verification Number (BVN)</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Instant match with bank name</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCheckType(KycCheckType.NIN);
            setError(null);
          }}
          className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
            checkType === KycCheckType.NIN
              ? 'border-primary bg-primary/5 shadow-brand font-semibold text-foreground'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
          }`}
        >
          <span className="text-label-md">National ID Number (NIN)</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">NIMC database verification</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={`11-Digit ${checkType}`}
          placeholder={checkType === KycCheckType.BVN ? '22212345678' : '12345678901'}
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 11));
            setError(null);
          }}
          error={error || undefined}
        />

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" type="button" onClick={onSkip}>
            Skip for now
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Verify Identity
          </Button>
        </div>
      </form>
    </Card>
  );
}
