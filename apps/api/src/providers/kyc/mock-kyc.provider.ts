import { Injectable } from '@nestjs/common';
import { KycProviderType, KycStatus } from '@paycrew/shared-types';
import { IKycProvider, KycProviderResult, LivenessResult } from './kyc.interface';

@Injectable()
export class MockKycProvider implements IKycProvider {
  readonly providerName = KycProviderType.MOCK;

  async verifyBvn(bvn: string): Promise<KycProviderResult> {
    const clean = bvn.replace(/\D/g, '');
    if (clean.endsWith('0000')) {
      return {
        success: false,
        status: KycStatus.FAILED,
        providerReference: `mock_${Date.now()}`,
        reasonCode: 'MOCK_DATA_MISMATCH',
      };
    }
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `mock_${Date.now()}`,
      firstName: 'DEMO',
      lastName: 'CONTRACTOR',
    };
  }

  async verifyNin(): Promise<KycProviderResult> {
    return {
      success: true,
      status: KycStatus.APPROVED,
      providerReference: `mock_nin_${Date.now()}`,
    };
  }

  async verifySelfie(): Promise<LivenessResult> {
    return {
      matched: true,
      confidenceScore: 99.0,
    };
  }
}
