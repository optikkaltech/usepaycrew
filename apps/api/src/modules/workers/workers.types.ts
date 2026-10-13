import { Currency, PayFrequency } from '@paycrew/shared-types';

export interface CreateWorkerDto {
  name: string;
  email: string;
  country?: string;
  role: string;
  payAmount: string;
  payCurrency: Currency;
  payFrequency: PayFrequency;
}

export interface WorkerAcceptInviteDto {
  token: string;
  password: string;
}
