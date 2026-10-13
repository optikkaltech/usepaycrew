import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1791929528714 implements MigrationInterface {
    name = 'InitialSchema1791929528714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('COMPANY_OWNER', 'APPROVER', 'WORKER', 'PLATFORM_ADMIN')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INVITED', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "fullName" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'COMPANY_OWNER', "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" character varying(255), "companyId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."kyc_checks_checktype_enum" AS ENUM('BVN', 'NIN', 'SELFIE_LIVENESS', 'BANK_ACCOUNT_NAME')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_checks_status_enum" AS ENUM('NOT_STARTED', 'PENDING', 'APPROVED', 'FAILED', 'MANUAL_REVIEW')`);
        await queryRunner.query(`CREATE TABLE "kyc_checks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workerId" uuid NOT NULL, "provider" character varying(50) NOT NULL DEFAULT 'DOJAH', "checkType" "public"."kyc_checks_checktype_enum" NOT NULL, "status" "public"."kyc_checks_status_enum" NOT NULL DEFAULT 'PENDING', "encryptedData" text, "maskedIdentifier" character varying(50), "reasonCode" character varying(100), "providerReference" character varying(150), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c28137b746ea89f69376ac1b862" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26d3a61d72d7ec71602a2de92d" ON "kyc_checks" ("workerId") `);
        await queryRunner.query(`CREATE TYPE "public"."payout_methods_type_enum" AS ENUM('BANK_ACCOUNT', 'STABLECOIN_WALLET')`);
        await queryRunner.query(`CREATE TABLE "payout_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workerId" uuid NOT NULL, "type" "public"."payout_methods_type_enum" NOT NULL, "accountReference" character varying(255) NOT NULL, "bankCode" character varying(50), "bankName" character varying(150), "accountName" character varying(255), "network" character varying(50), "isVerified" boolean NOT NULL DEFAULT false, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cedb0a9e379a9a0a16ad050527e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65d64602a0f403bda0302df22b" ON "payout_methods" ("workerId") `);
        await queryRunner.query(`CREATE TYPE "public"."contracts_status_enum" AS ENUM('DRAFT', 'SENT', 'SIGNED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workerId" uuid NOT NULL, "templateVersion" character varying(50) NOT NULL DEFAULT 'NG-CONTRACTOR-2026.1', "title" character varying(255) NOT NULL, "content" text NOT NULL, "status" "public"."contracts_status_enum" NOT NULL DEFAULT 'SENT', "signedPdfUrl" character varying(500), "signatureHash" character varying(255), "signedAt" TIMESTAMP WITH TIME ZONE, "signedIp" character varying(45), "signedUserAgent" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6208a1cb00f831ef861c745031" ON "contracts" ("workerId") `);
        await queryRunner.query(`CREATE TYPE "public"."payments_currency_enum" AS ENUM('USD', 'USDC', 'USDT', 'NGN')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('CREATED', 'SUBMITTED', 'PENDING', 'PAID', 'FAILED', 'REVERSED')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid NOT NULL, "workerId" uuid NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" "public"."payments_currency_enum" NOT NULL DEFAULT 'USD', "feeAmount" numeric(14,2) NOT NULL DEFAULT '0', "totalCharged" numeric(14,2) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'CREATED', "note" character varying(255), "providerReference" character varying(150), "idempotencyKey" character varying(255) NOT NULL, "scheduledFor" TIMESTAMP WITH TIME ZONE, "failureReason" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79fa12c269730f9e1eb40b09d3" ON "payments" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a03c9d5254fca3435262af9721" ON "payments" ("workerId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_743b9fb1d2a059f2f7860418e4" ON "payments" ("idempotencyKey") `);
        await queryRunner.query(`CREATE TYPE "public"."workers_paycurrency_enum" AS ENUM('USD', 'USDC', 'USDT', 'NGN')`);
        await queryRunner.query(`CREATE TYPE "public"."workers_payfrequency_enum" AS ENUM('ONE_OFF', 'MONTHLY')`);
        await queryRunner.query(`CREATE TYPE "public"."workers_status_enum" AS ENUM('INVITED', 'ONBOARDING', 'VERIFIED', 'ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "workers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid NOT NULL, "userId" uuid, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "country" character varying(10) NOT NULL DEFAULT 'NG', "role" character varying(150) NOT NULL, "payAmount" numeric(14,2) NOT NULL, "payCurrency" "public"."workers_paycurrency_enum" NOT NULL DEFAULT 'USD', "payFrequency" "public"."workers_payfrequency_enum" NOT NULL DEFAULT 'MONTHLY', "status" "public"."workers_status_enum" NOT NULL DEFAULT 'INVITED', "inviteToken" character varying(255), "inviteExpiresAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e950c9aba3bd84a4f193058d838" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0a6c1587efa7028853b273eb7" ON "workers" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdefd9252e90173f66271f76b9" ON "workers" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_87f2092ffaae628ef63547d244" ON "workers" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."ledger_entries_currency_enum" AS ENUM('USD', 'USDC', 'USDT', 'NGN')`);
        await queryRunner.query(`CREATE TYPE "public"."ledger_entries_entrytype_enum" AS ENUM('CREDIT', 'DEBIT')`);
        await queryRunner.query(`CREATE TYPE "public"."ledger_entries_category_enum" AS ENUM('DEPOSIT', 'PAYROLL_PAYMENT', 'PAYROLL_FEE', 'WITHDRAWAL', 'WITHDRAWAL_FEE', 'STAMP_DUTY', 'REVERSAL', 'ADJUSTMENT')`);
        await queryRunner.query(`CREATE TABLE "ledger_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid, "workerId" uuid, "accountType" character varying(50) NOT NULL, "amount" numeric(16,2) NOT NULL, "currency" "public"."ledger_entries_currency_enum" NOT NULL, "entryType" "public"."ledger_entries_entrytype_enum" NOT NULL, "category" "public"."ledger_entries_category_enum" NOT NULL, "reference" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6efcb84411d3f08b08450ae75d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd118d137be2200766a73b69bb" ON "ledger_entries" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ffd1742d0aad409c4411f4bfc" ON "ledger_entries" ("workerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e65825ccc890b273369f21ec2f" ON "ledger_entries" ("reference") `);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "registrationNumber" character varying(100), "country" character varying(10) NOT NULL DEFAULT 'NG', "plan" character varying(50) NOT NULL DEFAULT 'BASIC', "virtualAccountBank" character varying(100), "virtualAccountNumber" character varying(50), "depositWalletAddress" character varying(150), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actorId" uuid, "actorEmail" character varying(255), "action" character varying(100) NOT NULL, "entity" character varying(50) NOT NULL, "entityId" character varying(100), "ip" character varying(45), "userAgent" character varying(255), "details" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2dc33f7f3c22e2e7badafca1d1" ON "audit_logs" ("actorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cee5459245f652b75eb2759b4c" ON "audit_logs" ("action") `);
        await queryRunner.query(`CREATE INDEX "IDX_445557993007fefee3aa9f1117" ON "audit_logs" ("entity") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyc_checks" ADD CONSTRAINT "FK_26d3a61d72d7ec71602a2de92d4" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payout_methods" ADD CONSTRAINT "FK_65d64602a0f403bda0302df22b6" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_6208a1cb00f831ef861c7450315" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_79fa12c269730f9e1eb40b09d3b" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_a03c9d5254fca3435262af9721c" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "FK_c0a6c1587efa7028853b273eb7c" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ledger_entries" ADD CONSTRAINT "FK_cd118d137be2200766a73b69bb1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ledger_entries" ADD CONSTRAINT "FK_5ffd1742d0aad409c4411f4bfc8" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ledger_entries" DROP CONSTRAINT "FK_5ffd1742d0aad409c4411f4bfc8"`);
        await queryRunner.query(`ALTER TABLE "ledger_entries" DROP CONSTRAINT "FK_cd118d137be2200766a73b69bb1"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "FK_c0a6c1587efa7028853b273eb7c"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_a03c9d5254fca3435262af9721c"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_79fa12c269730f9e1eb40b09d3b"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_6208a1cb00f831ef861c7450315"`);
        await queryRunner.query(`ALTER TABLE "payout_methods" DROP CONSTRAINT "FK_65d64602a0f403bda0302df22b6"`);
        await queryRunner.query(`ALTER TABLE "kyc_checks" DROP CONSTRAINT "FK_26d3a61d72d7ec71602a2de92d4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_445557993007fefee3aa9f1117"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cee5459245f652b75eb2759b4c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dc33f7f3c22e2e7badafca1d1"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e65825ccc890b273369f21ec2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ffd1742d0aad409c4411f4bfc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd118d137be2200766a73b69bb"`);
        await queryRunner.query(`DROP TABLE "ledger_entries"`);
        await queryRunner.query(`DROP TYPE "public"."ledger_entries_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ledger_entries_entrytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ledger_entries_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87f2092ffaae628ef63547d244"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdefd9252e90173f66271f76b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0a6c1587efa7028853b273eb7"`);
        await queryRunner.query(`DROP TABLE "workers"`);
        await queryRunner.query(`DROP TYPE "public"."workers_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."workers_payfrequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."workers_paycurrency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_743b9fb1d2a059f2f7860418e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a03c9d5254fca3435262af9721"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79fa12c269730f9e1eb40b09d3"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6208a1cb00f831ef861c745031"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TYPE "public"."contracts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65d64602a0f403bda0302df22b"`);
        await queryRunner.query(`DROP TABLE "payout_methods"`);
        await queryRunner.query(`DROP TYPE "public"."payout_methods_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26d3a61d72d7ec71602a2de92d"`);
        await queryRunner.query(`DROP TABLE "kyc_checks"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_checks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_checks_checktype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
