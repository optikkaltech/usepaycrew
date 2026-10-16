import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { CompanyEntity, CompanyWalletEntity } from '../../database/entities';
import { RampProviderFactory } from '../../providers/ramp/ramp.factory';
import { RampProviderType, Currency } from '@paycrew/shared-types';
import {
  CompanyFundingInfo,
  UpdateCompanyDto,
  CreateCompanyWalletDto,
  AssetNetworkConfig,
} from './companies.types';

export const SUPPORTED_CRYPTO_ASSETS: AssetNetworkConfig[] = [
  { currency: 'USDT', name: 'Tether USD', networks: ['TRON (TRC20)', 'Polygon', 'BNB Chain (BEP20)', 'Ethereum (ERC20)'] },
  { currency: 'USDC', name: 'USD Coin', networks: ['Polygon', 'Base', 'Ethereum (ERC20)'] },
  { currency: 'BTC', name: 'Bitcoin', networks: ['Bitcoin'] },
  { currency: 'ETH', name: 'Ethereum', networks: ['Ethereum (ERC20)', 'Base', 'Arbitrum'] },
];

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(CompanyWalletEntity)
    private readonly walletRepo: Repository<CompanyWalletEntity>,
    private readonly rampFactory: RampProviderFactory,
  ) {}

  async getCompany(companyId: string): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      relations: ['workers'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async getWallets(companyId: string): Promise<CompanyWalletEntity[]> {
    return this.walletRepo.find({ where: { companyId }, order: { createdAt: 'DESC' } });
  }

  async createWallet(companyId: string, dto: CreateCompanyWalletDto): Promise<CompanyWalletEntity> {
    const company = await this.getCompany(companyId);
    const currencyUpper = (dto.currency || 'USDT').toUpperCase();
    const network = dto.network || 'TRON (TRC20)';

    // 1. Check if wallet already exists for this asset and network
    const existing = await this.walletRepo.findOne({
      where: { companyId, currency: currencyUpper, network },
    });
    if (existing) return existing;

    // 2. Generate live address from provider (Quidax API / configured treasury)
    const ramp = this.rampFactory.getProvider(company.activeRampProvider || RampProviderType.QUIDAX);
    const result = await ramp.generateDepositAddress(currencyUpper as Currency, network);

    if (!result?.address) {
      throw new BadRequestException(`Failed to generate live address for ${currencyUpper} on ${network}`);
    }

    // 3. Generate QR code for this address
    const qrCode = await QRCode.toDataURL(result.address);

    // 4. Save and return the wallet
    const wallet = this.walletRepo.create({
      companyId,
      currency: currencyUpper,
      network,
      address: result.address,
      qrCode,
    });

    const saved = await this.walletRepo.save(wallet);

    // Update company default deposit wallet if empty
    if (!company.depositWalletAddress) {
      company.depositWalletAddress = result.address;
      await this.companyRepo.save(company);
    }

    return saved;
  }

  async getFundingInfo(companyId: string): Promise<CompanyFundingInfo> {
    const company = await this.getCompany(companyId);
    const wallets = await this.getWallets(companyId);

    return {
      companyId: company.id,
      name: company.name,
      wallets,
      supportedAssets: SUPPORTED_CRYPTO_ASSETS,
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
