import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ContractEntity, WorkerEntity } from '../../database/entities';
import { ContractStatus, KycStatus, WorkerStatus } from '@paycrew/shared-types';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepo: Repository<ContractEntity>,
    @InjectRepository(WorkerEntity)
    private readonly workerRepo: Repository<WorkerEntity>,
  ) {}

  async getContract(contractId: string): Promise<ContractEntity> {
    const contract = await this.contractRepo.findOne({
      where: { id: contractId },
      relations: ['worker', 'worker.company'],
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async getWorkerContract(workerId: string): Promise<ContractEntity> {
    const contract = await this.contractRepo.findOne({
      where: { workerId },
      relations: ['worker'],
      order: { createdAt: 'DESC' },
    });
    if (!contract) throw new NotFoundException('Contract not found for worker');
    return contract;
  }

  async signContract(
    contractId: string,
    typedName: string,
    ip: string,
    userAgent: string,
  ): Promise<ContractEntity> {
    const contract = await this.getContract(contractId);
    if (contract.status === ContractStatus.SIGNED) {
      throw new BadRequestException('Contract is already signed');
    }

    const timestamp = new Date();
    const hashData = `${contract.id}:${typedName}:${timestamp.toISOString()}:${ip}:${userAgent}`;
    const signatureHash = crypto.createHash('sha256').update(hashData).digest('hex');

    contract.status = ContractStatus.SIGNED;
    contract.signedAt = timestamp;
    contract.signedIp = ip;
    contract.signedUserAgent = userAgent;
    contract.signatureHash = signatureHash;
    contract.signedPdfUrl = `/api/v1/contracts/${contract.id}/download`;

    const saved = await this.contractRepo.save(contract);

    // Update worker status if KYC is also completed
    const worker = await this.workerRepo.findOne({
      where: { id: contract.workerId },
      relations: ['kycChecks'],
    });
    if (worker) {
      const hasApprovedKyc = worker.kycChecks?.some((k) => k.status === KycStatus.APPROVED);
      if (hasApprovedKyc) {
        worker.status = WorkerStatus.ACTIVE;
        await this.workerRepo.save(worker);
      }
    }

    return saved;
  }
}
