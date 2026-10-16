import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { InitiateSubscriptionPaymentDto, AdminUpsertPlanDto } from './subscriptions.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@paycrew/shared-types';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPlans(@Query('country') country?: string) {
    const data = await this.subscriptionsService.getActivePlans(country);
    return { success: true, data };
  }

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

  @Get('plans/admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async getAllPlansAdmin() {
    const data = await this.subscriptionsService.getAllPlansAdmin();
    return { success: true, data };
  }

  @Patch('plans/admin/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async updatePlanAdmin(@Param('id') id: string, @Body() dto: AdminUpsertPlanDto) {
    const data = await this.subscriptionsService.updatePlanAdmin(id, dto);
    return { success: true, data };
  }
}
