import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { LedgerEntryEntity } from '../../database/entities';
import {
  Currency,
  LedgerCategory,
  LedgerEntryType,
} from '@paycrew/shared-types';
import {
  BalanceSummary,
  PayrollTransferParams,
  PostEntryParams,
  WithdrawalTransferParams,
} from './ledger.types';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntryEntity)
    private readonly ledgerRepo: Repository<LedgerEntryEntity>,
  ) {}

  async getBalance(
    filter: { companyId?: string; workerId?: string; currency: Currency },
    manager?: EntityManager,
  ): Promise<BalanceSummary> {
    const repo = manager ? manager.getRepository(LedgerEntryEntity) : this.ledgerRepo;
    const qb = repo.createQueryBuilder('entry');
    const isUsdGroup = [Currency.USD, Currency.USDT, Currency.USDC].includes(filter.currency);
    if (isUsdGroup) {
      qb.where('entry.currency IN (:...currencies)', { currencies: [Currency.USD, Currency.USDT, Currency.USDC] });
    } else {
      qb.where('entry.currency = :currency', { currency: filter.currency });
    }

    if (filter.companyId) {
      qb.andWhere('entry.companyId = :companyId AND entry.accountType = :accType', {
        companyId: filter.companyId,
        accType: 'COMPANY',
      });
    } else if (filter.workerId) {
      qb.andWhere('entry.workerId = :workerId AND entry.accountType = :accType', {
        workerId: filter.workerId,
        accType: 'WORKER',
      });
    }

    const entries = await qb.getMany();
    let credits = 0;
    let debits = 0;

    for (const entry of entries) {
      const val = Math.round(parseFloat(entry.amount) * 100);
      if (entry.entryType === LedgerEntryType.CREDIT) credits += val;
      if (entry.entryType === LedgerEntryType.DEBIT) debits += val;
    }

    const net = credits - debits;
    return {
      currency: filter.currency,
      availableBalance: (net / 100).toFixed(2),
      totalCredits: (credits / 100).toFixed(2),
      totalDebits: (debits / 100).toFixed(2),
    };
  }

  async postEntry(params: PostEntryParams, manager?: EntityManager): Promise<LedgerEntryEntity> {
    const repo = manager ? manager.getRepository(LedgerEntryEntity) : this.ledgerRepo;
    const entry = repo.create({
      companyId: params.companyId ?? null,
      workerId: params.workerId ?? null,
      accountType: params.accountType,
      amount: parseFloat(params.amount).toFixed(2),
      currency: params.currency,
      entryType: params.entryType,
      category: params.category,
      reference: params.reference,
      description: params.description,
      metadata: params.metadata ?? null,
    });
    return repo.save(entry);
  }

  async processPayroll(params: PayrollTransferParams, manager: EntityManager): Promise<void> {
    const balance = await this.getBalance(
      { companyId: params.companyId, currency: params.currency },
      manager,
    );

    const requiredCents = Math.round((parseFloat(params.amount) + parseFloat(params.feeAmount)) * 100);
    const availableCents = Math.round(parseFloat(balance.availableBalance) * 100);

    if (availableCents < requiredCents) {
      throw new BadRequestException(
        `Insufficient company balance. Required: ${params.amount} + ${params.feeAmount} ${params.currency}, Available: ${balance.availableBalance} ${params.currency}`,
      );
    }

    const totalDeduction = (requiredCents / 100).toFixed(2);

    await this.postEntry({
      companyId: params.companyId,
      accountType: 'COMPANY',
      amount: totalDeduction,
      currency: params.currency,
      entryType: LedgerEntryType.DEBIT,
      category: LedgerCategory.PAYROLL_PAYMENT,
      reference: params.idempotencyKey,
      description: `Payroll payment #${params.paymentId} for worker ${params.workerId}`,
    }, manager);

    await this.postEntry({
      workerId: params.workerId,
      accountType: 'WORKER',
      amount: parseFloat(params.amount).toFixed(2),
      currency: params.currency,
      entryType: LedgerEntryType.CREDIT,
      category: LedgerCategory.PAYROLL_PAYMENT,
      reference: params.idempotencyKey,
      description: `Payroll received from company #${params.companyId}`,
    }, manager);

    if (parseFloat(params.feeAmount) > 0) {
      await this.postEntry({
        accountType: 'PLATFORM_REVENUE',
        amount: parseFloat(params.feeAmount).toFixed(2),
        currency: params.currency,
        entryType: LedgerEntryType.CREDIT,
        category: LedgerCategory.PAYROLL_FEE,
        reference: params.idempotencyKey,
        description: `Platform fee on payment #${params.paymentId}`,
      }, manager);
    }
  }

  async processWithdrawal(params: WithdrawalTransferParams, manager: EntityManager): Promise<void> {
    const balance = await this.getBalance(
      { workerId: params.workerId, currency: params.currency },
      manager,
    );

    const totalCents = Math.round(
      (parseFloat(params.amount) + parseFloat(params.feeAmount) + parseFloat(params.stampDuty)) * 100,
    );
    const availableCents = Math.round(parseFloat(balance.availableBalance) * 100);

    if (availableCents < totalCents) {
      throw new BadRequestException('Insufficient worker balance for withdrawal');
    }

    await this.postEntry({
      workerId: params.workerId,
      accountType: 'WORKER',
      amount: (totalCents / 100).toFixed(2),
      currency: params.currency,
      entryType: LedgerEntryType.DEBIT,
      category: LedgerCategory.WITHDRAWAL,
      reference: params.withdrawalRef,
      description: `Worker withdrawal ${params.amount} ${params.currency}`,
    }, manager);
  }

  async getCompanyEntries(companyId: string, limit = 20): Promise<LedgerEntryEntity[]> {
    return this.ledgerRepo.find({
      where: { companyId, accountType: 'COMPANY' },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
