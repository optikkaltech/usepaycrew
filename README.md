# PayCrew — Enterprise Stablecoin Payroll & Contractor Operations

PayCrew enables employers to pay remote contractors in USDC/USDT and allows contractors in Nigeria to cash out directly to their commercial bank accounts in naira with transparent, statutory fee breakdowns.

---

## 1. Architecture Overview

Built as a modular pnpm monorepo following enterprise engineering practices:

```
paycrew/
├── apps/
│   ├── api/          # NestJS backend (PostgreSQL, TypeORM, Redis, BullMQ)
│   └── web/          # Next.js 15 App Router (React 19, Tailwind CSS, TanStack Query)
├── packages/
│   └── shared-types/ # Shared domain enums, types, and fee calculation contracts
├── PRD_and_Dev_Plan_Stablecoin_Payroll.md # Authoritative PRD specification
└── package.json
```

---

## 2. Core Modules & Capabilities

- **Double-Entry Ledger (`/api/v1/ledger`):** Every balance change is recorded as an immutable credit or debit entry with a reference. Balances are derived from journal entries and never directly manipulated.
- **Identity & RBAC (`/api/v1/auth`):** Argon2id password hashing, rotating JWT access and refresh tokens, TOTP 2FA, and role-based access guards (`COMPANY_OWNER`, `WORKER`, `PLATFORM_ADMIN`).
- **Contractor Onboarding & E-Signature (`/api/v1/workers`, `/api/v1/contracts`):** Cryptographic invitation links, automated Nigeria contractor agreement generation, typed-name e-signature with IP, user-agent, and SHA-256 audit hashing.
- **KYC & Regulatory Compliance (`/api/v1/kyc`):** 11-digit BVN and NIN verification, AES-256-GCM encryption at rest, masked display (`*******1234`), and sandbox adapter.
- **Payout Methods (`/api/v1/payout-methods`):** NUBAN account name resolution adapter and ERC-20 / Solana wallet address format validation.
- **Payroll Disbursement (`/api/v1/payments`):** Atomic payroll transfer, idempotency key enforcement, 1.0% processing fee (min ₦500 or $0.50), CSV export, and signed webhook handler.
- **Worker Cash Out (`/api/v1/withdrawals`):** Real-time naira withdrawal fee calculator including partner fee, flat ₦100 service fee, and statutory ₦50 stamp duty (for amounts ≥ ₦10,000), confirmed via PIN/OTP with digital receipts.
- **Platform Admin (`/api/v1/admin`):** KYC review queue, payout retry controls, and immutable audit logs.

---

## 3. Quick Start & Setup

### Prerequisites
- Node.js >= 20 (Node 24 recommended)
- pnpm >= 11
- PostgreSQL (running on port 5432)
- Redis (running on port 6379)

### Installation & Migrations
```bash
# Install dependencies
pnpm install

# Build shared types
pnpm --filter @paycrew/shared-types build

# Run database migrations against PostgreSQL (paycrew_dev)
pnpm --filter @paycrew/api migration:run
```

### Running Development Servers
```bash
# Start API (http://localhost:4000/api/v1 & Swagger at http://localhost:4000/api/docs)
pnpm dev:api

# Start Web App (http://localhost:3000)
pnpm dev:web

# Or run both concurrently
pnpm dev
```

---

## 4. Testing & Verification

```bash
# Run unit test suite for double-entry math, fee calculations, and stamp duty
pnpm --filter @paycrew/api test

# Typecheck backend and frontend
pnpm --filter @paycrew/api typecheck
pnpm --filter @paycrew/web typecheck

# Production build
pnpm build
```
