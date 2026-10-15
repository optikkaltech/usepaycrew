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
};
