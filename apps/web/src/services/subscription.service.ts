import { http } from './http.service';

export interface InitiateSubscriptionPayload {
  currency: string;
  paymentMethod: string;
  network: string;
  plan: string;
}

export const SubscriptionService = {
  initiate: async (payload: InitiateSubscriptionPayload) => {
    return http.post('/subscriptions/initiate', payload);
  },
};
