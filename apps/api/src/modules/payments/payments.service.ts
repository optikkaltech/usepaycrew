import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentEntity, WorkerEntity } from '../../database/entities';
import { Currency, PaymentStatus } from '@paycrew/shared-types';
import { LedgerService } from '../ledger/ledger.service';
import { CreatePaymentDto, PaymentFeeEstimate, WebhookEventPayload } from './payments.types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    private readonly ledgerService: LedgerService,
    private readonly dataSource: DataSource,
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

    const feeEst = this.calculateFee(dto.amount, dto.currency);

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
        providerReference: `qdx_payout_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
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
