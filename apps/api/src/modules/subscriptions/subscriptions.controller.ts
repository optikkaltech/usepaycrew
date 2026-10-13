import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { InitiateSubscriptionPaymentDto } from './subscriptions.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('summary')
  async getSummary(@CurrentUser('companyId') companyId: string) {
    const data = await this.subscriptionsService.getBillingSummary(companyId);
    return { success: true, data };
  }

  @Post('initiate')
  async initiatePayment(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: InitiateSubscriptionPaymentDto,
  ) {
    const data = await this.subscriptionsService.initiatePayment(companyId, dto);
    return { success: true, data };
  }

  @Post('confirm')
  async confirmPayment(
    @CurrentUser('companyId') companyId: string,
    @Body('reference') reference: string,
  ) {
    const data = await this.subscriptionsService.confirmPayment(companyId, reference);
    return { success: true, data };
  }
}
