import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayoutMethodsService } from './payout-methods.service';
import { AddBankAccountDto, AddWalletDto } from './payout-methods.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payout-methods')
export class PayoutMethodsController {
  constructor(private readonly pmService: PayoutMethodsService) {}

  @Get('banks')
  async getBanks() {
    const data = await this.pmService.getBanks();
    return { success: true, data };
  }

  @Get('lookup-bank')
  async lookupBank(
    @Query('accountNumber') accountNumber: string,
    @Query('bankCode') bankCode: string,
  ) {
    const data = await this.pmService.lookupBankAccount(accountNumber, bankCode);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':workerId/bank')
  async addBank(
    @Param('workerId') workerId: string,
    @Body() dto: AddBankAccountDto,
  ) {
    const data = await this.pmService.addBankAccount(workerId, dto);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':workerId/wallet')
  async addWallet(
    @Param('workerId') workerId: string,
    @Body() dto: AddWalletDto,
  ) {
    const data = await this.pmService.addWallet(workerId, dto);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':workerId')
  async getMethods(@Param('workerId') workerId: string) {
    const data = await this.pmService.getMethods(workerId);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reveal')
  async revealMethod(@Param('id') id: string) {
    const data = await this.pmService.revealMethod(id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':workerId/link-existing')
  async linkExisting(
    @Param('workerId') workerId: string,
    @Body() body: { existingMethodId: string },
  ) {
    const data = await this.pmService.linkExistingMethod(workerId, body.existingMethodId);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/default')
  async setDefault(@Param('id') id: string) {
    const data = await this.pmService.setDefault(id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMethod(@Param('id') id: string) {
    await this.pmService.deleteMethod(id);
    return { success: true };
  }
}
