import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CreateBatchPaymentDto, WebhookEventPayload } from './payments.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Currency, UserRole } from '@paycrew/shared-types';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('rate')
  async getRate(@Query('pair') pair?: string) {
    const data = await this.paymentsService.getMarketRate(pair);
    return { success: true, data };
  }

  @Get('fee-estimate')
  @UseGuards(JwtAuthGuard)
  estimateFee(
    @Query('amount') amount: string,
    @Query('currency') currency: Currency = Currency.USD,
  ) {
    const data = this.paymentsService.calculateFee(amount, currency);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async payWorker(@Req() req: any, @Body() dto: CreatePaymentDto) {
    const data = await this.paymentsService.createPayment(req.user.companyId, dto);
    return { success: true, data };
  }

  @Post('batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async payBatchWorkers(@Req() req: any, @Body() dto: CreateBatchPaymentDto) {
    const data = await this.paymentsService.createBatchPayment(req.user.companyId, dto);
    return { success: true, data };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPayments(@Req() req: any, @Query('workerId') workerId?: string) {
    const data = await this.paymentsService.getPayments(req.user.companyId, workerId);
    return { success: true, data };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('x-quidax-signature') signature: string,
    @Body() payload: WebhookEventPayload,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const secret =
      process.env.QUIDAX_RAMP_WEBHOOK_SECRET ||
      process.env.QUIDAX_WEBHOOK_SECRET ||
      'test_webhook_secret_key_2026';
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (isProduction || signature) {
      if (!signature || signature !== computedSignature) {
        throw new UnauthorizedException('Invalid or missing webhook signature');
      }
    }

    const data = await this.paymentsService.handleWebhook(payload);
    return { success: true, data };
  }
}
