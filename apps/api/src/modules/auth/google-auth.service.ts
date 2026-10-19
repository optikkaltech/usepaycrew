import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserEntity, CompanyEntity, WorkerEntity } from '../../database/entities';
import { UserRole, UserStatus, WorkerStatus, Currency, PayFrequency } from '@paycrew/shared-types';
import { AuthResponse, JwtPayload } from './auth.types';
import { maskEmail } from '../../common/utils/masking.util';
import { fetchGoogleProfile, GoogleProfile } from './google-oauth.util';

export interface GoogleAuthDto {
  credential?: string;
  code?: string;
  redirectUri?: string;
  role?: UserRole;
  companyName?: string;
}

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  getGoogleAuthUrl(redirectUri?: string): { url: string; clientId: string } {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const callback = redirectUri || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/login';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callback,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });
    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      clientId,
    };
  }

  async authenticateWithGoogle(dto: GoogleAuthDto): Promise<AuthResponse> {
    const profile: GoogleProfile = await fetchGoogleProfile(dto);
    const email = profile.email.toLowerCase();
    const googleId = profile.googleId;
    const name = profile.name;
    const avatarUrl = profile.avatarUrl;

    let user = await this.userRepo.findOne({
      where: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.avatarUrl = avatarUrl || user.avatarUrl;
        await this.userRepo.save(user);
      }
      let workerId: string | null = null;
      if (user.role === UserRole.WORKER) {
        const worker = await this.workerRepo.findOne({
          where: [{ userId: user.id }, { email }],
        });
        if (worker) {
          workerId = worker.id;
          if (!worker.userId) {
            worker.userId = user.id;
            await this.workerRepo.save(worker);
          }
        }
      }
      return this.generateTokens(user, workerId);
    }

    // Auto-detect if user was already invited as a worker/contractor
    const existingWorker = await this.workerRepo.findOne({ where: { email } });
    if (existingWorker) {
      return this.dataSource.transaction(async (manager) => {
        const newUser = manager.create(UserEntity, {
          email,
          fullName: name || existingWorker.name || email.split('@')[0],
          googleId,
          avatarUrl: avatarUrl || null,
          passwordHash: `google_oauth_${crypto.randomBytes(16).toString('hex')}`,
          role: UserRole.WORKER,
          status: UserStatus.ACTIVE,
          companyId: existingWorker.companyId,
        });
        const savedUser = await manager.save(newUser);
        existingWorker.userId = savedUser.id;
        if (existingWorker.status === WorkerStatus.INVITED) {
          existingWorker.status = WorkerStatus.ONBOARDING;
        }
        await manager.save(existingWorker);
        return this.generateTokens(savedUser, existingWorker.id);
      });
    }

    // Register brand new user with role autodetection
    return this.dataSource.transaction(async (manager) => {
      const isContractor = dto.role === UserRole.WORKER;
      let companyId: string | null = null;

      if (!isContractor) {
        const company = manager.create(CompanyEntity, {
          name: dto.companyName || `${name || email.split('@')[0]}'s Organization`,
          country: 'NG',
          virtualAccountBank: null,
          virtualAccountNumber: null,
          depositWalletAddress: null,
        });
        const savedCompany = await manager.save(company);
        companyId = savedCompany.id;
      } else {
        const personalCompany = manager.create(CompanyEntity, {
          name: `${name || email.split('@')[0]}'s Workspace`,
          country: 'NG',
        });
        const savedCompany = await manager.save(personalCompany);
        companyId = savedCompany.id;
      }

      const role = isContractor ? UserRole.WORKER : UserRole.COMPANY_OWNER;
      const newUser = manager.create(UserEntity, {
        email,
        fullName: name || email.split('@')[0],
        googleId,
        avatarUrl: avatarUrl || null,
        passwordHash: `google_oauth_${crypto.randomBytes(16).toString('hex')}`,
        role,
        status: UserStatus.ACTIVE,
        companyId,
      });
      const savedUser = await manager.save(newUser);

      let workerId: string | null = null;
      if (isContractor) {
        const newWorker = manager.create(WorkerEntity, {
          companyId: companyId!,
          userId: savedUser.id,
          name: savedUser.fullName,
          email: savedUser.email,
          role: 'Contractor',
          country: 'NG',
          payAmount: '0.00',
          payCurrency: Currency.USDT,
          payFrequency: PayFrequency.MONTHLY,
          status: WorkerStatus.ONBOARDING,
        });
        const savedWorker = await manager.save(newWorker);
        workerId = savedWorker.id;
      }

      return this.generateTokens(savedUser, workerId);
    });
  }

  private generateTokens(user: UserEntity, workerId?: string | null): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      companyId: user.companyId,
      workerId: workerId || undefined,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'paycrew_jwt_super_secret_key_2026',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'paycrew_refresh_super_secret_key_2026',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        maskedEmail: maskEmail(user.email),
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
        companyId: user.companyId,
        workerId: workerId || null,
      },
    };
  }
}
