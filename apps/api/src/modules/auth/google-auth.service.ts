import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserEntity, CompanyEntity } from '../../database/entities';
import { UserRole, UserStatus } from '@paycrew/shared-types';
import { AuthResponse, JwtPayload } from './auth.types';

export interface GoogleAuthDto {
  credential?: string;
  email?: string;
  name?: string;
  googleId?: string;
  avatarUrl?: string;
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
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async authenticateWithGoogle(dto: GoogleAuthDto): Promise<AuthResponse> {
    let email = dto.email;
    let name = dto.name;
    let googleId = dto.googleId;
    let avatarUrl = dto.avatarUrl;

    if (dto.credential) {
      try {
        const parts = dto.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          email = payload.email || email;
          name = payload.name || name;
          googleId = payload.sub || googleId;
          avatarUrl = payload.picture || avatarUrl;
        }
      } catch (err) {
        // Fallback to provided fields
      }
    }

    if (!email) {
      throw new BadRequestException('Google authentication failed: Email is required');
    }

    email = email.toLowerCase();
    let user = await this.userRepo.findOne({
      where: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.avatarUrl = avatarUrl || user.avatarUrl;
        await this.userRepo.save(user);
      }
      return this.generateTokens(user);
    }

    // Register new user via Google
    return this.dataSource.transaction(async (manager) => {
      let companyId: string | null = null;
      const role = dto.role || UserRole.COMPANY_OWNER;

      if (role === UserRole.COMPANY_OWNER) {
        const company = manager.create(CompanyEntity, {
          name: dto.companyName || `${name || 'My'}'s Organization`,
          country: 'NG',
          virtualAccountBank: 'Providus Bank (Korapay)',
          virtualAccountNumber: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
          depositWalletAddress: `0x${crypto.randomBytes(20).toString('hex')}`,
        });
        const savedCompany = await manager.save(company);
        companyId = savedCompany.id;
      }

      const newUser = manager.create(UserEntity, {
        email,
        fullName: name || email.split('@')[0],
        googleId: googleId || `g_${Date.now()}`,
        avatarUrl: avatarUrl || null,
        passwordHash: `google_oauth_${crypto.randomBytes(16).toString('hex')}`,
        role,
        status: UserStatus.ACTIVE,
        companyId,
      });

      const savedUser = await manager.save(newUser);
      return this.generateTokens(savedUser);
    });
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
