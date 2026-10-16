import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserEntity, CompanyEntity } from '../../database/entities';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { GoogleAuthService } from './google-auth.service';

import { TurnstileGuard } from './guards/turnstile.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CompanyEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'paycrew_jwt_super_secret_key_2026',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService, JwtStrategy, JwtAuthGuard, RolesGuard, TurnstileGuard],
  exports: [AuthService, GoogleAuthService, JwtAuthGuard, RolesGuard, TurnstileGuard, JwtModule],
})
export class AuthModule {}

