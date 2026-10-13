import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentEntity, WorkerEntity, CompanyEntity } from '../../database/entities';
import { Currency, PaymentStatus } from '@paycrew/shared-types';
import { LedgerService } from '../ledger/ledger.service';
import { RampProviderFactory } from '../../providers/ramp/ramp.factory';
import { CreatePaymentDto, PaymentFeeEstimate, WebhookEventPayload } from './payments.types';

@Injectable()
export class PaymentsService {
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
  ) {}


  calculateFee(amountStr: string, currency: Currency): PaymentFeeEstimate {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const feePct = 0.01;
    let fee = amount * feePct;
    const minFee = currency === Currency.NGN ? 500 : 0.5;
    if (fee < minFee) fee = minFee;

    const total = amount + fee;
    return {
      amount: amount.toFixed(2),
      currency,
      feePercentage: 1.0,
      feeAmount: fee.toFixed(2),
      totalCharged: total.toFixed(2),
    };
  }

  async createPayment(companyId: string, dto: CreatePaymentDto): Promise<PaymentEntity> {
    const existing = await this.paymentRepo.findOne({
      where: { idempotencyKey: dto.idempotencyKey },
      relations: ['worker'],
    });
    if (existing) return existing;

    const worker = await this.workerRepo.findOne({
      where: { id: dto.workerId, companyId },
    });
    if (!worker) throw new NotFoundException('Worker not found in your company');

    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    const feeEst = this.calculateFee(dto.amount, dto.currency);
    const rampProvider = this.rampFactory.getProvider(company?.activeRampProvider);
    const ref = `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    let providerRef = ref;

    if (dto.currency === Currency.USDT || dto.currency === Currency.USDC) {
      const payoutRes = await rampProvider.initiatePayout({
        payoutId: ref,
        recipientAccount: '0x323b5d4c32345ced773f21e087',
        amount: feeEst.amount,
        currency: dto.currency,
        idempotencyKey: dto.idempotencyKey,
      });
      providerRef = payoutRes.providerReference;
    }


    return this.dataSource.transaction(async (manager) => {
      const payment = manager.create(PaymentEntity, {
        companyId,
        workerId: worker.id,
        amount: feeEst.amount,
        currency: dto.currency,
        feeAmount: feeEst.feeAmount,
        totalCharged: feeEst.totalCharged,
        status: PaymentStatus.SUBMITTED,
        note: dto.note || null,
        idempotencyKey: dto.idempotencyKey,
        scheduledFor: dto.scheduledFor || null,
        providerReference: providerRef,
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

      saved.status = PaymentStatus.PAID;
      return manager.save(saved);
    });
  }

  async getPayments(companyId: string, workerId?: string): Promise<PaymentEntity[]> {
    const qb = this.paymentRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.worker', 'worker')
      .where('p.companyId = :companyId', { companyId });

    if (workerId) qb.andWhere('p.workerId = :workerId', { workerId });
    return qb.orderBy('p.createdAt', 'DESC').getMany();
  }

  async handleWebhook(payload: WebhookEventPayload): Promise<{ processed: boolean }> {
    const payment = await this.paymentRepo.findOne({
      where: { providerReference: payload.data.reference },
    });
    if (!payment) return { processed: false };

    if (payload.data.status === 'PAID') {
      payment.status = PaymentStatus.PAID;
    } else if (payload.data.status === 'FAILED') {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = payload.data.failureReason || 'Provider payout failed';
    }
    await this.paymentRepo.save(payment);
    return { processed: true };
  }
}
