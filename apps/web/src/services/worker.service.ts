import { http } from './http.service';

export const WorkerService = {
  getAll: async () => {
    return http.get('/workers');
  },
  getById: async (id: string) => {
    return http.get(`/workers/${id}`);
  },
  create: async (payload: Record<string, any>) => {
    return http.post('/workers', payload);
  },
  update: async (id: string, payload: Record<string, any>) => {
    return http.patch(`/workers/${id}`, payload);
  },
  delete: async (id: string) => {
    return http.delete(`/workers/${id}`);
  },
  updateProfile: async (id: string, payload: { name?: string; email?: string; role?: string; country?: string }) => {
    return http.patch(`/workers/${id}/profile`, payload);
  },
  updatePreferences: async (id: string, payload: { autoCashoutEnabled: boolean }) => {
    return http.patch(`/workers/${id}/preferences`, payload);
  },
  getBalance: async () => {
    return http.get('/ledger/worker-balance?currency=USD');
  },
  getPayments: async (workerId: string) => {
    return http.get(`/payments?workerId=${workerId}`);
  },
  getMarketRate: async () => {
    return http.get('/payments/rate');
  },
};
