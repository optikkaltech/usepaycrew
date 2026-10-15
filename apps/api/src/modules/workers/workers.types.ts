import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Currency, PayFrequency } from '@paycrew/shared-types';

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  name: string;

  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsNotEmpty({ message: 'Role title is required' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'Pay amount is required' })
  payAmount: string;

  @IsEnum(Currency, { message: 'Invalid pay currency' })
  payCurrency: Currency;

  @IsEnum(PayFrequency, { message: 'Invalid pay frequency' })
  payFrequency: PayFrequency;
}

export class WorkerAcceptInviteDto {
  @IsString()
  @IsNotEmpty({ message: 'Invitation token is required' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class UpdateWorkerPreferencesDto {
  @IsBoolean()
  autoCashoutEnabled: boolean;
}

