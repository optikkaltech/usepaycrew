import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReviewKycDto, RetryPaymentDto } from './admin.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@paycrew/shared-types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('kyc-queue')
  async getKycQueue() {
    const data = await this.adminService.getKycQueue();
    return { success: true, data };
  }

  @Post('kyc-queue/:checkId/review')
  async reviewKyc(
    @Param('checkId') checkId: string,
    @Body() dto: ReviewKycDto,
  ) {
    const data = await this.adminService.reviewKyc(checkId, dto);
    return { success: true, data };
  }

  @Get('transactions')
  async getTransactions() {
    const data = await this.adminService.getTransactionMonitor();
    return { success: true, data };
  }

  @Post('transactions/retry')
  async retryPayment(@Body() dto: RetryPaymentDto) {
    const data = await this.adminService.retryPayment(dto.paymentId);
    return { success: true, data };
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('limit') limit = 100) {
    const data = await this.adminService.getAuditLogs(Number(limit));
    return { success: true, data };
  }
}
