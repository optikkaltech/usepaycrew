'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppStrings } from '@/assets';
import { useCountries, useStates, useCitiesOrLgas } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { CompanyProfileFormValues, CountryOption, INDUSTRIES } from './company-onboarding.types';

const profileSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(1, 'State / Province is required'),
  lga: z.string().optional(),
  city: z.string().optional(),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  taxId: z.string().min(2, 'Tax ID is required'),
  industry: z.string().min(2, 'Industry is required'),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialValues?.name || '',
      country: initialValues?.country || 'NG',
      state: initialValues?.state || '',
      lga: initialValues?.lga || '',
      city: initialValues?.city || '',
      registrationNumber: initialValues?.registrationNumber || '',
      taxId: initialValues?.taxId || '',
      industry: initialValues?.industry || 'Technology & Fintech',
    },
  });

  const selectedCountryCode = watch('country') || 'NG';
  const selectedState = watch('state') || '';
  const selectedLga = watch('lga') || '';
  const selectedCity = watch('city') || '';

  const { data: countries = [] } = useCountries();

  const currentCountry =
    countries.find((c) => c.code.toUpperCase() === selectedCountryCode.toUpperCase()) || {
      code: selectedCountryCode,
      name: selectedCountryCode,
      currency: 'USD',
      registrationLabel: 'Registration Number',
      registrationPlaceholder: 'Enter registration number',
      taxIdLabel: 'Corporate Tax ID',
      taxIdPlaceholder: 'Enter corporate tax ID',
      stateLabel: 'State / Province',
      lgaLabel: 'City / Municipality',
      hasLga: selectedCountryCode.toUpperCase() === 'NG',
      directorIdLabel: 'Director ID / Passport',
      directorIdPlaceholder: 'Enter ID',
      directorDocTypes: [],
    };

  const { data: states = [] } = useStates(selectedCountryCode);
  const { data: citiesOrLgas = [] } = useCitiesOrLgas(selectedCountryCode, selectedState);

  const handleCountryChange = (code: string) => {
    setValue('country', code, { shouldValidate: true });
    setValue('state', '');
    setValue('lga', '');
    setValue('city', '');
  };

  const handleStateChange = (st: string) => {
    setValue('state', st, { shouldValidate: true });
    setValue('lga', '');
    setValue('city', '');
  };

  const handleCityOrLgaChange = (val: string) => {
    if (currentCountry.hasLga) {
      setValue('lga', val, { shouldValidate: true });
    } else {
      setValue('city', val, { shouldValidate: true });
    }
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5 border-border">
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{AppStrings.onboarding.stepProfile}</h2>
        <p className="mt-1 text-body-xs text-muted-foreground">
          Provide your registered legal entity details for corporate banking &amp; tax reporting
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <Input label={AppStrings.auth.companyNameLabel} placeholder="Acme Technologies Limited" error={errors.name?.message} {...register('name')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SearchableSelect
            label="Registered Country"
            placeholder="Select Country"
            searchPlaceholder="Search country..."
            options={countries.map((c) => ({ value: c.code, label: c.name }))}
            value={selectedCountryCode}
            onChange={handleCountryChange}
            error={errors.country?.message}
          />

          <SearchableSelect
            label={currentCountry.stateLabel}
            placeholder={`Select ${currentCountry.stateLabel}`}
            searchPlaceholder={`Search ${currentCountry.stateLabel}...`}
            options={states.map((st) => ({ value: st, label: st }))}
            value={selectedState}
            onChange={handleStateChange}
            error={errors.state?.message}
            disabled={states.length === 0}
          />
        </div>

        <SearchableSelect
          label={currentCountry.lgaLabel || 'City / Municipality'}
          placeholder={!selectedState ? `Select a ${currentCountry.stateLabel.toLowerCase()} first` : `Select ${currentCountry.lgaLabel || 'City'}`}
          searchPlaceholder={`Search ${currentCountry.lgaLabel || 'city'}...`}
          options={citiesOrLgas.map((loc) => ({ value: loc, label: loc }))}
          value={currentCountry.hasLga ? selectedLga : selectedCity}
          onChange={handleCityOrLgaChange}
          error={currentCountry.hasLga ? errors.lga?.message : errors.city?.message}
          disabled={!selectedState || citiesOrLgas.length === 0}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label={currentCountry.registrationLabel} placeholder={currentCountry.registrationPlaceholder} error={errors.registrationNumber?.message} {...register('registrationNumber')} />
          <Input label={currentCountry.taxIdLabel} placeholder={currentCountry.taxIdPlaceholder} error={errors.taxId?.message} {...register('taxId')} />
        </div>

        <SearchableSelect
          label={AppStrings.onboarding.industry}
          placeholder="Select Industry"
          searchPlaceholder="Search industry..."
          options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
          value={watch('industry') || 'Technology & Software'}
          onChange={(val) => setValue('industry', val, { shouldValidate: true })}
          error={errors.industry?.message}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full min-h-[42px] text-label-sm">
          {AppStrings.onboarding.submitProfile}
        </Button>
      </form>
    </Card>
  );
}
