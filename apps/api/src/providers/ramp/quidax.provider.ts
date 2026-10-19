import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Currency, PaymentStatus, RampProviderType } from '@paycrew/shared-types';
import {
  DepositAddressResult,
  IRampProvider,
  PayoutRequest,
  PayoutResponse,
  RampQuoteResult,
} from './ramp.interface';

@Injectable()
export class QuidaxRampProvider implements IRampProvider {
  readonly providerName = RampProviderType.QUIDAX;
  private readonly logger = new Logger(QuidaxRampProvider.name);

  private readonly rampBaseUrl = process.env.QUIDAX_RAMP_BASE_URL || 'https://ramp-be.quidax.io';
  private readonly rampPrivateKey = process.env.QUIDAX_RAMP_PRIVATE_KEY || '';
  private readonly rampWebhookSecret = process.env.QUIDAX_RAMP_WEBHOOK_SECRET || process.env.QUIDAX_WEBHOOK_SECRET || 'test_quidax_secret';

  private normalizeNetwork(net: string): { quidaxNet: string; envKey: string } {
    const u = (net || '').toUpperCase();
    if (u.includes('TRON') || u.includes('TRC')) return { quidaxNet: 'trc20', envKey: 'TRON' };
    if (u.includes('BNB') || u.includes('BEP') || u.includes('BSC')) return { quidaxNet: 'bep20', envKey: 'BNB' };
    if (u.includes('POLYGON') || u.includes('MATIC')) return { quidaxNet: 'polygon', envKey: 'POLYGON' };
    if (u.includes('ETH') || u.includes('ERC')) return { quidaxNet: 'erc20', envKey: 'ETHEREUM' };
    if (u.includes('BASE')) return { quidaxNet: 'base', envKey: 'BASE' };
    if (u.includes('SOL')) return { quidaxNet: 'solana', envKey: 'SOLANA' };
    return { quidaxNet: (net || 'trc20').toLowerCase(), envKey: u.replace(/[^A-Z0-9]/g, '_') };
  }

  private isMockMode(): boolean {
    return !this.rampPrivateKey || this.rampPrivateKey.startsWith('sk_test_quidax_ramp_key');
  }

  async getQuote(amount = '10', token = 'usdt', currency = 'ngn', network = 'bep20'): Promise<RampQuoteResult> {
    const qdxToken = token.toLowerCase();
    const qdxCurrency = currency.toLowerCase();
    const { quidaxNet } = this.normalizeNetwork(network);
    const queryAmount = parseFloat(amount) < 10 ? '10' : amount;

    if (!this.isMockMode()) {
      try {
        const url = `${this.rampBaseUrl}/api/v1/merchants/purchase_quotes/sell?token=${qdxToken}&currency=${qdxCurrency}&token_amount=${queryAmount}&token_network=${quidaxNet}`;
        const resp = await fetch(url, { headers: { 'x-private-key': this.rampPrivateKey, accept: 'application/json' } });
        const json = await resp.json();
        if (resp.ok && json.data?.to_amount) {
          const toAmountNum = parseFloat(json.data.to_amount);
          const tokenAmountNum = parseFloat(queryAmount);
          const effectiveRate = tokenAmountNum > 0 ? toAmountNum / tokenAmountNum : toAmountNum;
          return { rate: Math.round(effectiveRate * 100) / 100, fee: json.data.fee || '50.0', toAmount: json.data.to_amount, source: 'Quidax Ramp Live Quote' };
        }
        throw new Error(json.message || `Quidax Ramp returned HTTP ${resp.status}`);
      } catch (err: any) {
        this.logger.error(`Quidax Ramp live quote error: ${err.message}`);
        throw new Error(`Quidax live quote unavailable: ${err.message}`);
      }
    }
    throw new Error('Quidax Ramp API key is not configured or in mock mode');
  }

