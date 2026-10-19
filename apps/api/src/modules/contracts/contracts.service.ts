import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import PDFDocument from 'pdfkit';
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

  async generateContractPdf(contractId: string): Promise<{ buffer: Buffer; filename: string }> {
    const contract = await this.getContract(contractId);
    const worker = contract.worker;
    const company = worker?.company;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          filename: `PayCrew_Contract_${worker?.name?.replace(/\s+/g, '_') || 'Worker'}_${contract.id.slice(0, 8)}.pdf`,
        });
      });
      doc.on('error', (err) => reject(err));

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('PAYCREW CONTRACTOR AGREEMENT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#555555').text(`Template Version: ${contract.templateVersion}`, { align: 'center' });
      doc.moveDown(1.5);

      // 1. Parties
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('1. PARTIES');
      doc.font('Helvetica').fontSize(10).text(
        `This Independent Contractor Agreement is entered into between ${company?.name || 'Company'} ("Client") and ${worker?.name || 'Contractor'} ("Contractor"), email: ${worker?.email || 'N/A'}.`
      );
      doc.moveDown();

      // 2. Engagement & Role
      doc.fontSize(12).font('Helvetica-Bold').text('2. ENGAGEMENT AND ROLE');
      doc.font('Helvetica').fontSize(10).text(
        `The Contractor shall perform services in the capacity of ${worker?.role || 'Independent Contractor'} in accordance with industry best practices and governed under the laws of the Federal Republic of Nigeria.`
      );
      doc.moveDown();

      // 3. Compensation
      doc.fontSize(12).font('Helvetica-Bold').text('3. COMPENSATION & PAYMENT TERMS');
      doc.font('Helvetica').fontSize(10).text(
        `Client agrees to compensate Contractor at the rate of ${worker?.payAmount || '0.00'} ${worker?.payCurrency || 'USD'} payable on a ${worker?.payFrequency?.toLowerCase() || 'monthly'} schedule via PayCrew automated stablecoin disbursement rails.`
      );
      doc.moveDown();

      // 4. Status & Taxes
      doc.fontSize(12).font('Helvetica-Bold').text('4. INDEPENDENT CONTRACTOR STATUS & TAXES');
      doc.font('Helvetica').fontSize(10).text(
        'The Contractor acknowledges they are an independent contractor, not an employee. Contractor is solely responsible for all personal taxes, levies, and statutory filings under applicable local laws (including Nigeria Tax regulations).'
      );
      doc.moveDown(2);

      // 5. Digital Signatures & Audit Trail
      doc.fontSize(12).font('Helvetica-Bold').text('5. DIGITAL SIGNATURE AUDIT TRAIL');
      doc.moveDown(0.5);

      doc.rect(50, doc.y, 500, 100).fillAndStroke('#f8f9fa', '#e2e8f0');
      doc.fillColor('#1a202c').fontSize(9).font('Helvetica');

      const boxY = doc.y + 10;
      doc.text(`Digital Signature: ${contract.status === ContractStatus.SIGNED ? 'VERIFIED & EXECUTED' : 'PENDING SIGNATURE'}`, 65, boxY);
      doc.text(`Signed By: ${worker?.name || 'Contractor'}`, 65, boxY + 16);
      doc.text(`Timestamp: ${contract.signedAt ? new Date(contract.signedAt).toUTCString() : 'Pending'}`, 65, boxY + 32);
      doc.text(`IP Address: ${contract.signedIp || '127.0.0.1'}`, 65, boxY + 48);
      doc.text(`Cryptographic Hash (SHA-256): ${contract.signatureHash || 'Pending'}`, 65, boxY + 64);

      doc.end();
    });
  }
}
