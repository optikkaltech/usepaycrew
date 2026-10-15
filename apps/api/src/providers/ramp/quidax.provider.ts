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
export class QuidaxRampProvider implements IRampProvider {
  readonly providerName = RampProviderType.QUIDAX;
  private readonly logger = new Logger(QuidaxRampProvider.name);
  private readonly baseUrl = process.env.QUIDAX_BASE_URL || 'https://app.quidax.com/api/v1';
  private readonly secretKey = process.env.QUIDAX_SECRET_KEY || '';
  private readonly webhookSecret = process.env.QUIDAX_WEBHOOK_SECRET || 'test_quidax_secret';

  // Network mapping from enterprise symbol to Quidax query parameter
  private readonly networkMap: Record<string, string> = {
    TRON: 'trc20',
    POLYGON: 'polygon',
    BASE: 'base',
    ETHEREUM: 'erc20',
    BSC: 'bep20',
    SOLANA: 'solana',
    ARBITRUM: 'arbitrum',
  };

  private isMockMode(): boolean {
    return !this.secretKey || this.secretKey.startsWith('sec_test_');
  }

  async generateDepositAddress(currency: Currency, network = 'TRON'): Promise<DepositAddressResult> {
    const qdxCurrency = currency.toLowerCase();
    const qdxNetwork = this.networkMap[network.toUpperCase()] || network.toLowerCase();
    this.logger.log(`Quidax: Requesting deposit address for ${qdxCurrency} on ${qdxNetwork}`);

    if (!this.isMockMode()) {
      try {
        const resp = await fetch(`${this.baseUrl}/users/me/wallets/${qdxCurrency}/addresses?network=${qdxNetwork}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        });
        const json = await resp.json();
        if (resp.ok && json.data?.address) {
          return {
            address: json.data.address,
            network: qdxNetwork.toUpperCase(),
            memo: json.data.destination_tag || undefined,
          };
        }
        throw new Error(json.message || `Quidax address generation failed: HTTP ${resp.status}`);
      } catch (err: any) {
        this.logger.error(`Quidax API address request failed: ${err.message}`);
        throw err;
      }
    }

    // High-fidelity fallback for sandbox
    const prefix = network.toUpperCase() === 'TRON' ? 'T' : '0x';
    const address = prefix === 'T'
      ? `T${crypto.randomBytes(16).toString('hex').toUpperCase().substring(0, 33)}`
      : `0x${crypto.randomBytes(20).toString('hex')}`;

    return {
      address,
      network: qdxNetwork.toUpperCase(),
    };
  }

  async initiatePayout(request: PayoutRequest): Promise<PayoutResponse> {
    const qdxCurrency = request.currency.toLowerCase();
    this.logger.log(`Quidax: Initiating payout of ${request.amount} ${qdxCurrency} to ${request.recipientAccount}`);

    if (!this.isMockMode()) {
      try {
        const resp = await fetch(`${this.baseUrl}/users/me/withdraws`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currency: qdxCurrency,
            amount: request.amount,
            fund_uid: request.recipientAccount,
            transaction_note: request.narration || 'PayCrew Contractor Payout',
            reference: request.idempotencyKey,
          }),
        });
        const json = await resp.json();
        if (resp.ok && json.data) {
          return {
            success: true,
            providerReference: json.data.id || json.data.reference,
            status: PaymentStatus.PAID,
            fee: json.data.fee || '150.00',
            rawResponse: json.data,
          };
        }
        throw new Error(json.message || `Quidax payout failed: HTTP ${resp.status}`);
      } catch (err: any) {
        this.logger.error(`Quidax payout failed: ${err.message}`);
        throw err;
      }
    }

    return {
      success: true,
      providerReference: `qdx_tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      status: PaymentStatus.PAID,
      fee: '150.00',
      rawResponse: { provider: 'quidax', status: 'success' },
    };
  }

  async checkStatus(providerRef: string): Promise<{ status: PaymentStatus; failureReason?: string }> {
    this.logger.log(`Quidax: Checking withdrawal status for ${providerRef}`);
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
