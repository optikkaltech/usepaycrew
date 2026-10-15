import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '@paycrew/shared-types';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker ID is required' })
  workerId: string;

  @IsString()
  @IsNotEmpty({ message: 'Payment amount is required' })
  amount: string;

  @IsEnum(Currency, { message: 'Valid payment currency is required' })
  currency: Currency;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsNotEmpty({ message: 'Idempotency key is required' })
  idempotencyKey: string;

  @IsOptional()
  scheduledFor?: Date;
}

export class BatchPaymentItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker ID is required' })
  workerId: string;

  @IsString()
  @IsNotEmpty({ message: 'Payment amount is required' })
  amount: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateBatchPaymentDto {
  @IsArray({ message: 'Payments list must be an array' })
  @ValidateNested({ each: true })
  @Type(() => BatchPaymentItemDto)
  payments: BatchPaymentItemDto[];

  @IsEnum(Currency, { message: 'Valid payment currency is required' })
  @IsOptional()
  currency?: Currency;
}

export interface PaymentFeeEstimate {
  amount: string;
  currency: Currency;
  feePercentage: number;
  feeAmount: string;
  totalCharged: string;
}

export interface WebhookEventPayload {
  event: string;
  data: {
    id?: string;
    reference?: string;
    status?: string;
    currency?: string;
    amount?: string;
    recipient_address?: string;
    wallet_address?: string;
    txid?: string;
    providerTxId?: string;
    failureReason?: string;
  };
}
