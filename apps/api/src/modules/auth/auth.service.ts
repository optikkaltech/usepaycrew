import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { UserEntity, CompanyEntity, WorkerEntity } from '../../database/entities';
import { UserRole, UserStatus, WorkerStatus, Currency, PayFrequency } from '@paycrew/shared-types';
import { AuthResponse, JwtPayload, LoginDto, RegisterDto } from './auth.types';
import { maskEmail } from '../../common/utils/masking.util';

@Injectable()
export class AuthService {
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

  async registerEmployer(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(dto.password);
    const isContractor = dto.role === UserRole.WORKER;

    return this.dataSource.transaction(async (manager) => {
      const company = manager.create(CompanyEntity, {
        name: isContractor ? `${dto.fullName}'s Workspace` : dto.companyName,
        registrationNumber: dto.registrationNumber || null,
        country: dto.country || 'NG',
      });
      const savedCompany = await manager.save(company);

      const user = manager.create(UserEntity, {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        role: isContractor ? UserRole.WORKER : UserRole.COMPANY_OWNER,
        status: UserStatus.ACTIVE,
        companyId: savedCompany.id,
      });
      const savedUser = await manager.save(user);

      let workerId: string | null = null;
      if (isContractor) {
        const worker = manager.create(WorkerEntity, {
          companyId: savedCompany.id,
          userId: savedUser.id,
          name: dto.fullName,
          email: dto.email.toLowerCase(),
          role: dto.companyName || 'Contractor',
          country: dto.country || 'NG',
          payAmount: '0.00',
          payCurrency: Currency.USDT,
          payFrequency: PayFrequency.MONTHLY,
          status: WorkerStatus.ONBOARDING,
        });
        const savedWorker = await manager.save(worker);
        workerId = savedWorker.id;
      }

      return this.generateTokens(savedUser, workerId);
    });
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.passwordHash || !user.passwordHash.startsWith('$argon2')) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active or has been suspended');
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.password).catch(() => false);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorToken) throw new UnauthorizedException('Two-factor authentication code required');
      if (!authenticator.verify({ token: dto.twoFactorToken, secret: user.twoFactorSecret || '' })) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    let workerId: string | null = null;
    if (user.role === UserRole.WORKER) {
      const worker = await this.workerRepo.findOne({ where: [{ userId: user.id }, { email: user.email }] });
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

  async generate2faSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const secret = authenticator.generateSecret();
    const qrCode = await QRCode.toDataURL(authenticator.keyuri(user.email, 'PayCrew', secret));
    user.twoFactorSecret = secret;
    await this.userRepo.save(user);
    return { secret, qrCode };
  }

  async enable2fa(userId: string, token: string): Promise<{ success: boolean }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) throw new BadRequestException('2FA setup not initiated');
    if (!authenticator.verify({ token, secret: user.twoFactorSecret })) {
      throw new UnauthorizedException('Invalid verification code');
    }
    user.twoFactorEnabled = true;
    await this.userRepo.save(user);
    return { success: true };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'paycrew_refresh_super_secret_key_2026',
      });
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: user.companyId },
        { secret: process.env.JWT_SECRET || 'paycrew_jwt_super_secret_key_2026', expiresIn: '15m' },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      companyId: user.companyId,
    };
  }

  private generateTokens(user: UserEntity, workerId?: string | null): AuthResponse {
    const payload: JwtPayload = { sub: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: user.companyId, workerId: workerId || undefined };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'paycrew_jwt_super_secret_key_2026', expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'paycrew_refresh_super_secret_key_2026', expiresIn: '7d' });

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

