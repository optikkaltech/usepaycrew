import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Currency, LedgerCategory, LedgerEntryType, UserRole } from '@paycrew/shared-types';

@Controller('ledger')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('company-balance')
  async getCompanyBalance(
    @Req() req: any,
    @Query('currency') currency: Currency = Currency.USD,
  ) {
    const companyId = req.user.companyId;
    return this.ledgerService.getBalance({ companyId, currency });
  }

  @Get('worker-balance')
  async getWorkerBalance(
    @Req() req: any,
    @Query('currency') currency: Currency = Currency.USD,
  ) {
    const workerId = req.user.workerId || req.user.id;
    return this.ledgerService.getBalance({ workerId, currency });
  }

  @Post('deposit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async recordDeposit(
    @Req() req: any,
    @Body() body: { amount: string; currency: Currency; reference: string },
  ) {
    const companyId = req.user.companyId;
    const entry = await this.ledgerService.postEntry({
      companyId,
      accountType: 'COMPANY',
      amount: body.amount,
      currency: body.currency,
      entryType: LedgerEntryType.CREDIT,
      category: LedgerCategory.DEPOSIT,
      reference: body.reference,
      description: `Funding deposit via ${body.reference}`,
    });
    return { success: true, data: entry };
  }

  @Get('company-entries')
  async getCompanyEntries(@Req() req: any) {
    const data = await this.ledgerService.getCompanyEntries(req.user.companyId);
    return { success: true, data };
  }
}
