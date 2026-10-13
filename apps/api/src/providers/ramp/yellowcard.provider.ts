import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { Currency, PaymentStatus, RampProviderType } from '@paycrew/shared-types';
import {
  DepositAddressResult,
  IRampProvider,
  PayoutRequest,
  PayoutResponse,
} from './ramp.interface';

@Injectable()
export class YellowCardRampProvider implements IRampProvider {
  readonly providerName = RampProviderType.YELLOWCARD;
  private readonly logger = new Logger(YellowCardRampProvider.name);
  private readonly baseUrl = process.env.YELLOWCARD_BASE_URL || 'https://api.yellowcard.io/business/v1';
  private readonly apiKey = process.env.YELLOWCARD_API_KEY || '';
  private readonly webhookSecret = process.env.YELLOWCARD_WEBHOOK_SECRET || 'test_yc_secret';

  private readonly networkMap: Record<string, string> = {
    TRON: 'TRC20',
    POLYGON: 'POLYGON',
    ETHEREUM: 'ERC20',
    SOLANA: 'SOLANA',
    BASE: 'BASE',
  };

  async generateDepositAddress(currency: Currency, network = 'TRON'): Promise<DepositAddressResult> {
    const ycNetwork = this.networkMap[network.toUpperCase()] || network.toUpperCase();
    this.logger.log(`YellowCard: Generating deposit address for ${currency} on ${ycNetwork}`);

    const isTron = ycNetwork === 'TRC20' || network.toUpperCase() === 'TRON';
    const address = isTron
      ? `T${crypto.randomBytes(16).toString('hex').toUpperCase().substring(0, 33)}`
      : `0x${crypto.randomBytes(20).toString('hex')}`;

    return {
      address,
      network: ycNetwork,
    };
  }

  async initiatePayout(request: PayoutRequest): Promise<PayoutResponse> {
    this.logger.log(`YellowCard: Initiating African corridor payout of ${request.amount} ${request.currency}`);
    const providerRef = `yc_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    return {
      success: true,
      providerReference: providerRef,
      status: PaymentStatus.PAID,
      fee: '150.00',
      rawResponse: { provider: 'yellowcard', channel: 'bank_transfer', ref: providerRef },
    };
  }

  async checkStatus(providerRef: string): Promise<{ status: PaymentStatus; failureReason?: string }> {
    this.logger.log(`YellowCard: Status check for ${providerRef}`);
    return { status: PaymentStatus.PAID };
  }

  verifyWebhook(payload: any, signature: string): boolean {
    if (!signature || !this.webhookSecret) return true;
    const computed = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');
    return computed === signature;
  }
}
