'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, ShieldCheckIcon } from '@/assets';
import { useCountryConfig } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CompanyComplianceFormValues } from './company-onboarding.types';

interface ComplianceStepProps {
  country?: string;
  onSubmit: (values: CompanyComplianceFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ComplianceStep({ country = 'NG', onSubmit, isLoading }: ComplianceStepProps) {
  const isNigeria = country.toUpperCase() === 'NG';
  const { data: countryConfig } = useCountryConfig(country);

  const docTypes = isNigeria
    ? [
        { value: 'BVN', label: 'Bank Verification Number (BVN - 11 digits)' },
        { value: 'NIN', label: 'National Identification Number (NIN - 11 digits)' },
        { value: 'CAC_RC', label: 'CAC Registration / RC Number' },
      ]
    : countryConfig?.directorDocTypes && countryConfig.directorDocTypes.length > 0
    ? countryConfig.directorDocTypes
    : [
        { value: 'PASSPORT', label: 'International Passport' },
        { value: 'NATIONAL_ID', label: 'National Identity / Driver License' },
        { value: 'TAX_ID', label: 'Corporate Tax ID / EIN' },
      ];

  const complianceSchema = z.object({
    directorName: z.string().min(2, 'Director full legal name is required'),
    directorBvnOrNin: isNigeria
      ? z.string().min(6, 'Valid Nigerian BVN, NIN, or CAC number is required')
      : z.string().min(3, 'Valid identity identifier is required'),
    documentType: z.string().min(1, 'Verification type is required'),
  });

  type ComplianceSchemaValues = z.infer<typeof complianceSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ComplianceSchemaValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      directorName: '',
      directorBvnOrNin: '',
      documentType: docTypes[0]?.value || (isNigeria ? 'BVN' : 'PASSPORT'),
    },
  });

  const selectedDocType = watch('documentType');

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border border-black/[0.08] dark:border-white/[0.08]">
      <div className="flex items-center gap-2.5 text-primary">
        <ShieldCheckIcon className="h-5 w-5 text-brand-emerald" />
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {AppStrings.onboarding.stepCompliance}
          </h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            {isNigeria
              ? 'AML regulatory compliance for registered entities'
              : 'AML & sanctions screening for global entities (No BVN/NIN required)'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label={AppStrings.onboarding.directorName}
          placeholder="e.g. Jane Doe"
          error={errors.directorName?.message}
          {...register('directorName')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-foreground/80">Verification Identifier Type</label>
          <select
            {...register('documentType')}
            className="min-h-[42px] rounded-lg border border-border bg-card px-3 py-2 text-body-xs sm:text-body-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          >
            {docTypes.map((doc) => (
              <option key={doc.value} value={doc.value}>
                {doc.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={
            selectedDocType === 'BVN'
              ? 'Bank Verification Number (11 digits)'
              : selectedDocType === 'NIN'
              ? 'National Identification Number (11 digits)'
              : selectedDocType === 'PASSPORT'
              ? 'Passport Number'
              : selectedDocType === 'TAX_ID'
              ? 'Corporate Tax / EIN Number'
              : 'Identity / Document Number'
          }
          placeholder={isNigeria && (selectedDocType === 'BVN' || selectedDocType === 'NIN') ? '22233344455' : 'Enter identifier / passport number'}
          maxLength={isNigeria && (selectedDocType === 'BVN' || selectedDocType === 'NIN') ? 11 : 32}
          error={errors.directorBvnOrNin?.message}
          {...register('directorBvnOrNin')}
        />

        <div className="rounded-lg bg-secondary/50 p-3 text-caption text-muted-foreground border border-black/[0.06] dark:border-white/[0.06]">
          {isNigeria
            ? 'Processed encrypted against official identity databases. Your data is protected.'
            : 'Screened against international compliance registries. Passports and foreign IDs accepted.'}
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[42px] text-label-sm">
          {AppStrings.onboarding.verifyDirector}
        </Button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSubmit({ skip: true })}
          className="text-caption font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-center py-1 underline-offset-4 hover:underline"
        >
          {AppStrings.onboarding.skipCompliance} &rarr;
        </button>
      </form>
    </Card>
  );
}
