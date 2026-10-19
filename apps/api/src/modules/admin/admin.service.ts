import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  AuditLogEntity,
  KycCheckEntity,
  PaymentEntity,
  WorkerEntity,
} from '../../database/entities';
import { KycStatus, PaymentStatus, WorkerStatus } from '@paycrew/shared-types';
import { ReviewKycDto } from './admin.types';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(KycCheckEntity)
    private readonly kycRepo: Repository<KycCheckEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
  ) {}

  async getKycQueue(): Promise<KycCheckEntity[]> {
    return this.kycRepo.find({
      where: {
        status: In([KycStatus.FAILED, KycStatus.MANUAL_REVIEW, KycStatus.PENDING]),
      },
      relations: ['worker', 'worker.company'],
      order: { createdAt: 'DESC' },
    });
  }

  async reviewKyc(checkId: string, dto: ReviewKycDto): Promise<KycCheckEntity> {
    const check = await this.kycRepo.findOne({
      where: { id: checkId },
      relations: ['worker'],
    });
    if (!check) throw new NotFoundException('KYC check record not found');

    check.status = dto.status;
    if (dto.reasonCode) check.reasonCode = dto.reasonCode;
    const saved = await this.kycRepo.save(check);

    if (dto.status === KycStatus.APPROVED && check.worker) {
      check.worker.status = WorkerStatus.VERIFIED;
      await this.workerRepo.save(check.worker);
    }

    await this.recordAudit({
      action: `KYC_${dto.status}`,
      entity: 'KYC_CHECK',
      entityId: check.id,
      details: { status: dto.status, reasonCode: dto.reasonCode, workerId: check.workerId },
    });

    return saved;
  }

  async getTransactionMonitor(): Promise<PaymentEntity[]> {
    return this.paymentRepo.find({
      where: {
        status: In([PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.SUBMITTED]),
      },
      relations: ['company', 'worker'],
      order: { createdAt: 'DESC' },
    });
  }

  async retryPayment(paymentId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== PaymentStatus.FAILED) {
      throw new BadRequestException('Only failed payments can be retried');
    }

    payment.status = PaymentStatus.SUBMITTED;
    payment.failureReason = null;
    payment.providerReference = `qdx_retry_${Date.now()}`;
    payment.status = PaymentStatus.PAID;
    const savedPayment = await this.paymentRepo.save(payment);

    await this.recordAudit({
      action: 'PAYMENT_RETRIED',
      entity: 'PAYMENT',
      entityId: payment.id,
      details: { previousStatus: PaymentStatus.FAILED, newStatus: PaymentStatus.PAID },
    });

    return savedPayment;
  }

  async getAuditLogs(limit = 100): Promise<AuditLogEntity[]> {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async recordAudit(params: {
    actorId?: string;
    actorEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    ip?: string;
    userAgent?: string;
    details?: Record<string, any>;
  }): Promise<AuditLogEntity> {
    const entry = this.auditRepo.create(params);
    return this.auditRepo.save(entry);
  }
}
