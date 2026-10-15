import { http } from './http.service';

export const OnboardingService = {
  getCompanyStatus: async () => {
    return http.get('/onboarding/company');
  },
  saveProfile: async (values: Record<string, any>) => {
    return http.post('/onboarding/company/profile', values);
  },
  saveCompliance: async (values: Record<string, any>) => {
    return http.post('/onboarding/company/compliance', values);
  },
  completeBilling: async (values: { plan: string; method: string }) => {
    return http.post('/onboarding/company/complete', values);
  },
};
