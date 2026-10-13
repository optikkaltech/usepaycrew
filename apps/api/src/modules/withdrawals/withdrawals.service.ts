import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WorkerEntity, PayoutMethodEntity } from '../../database/entities';
import { PayoutMethodType, Currency } from '@paycrew/shared-types';
import { LedgerService } from '../ledger/ledger.service';
import { BankingProviderFactory } from '../../providers/banking/banking.factory';
import {
  InitiateWithdrawalDto,
  WithdrawalCalculation,
  WithdrawalReceipt,
} from './withdrawals.types';

@Injectable()
export class WithdrawalsService {
  private readonly exchangeRate = 1450.0;

  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    @InjectRepository(PayoutMethodEntity)
    private readonly pmRepo: Repository<PayoutMethodEntity>,
    private readonly ledgerService: LedgerService,
    private readonly dataSource: DataSource,
    private readonly bankingFactory: BankingProviderFactory,
  ) {}

  calculateWithdrawal(amountStr: string, currency: Currency): WithdrawalCalculation {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than zero');
    }

    const grossNgn = currency === Currency.NGN ? amount : amount * this.exchangeRate;
    const partnerFee = 150.0;
    const flatFee = 100.0;
    const stampDuty = grossNgn >= 10000 ? 50.0 : 0.0;
    const totalDeductions = partnerFee + flatFee + stampDuty;
    const netPayoutNaira = grossNgn - totalDeductions;

    if (netPayoutNaira <= 0) {
      throw new BadRequestException('Withdrawal amount too low to cover fees');
    }

    return {
      grossAmount: grossNgn.toFixed(2),
      partnerFee: partnerFee.toFixed(2),
      flatFee: flatFee.toFixed(2),
      stampDuty: stampDuty.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netPayoutNaira: netPayoutNaira.toFixed(2),
      exchangeRate: this.exchangeRate,
    };
  }

  async executeWithdrawal(dto: InitiateWithdrawalDto): Promise<WithdrawalReceipt> {
    const worker = await this.workerRepo.findOne({ where: { id: dto.workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const pm = await this.pmRepo.findOne({
      where: { id: dto.payoutMethodId, workerId: worker.id },
    });
    if (!pm) throw new NotFoundException('Payout method not found');

    if (!dto.otpOrPin || dto.otpOrPin.length < 4) {
      throw new BadRequestException('Valid OTP or security PIN is required to confirm withdrawal');
    }

    const calc = this.calculateWithdrawal(dto.amount, dto.currency);
    const ref = `wdr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return this.dataSource.transaction(async (manager) => {
      const feeInCurrency = dto.currency === Currency.NGN
        ? (parseFloat(calc.partnerFee) + parseFloat(calc.flatFee)).toFixed(2)
        : ((parseFloat(calc.partnerFee) + parseFloat(calc.flatFee)) / this.exchangeRate).toFixed(2);

      const stampDutyInCurrency = dto.currency === Currency.NGN
        ? calc.stampDuty
        : (parseFloat(calc.stampDuty) / this.exchangeRate).toFixed(2);

      await this.ledgerService.processWithdrawal(
        {
          workerId: worker.id,
          amount: parseFloat(dto.amount).toFixed(2),
          currency: dto.currency,
          feeAmount: feeInCurrency,
          stampDuty: stampDutyInCurrency,
          withdrawalRef: ref,
        },
        manager,
      );

      if (pm.type === PayoutMethodType.BANK_ACCOUNT) {
        await this.bankingFactory.getProvider().disburseNaira({
          amount: parseFloat(calc.netPayoutNaira),
          reference: ref,
          bankCode: pm.bankCode || '058',
          accountNumber: pm.accountReference,
          accountName: pm.accountName || worker.name,
          narration: `PayCrew withdrawal to ${worker.name}`,
        });
      }

      return {
        receiptId: `RCP-${Date.now().toString(36).toUpperCase()}`,
        workerName: worker.name,
        bankName: pm.bankName || 'Nigerian Bank',
        accountNumber: pm.accountReference,
        accountName: pm.accountName || worker.name,
        grossAmount: calc.grossAmount,
        netAmount: calc.netPayoutNaira,
        fees: (parseFloat(calc.partnerFee) + parseFloat(calc.flatFee)).toFixed(2),
        stampDuty: calc.stampDuty,
        currency: Currency.NGN,
        reference: ref,
        completedAt: new Date(),
      };
    });
  }
}

