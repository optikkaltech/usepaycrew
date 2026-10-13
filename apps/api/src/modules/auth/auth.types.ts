import { UserRole, UserStatus } from '@paycrew/shared-types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  workerId?: string | null;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  registrationNumber?: string;
  country?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  twoFactorToken?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    twoFactorEnabled: boolean;
    companyId: string | null;
  };
}
