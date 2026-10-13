import { KycCheckType, KycStatus } from '@paycrew/shared-types';

export interface SubmitKycDto {
  checkType: KycCheckType;
  identifier: string; // Raw BVN or NIN
  selfieBase64?: string;
}

export interface KycVerificationResult {
  id: string;
  checkType: KycCheckType;
  status: KycStatus;
  maskedIdentifier: string;
  reasonCode?: string | null;
  createdAt: Date;
}
