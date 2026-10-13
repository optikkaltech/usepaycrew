import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { UserEntity, CompanyEntity } from '../../database/entities';
import { UserRole, UserStatus } from '@paycrew/shared-types';
import { AuthResponse, JwtPayload, LoginDto, RegisterDto } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async registerEmployer(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);

    return this.dataSource.transaction(async (manager) => {
      const company = manager.create(CompanyEntity, {
        name: dto.companyName,
        registrationNumber: dto.registrationNumber || null,
        country: dto.country || 'NG',
        virtualAccountBank: 'Wema Bank / Providus',
        virtualAccountNumber: `012${Math.floor(1000000 + Math.random() * 9000000)}`,
        depositWalletAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      });
      const savedCompany = await manager.save(company);

      const user = manager.create(UserEntity, {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        role: UserRole.COMPANY_OWNER,
        status: UserStatus.ACTIVE,
        companyId: savedCompany.id,
      });
      const savedUser = await manager.save(user);

      return this.generateTokens(savedUser);
    });
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorToken) {
        throw new UnauthorizedException('Two-factor authentication code required');
      }
      const isValid = authenticator.verify({
        token: dto.twoFactorToken,
        secret: user.twoFactorSecret || '',
      });
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    return this.generateTokens(user);
  }

  async generate2faSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'PayCrew', secret);
    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    user.twoFactorSecret = secret;
    await this.userRepo.save(user);

    return { secret, qrCode };
  }

  async enable2fa(userId: string, token: string): Promise<{ success: boolean }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
    if (!isValid) {
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
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
        {
          secret: process.env.JWT_SECRET || 'paycrew_jwt_super_secret_key_2026',
          expiresIn: '15m',
        },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: UserEntity): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
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
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
        companyId: user.companyId,
      },
    };
  }
}

