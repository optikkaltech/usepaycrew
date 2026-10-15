import { http } from './http.service';

export const KycService = {
  submitWorkerKyc: async (workerId: string, payload: { checkType: string; identifier: string }) => {
    return http.post(`/kyc/${workerId}/submit`, payload);
  },
};
