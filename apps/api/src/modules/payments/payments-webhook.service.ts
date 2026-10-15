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

    // Handle Automated Incoming Crypto Deposits from Quidax
    if (eventName.includes('deposit') || payload.data?.status === 'successful') {
      const address = payload.data.recipient_address || payload.data.wallet_address;
      const amount = payload.data.amount;
      if (address && amount) {
        const company = await this.companyRepo.findOne({
          where: { depositWalletAddress: address },
        });
        if (company) {
          await this.ledgerService.postEntry({
            companyId: company.id,
            accountType: 'COMPANY',
            amount: parseFloat(amount).toFixed(2),
            currency: payload.data.currency?.toUpperCase() === 'USDC' ? Currency.USDC : Currency.USDT,
            entryType: LedgerEntryType.CREDIT,
            category: LedgerCategory.DEPOSIT,
            reference: payload.data.txid || payload.data.id || `dep_${Date.now()}`,
            description: `Automated Deposit (${payload.data.currency?.toUpperCase() || 'USDT'}) from Quidax`,
          });
          this.logger.log(`Credited company ${company.id} with ${amount} USDT via webhook`);
          return { processed: true, action: 'deposit_credited' };
        }
      }
    }

    // Handle Outgoing Payout Status updates
    const ref = payload.data?.reference || payload.data?.id;
    if (ref) {
      const payment = await this.paymentRepo.findOne({ where: { providerReference: ref } });
      if (payment) {
        if (payload.data.status === 'PAID' || payload.data.status === 'successful') {
          payment.status = PaymentStatus.PAID;
        } else if (payload.data.status === 'FAILED') {
          payment.status = PaymentStatus.FAILED;
          payment.failureReason = payload.data.failureReason || 'Payout failed';
        }
        await this.paymentRepo.save(payment);
        return { processed: true, action: 'payout_updated' };
      }
    }

    return { processed: false };
  }
}
