'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, ShieldCheckIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CompanyComplianceFormValues } from './company-onboarding.types';

const complianceSchema = z.object({
  directorName: z.string().min(2, 'Director full legal name is required'),
  directorBvnOrNin: z.string().regex(/^\d{11}$/, 'Must be an 11-digit Nigerian BVN or NIN'),
  documentType: z.string().default('BVN'),
});

interface ComplianceStepProps {
  onSubmit: (values: CompanyComplianceFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ComplianceStep({ onSubmit, isLoading }: ComplianceStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyComplianceFormValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      directorName: '',
      directorBvnOrNin: '',
      documentType: 'BVN',
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-2.5 text-primary">
        <ShieldCheckIcon className="h-6 w-6" />
        <div>
          <h2 className="text-display-sm text-foreground">{AppStrings.onboarding.stepCompliance}</h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            CBN &amp; AML regulatory verification powered by Prembly &amp; Smile ID
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label={AppStrings.onboarding.directorName}
          placeholder="Oluwaseun Adebayo"
          error={errors.directorName?.message}
          {...register('directorName')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-foreground">Verification Identifier Type</label>
          <select
            {...register('documentType')}
            className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground"
          >
            <option value="BVN">Bank Verification Number (BVN - 11 digits)</option>
            <option value="NIN">National Identification Number (NIN - 11 digits)</option>
          </select>
        </div>

        <Input
          label={AppStrings.onboarding.directorId}
          placeholder="22345678901"
          maxLength={11}
          error={errors.directorBvnOrNin?.message}
          {...register('directorBvnOrNin')}
        />

        <div className="rounded-lg bg-secondary/50 p-3 text-caption text-muted-foreground border border-border">
          Verification is processed encrypted against the central NIBSS / NIMC database. Your data is never shared.
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[44px]">
          {AppStrings.onboarding.verifyDirector}
        </Button>
      </form>
    </Card>
  );
}
