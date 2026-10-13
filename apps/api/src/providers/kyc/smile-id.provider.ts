import { Injectable, Logger } from '@nestjs/common';
import { KycProviderType, KycStatus } from '@paycrew/shared-types';
import { IKycProvider, KycProviderResult, LivenessResult } from './kyc.interface';

@Injectable()
export class SmileIdKycProvider implements IKycProvider {
  readonly providerName = KycProviderType.SMILE_ID;
  private readonly logger = new Logger(SmileIdKycProvider.name);
  private readonly partnerId = process.env.SMILE_ID_PARTNER_ID || 'sandbox_partner';

  async verifyBvn(bvn: string): Promise<KycProviderResult> {
    this.logger.log(`Smile ID: Enhanced KYC BVN verification`);
    const clean = bvn.replace(/\D/g, '');
    const isMockFailure = clean.endsWith('0000');

    if (isMockFailure) {
      return {
        success: false,
        status: KycStatus.FAILED,
        providerReference: `sid_${Date.now()}`,
        reasonCode: 'SMILE_ID_NO_MATCH',
      };
    }

    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `sid_${Date.now()}`,
      firstName: 'FATIMA',
      lastName: 'BELLO',
    };
  }

  async verifyNin(nin: string): Promise<KycProviderResult> {
    this.logger.log(`Smile ID: Enhanced KYC NIN check`);
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `sid_nin_${Date.now()}`,
    };
  }

  async verifySelfie(selfieBase64: string): Promise<LivenessResult> {
    this.logger.log(`Smile ID: SmartSelfie biometric liveness analysis`);
    return {
      matched: true,
      confidenceScore: 99.2,
    };
  }
}
