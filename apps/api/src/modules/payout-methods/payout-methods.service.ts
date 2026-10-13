import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutMethodEntity, WorkerEntity } from '../../database/entities';
import { PayoutMethodType } from '@paycrew/shared-types';
import {
  AddBankAccountDto,
  AddWalletDto,
  BankAccountLookupResult,
} from './payout-methods.types';

@Injectable()
export class PayoutMethodsService {
  constructor(
    @InjectRepository(PayoutMethodEntity)
    private readonly pmRepo: Repository<PayoutMethodEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
  ) {}

  async lookupBankAccount(accountNumber: string, bankCode: string): Promise<BankAccountLookupResult> {
    if (!/^\d{10}$/.test(accountNumber)) {
      throw new BadRequestException('Nigerian NUBAN account number must be 10 digits');
    }

    // Bank resolution mock adapter (matches real NIBSS/Paystack/Monnify format)
    const simulatedNames: Record<string, string> = {
      '058': 'OLUWASEUN ADEBAYO',
      '011': 'CHUKWUMA EZE',
      '033': 'FATIMA BELLO',
      '057': 'BABATUNDE BAKARE',
      '232': 'AMINA SULEIMAN',
    };

    const resolvedName = simulatedNames[bankCode] || 'VERIFIED WORKER ACCOUNT';
    return {
      accountNumber,
      bankCode,
      accountName: resolvedName,
    };
  }

  async addBankAccount(workerId: string, dto: AddBankAccountDto): Promise<PayoutMethodEntity> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const lookup = await this.lookupBankAccount(dto.accountNumber, dto.bankCode);

    // Unset existing defaults if any
    await this.pmRepo.update({ workerId, isDefault: true }, { isDefault: false });

    const pm = this.pmRepo.create({
      workerId,
      type: PayoutMethodType.BANK_ACCOUNT,
      accountReference: dto.accountNumber,
      bankCode: dto.bankCode,
      bankName: dto.bankName,
      accountName: lookup.accountName,
      isVerified: true,
      isDefault: true,
    });
    return this.pmRepo.save(pm);
  }

  async addWallet(workerId: string, dto: AddWalletDto): Promise<PayoutMethodEntity> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const cleanAddress = dto.walletAddress.trim();
    const isEvm = /^0x[a-fA-F0-9]{40}$/.test(cleanAddress);
    const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanAddress);

    if (!isEvm && !isSolana) {
      throw new BadRequestException('Invalid wallet address format');
    }

    const pm = this.pmRepo.create({
      workerId,
      type: PayoutMethodType.STABLECOIN_WALLET,
      accountReference: cleanAddress,
      network: dto.network,
      isVerified: true,
      isDefault: false,
    });
    return this.pmRepo.save(pm);
  }

  async getMethods(workerId: string): Promise<PayoutMethodEntity[]> {
    return this.pmRepo.find({
      where: { workerId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }
}
