'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings, ShieldCheckIcon } from '@/assets';
import { useCountryConfig } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CompanyComplianceFormValues, CountryOption } from './company-onboarding.types';

interface ComplianceStepProps {
  country?: string;
  onSubmit: (values: CompanyComplianceFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ComplianceStep({ country = 'NG', onSubmit, isLoading }: ComplianceStepProps) {
  const isNigeria = country.toUpperCase() === 'NG';

  const { data: countryConfig } = useCountryConfig(country);

  const docTypes = countryConfig?.directorDocTypes && countryConfig.directorDocTypes.length > 0
    ? countryConfig.directorDocTypes
    : isNigeria
    ? [
        { value: 'BVN', label: 'Bank Verification Number (BVN - 11 digits)' },
        { value: 'NIN', label: 'National Identification Number (NIN - 11 digits)' },
      ]
    : [
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'NATIONAL_ID', label: 'National Identity Card' },
      ];

  const complianceSchema = z.object({
    directorName: z.string().min(2, 'Director full legal name is required'),
    directorBvnOrNin: isNigeria
      ? z.string().regex(/^\d{11}$/, 'Must be an 11-digit Nigerian BVN or NIN')
      : z.string().min(4, 'Valid identity identifier is required'),
    documentType: z.string().min(1, 'Verification type is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyComplianceFormValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      directorName: '',
      directorBvnOrNin: '',
      documentType: docTypes[0]?.value || 'BVN',
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div className="flex items-center gap-2.5 text-primary">
        <ShieldCheckIcon className="h-5 w-5" />
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{AppStrings.onboarding.stepCompliance}</h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            {isNigeria
              ? 'CBN & AML regulatory verification powered by Prembly & Smile ID'
              : 'AML / OFAC compliance and corporate sanctions screening'}
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
          <label className="text-[12px] font-medium text-foreground/80">Verification Identifier Type</label>
          <select
            {...register('documentType')}
            className="min-h-[42px] rounded-lg border border-input bg-background px-3 py-2 text-body-xs sm:text-body-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          >
            {docTypes.map((doc) => (
              <option key={doc.value} value={doc.value}>
                {doc.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={countryConfig?.directorIdLabel || 'Director ID / Passport Number'}
          placeholder={countryConfig?.directorIdPlaceholder || 'Enter ID / Passport Number'}
          maxLength={isNigeria ? 11 : 30}
          error={errors.directorBvnOrNin?.message}
          {...register('directorBvnOrNin')}
        />

        <div className="rounded-lg bg-secondary/50 p-3 text-caption text-muted-foreground border border-border">
          {isNigeria
            ? 'Verification is processed encrypted against the central NIBSS / NIMC database. Your data is never shared.'
            : 'Identity verification is securely screened against global PEP and regulatory sanctions databases.'}
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[42px] text-label-sm">
          {AppStrings.onboarding.verifyDirector}
        </Button>
      </form>
    </Card>
  );
}
