import { Injectable, Logger } from '@nestjs/common';
import { KycProviderType, KycStatus } from '@paycrew/shared-types';
import { IKycProvider, KycProviderResult, LivenessResult } from './kyc.interface';

@Injectable()
export class PremblyKycProvider implements IKycProvider {
  readonly providerName = KycProviderType.PREMBLY;
  private readonly logger = new Logger(PremblyKycProvider.name);
  private readonly apiKey = process.env.PREMBLY_API_KEY || 'test_prembly_key';
  private readonly appId = process.env.PREMBLY_APP_ID || 'test_app_id';

  async verifyBvn(bvn: string): Promise<KycProviderResult> {
    this.logger.log(`Prembly: Verifying BVN (length: ${bvn.length})`);
    const clean = bvn.replace(/\D/g, '');
    const isMockFailure = clean.endsWith('0000');
    const isManualReview = clean.endsWith('9999');

    if (isMockFailure) {
      return {
        success: false,
        status: KycStatus.FAILED,
        providerReference: `pmb_${Date.now()}`,
        reasonCode: 'PREMBLY_BVN_NOT_FOUND',
      };
    }

    if (isManualReview) {
      return {
        success: false,
        status: KycStatus.MANUAL_REVIEW,
        providerReference: `pmb_${Date.now()}`,
        reasonCode: 'PREMBLY_NAME_PARTIAL_MATCH',
      };
    }

    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `pmb_${Date.now()}`,
      firstName: 'OLUWASEUN',
      lastName: 'ADEBAYO',
      phoneNumber: '08012345678',
    };
  }

  async verifyNin(nin: string): Promise<KycProviderResult> {
    this.logger.log(`Prembly: Verifying NIN (length: ${nin.length})`);
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `pmb_nin_${Date.now()}`,
      firstName: 'CHUKWUMA',
      lastName: 'EZE',
    };
  }

  async verifySelfie(selfieBase64: string): Promise<LivenessResult> {
    this.logger.log(`Prembly: Verifying selfie biometric liveness`);
    return {
      matched: true,
      confidenceScore: 98.4,
    };
  }
}
