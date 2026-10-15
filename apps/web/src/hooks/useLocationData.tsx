'use client';

import { useQuery } from '@tanstack/react-query';
import { LocationService } from '@/services';
import { CountryOption } from '@/app/onboarding/company/_components/company-onboarding.types';

export function useCountries() {
  return useQuery<CountryOption[]>({
    queryKey: ['locations-countries'],
    queryFn: LocationService.getCountries,
    staleTime: 60 * 60 * 1000,
  });
}

export function useCountryConfig(countryCode?: string) {
  return useQuery<CountryOption>({
    queryKey: ['locations-country', countryCode],
    queryFn: () => LocationService.getCountry(countryCode!),
    enabled: !!countryCode,
    staleTime: 60 * 60 * 1000,
  });
}

export function useStates(countryCode?: string) {
  return useQuery<string[]>({
    queryKey: ['locations-states', countryCode],
    queryFn: () => LocationService.getStates(countryCode!),
    enabled: !!countryCode,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCitiesOrLgas(countryCode?: string, stateName?: string) {
  return useQuery<string[]>({
    queryKey: ['locations-cities', countryCode, stateName],
    queryFn: () => LocationService.getCities(countryCode!, stateName!),
    enabled: !!countryCode && !!stateName,
    staleTime: 30 * 60 * 1000,
  });
}
