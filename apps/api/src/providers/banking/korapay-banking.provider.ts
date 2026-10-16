import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  BankAccountResolution,
  BankInfo,
  CheckoutParams,
  CheckoutResult,
  IBankingProvider,
  NairaDisbursementParams,
  VirtualAccountDetails,
} from './banking.interface';

@Injectable()
export class KorapayBankingProvider implements IBankingProvider {
  private readonly logger = new Logger(KorapayBankingProvider.name);
  private readonly baseUrl = (process.env.KORAPAY_BASE_URL || 'https://api.korapay.com/merchant/api').replace(/\/v1\/?$/, '');
  private readonly secretKey = process.env.KORAPAY_SECRET_KEY || '';
  private readonly publicKey = process.env.KORAPAY_PUBLIC_KEY || '';

  async resolveAccount(accountNumber: string, bankCode: string): Promise<BankAccountResolution> {
    this.logger.log(`Korapay: Resolving NUBAN ***${accountNumber.slice(-4)} on bank ${bankCode}`);

    if (!this.secretKey && !this.publicKey) {
      throw new BadRequestException('Korapay API credentials are not configured in environment (KORAPAY_SECRET_KEY)');
    }

    const resp = await fetch(`${this.baseUrl}/v1/misc/banks/resolve`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey || this.publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bank: bankCode, account: accountNumber, currency: 'NGN' }),
    });

    const json = await resp.json();
    if (resp.ok && json.data?.account_name) {
      return {
        accountNumber: json.data.account_number || accountNumber,
        bankCode,
        accountName: json.data.account_name,
        bankName: json.data.bank_name || 'Nigerian Commercial Bank',
      };
    }

    throw new BadRequestException(
      json.message || `Unable to resolve account ${accountNumber} on bank ${bankCode} via Korapay`
    );
  }

  async getBanks(): Promise<BankInfo[]> {
    if (!this.secretKey && !this.publicKey) {
      throw new BadRequestException('Korapay API credentials are not configured (KORAPAY_SECRET_KEY / KORAPAY_PUBLIC_KEY)');
    }

    const resp = await fetch(`${this.baseUrl}/v1/misc/banks?countryCode=NG`, {
      headers: { Authorization: `Bearer ${this.publicKey || this.secretKey}` },
    });

    const json = await resp.json();
    if (resp.ok && Array.isArray(json.data)) {
      return json.data.map((b: any) => ({
        code: b.code || b.slug,
        name: b.name,
      }));
    }

    throw new BadRequestException(json.message || 'Failed to fetch Nigerian commercial banks list from Korapay API');
  }

  async disburseNaira(params: NairaDisbursementParams): Promise<{ success: boolean; reference: string }> {
    this.logger.log(`Korapay: Disbursing ₦${params.amount} to ${params.accountNumber} (${params.reference})`);
    if (!this.secretKey) {
      throw new BadRequestException('KORAPAY_SECRET_KEY is not configured for disbursements');
    }

    const resp = await fetch(`${this.baseUrl}/v1/transactions/disburse`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: params.reference,
        destination: {
          type: 'bank_account',
          amount: params.amount,
          currency: 'NGN',
          narration: params.narration,
          bank_account: { bank: params.bankCode, account: params.accountNumber },
        },
      }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      throw new BadRequestException(json.message || 'Korapay disbursement transaction failed');
    }

    return { success: true, reference: json.data?.reference || params.reference };
  }

  async createVirtualAccount(companyName: string, reference: string, bvn?: string): Promise<VirtualAccountDetails> {
    this.logger.log(`Korapay: Provisioning dedicated virtual funding NUBAN for ${companyName}`);
    if (!this.secretKey) {
      throw new BadRequestException('KORAPAY_SECRET_KEY is not configured for virtual accounts');
    }

    const payload: any = {
      account_name: `PayCrew - ${companyName}`,
      account_reference: reference,
      permanent: true,
      bank_code: '000',
      customer: { name: companyName, email: `billing+${reference}@paycrew.io` },
    };

    if (bvn) {
      payload.kyc = { bvn };
    }

    const resp = await fetch(`${this.baseUrl}/v1/virtual-bank-account`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();
    if (resp.ok && json.data?.account_number) {
      return {
        accountNumber: json.data.account_number,
        accountName: json.data.account_name,
        bankName: json.data.bank_name || 'Test Bank',
        bankCode: json.data.bank_code || '000',
        reference,
      };
    }

    throw new BadRequestException(
      json.message || 'Failed to create dedicated virtual bank account via Korapay'
    );
  }

  async initializeCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    this.logger.log(`Korapay: Initializing checkout charge of ₦${params.amount} for ${params.customerName}`);
    if (!this.secretKey) {
      throw new BadRequestException('KORAPAY_SECRET_KEY is not configured for checkout charges');
    }

    const resp = await fetch(`${this.baseUrl}/v1/charges/initialize`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: params.reference,
        amount: params.amount,
        currency: 'NGN',
        customer: { name: params.customerName, email: params.customerEmail },
        narration: params.narration || 'PayCrew Subscription',
        redirect_url: params.redirectUrl,
      }),
    });

    const json = await resp.json();
    if (resp.ok && json.data?.checkout_url) {
      return { checkoutUrl: json.data.checkout_url, reference: json.data.reference || params.reference };
    }

    throw new BadRequestException(
      json.message || 'Korapay checkout initialization failed'
    );
  }

  verifyWebhook(payload: any, signature: string): boolean {
    if (!signature || !this.secretKey) return true;
    const computed = crypto
      .createHmac('sha256', this.secretKey)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');
    return computed === signature;
  }
}
