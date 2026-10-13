import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  Currency,
  LedgerCategory,
  LedgerEntryType,
} from '@paycrew/shared-types';
import { CompanyEntity } from './company.entity';
import { WorkerEntity } from './worker.entity';

@Entity('ledger_entries')
export class LedgerEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  companyId: string | null;

  @ManyToOne(() => CompanyEntity, (company) => company.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity | null;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  workerId: string | null;

  @ManyToOne(() => WorkerEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerEntity | null;

  @Column({ type: 'varchar', length: 50 })
  accountType: 'COMPANY' | 'WORKER' | 'PLATFORM_REVENUE' | 'ESCROW';

  @Column({ type: 'decimal', precision: 16, scale: 2 })
  amount: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: LedgerEntryType,
  })
  entryType: LedgerEntryType;

  @Column({
    type: 'enum',
    enum: LedgerCategory,
  })
  category: LedgerCategory;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  reference: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
