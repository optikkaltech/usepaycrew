import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProvidersAndOnboarding1791930934577 implements MigrationInterface {
    name = 'AddProvidersAndOnboarding1791930934577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "plan"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "googleId" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying(500)`);
        await queryRunner.query(`CREATE TYPE "public"."workers_onboardingstep_enum" AS ENUM('ACCOUNT', 'KYC', 'BANK', 'CONTRACT', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "workers" ADD "onboardingStep" "public"."workers_onboardingstep_enum" NOT NULL DEFAULT 'ACCOUNT'`);
        await queryRunner.query(`CREATE TYPE "public"."companies_subscriptionstatus_enum" AS ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "subscriptionStatus" "public"."companies_subscriptionstatus_enum" NOT NULL DEFAULT 'TRIAL'`);
        await queryRunner.query(`CREATE TYPE "public"."companies_subscriptionplan_enum" AS ENUM('STARTER', 'GROWTH', 'ENTERPRISE')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "subscriptionPlan" "public"."companies_subscriptionplan_enum" NOT NULL DEFAULT 'STARTER'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "subscriptionExpiresAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE TYPE "public"."companies_onboardingstep_enum" AS ENUM('PROFILE', 'COMPLIANCE', 'BILLING', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "onboardingStep" "public"."companies_onboardingstep_enum" NOT NULL DEFAULT 'PROFILE'`);
        await queryRunner.query(`CREATE TYPE "public"."companies_activekycprovider_enum" AS ENUM('PREMBLY', 'SMILE_ID', 'DOJAH', 'MOCK')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "activeKycProvider" "public"."companies_activekycprovider_enum" NOT NULL DEFAULT 'MOCK'`);
        await queryRunner.query(`CREATE TYPE "public"."companies_activerampprovider_enum" AS ENUM('QUIDAX', 'YELLOWCARD', 'MOCK')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "activeRampProvider" "public"."companies_activerampprovider_enum" NOT NULL DEFAULT 'MOCK'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "industry" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "businessAddress" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "taxId" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."ledger_entries_category_enum" RENAME TO "ledger_entries_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ledger_entries_category_enum" AS ENUM('DEPOSIT', 'PAYROLL_PAYMENT', 'PAYROLL_FEE', 'WITHDRAWAL', 'WITHDRAWAL_FEE', 'STAMP_DUTY', 'REVERSAL', 'ADJUSTMENT', 'SUBSCRIPTION_FEE')`);
        await queryRunner.query(`ALTER TABLE "ledger_entries" ALTER COLUMN "category" TYPE "public"."ledger_entries_category_enum" USING "category"::"text"::"public"."ledger_entries_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ledger_entries_category_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_f382af58ab36057334fb262efd" ON "users" ("googleId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f382af58ab36057334fb262efd"`);
        await queryRunner.query(`CREATE TYPE "public"."ledger_entries_category_enum_old" AS ENUM('DEPOSIT', 'PAYROLL_PAYMENT', 'PAYROLL_FEE', 'WITHDRAWAL', 'WITHDRAWAL_FEE', 'STAMP_DUTY', 'REVERSAL', 'ADJUSTMENT')`);
        await queryRunner.query(`ALTER TABLE "ledger_entries" ALTER COLUMN "category" TYPE "public"."ledger_entries_category_enum_old" USING "category"::"text"::"public"."ledger_entries_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."ledger_entries_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ledger_entries_category_enum_old" RENAME TO "ledger_entries_category_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "taxId"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "businessAddress"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "activeRampProvider"`);
        await queryRunner.query(`DROP TYPE "public"."companies_activerampprovider_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "activeKycProvider"`);
        await queryRunner.query(`DROP TYPE "public"."companies_activekycprovider_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "onboardingStep"`);
        await queryRunner.query(`DROP TYPE "public"."companies_onboardingstep_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "subscriptionExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "subscriptionPlan"`);
        await queryRunner.query(`DROP TYPE "public"."companies_subscriptionplan_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."companies_subscriptionstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "onboardingStep"`);
        await queryRunner.query(`DROP TYPE "public"."workers_onboardingstep_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "plan" character varying(50) NOT NULL DEFAULT 'BASIC'`);
    }

}
