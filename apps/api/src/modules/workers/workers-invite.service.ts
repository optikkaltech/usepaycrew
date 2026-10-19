import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { WorkerEntity, UserEntity, KycCheckEntity, PayoutMethodEntity } from '../../database/entities';
import { KycStatus, PayoutMethodType, UserRole, UserStatus, WorkerStatus } from '@paycrew/shared-types';
import { WorkerAcceptInviteDto } from './workers.types';
import { maskAccountNumber, maskWalletAddress } from '../../common/utils/masking.util';

@Injectable()
export class WorkersInviteService {
  constructor(
    @InjectRepository(WorkerEntity) private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(KycCheckEntity) private readonly kycRepo: Repository<KycCheckEntity>,
    @InjectRepository(PayoutMethodEntity) private readonly pmRepo: Repository<PayoutMethodEntity>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async getWorkerByInviteToken(token: string): Promise<any> {
    const worker = await this.workerRepo.findOne({
      where: { inviteToken: token },
      relations: ['company', 'contracts'],
    });
    if (!worker) throw new NotFoundException('Invalid or expired invitation token');
    if (worker.inviteExpiresAt && worker.inviteExpiresAt < new Date()) {
      throw new BadRequestException('Invitation link has expired');
    }

    const existingUser = await this.userRepo.findOne({
      where: { email: worker.email.toLowerCase() },
    });

    if (!existingUser) {
      return { ...worker, isExistingUser: false, existingUserName: null, hasVerifiedKyc: false, existingPayoutMethods: [] };
    }

    const previousWorkers = await this.workerRepo.find({
      where: { userId: existingUser.id },
      relations: ['kycChecks', 'payoutMethods'],
    });

    const hasVerifiedKyc = previousWorkers.some((pw) =>
      pw.kycChecks?.some((k) => k.status === KycStatus.APPROVED || (k.status as string) === 'VERIFIED')
    );

    const existingPayoutMethods: any[] = [];
    const seen = new Set<string>();
    for (const pw of previousWorkers) {
      for (const pm of pw.payoutMethods || []) {
        const ref = pm.accountReference || pm.id;
        if (!seen.has(ref)) {
          seen.add(ref);
          const masked =
            pm.type === PayoutMethodType.BANK_ACCOUNT
              ? maskAccountNumber(pm.accountReference)
              : maskWalletAddress(pm.accountReference);
          existingPayoutMethods.push({
            id: pm.id,
            type: pm.type,
            bankName: pm.bankName,
            accountName: pm.accountName,
            accountReference: masked,
            network: pm.network,
            isDefault: pm.isDefault,
          });
        }
      }
    }

    return {
      ...worker,
      isExistingUser: true,
      existingUserName: existingUser.fullName,
      hasVerifiedKyc,
      existingPayoutMethods,
    };
  }

  async acceptInvite(dto: WorkerAcceptInviteDto, currentUser?: any): Promise<any> {
    const worker = await this.workerRepo.findOne({
      where: { inviteToken: dto.token },
      relations: ['company', 'contracts'],
    });
    if (!worker) throw new NotFoundException('Invalid or expired invitation token');

    const existingUser = await this.userRepo.findOne({
      where: { email: worker.email.toLowerCase() },
    });

    if (existingUser) {
      const isAlreadyLoggedIn = currentUser && currentUser.id === existingUser.id;
      if (!isAlreadyLoggedIn) {
        if (!dto.password) throw new BadRequestException('Password required for your existing PayCrew account');
        const isValid = await argon2.verify(existingUser.passwordHash || '', dto.password);
        if (!isValid) throw new BadRequestException('Incorrect password for your existing PayCrew account');
      }

      const previousWorkers = await this.workerRepo.find({
        where: { userId: existingUser.id },
        relations: ['kycChecks'],
      });
      const verifiedKyc = previousWorkers
        .flatMap((pw) => pw.kycChecks || [])
        .find((k) => k.status === KycStatus.APPROVED || (k.status as string) === 'VERIFIED');

      const updatedWorker = await this.dataSource.transaction(async (manager) => {
        worker.userId = existingUser.id;
        worker.status = WorkerStatus.ONBOARDING;
        const saved = await manager.save(worker);

        if (verifiedKyc) {
          const autoKyc = manager.create(KycCheckEntity, {
            workerId: saved.id,
            checkType: verifiedKyc.checkType,
            provider: verifiedKyc.provider,
            status: KycStatus.APPROVED,
            encryptedData: verifiedKyc.encryptedData,
            maskedIdentifier: verifiedKyc.maskedIdentifier,
          });
          await manager.save(autoKyc);
        }
        return saved;
      });

      const token = this.jwtService.sign({ sub: existingUser.id, email: existingUser.email, role: existingUser.role, workerId: updatedWorker.id });
      return { worker: updatedWorker, user: existingUser, token, isExistingUser: true, hasVerifiedKyc: !!verifiedKyc };
    }

    if (!dto.password || dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
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
      const savedWorker = await manager.save(worker);

      const token = this.jwtService.sign({ sub: savedUser.id, email: savedUser.email, role: savedUser.role, workerId: savedWorker.id });
      return { worker: savedWorker, user: savedUser, token, isExistingUser: false, hasVerifiedKyc: false };
    });
  }
}
