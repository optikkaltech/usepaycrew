import { Injectable, Logger } from '@nestjs/common';
import { RampProviderType } from '@paycrew/shared-types';
import { IRampProvider } from './ramp.interface';
import { QuidaxRampProvider } from './quidax.provider';
import { YellowCardRampProvider } from './yellowcard.provider';
import { MockRampProvider } from './mock-ramp.provider';

@Injectable()
export class RampProviderFactory {
  private readonly logger = new Logger(RampProviderFactory.name);
  private readonly providers: Map<RampProviderType, IRampProvider> = new Map();

  constructor(
    private readonly quidax: QuidaxRampProvider,
    private readonly yellowCard: YellowCardRampProvider,
    private readonly mockRamp: MockRampProvider,
  ) {
    this.providers.set(RampProviderType.QUIDAX, this.quidax);
    this.providers.set(RampProviderType.YELLOWCARD, this.yellowCard);
    this.providers.set(RampProviderType.MOCK, this.mockRamp);
  }

  getProvider(type: RampProviderType = RampProviderType.QUIDAX): IRampProvider {
    const provider = this.providers.get(type) || this.quidax;
    if (!provider) {
      throw new Error(`Ramp provider ${type} is not available and Quidax is unconfigured.`);
    }
    return provider;
  }

  async executeWithFailover<T>(
    primaryType: RampProviderType,
    operation: (provider: IRampProvider) => Promise<T>,
  ): Promise<T> {
    const primary = this.getProvider(primaryType);
    try {
      return await operation(primary);
    } catch (err: any) {
      this.logger.error(`Primary provider ${primaryType} failed: ${err.message}. Attempting YellowCard failover...`);
      const backup = this.getProvider(RampProviderType.YELLOWCARD);
      return await operation(backup);
    }
  }
}
