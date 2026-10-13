import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { KycCheckEntity, WorkerEntity } from '../../database/entities';
import { KycCheckType, KycProviderType, KycStatus, WorkerStatus } from '@paycrew/shared-types';
import { KycVerificationResult, SubmitKycDto } from './kyc.types';
import { KycProviderFactory } from '../../providers/kyc/kyc.factory';

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
    private readonly kycFactory: KycProviderFactory,
  ) {}

  async submitCheck(workerId: string, dto: SubmitKycDto): Promise<KycVerificationResult> {
    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
      relations: ['company'],
    });
    if (!worker) throw new NotFoundException('Worker not found');

    const cleanId = dto.identifier.replace(/\D/g, '');
    if (cleanId.length !== 11) {
      throw new BadRequestException(`${dto.checkType} must be exactly 11 digits`);
    }

    const encryptedData = this.encrypt(cleanId);
    const maskedIdentifier = `*******${cleanId.slice(-4)}`;

    const preferredProvider = worker.company?.activeKycProvider || KycProviderType.PREMBLY;

    // Execute verification via OOP KycProviderFactory with automated failover
    const providerResult = await this.kycFactory.verifyWithFailover(
      preferredProvider,
      async (provider) => {
        if (dto.checkType === KycCheckType.NIN) {
          return provider.verifyNin(cleanId);
        }
        return provider.verifyBvn(cleanId);
      },
    );

    const check = this.kycRepo.create({
      workerId,
      provider: preferredProvider,
      checkType: dto.checkType,
      status: providerResult.status,
      encryptedData,
      maskedIdentifier,
      reasonCode: providerResult.reasonCode || null,
      providerReference: providerResult.providerReference,
    });

    const saved = await this.kycRepo.save(check);

    if (providerResult.status === KycStatus.APPROVED) {
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
