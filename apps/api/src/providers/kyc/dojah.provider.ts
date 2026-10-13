import { Injectable, Logger } from '@nestjs/common';
import { KycProviderType, KycStatus } from '@paycrew/shared-types';
import { IKycProvider, KycProviderResult, LivenessResult } from './kyc.interface';

@Injectable()
export class DojahKycProvider implements IKycProvider {
  readonly providerName = KycProviderType.DOJAH;
  private readonly logger = new Logger(DojahKycProvider.name);

  async verifyBvn(bvn: string): Promise<KycProviderResult> {
    this.logger.log(`Dojah: Financial lookup for BVN`);
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `djh_${Date.now()}`,
      firstName: 'BABATUNDE',
      lastName: 'BAKARE',
    };
  }

  async verifyNin(nin: string): Promise<KycProviderResult> {
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `djh_nin_${Date.now()}`,
    };
  }

  async verifySelfie(): Promise<LivenessResult> {
    return {
      matched: true,
      confidenceScore: 97.5,
    };
  }
}
