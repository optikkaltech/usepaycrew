import { Injectable } from '@nestjs/common';
import { Currency, PaymentStatus, RampProviderType } from '@paycrew/shared-types';
import {
  DepositAddressResult,
  IRampProvider,
  PayoutRequest,
  PayoutResponse,
} from './ramp.interface';

@Injectable()
export class MockRampProvider implements IRampProvider {
  readonly providerName = RampProviderType.MOCK;

  async generateDepositAddress(currency: Currency, network = 'Polygon'): Promise<DepositAddressResult> {
    return {
      address: '0x71C8fb866336650E4F4259b3A6D63Ea4B0866952',
      network,
    };
  }

  async initiatePayout(request: PayoutRequest): Promise<PayoutResponse> {
    return {
      success: true,
      providerReference: `mock_ramp_tx_${Date.now()}`,
      status: PaymentStatus.PAID,
      fee: '150.00',
    };
  }

  async checkStatus(): Promise<{ status: PaymentStatus; failureReason?: string }> {
    return { status: PaymentStatus.PAID };
  }

  verifyWebhook(): boolean {
    return true;
  }
}
