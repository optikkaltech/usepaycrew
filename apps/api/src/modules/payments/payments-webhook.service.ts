import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, PaymentEntity } from '../../database/entities';
import { Currency, LedgerCategory, LedgerEntryType, PaymentStatus } from '@paycrew/shared-types';
import { LedgerService } from '../ledger/ledger.service';
import { WebhookEventPayload } from './payments.types';

@Injectable()
export class PaymentsWebhookService {
  private readonly logger = new Logger(PaymentsWebhookService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    private readonly ledgerService: LedgerService,
  ) {}

  async handleWebhook(payload: WebhookEventPayload): Promise<{ processed: boolean; action?: string }> {
    const eventName = payload.event || '';

    // Handle Automated Incoming Crypto Deposits (Quidax Ramp buy_transaction or direct deposit)
    if (
      eventName.includes('deposit') ||
      eventName.includes('buy_transaction') ||
      payload.data?.status === 'successful' ||
      payload.data?.status === 'completed'
    ) {
      const address =
        payload.data?.crypto_deposit?.address ||
        payload.data?.recipient_address ||
        payload.data?.wallet_address;
      const amount =
        payload.data?.crypto_deposit?.amount ||
        payload.data?.from_amount ||
        payload.data?.amount;

      if (address && amount) {
        const company = await this.companyRepo.findOne({
          where: { depositWalletAddress: address },
        });
        if (company) {
          const currency =
            (payload.data?.crypto_deposit?.currency || payload.data?.currency)?.toUpperCase() === 'USDC'
              ? Currency.USDC
              : Currency.USDT;

          await this.ledgerService.postEntry({
            companyId: company.id,
            accountType: 'COMPANY',
            amount: parseFloat(amount).toFixed(2),
            currency,
            entryType: LedgerEntryType.CREDIT,
            category: LedgerCategory.DEPOSIT,
            reference: payload.data?.txid || payload.data?.public_id || payload.data?.id || `dep_${Date.now()}`,
            description: `Automated Deposit (${currency}) from Quidax Ramp`,
          });
          this.logger.log(`Credited company ${company.id} with ${amount} ${currency} via Quidax webhook`);
          return { processed: true, action: 'deposit_credited' };
        }
      }
    }

    // Handle Outgoing Payout Status updates (Quidax Ramp sell_transaction.* or standard payout)
    const ref =
      payload.data?.merchant_reference ||
      payload.data?.reference ||
      payload.data?.public_id ||
      payload.data?.id;

    if (ref) {
      const payment = await this.paymentRepo.findOne({
        where: [{ providerReference: ref }, { id: ref }],
      });
      if (payment) {
        const isSuccess =
          eventName === 'sell_transaction.successful' ||
          payload.data?.status === 'PAID' ||
          payload.data?.status === 'successful' ||
          payload.data?.status === 'completed';

        const isFailure =
          eventName === 'sell_transaction.failed' ||
          payload.data?.status === 'FAILED' ||
          payload.data?.status === 'failed' ||
          payload.data?.status === 'needs_attention';

        if (isSuccess) {
          payment.status = PaymentStatus.PAID;
        } else if (isFailure) {
          payment.status = PaymentStatus.FAILED;
          payment.failureReason =
            payload.data?.error_message || payload.data?.failureReason || 'Quidax Ramp payout failed';
        } else if (eventName === 'sell_transaction.processing' || payload.data?.status === 'processing') {
          payment.status = PaymentStatus.PENDING;
        }
        await this.paymentRepo.save(payment);
        return { processed: true, action: 'payout_updated' };
      }
    }

    return { processed: false };
  }
}
