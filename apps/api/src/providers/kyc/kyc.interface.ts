import { KycProviderType, KycStatus } from '@paycrew/shared-types';

export interface KycProviderResult {
  success: boolean;
  status: KycStatus;
  providerReference: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  reasonCode?: string;
  rawResponse?: any;
}

export interface LivenessResult {
  matched: boolean;
  confidenceScore: number;
  reasonCode?: string;
}

export interface IKycProvider {
  readonly providerName: KycProviderType;
  verifyBvn(bvn: string): Promise<KycProviderResult>;
  verifyNin(nin: string): Promise<KycProviderResult>;
  verifySelfie(selfieBase64: string, idNumber?: string): Promise<LivenessResult>;
}
