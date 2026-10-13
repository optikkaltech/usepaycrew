import { Currency, PaymentStatus, RampProviderType } from '@paycrew/shared-types';

export interface DepositAddressResult {
  address: string;
  network: string;
  memo?: string;
  expiresAt?: Date;
}

export interface PayoutRequest {
  payoutId: string;
  recipientAccount: string;
  recipientName?: string;
  bankCode?: string;
  amount: string;
  currency: Currency;
  narration?: string;
  idempotencyKey: string;
}

export interface PayoutResponse {
  success: boolean;
  providerReference: string;
  status: PaymentStatus;
  fee: string;
  rawResponse?: any;
}

export interface IRampProvider {
  readonly providerName: RampProviderType;
  generateDepositAddress(currency: Currency, network?: string): Promise<DepositAddressResult>;
  initiatePayout(request: PayoutRequest): Promise<PayoutResponse>;
  checkStatus(providerRef: string): Promise<{ status: PaymentStatus; failureReason?: string }>;
  verifyWebhook(payload: any, signature: string): boolean;
}
