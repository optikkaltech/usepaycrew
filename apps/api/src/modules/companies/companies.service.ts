import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../database/entities';
import { CompanyFundingInfo, UpdateCompanyDto } from './companies.types';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
  ) {}

  async getCompany(companyId: string): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      relations: ['workers'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async getFundingInfo(companyId: string): Promise<CompanyFundingInfo> {
    const company = await this.getCompany(companyId);
    return {
      companyId: company.id,
      name: company.name,
      virtualAccountBank: company.virtualAccountBank,
      virtualAccountNumber: company.virtualAccountNumber,
      depositWalletAddress: company.depositWalletAddress,
      supportedCurrencies: ['USD', 'USDC', 'USDT', 'NGN'],
    };
  }

  async updateCompany(companyId: string, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    const company = await this.getCompany(companyId);
    if (dto.name) company.name = dto.name;
    if (dto.registrationNumber !== undefined) company.registrationNumber = dto.registrationNumber;
    if (dto.country) company.country = dto.country;
    return this.companyRepo.save(company);
  }
}
