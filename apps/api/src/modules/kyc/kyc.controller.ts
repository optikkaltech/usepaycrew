import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './kyc.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post(':workerId/submit')
  async submitKyc(
    @Param('workerId') workerId: string,
    @Body() dto: SubmitKycDto,
  ) {
    const data = await this.kycService.submitCheck(workerId, dto);
    return { success: true, data };
  }

  @Get(':workerId')
  async getChecks(@Param('workerId') workerId: string) {
    const data = await this.kycService.getWorkerChecks(workerId);
    return { success: true, data };
  }
}
