import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserEntity, CompanyEntity } from '../../database/entities';
import { UserRole, UserStatus } from '@paycrew/shared-types';
import { AuthResponse, JwtPayload } from './auth.types';
import { maskEmail } from '../../common/utils/masking.util';

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
    let email: string | undefined;
    let name: string | undefined;
    let googleId: string | undefined;
    let avatarUrl: string | undefined;

    if (dto.credential) {
      // 1. Verify Google ID Token via Google's tokeninfo API
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${dto.credential}`);
      if (!resp.ok) {
        throw new UnauthorizedException('Invalid or expired Google credential');
      }
      const data = await resp.json();
      email = data.email;
      name = data.name;
      googleId = data.sub;
      avatarUrl = data.picture;
    } else if (dto.code) {
      // 2. Exchange authorization code with Google OAuth servers
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = dto.redirectUri || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/login';

      if (!clientId || !clientSecret) {
        throw new BadRequestException('Google OAuth is not configured on the server (missing GOOGLE_CLIENT_ID/SECRET)');
      }

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: dto.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenJson = await tokenResp.json();
      if (!tokenResp.ok) {
        console.error('Google token exchange error details:', tokenJson, 'using redirectUri:', redirectUri);
        throw new UnauthorizedException(tokenJson.error_description || tokenJson.error || 'Failed to verify Google code');
      }

      // Fetch verified user profile with access token
      const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });

      if (!userResp.ok) {
        throw new UnauthorizedException('Failed to retrieve user profile from Google');
      }

      const userData = await userResp.json();
      email = userData.email;
      name = userData.name;
      googleId = userData.sub;
      avatarUrl = userData.picture;
    } else {
      throw new BadRequestException('Google authentication requires a valid Google credential or authorization code');
    }

    if (!email) {
      throw new BadRequestException('Google account must have a verified email address');
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
          name: dto.companyName || `${name || email.split('@')[0]}'s Organization`,
          country: 'NG',
          virtualAccountBank: null,
          virtualAccountNumber: null,
          depositWalletAddress: null,
        });
        const savedCompany = await manager.save(company);
        companyId = savedCompany.id;
      }

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
        maskedEmail: maskEmail(user.email),
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
        companyId: user.companyId,
      },
    };
  }
}
