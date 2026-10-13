import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WorkerEntity } from './worker.entity';
import { PaymentEntity } from './payment.entity';
import { LedgerEntryEntity } from './ledger-entry.entity';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrationNumber: string | null;

  @Column({ type: 'varchar', length: 10, default: 'NG' })
  country: string;

  @Column({ type: 'varchar', length: 50, default: 'BASIC' })
  plan: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  virtualAccountBank: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  virtualAccountNumber: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  depositWalletAddress: string | null;

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity[];

  @OneToMany(() => WorkerEntity, (worker) => worker.company)
  workers: WorkerEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.company)
  payments: PaymentEntity[];

  @OneToMany(() => LedgerEntryEntity, (entry) => entry.company)
  ledgerEntries: LedgerEntryEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
