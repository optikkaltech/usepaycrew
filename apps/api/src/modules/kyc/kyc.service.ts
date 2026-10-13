import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { KycCheckEntity, WorkerEntity } from '../../database/entities';
import { KycCheckType, KycStatus, WorkerStatus } from '@paycrew/shared-types';
import { KycVerificationResult, SubmitKycDto } from './kyc.types';

@Injectable()
export class KycService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey = Buffer.from(
    (process.env.KYC_ENCRYPTION_KEY || '01234567890123456789012345678901').padEnd(32).slice(0, 32),
  );

  constructor(
    @InjectRepository(KycCheckEntity)
    private readonly kycRepo: Repository<KycCheckEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
  ) {}

  async submitCheck(workerId: string, dto: SubmitKycDto): Promise<KycVerificationResult> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const cleanId = dto.identifier.replace(/\D/g, '');
    if (cleanId.length !== 11) {
      throw new BadRequestException(`${dto.checkType} must be exactly 11 digits`);
    }

    const encryptedData = this.encrypt(cleanId);
    const maskedIdentifier = `*******${cleanId.slice(-4)}`;

    // Provider check simulation (sandbox / mock adapter)
    const isMockFailure = cleanId.endsWith('0000');
    const isManualReview = cleanId.endsWith('9999');

    let status = KycStatus.APPROVED;
    let reasonCode: string | null = null;

    if (isMockFailure) {
      status = KycStatus.FAILED;
      reasonCode = 'IDENTITY_DATA_MISMATCH';
    } else if (isManualReview) {
      status = KycStatus.MANUAL_REVIEW;
      reasonCode = 'SUSPECTED_FRAUD_FLAG';
    }

    const check = this.kycRepo.create({
      workerId,
      provider: 'DOJAH_SANDBOX',
      checkType: dto.checkType,
      status,
      encryptedData,
      maskedIdentifier,
      reasonCode,
      providerReference: `kyc_ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });

    const saved = await this.kycRepo.save(check);

    if (status === KycStatus.APPROVED) {
      worker.status = WorkerStatus.VERIFIED;
      await this.workerRepo.save(worker);
    }

    return {
      id: saved.id,
      checkType: saved.checkType,
      status: saved.status,
      maskedIdentifier: saved.maskedIdentifier,
      reasonCode: saved.reasonCode,
      createdAt: saved.createdAt,
    };
  }

  async getWorkerChecks(workerId: string): Promise<KycCheckEntity[]> {
    return this.kycRepo.find({
      where: { workerId },
      order: { createdAt: 'DESC' },
    });
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }
}
