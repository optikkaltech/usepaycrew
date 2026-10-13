import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { InitiateWithdrawalDto } from './withdrawals.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Currency } from '@paycrew/shared-types';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get('estimate')
  estimate(
    @Query('amount') amount: string,
    @Query('currency') currency: Currency = Currency.USD,
  ) {
    const data = this.withdrawalsService.calculateWithdrawal(amount, currency);
    return { success: true, data };
  }

  @Post('execute')
  async execute(@Body() dto: InitiateWithdrawalDto) {
    const data = await this.withdrawalsService.executeWithdrawal(dto);
    return { success: true, data };
  }
}
