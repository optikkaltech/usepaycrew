import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { WorkerEntity, ContractEntity, UserEntity } from '../../database/entities';
import {
  ContractStatus,
  UserRole,
  UserStatus,
  WorkerStatus,
} from '@paycrew/shared-types';
import { CreateWorkerDto, WorkerAcceptInviteDto } from './workers.types';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepo: Repository<ContractEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
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

    return this.dataSource.transaction(async (manager) => {
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
  }

  async getWorkersByCompany(companyId: string): Promise<WorkerEntity[]> {
    return this.workerRepo.find({
      where: { companyId },
      relations: ['contracts', 'kycChecks', 'payoutMethods'],
      order: { createdAt: 'DESC' },
    });
  }

  async getWorkerById(workerId: string): Promise<WorkerEntity> {
    const worker = await this.workerRepo.findOne({
      where: { id: workerId },
      relations: ['contracts', 'kycChecks', 'payoutMethods', 'company'],
    });
    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }

  async getWorkerByInviteToken(token: string): Promise<WorkerEntity> {
    const worker = await this.workerRepo.findOne({
      where: { inviteToken: token },
      relations: ['company', 'contracts'],
    });
    if (!worker) throw new NotFoundException('Invalid or expired invitation token');
    if (worker.inviteExpiresAt && worker.inviteExpiresAt < new Date()) {
      throw new BadRequestException('Invitation link has expired');
    }
    return worker;
  }

  async acceptInvite(dto: WorkerAcceptInviteDto): Promise<{ worker: WorkerEntity; user: UserEntity }> {
    const worker = await this.getWorkerByInviteToken(dto.token);

    const existingUser = await this.userRepo.findOne({
      where: { email: worker.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('A user account already exists for this email');
    }

    const passwordHash = await argon2.hash(dto.password);

    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(UserEntity, {
        email: worker.email.toLowerCase(),
        passwordHash,
        fullName: worker.name,
        role: UserRole.WORKER,
        status: UserStatus.ACTIVE,
        companyId: worker.companyId,
      });
      const savedUser = await manager.save(user);

      worker.userId = savedUser.id;
      worker.status = WorkerStatus.ONBOARDING;
      worker.inviteToken = null;
      const updatedWorker = await manager.save(worker);

      return { worker: updatedWorker, user: savedUser };
    });
  }
}
