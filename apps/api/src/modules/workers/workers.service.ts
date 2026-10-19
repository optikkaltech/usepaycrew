import { Injectable, Logger, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { WorkerEntity, ContractEntity, UserEntity, CompanyEntity } from '../../database/entities';
import { ContractStatus, PayoutMethodType, UserRole, UserStatus, WorkerStatus } from '@paycrew/shared-types';
import { CreateWorkerDto, WorkerAcceptInviteDto, UpdateWorkerDto } from './workers.types';
import { maskEmail, maskAccountNumber, maskWalletAddress } from '../../common/utils/masking.util';
import { MailerSendProvider } from '../../providers/email/mailersend.provider';
import { env } from '../../config';
import { WorkersInviteService } from './workers-invite.service';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);

  constructor(
    @InjectRepository(WorkerEntity) private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(ContractEntity) private readonly contractRepo: Repository<ContractEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly mailer: MailerSendProvider,
    private readonly inviteService: WorkersInviteService,
  ) {}

  async createWorker(companyId: string, dto: CreateWorkerDto): Promise<WorkerEntity> {
    const existing = await this.workerRepo.findOne({
      where: { companyId, email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Worker with this email already exists in company');
    }

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const saved = await this.dataSource.transaction(async (manager) => {
      const worker = manager.create(WorkerEntity, {
        companyId,
        name: dto.name,
        email: dto.email.toLowerCase(),
        country: dto.country || 'NG',
        role: dto.role,
        payAmount: parseFloat(dto.payAmount).toFixed(2),
        payCurrency: dto.payCurrency,
        payFrequency: dto.payFrequency,
        status: WorkerStatus.INVITED,
        inviteToken,
        inviteExpiresAt,
      });
      const savedWorker = await manager.save(worker);

      const contract = manager.create(ContractEntity, {
        workerId: savedWorker.id,
        templateVersion: 'NG-CONTRACTOR-2026.1',
        title: `Independent Contractor Agreement - ${savedWorker.name}`,
        content: `THIS INDEPENDENT CONTRACTOR AGREEMENT is made between Company and ${savedWorker.name} (${savedWorker.email}) for services as ${savedWorker.role}. Compensation is ${savedWorker.payAmount} ${savedWorker.payCurrency} payable ${savedWorker.payFrequency}. The contractor shall provide services independently under Nigerian law.`,
        status: ContractStatus.SENT,
      });
      await manager.save(contract);
      return savedWorker;
    });

    const inviteUrl = `${env.FRONTEND_URL}/onboard/${inviteToken}`;
    const company = await this.dataSource.getRepository(CompanyEntity).findOne({ where: { id: companyId } });
    this.mailer
      .sendContractorInvite({
        to: saved.email,
        contractorName: saved.name,
        companyName: company?.name || 'PayCrew',
        role: saved.role,
        payAmount: saved.payAmount,
        payCurrency: saved.payCurrency,
        payFrequency: saved.payFrequency,
        inviteUrl,
        expiresIn: '7 days',
      })
      .catch((err) => this.logger.warn(`Failed to dispatch invite email: ${err.message}`));

    return saved;
  }

  async createBulkWorkers(companyId: string, dtos: CreateWorkerDto[]): Promise<{ created: WorkerEntity[]; failed: { email: string; reason: string }[] }> {
    const created: WorkerEntity[] = [];
    const failed: { email: string; reason: string }[] = [];
    for (const dto of dtos) {
      try {
        const worker = await this.createWorker(companyId, dto);
        created.push(worker);
      } catch (err: any) {
        failed.push({ email: dto.email, reason: err.message || 'Failed to create worker' });
      }
    }
    return { created, failed };
  }

  async getWorkersByCompany(companyId: string): Promise<any[]> {
    const workers = await this.workerRepo.find({
      where: { companyId },
      relations: ['contracts', 'kycChecks', 'payoutMethods'],
      order: { createdAt: 'DESC' },
    });

    return workers.map((w) => ({
      ...w,
      maskedEmail: maskEmail(w.email),
      payoutMethods: w.payoutMethods?.map((pm) => ({
        ...pm,
        accountReference:
          pm.type === PayoutMethodType.BANK_ACCOUNT
            ? maskAccountNumber(pm.accountReference)
            : maskWalletAddress(pm.accountReference),
      })),
    }));
  }

  async getWorkerById(workerId: string): Promise<WorkerEntity> {
    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
      relations: ['contracts', 'kycChecks', 'payoutMethods', 'company'],
    });
    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }

  async getWorkerByInviteToken(token: string): Promise<any> {
    return this.inviteService.getWorkerByInviteToken(token);
  }

  async acceptInvite(dto: WorkerAcceptInviteDto, currentUser?: any): Promise<any> {
    return this.inviteService.acceptInvite(dto, currentUser);
  }

  async updateWorker(companyId: string, workerId: string, dto: UpdateWorkerDto): Promise<WorkerEntity> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId, companyId } });
    if (!worker) throw new NotFoundException('Worker not found');

    if (dto.name !== undefined) worker.name = dto.name;
    if (dto.role !== undefined) worker.role = dto.role;
    if (dto.country !== undefined) worker.country = dto.country;
    if (dto.payAmount !== undefined) worker.payAmount = parseFloat(dto.payAmount).toFixed(2);
    if (dto.payCurrency !== undefined) worker.payCurrency = dto.payCurrency;
    if (dto.payFrequency !== undefined) worker.payFrequency = dto.payFrequency;

    return this.workerRepo.save(worker);
  }

  async deleteWorker(companyId: string, workerId: string): Promise<void> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId, companyId } });
    if (!worker) throw new NotFoundException('Worker not found');

    await this.dataSource.transaction(async (manager) => {
      if (worker.userId) {
        await manager.delete(UserEntity, { id: worker.userId });
      }
      await manager.remove(worker);
    });
  }

  async updatePreferences(workerId: string, autoCashoutEnabled: boolean): Promise<WorkerEntity> {
    const worker = await this.getWorkerById(workerId);
    worker.autoCashoutEnabled = autoCashoutEnabled;
    return this.workerRepo.save(worker);
  }

  async updateProfile(
    workerId: string,
    dto: { name?: string; email?: string; role?: string; country?: string },
  ): Promise<WorkerEntity> {
    const worker = await this.getWorkerById(workerId);
    if (dto.name !== undefined) worker.name = dto.name;
    if (dto.email !== undefined) worker.email = dto.email;
    if (dto.role !== undefined) worker.role = dto.role;
    if (dto.country !== undefined) worker.country = dto.country;
    return this.workerRepo.save(worker);
  }

  async setTransactionPin(
    workerId: string,
    pin: string,
    currentPin?: string,
  ): Promise<{ success: boolean }> {
    if (!pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      throw new BadRequestException('PIN must be 4 to 6 numeric digits');
    }
    const worker = await this.getWorkerById(workerId);
    if (worker.transactionPinHash && currentPin) {
      const isValid = await argon2.verify(worker.transactionPinHash, currentPin);
      if (!isValid) throw new BadRequestException('Current PIN is incorrect');
    } else if (worker.transactionPinHash && !currentPin) {
      throw new BadRequestException('Current PIN is required to change your transaction PIN');
    }

    worker.transactionPinHash = await argon2.hash(pin);
    await this.workerRepo.save(worker);
    return { success: true };
  }
}
