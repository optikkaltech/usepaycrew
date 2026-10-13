import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ContractStatus } from '@paycrew/shared-types';
import { WorkerEntity } from './worker.entity';

@Entity('contracts')
export class ContractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  workerId: string;

  @ManyToOne(() => WorkerEntity, (worker) => worker.contracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerEntity;

  @Column({ type: 'varchar', length: 50, default: 'NG-CONTRACTOR-2026.1' })
  templateVersion: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.SENT,
  })
  status: ContractStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  signedPdfUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signatureHash: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  signedAt: Date | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  signedIp: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signedUserAgent: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
