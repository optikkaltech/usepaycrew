import { Injectable, Logger } from '@nestjs/common';
import { KycProviderType } from '@paycrew/shared-types';
import { IKycProvider } from './kyc.interface';
import { PremblyKycProvider } from './prembly.provider';
import { SmileIdKycProvider } from './smile-id.provider';
import { DojahKycProvider } from './dojah.provider';
import { MockKycProvider } from './mock-kyc.provider';

@Injectable()
export class KycProviderFactory {
  private readonly logger = new Logger(KycProviderFactory.name);
  private readonly providers: Map<KycProviderType, IKycProvider> = new Map();

  constructor(
    private readonly prembly: PremblyKycProvider,
    private readonly smileId: SmileIdKycProvider,
    private readonly dojah: DojahKycProvider,
    private readonly mockKyc: MockKycProvider,
  ) {
    this.providers.set(KycProviderType.PREMBLY, this.prembly);
    this.providers.set(KycProviderType.SMILE_ID, this.smileId);
    this.providers.set(KycProviderType.DOJAH, this.dojah);
    this.providers.set(KycProviderType.MOCK, this.mockKyc);
  }

  getProvider(type: KycProviderType = KycProviderType.PREMBLY): IKycProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      this.logger.warn(`KYC Provider ${type} not found. Falling back to Prembly`);
      return this.prembly;
    }
    return provider;
  }

  async verifyWithFailover<T>(
    primaryType: KycProviderType,
    operation: (provider: IKycProvider) => Promise<T>,
  ): Promise<T> {
    const primary = this.getProvider(primaryType);
    try {
      return await operation(primary);
    } catch (err: any) {
      this.logger.error(`Primary KYC provider ${primaryType} failed: ${err.message}. Failing over to Smile ID...`);
      const backup = this.getProvider(KycProviderType.SMILE_ID);
      return await operation(backup);
    }
  }
}
