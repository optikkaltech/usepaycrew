import { Controller, Get, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto, CreateCompanyWalletDto } from './companies.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('current')
  async getCurrent(@Req() req: any) {
    const data = await this.companiesService.getCompany(req.user.companyId);
    return { success: true, data };
  }

  @Get('me')
  async getMe(@Req() req: any) {
    const data = await this.companiesService.getCompany(req.user.companyId);
    return { success: true, data };
  }

  @Get('funding-info')
  async getFundingInfo(@Req() req: any) {
    const data = await this.companiesService.getFundingInfo(req.user.companyId);
    return { success: true, data };
  }

  @Get('wallets')
  async getWallets(@Req() req: any) {
    const data = await this.companiesService.getWallets(req.user.companyId);
    return { success: true, data };
  }

  @Post('wallets')
  async createWallet(@Req() req: any, @Body() dto: CreateCompanyWalletDto) {
    const data = await this.companiesService.createWallet(req.user.companyId, dto);
    return { success: true, data };
  }

  @Patch('current')
  async updateCurrent(@Req() req: any, @Body() dto: UpdateCompanyDto) {
    const data = await this.companiesService.updateCompany(req.user.companyId, dto);
    return { success: true, data };
  }

  @Patch('providers')
  async updateProviders(@Req() req: any, @Body() dto: { activeRampProvider?: any; activeKycProvider?: any }) {
    const data = await this.companiesService.updateProviders(req.user.companyId, dto);
    return { success: true, data };
  }
}
