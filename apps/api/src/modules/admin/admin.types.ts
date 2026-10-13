import { KycStatus } from '@paycrew/shared-types';

export interface ReviewKycDto {
  status: KycStatus.APPROVED | KycStatus.FAILED;
  reasonCode?: string;
}

export interface RetryPaymentDto {
  paymentId: string;
}
