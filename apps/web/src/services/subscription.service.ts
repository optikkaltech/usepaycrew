import { http } from './http.service';

export interface InitiateSubscriptionPayload {
  currency: string;
  paymentMethod: string;
  network?: string;
  plan: string;
}

export interface SubscriptionInitiateResponse {
  reference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  checkoutUrl?: string;
  depositAddress?: string;
  network?: string;
}

export const SubscriptionService = {
  getPlans: async (country?: string) => {
    return http.get(`/subscriptions/plans${country ? `?country=${country}` : ''}`);
  },
  getSummary: async () => {
    return http.get('/subscriptions/summary');
  },
  initiate: async (payload: InitiateSubscriptionPayload): Promise<SubscriptionInitiateResponse> => {
    return http.post<SubscriptionInitiateResponse>('/subscriptions/initiate', payload);
  },
};
