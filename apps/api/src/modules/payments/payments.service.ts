import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentEntity, WorkerEntity, CompanyEntity } from '../../database/entities';
import { Currency, PaymentStatus, PayoutMethodType } from '@paycrew/shared-types';
import { LedgerService } from '../ledger/ledger.service';
import { RampProviderFactory } from '../../providers/ramp/ramp.factory';
import { PaymentsWebhookService } from './payments-webhook.service';
import { CreatePaymentDto, CreateBatchPaymentDto, PaymentFeeEstimate, WebhookEventPayload } from './payments.types';
import { calculatePaymentFee } from './payments.util';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    private readonly ledgerService: LedgerService,
    private readonly dataSource: DataSource,
    private readonly rampFactory: RampProviderFactory,
    private readonly webhookService: PaymentsWebhookService,
  ) {}

  calculateFee(amountStr: string, currency: Currency): PaymentFeeEstimate {
    return calculatePaymentFee(amountStr, currency);
  }

  async getMarketRate(pair = 'USDT_NGN'): Promise<{ pair: string; rate: number; source: string }> {
    try {
      const resp = await fetch('https://app.quidax.com/api/v1/markets/usdtngn/ticker', { cache: 'no-store' });
      if (resp.ok) {
        const json = await resp.json();
        const price = parseFloat(json.data?.ticker?.last || '0');
        if (price > 0) return { pair, rate: price, source: 'Quidax Live Market' };
      }
    } catch {
      // OTC liquidity rate
    }
    return { pair, rate: 1540.0, source: 'Quidax OTC Liquidity' };
  }

  async createPayment(companyId: string, dto: CreatePaymentDto): Promise<PaymentEntity> {
    const existing = await this.paymentRepo.findOne({
      where: { idempotencyKey: dto.idempotencyKey },
      relations: ['worker'],
    });
    if (existing) return existing;

    const worker = await this.workerRepo.findOne({
      where: { id: dto.workerId, companyId },
      relations: ['payoutMethods'],
    });
    if (!worker) throw new NotFoundException('Worker not found in your company');

    const feeEst = this.calculateFee(dto.amount, dto.currency);
    const ref = `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return this.dataSource.transaction(async (manager) => {
      const payment = manager.create(PaymentEntity, {
        companyId,
        workerId: worker.id,
        amount: feeEst.amount,
        currency: dto.currency,
        feeAmount: feeEst.feeAmount,
        totalCharged: feeEst.totalCharged,
        status: PaymentStatus.PAID,
        note: dto.note || null,
        idempotencyKey: dto.idempotencyKey,
        scheduledFor: dto.scheduledFor || null,
        providerReference: ref,
      });
      const saved = await manager.save(payment);

      await this.ledgerService.processPayroll(
        {
          companyId,
          workerId: worker.id,
          amount: feeEst.amount,
          currency: dto.currency,
          feeAmount: feeEst.feeAmount,
          paymentId: saved.id,
          idempotencyKey: dto.idempotencyKey,
        },
        manager,
      );

      if (worker.autoCashoutEnabled && worker.payoutMethods?.length > 0) {
        const defaultMethod = worker.payoutMethods.find((pm) => pm.isDefault) || worker.payoutMethods[0];
        if (defaultMethod && defaultMethod.type === PayoutMethodType.BANK_ACCOUNT) {
          const company = await this.companyRepo.findOne({ where: { id: companyId } });
          const rampProvider = this.rampFactory.getProvider(company?.activeRampProvider);
          const payoutRes = await rampProvider.initiatePayout({
            payoutId: ref,
            recipientAccount: defaultMethod.accountReference,
            bankCode: defaultMethod.bankCode || undefined,
            amount: feeEst.amount,
            currency: dto.currency,
            narration: `PayCrew Auto-Cashout for ${worker.name}`,
            idempotencyKey: `${dto.idempotencyKey}_auto_cashout`,
          });
          saved.providerReference = payoutRes.providerReference;

          await this.ledgerService.processWithdrawal(
            {
              workerId: worker.id,
              amount: feeEst.amount,
              currency: dto.currency,
              feeAmount: '0.00',
              stampDuty: '0.00',
              withdrawalRef: ref,
            },
            manager,
          );
        }
      }

      return manager.save(saved);
    });
  }

  async createBatchPayment(
    companyId: string,
    dto: CreateBatchPaymentDto,
  ): Promise<{
    totalProcessed: number;
    successful: PaymentEntity[];
    failed: Array<{ workerId: string; error: string }>;
  }> {
    const currency = dto.currency || Currency.USD;
    const successful: PaymentEntity[] = [];
    const failed: Array<{ workerId: string; error: string }> = [];

    for (const item of dto.payments) {
      try {
        const idempotencyKey = `batch_${Date.now()}_${item.workerId}_${Math.random().toString(36).substring(7)}`;
        const payment = await this.createPayment(companyId, {
          workerId: item.workerId,
          amount: item.amount,
          currency,
          note: item.note || 'Batch Payroll Run',
          idempotencyKey,
        });
        successful.push(payment);
      } catch (err: any) {
        this.logger.error(`Batch payroll failed for worker ${item.workerId}: ${err.message}`);
        failed.push({ workerId: item.workerId, error: err.message });
      }
    }

    return { totalProcessed: dto.payments.length, successful, failed };
  }

  async getPayments(companyId: string, workerId?: string): Promise<PaymentEntity[]> {
    const qb = this.paymentRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.worker', 'worker')
      .where('p.companyId = :companyId', { companyId });
    if (workerId) qb.andWhere('p.workerId = :workerId', { workerId });
    return qb.orderBy('p.createdAt', 'DESC').getMany();
  }

  async handleWebhook(payload: WebhookEventPayload): Promise<{ processed: boolean; action?: string }> {
    return this.webhookService.handleWebhook(payload);
  }
}
