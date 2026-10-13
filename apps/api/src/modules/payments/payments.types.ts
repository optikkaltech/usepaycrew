import { Currency, PaymentStatus } from '@paycrew/shared-types';

export interface CreatePaymentDto {
  workerId: string;
  amount: string;
  currency: Currency;
  note?: string;
  idempotencyKey: string;
  scheduledFor?: Date;
}

export interface PaymentFeeEstimate {
  amount: string;
  currency: Currency;
  feePercentage: number;
  feeAmount: string;
  totalCharged: string;
}

export interface WebhookEventPayload {
  event: string;
  data: {
    reference: string;
    status: 'PAID' | 'FAILED' | 'REVERSED';
    providerTxId?: string;
    failureReason?: string;
  };
}
