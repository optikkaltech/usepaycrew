import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  UpdateCompanyProfileDto,
  UpdateCompanyComplianceDto,
  UpdateWorkerProfileDto,
} from './onboarding.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('company')
  async getCompanyStatus(@CurrentUser('companyId') companyId: string) {
    const data = await this.onboardingService.getCompanyStatus(companyId);
    return { success: true, data };
  }

  @Post('company/profile')
  async submitCompanyProfile(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    const data = await this.onboardingService.submitCompanyProfile(companyId, dto);
    return { success: true, data };
  }

  @Post('company/compliance')
  async submitCompanyCompliance(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateCompanyComplianceDto,
  ) {
    const data = await this.onboardingService.submitCompanyCompliance(companyId, dto);
    return { success: true, data };
  }

  @Post('company/complete')
  async completeCompanyBilling(
    @CurrentUser('companyId') companyId: string,
    @Body('plan') plan: string,
  ) {
    const data = await this.onboardingService.completeCompanyBilling(companyId, plan);
    return { success: true, data };
  }

  @Get('worker/:workerId')
  async getWorkerStatus(@Param('workerId') workerId: string) {
    const data = await this.onboardingService.getWorkerStatus(workerId);
    return { success: true, data };
  }

  @Post('worker/:workerId/profile')
  async updateWorkerProfile(
    @Param('workerId') workerId: string,
    @Body() dto: UpdateWorkerProfileDto,
  ) {
    const data = await this.onboardingService.updateWorkerProfile(workerId, dto);
    return { success: true, data };
  }
}