  async generateDepositAddress(currency: Currency, network = 'TRON'): Promise<DepositAddressResult> {
    const qdxCurrency = currency.toLowerCase();
    const { quidaxNet, envKey } = this.normalizeNetwork(network);

    const configuredAddress =
      process.env[`QUIDAX_DEPOSIT_ADDRESS_${envKey}`] ||
      process.env[`QUIDAX_DEPOSIT_ADDRESS_${network.toUpperCase()}`] ||
      process.env.QUIDAX_DEPOSIT_WALLET_ADDRESS;

    if (configuredAddress) {
      return { address: configuredAddress, network: quidaxNet.toUpperCase() };
    }

    const candidateKeys = [
      process.env.QUIDAX_PUBLIC_KEY,
      process.env.QUIDAX_API_KEY,
      process.env.QUIDAX_SECRET_KEY,
    ].filter((k): k is string => Boolean(k && !k.startsWith('sk_test_') && !k.startsWith('sec_test_')));

    for (const key of candidateKeys) {
      try {
        const listUrl = `https://openapi.quidax.io/exchange-open-api/api/v1/users/me/wallets/${qdxCurrency}/addresses`;
        const listResp = await fetch(listUrl, { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } });
        const listJson = await listResp.json();
        if (listResp.ok && Array.isArray(listJson.data)) {
          const matched = listJson.data.find((a: any) =>
            a.currency?.toLowerCase() === qdxCurrency &&
            (!a.network || a.network.toLowerCase() === quidaxNet.toLowerCase())
          );
          if (matched?.address) return { address: matched.address, network: (matched.network || quidaxNet).toUpperCase() };
        }

        const postUrl = `https://openapi.quidax.io/exchange-open-api/api/v1/users/me/wallets/${qdxCurrency}/addresses?network=${quidaxNet}`;
        const resp = await fetch(postUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json' },
        });
        const json = await resp.json();
        if (resp.ok && json.data?.address) {
          return { address: json.data.address, network: quidaxNet.toUpperCase() };
        }
      } catch (err: any) {
        this.logger.warn(`Quidax live address lookup failed: ${err.message}`);
      }
    }

    throw new BadRequestException(
      `No live crypto wallet address configured for ${currency} on ${network} (${quidaxNet.toUpperCase()}). Please configure Quidax with live API credentials or set QUIDAX_DEPOSIT_ADDRESS_${envKey} in your environment.`
    );
  }

  async initiatePayout(request: PayoutRequest): Promise<PayoutResponse> {
    const qdxCurrency = request.currency.toLowerCase();
    this.logger.log(`Quidax Ramp: Initiating custodial off-ramp of ${request.amount} ${qdxCurrency} to ${request.recipientAccount}`);

    if (!this.isMockMode()) {
      try {
        const [firstName, ...rest] = (request.recipientName || 'Contractor').split(' ');
        const headers = { 'x-private-key': this.rampPrivateKey, 'Content-Type': 'application/json', accept: 'application/json' };

        // 1. Initiate off-ramp transaction with Quidax Ramp
        const initResp = await fetch(`${this.rampBaseUrl}/api/v1/merchants/custodial/off_ramp_transactions/initiate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from_currency: qdxCurrency,
            to_currency: 'ngn',
            from_amount: request.amount,
            network: 'bep20',
            customer: { email: `${request.recipientAccount}@paycrew.internal`, first_name: firstName, last_name: rest.join(' ') || 'User' },
            merchant_reference: request.idempotencyKey,
          }),
        });
        const initJson = await initResp.json();
        if (!initResp.ok) throw new Error(initJson.message || `Quidax initiate failed HTTP ${initResp.status}`);

        // 2. Attach destination bank account
        const bankResp = await fetch(
          `${this.rampBaseUrl}/api/v1/merchants/custodial/off_ramp_transactions/${request.idempotencyKey}/bank_account`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ currency_code: 'ngn', bank_code: request.bankCode || '058', account_number: request.recipientAccount }),
          },
        );
        const bankJson = await bankResp.json();
        if (!bankResp.ok) throw new Error(bankJson.message || `Quidax bank attach failed HTTP ${bankResp.status}`);

        // 3. Confirm transaction
        await fetch(`${this.rampBaseUrl}/api/v1/merchants/custodial/off_ramp_transactions/${request.idempotencyKey}/confirm`, {
          method: 'POST',
          headers: { 'x-private-key': this.rampPrivateKey, accept: 'application/json' },
        });

        return {
          success: true,
          providerReference: initJson.data?.reference || request.idempotencyKey,
          status: PaymentStatus.PENDING,
          fee: initJson.data?.stamp_charge || '50.00',
          rawResponse: initJson.data,
        };
      } catch (err: any) {
        this.logger.error(`Quidax Ramp payout failed: ${err.message}`);
        throw err;
      }
    }
    throw new BadRequestException('Quidax Ramp private key missing or invalid. Live credentials required.');
  }

  async checkStatus(providerRef: string): Promise<{ status: PaymentStatus; failureReason?: string }> {
    this.logger.log(`Quidax Ramp: Requerying transaction ${providerRef}`);
    if (!this.isMockMode()) {
      try {
        const resp = await fetch(`${this.rampBaseUrl}/api/v1/merchants/off_ramp_transaction/${providerRef}`, {
          headers: { 'x-private-key': this.rampPrivateKey, accept: 'application/json' },
        });
        const json = await resp.json();
        if (resp.ok && json.data) {
          if (json.data.status === 'completed') return { status: PaymentStatus.PAID };
          if (json.data.status === 'failed' || json.data.status === 'needs_attention') {
            return { status: PaymentStatus.FAILED, failureReason: json.data.error_message || 'Ramp payout failed' };
          }
          return { status: PaymentStatus.PENDING };
        }
      } catch (err: any) {
        this.logger.error(`Quidax Ramp requery error: ${err.message}`);
      }
    }
    throw new BadRequestException('Quidax live credentials required to query payout status.');
  }

  verifyWebhook(payload: any, signature: string): boolean {
    if (!signature || !this.rampWebhookSecret) return true;
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', this.rampWebhookSecret).update(data).digest('hex') === signature;
  }
}
