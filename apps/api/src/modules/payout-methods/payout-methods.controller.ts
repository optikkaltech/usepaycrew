import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayoutMethodsService } from './payout-methods.service';
import { AddBankAccountDto, AddWalletDto } from './payout-methods.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payout-methods')
@UseGuards(JwtAuthGuard)
export class PayoutMethodsController {
  constructor(private readonly pmService: PayoutMethodsService) {}

  @Get('lookup-bank')
  async lookupBank(
    @Query('accountNumber') accountNumber: string,
    @Query('bankCode') bankCode: string,
  ) {
    const data = await this.pmService.lookupBankAccount(accountNumber, bankCode);
    return { success: true, data };
  }

  @Post(':workerId/bank')
  async addBank(
    @Param('workerId') workerId: string,
    @Body() dto: AddBankAccountDto,
  ) {
    const data = await this.pmService.addBankAccount(workerId, dto);
    return { success: true, data };
  }

  @Post(':workerId/wallet')
  async addWallet(
    @Param('workerId') workerId: string,
    @Body() dto: AddWalletDto,
  ) {
    const data = await this.pmService.addWallet(workerId, dto);
    return { success: true, data };
  }

  @Get(':workerId')
  async getMethods(@Param('workerId') workerId: string) {
    const data = await this.pmService.getMethods(workerId);
    return { success: true, data };
  }
}
