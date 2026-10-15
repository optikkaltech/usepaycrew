import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutMethodEntity, WorkerEntity } from '../../database/entities';
import { PayoutMethodType } from '@paycrew/shared-types';
import { BankingProviderFactory } from '../../providers/banking/banking.factory';
import { BankInfo } from '../../providers/banking/banking.interface';
import {
  AddBankAccountDto,
  AddWalletDto,
  BankAccountLookupResult,
} from './payout-methods.types';
import { maskAccountNumber, maskWalletAddress } from '../../common/utils/masking.util';

@Injectable()
export class PayoutMethodsService {
  constructor(
    @InjectRepository(PayoutMethodEntity)
    private readonly pmRepo: Repository<PayoutMethodEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
    private readonly bankingFactory: BankingProviderFactory,
  ) {}

  async getBanks(): Promise<BankInfo[]> {
    return this.bankingFactory.getProvider().getBanks();
  }

  async lookupBankAccount(accountNumber: string, bankCode: string): Promise<BankAccountLookupResult> {
    if (!/^\d{10}$/.test(accountNumber)) {
      throw new BadRequestException('Nigerian NUBAN account number must be 10 digits');
    }

    const res = await this.bankingFactory.getProvider().resolveAccount(accountNumber, bankCode);
    return {
      accountNumber: res.accountNumber,
      bankCode: res.bankCode,
      accountName: res.accountName,
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
    const isTron = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(cleanAddress);
    const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanAddress);

    if (!isEvm && !isTron && !isSolana) {
      throw new BadRequestException('Invalid wallet address format (EVM, TRON, or Solana)');
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

  async getMethods(workerId: string): Promise<any[]> {
    const methods = await this.pmRepo.find({
      where: { workerId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
    return methods.map((m) => ({
      ...m,
      accountReference:
        m.type === PayoutMethodType.BANK_ACCOUNT
          ? maskAccountNumber(m.accountReference)
          : maskWalletAddress(m.accountReference),
      maskedReference:
        m.type === PayoutMethodType.BANK_ACCOUNT
          ? maskAccountNumber(m.accountReference)
          : maskWalletAddress(m.accountReference),
      canReveal: true,
    }));
  }

  async revealMethod(id: string): Promise<{ id: string; accountReference: string }> {
    const pm = await this.pmRepo.findOne({ where: { id } });
    if (!pm) throw new NotFoundException('Payout method not found');
    return {
      id: pm.id,
      accountReference: pm.accountReference,
    };
  }
}

