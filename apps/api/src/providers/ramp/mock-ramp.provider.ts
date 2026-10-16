import { Injectable, BadRequestException } from '@nestjs/common';
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
    throw new BadRequestException(
      `No live crypto wallet address configured for ${currency} on ${network}. Please configure Quidax with live API credentials to generate real blockchain deposit addresses.`
    );
  }

  async initiatePayout(request: PayoutRequest): Promise<PayoutResponse> {
    throw new BadRequestException(
      'Live crypto payout rails required. Please configure Quidax or YellowCard credentials.'
    );
  }

  async checkStatus(): Promise<{ status: PaymentStatus; failureReason?: string }> {
    return { status: PaymentStatus.FAILED, failureReason: 'Live ramp provider required' };
  }

  verifyWebhook(): boolean {
    return false;
  }
}
