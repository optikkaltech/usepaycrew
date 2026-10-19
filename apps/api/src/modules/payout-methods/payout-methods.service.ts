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

  private cachedBanks: BankInfo[] = [];
  private lastFetchedBanksAt = 0;

  async getBanks(): Promise<BankInfo[]> {
    const now = Date.now();
    if (this.cachedBanks.length > 0 && now - this.lastFetchedBanksAt < 3600000) {
      return this.cachedBanks;
    }

    try {
      const rampBaseUrl = process.env.QUIDAX_RAMP_BASE_URL || 'https://ramp-be.quidax.io';
      const rampPrivateKey = process.env.QUIDAX_RAMP_PRIVATE_KEY || '';
      if (rampPrivateKey) {
        const resp = await fetch(`${rampBaseUrl}/api/v1/merchants/custodial/banks?country=NG`, {
          headers: { 'x-private-key': rampPrivateKey, accept: 'application/json' },
        });
        const json = await resp.json();
        if (resp.ok && Array.isArray(json.data) && json.data.length > 0) {
          this.cachedBanks = json.data
            .map((b: any) => ({ code: b.code, name: b.name }))
            .sort((a: BankInfo, b: BankInfo) => a.name.localeCompare(b.name));
          this.lastFetchedBanksAt = now;
          return this.cachedBanks;
        }
      }
    } catch {
      // fallback
    }

    try {
      return await this.bankingFactory.getProvider().getBanks();
    } catch {
      return this.cachedBanks;
    }
  }

  async lookupBankAccount(accountNumber: string, bankCode: string): Promise<BankAccountLookupResult> {
    if (!/^\d{10}$/.test(accountNumber)) {
      throw new BadRequestException('Account number must be 10 digits');
    }

    try {
      const res = await this.bankingFactory.getProvider().resolveAccount(accountNumber, bankCode);
      return {
        accountNumber: res.accountNumber,
        bankCode: res.bankCode,
        accountName: res.accountName,
      };
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new BadRequestException(
          err.message || 'Unable to resolve bank account. Please check the account number and bank.',
        );
      }
      return {
        accountNumber,
        bankCode,
        accountName: 'Demo Account Holder (Test Mode)',
      };
    }
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

  async linkExistingMethod(workerId: string, existingMethodId: string): Promise<PayoutMethodEntity> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const source = await this.pmRepo.findOne({ where: { id: existingMethodId } });
    if (!source) throw new NotFoundException('Existing payout method not found');

    await this.pmRepo.update({ workerId, isDefault: true }, { isDefault: false });

    const newPm = this.pmRepo.create({
      workerId, type: source.type, accountReference: source.accountReference,
      bankCode: source.bankCode, bankName: source.bankName, accountName: source.accountName,
      network: source.network, isVerified: true, isDefault: true,
    });
    return this.pmRepo.save(newPm);
  }

  async setDefault(id: string): Promise<PayoutMethodEntity> {
    const pm = await this.pmRepo.findOne({ where: { id } });
    if (!pm) throw new NotFoundException('Payout method not found');
    await this.pmRepo.update({ workerId: pm.workerId }, { isDefault: false });
    pm.isDefault = true;
    return this.pmRepo.save(pm);
  }

  async deleteMethod(id: string): Promise<void> {
    const pm = await this.pmRepo.findOne({ where: { id } });
    if (!pm) throw new NotFoundException('Payout method not found');
    await this.pmRepo.remove(pm);
  }
}

