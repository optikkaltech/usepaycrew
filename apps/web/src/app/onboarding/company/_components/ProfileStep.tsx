'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CompanyProfileFormValues } from './company-onboarding.types';

const profileSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  registrationNumber: z.string().min(2, 'RC / CAC registration number is required'),
  taxId: z.string().min(6, 'Corporate Tax ID (TIN) is required'),
  industry: z.string().min(2, 'Industry is required'),
  country: z.string().default('NG'),
});

interface ProfileStepProps {
  initialValues?: Partial<CompanyProfileFormValues>;
  onSubmit: (values: CompanyProfileFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ProfileStep({ initialValues, onSubmit, isLoading }: ProfileStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialValues?.name || '',
      registrationNumber: initialValues?.registrationNumber || '',
      taxId: initialValues?.taxId || '',
      industry: initialValues?.industry || 'Technology & Fintech',
      country: initialValues?.country || 'NG',
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div>
        <h2 className="text-display-sm text-foreground">{AppStrings.onboarding.stepProfile}</h2>
        <p className="mt-1 text-body-xs text-muted-foreground">
          Provide your registered legal entity details for corporate banking & tax reporting
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label={AppStrings.auth.companyNameLabel}
          placeholder="Acme Technologies Limited"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="CAC / RC Registration Number"
            placeholder="RC-1948291"
            error={errors.registrationNumber?.message}
            {...register('registrationNumber')}
          />

          <Input
            label={AppStrings.onboarding.taxId}
            placeholder="TIN-29481940"
            error={errors.taxId?.message}
            {...register('taxId')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-foreground">{AppStrings.onboarding.industry}</label>
          <select
            {...register('industry')}
            className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-md text-foreground"
          >
            <option value="Technology & Fintech">Technology &amp; Fintech</option>
            <option value="Software Engineering Agency">Software Engineering Agency</option>
            <option value="Digital Media & Creative">Digital Media &amp; Creative</option>
            <option value="Commerce & Logistics">Commerce &amp; Logistics</option>
            <option value="Professional Services">Professional Services</option>
          </select>
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[44px]">
          {AppStrings.onboarding.submitProfile}
        </Button>
      </form>
    </Card>
  );
}
