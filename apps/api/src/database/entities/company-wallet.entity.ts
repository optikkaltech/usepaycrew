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
import { CompanyEntity } from './company.entity';

@Entity('company_wallets')
@Index(['companyId', 'currency', 'network'], { unique: true })
export class CompanyWalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => CompanyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 20 })
  currency: string;

  @Column({ type: 'varchar', length: 50 })
  network: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  destinationTag: string | null;

  @Column({ type: 'text', nullable: true })
  qrCode: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
