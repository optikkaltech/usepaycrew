import { http } from './http.service';

export const PayoutService = {
  getBanks: async () => {
    return http.get('/payout-methods/banks');
  },
  lookupBank: async (accountNumber: string, bankCode: string) => {
    return http.get(`/payout-methods/lookup-bank?accountNumber=${accountNumber}&bankCode=${bankCode}`);
  },
  linkBank: async (workerId: string, payload: { accountNumber: string; bankCode: string; bankName: string }) => {
    return http.post(`/payout-methods/${workerId}/bank`, payload);
  },
  getWithdrawalEstimate: async (amount: string, currency: string = 'USD') => {
    return http.get(`/withdrawals/estimate?amount=${amount}&currency=${currency}`);
  },
  executeWithdrawal: async (payload: {
    workerId: string;
    amount: string;
    currency: string;
    payoutMethodId: string;
    otpOrPin?: string;
  }) => {
    return http.post('/withdrawals/execute', payload);
  },
  getMethods: async (workerId: string) => {
    return http.get(`/payout-methods/${workerId}`);
  },
  setDefaultMethod: async (methodId: string) => {
    return http.patch(`/payout-methods/${methodId}/default`, {});
  },
  deleteMethod: async (methodId: string) => {
    return http.delete(`/payout-methods/${methodId}`);
  },
};
