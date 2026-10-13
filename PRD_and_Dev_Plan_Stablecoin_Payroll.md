# Product Requirements & Development Plan
## Working name: PayCrew (placeholder)
### Stablecoin payroll, contractor payments and onboarding for African teams

Version 0.1 | Solo developer | MVP target: 12 weeks

---

## 1. Product summary

PayCrew lets a company (employer) pay its remote team in USDC or USDT and lets each worker cash out to a Nigerian bank account in naira. The product is built around one flow: add a person, set a pay amount, pay. Everything else is secondary.

The MVP covers three jobs:
1. **Onboard** a worker: collect details, verify identity, sign a contract.
2. **Pay** a worker: fund the account, run a payout, show the worker receipts.
3. **Track** payments: history, exports, and status alerts.

Advanced features (bulk payroll, API, accounting exports, multi-country contracts) come after the MVP is paying customers.

---

## 2. Goals and non-goals

**Goals**
- A new employer can add a worker and make the first payment in under 10 minutes.
- A worker can cash out to a Nigerian bank in under 5 minutes, with fees shown before confirmation.
- Build on third-party licensed providers for money movement and identity checks. Do not build a licensed exchange or custody layer.
- Keep the interface to one main dashboard and two mobile-first worker screens.

**Non-goals (for MVP)**
- Employer of record (EOR) service and full employment contracts across countries.
- Own custody of customer funds beyond what the payment partner holds.
- Native mobile apps (web app, mobile-responsive only).
- Lending, cards, or savings products.

---

## 3. Users

| User | Who | Main job |
|---|---|---|
| Employer (admin) | Founder, ops or finance lead at a company paying remote staff | Add workers, fund account, pay, download records |
| Worker | Freelancer or contractor in Nigeria or another African country | Verify identity, sign contract, see pay, withdraw to bank or wallet |
| Platform admin (internal) | You | Review KYC failures, handle disputes, monitor payouts |

---

## 4. MVP feature requirements

### 4.1 Employer dashboard
- **F1. Sign up and company setup.** Email, password, 2FA by SMS or authenticator app. Company name, registration number, country, billing contact.
- **F2. Fund account.** Show a deposit method (bank transfer to a virtual account or stablecoin transfer to a wallet address). Show balance in USD and in naira equivalent.
- **F3. Add worker.** Fields: full name, email, country, role, pay amount, pay currency (USD or NGN), pay frequency (one-off or monthly). Sends an onboarding invite.
- **F4. Pay worker.** Choose worker, amount, note. Show fees and total before confirming. Optional: schedule for a future date.
- **F5. Payment history.** Table with date, worker, amount, status (pending, paid, failed), transaction reference. Filter by worker and date. CSV export.
- **F6. Contracts.** Use a standard template per country (MVP: Nigeria contractor agreement only). Send for e-signature. Store signed PDF.
- **F7. Notifications.** Email on payment sent, payment failed, worker verified, contract signed.

### 4.2 Worker onboarding and wallet
- **W1. Invite and sign up.** Email link, set password, accept contract.
- **W2. Identity verification (KYC).** Collect BVN or NIN, selfie liveness check, bank account name check. Use a KYC provider (see section 6).
- **W3. Payout method.** Add a Nigerian bank account (verified by account name lookup) or a stablecoin wallet address (USDC on a supported network, with a warning if the network is wrong).
- **W4. Balance and history.** Show amounts received, status, and downloadable receipts.
- **W5. Withdraw.** Choose amount, see exact naira amount, fee and stamp duty before confirming. Confirm with a PIN or OTP.

### 4.3 Admin (internal)
- **A1. KYC queue.** List failed or manual-review checks with reason codes.
- **A2. Transaction monitor.** List pending and failed payouts with provider status, retry button.
- **A3. Audit log viewer.** Every admin and money action with user, time and IP.

---

## 5. Advanced features (phase 2, after first paying customers)

- **Bulk payroll upload** (CSV with name, amount, currency, bank or wallet).
- **Recurring payroll** (monthly schedule with reminder before run).
- **Multi-currency pay** (USD, EUR, GBP, NGN, KES, GHS payouts where partner supports them).
- **Accounting export** (CSV and Xero or QuickBooks format).
- **Public API and webhooks** so employers can trigger payments from their own systems.
- **Tax summary per worker** at year end (amounts paid, currencies, reference numbers).
- **Team roles** (owner, approver, viewer).
- **Approval flow** (payments above a set amount need a second approver).
- **WhatsApp or SMS alerts** for payment status.
- **Additional contract templates** for other countries.

---

## 6. Third-party providers (build on these, do not replace them)

| Need | Provider options | Notes |
|---|---|---|
| Stablecoin on/off-ramp, naira payouts, KYC/AML on the exchange side | Quidax Business API | Confirm reseller terms, sandbox access, current API fees, and who holds customer funds during payout. Quidax reports a provisional SEC Digital Assets Exchange licence. |
| Backup on/off-ramp | Yellow Card API | Use as failover if Quidax is down or a corridor is unsupported. Confirm terms. |
| BVN, NIN and account name checks | Dojah, Youverify, Smile ID, Monnify | Pricing example from Monnify: BVN ₦10 per check, NIN ₦60 per check, account name enquiry free. Dojah starts every account in sandbox. Pick one for MVP and keep an adapter so you can switch. |
| Liveness and selfie match | Smile ID or Dojah biometric | Use only if the chosen KYC provider includes it, to avoid two contracts. |
| Email | Postmark, SendGrid, or Resend | Transactional email only. |
| SMS and OTP | Termii, Twilio, or the KYC provider's OTP | Choose based on delivery rates in Nigeria. |
| E-signature | DocuSign or a simple PDF signing service | MVP can use typed-name acceptance with timestamp and IP logged. |
| Hosting and database | Vercel or Render for app, Supabase or managed Postgres | Keep costs low until revenue. |

**Decision rule:** Every money movement and identity check goes through a provider adapter in the codebase, not directly from the UI. This keeps the product working if a provider changes price or terms.

---

## 7. Fees and pricing (proposed for MVP)

| Item | Proposed price | Notes |
|---|---|---|
| Employer subscription | ₦15,000 or $10 per month per company | Includes up to 10 workers. |
| Per worker added | ₦1,500 or $1 per active worker per month | Active = paid at least once that month. |
| Payout fee | 1.0% of amount (min ₦500) | Shown before confirmation. Test against partner fees and your margin. |
| Naira withdrawal | Pass-through of partner fee plus flat ₦100 | Show stamp duty separately as the law requires. |
| KYC check | Passed through at cost | Worker pays nothing for the first verification, employer pays from balance. |

Prices are proposals for testing. Adjust after the first 10 paying employers.

---

## 8. Technical architecture

**Stack (recommended for a solo developer)**
- Frontend: Next.js (TypeScript), Tailwind, one component library. Mobile-responsive.
- Backend: Next.js API routes or a separate Node.js (TypeScript) service with Express or Fastify.
- Database: PostgreSQL with row-level security per company.
- Background jobs: a queue (BullMQ with Redis, or a managed queue) for payouts, retries, KYC checks and emails.
- Auth: a managed auth service (Clerk, Auth0, or Supabase Auth) with 2FA.
- Hosting: Vercel (frontend) plus Render or Railway (backend, worker, Postgres).
- Observability: Sentry for errors, a logs dashboard, uptime monitoring.

**Core services**
1. **Identity service:** user accounts, companies, roles, 2FA.
2. **Ledger service:** every balance change recorded as an entry (credit or debit) with a reference. Balances are computed from entries, never stored as an editable number.
3. **Payment orchestrator:** creates payouts, calls provider adapters, handles status webhooks, retries with idempotency keys.
4. **KYC service:** submits checks, stores result codes, never stores raw BVN or NIN in plain text (encrypt at rest, store only needed fields).
5. **Contracts service:** generates PDF from template, sends for signature, stores signed copy.
6. **Notification service:** email and SMS, templated.

**Data model (core tables)**
- `companies` (id, name, registration_no, country, plan)
- `users` (id, email, role, company_id, 2fa_enabled)
- `workers` (id, company_id, user_id, name, country, pay_amount, pay_currency, status)
- `kyc_checks` (id, worker_id, provider, check_type, result, reason_code, created_at)
- `payout_methods` (id, worker_id, type [bank|wallet], account_ref, network, verified)
- `ledger_entries` (id, company_id, worker_id, amount, currency, type, reference, created_at)
- `payments` (id, company_id, worker_id, amount, currency, status, provider_ref, idempotency_key, created_at)
- `contracts` (id, worker_id, template_version, status, signed_pdf_url, signed_at, signed_ip)
- `audit_logs` (id, actor_id, action, entity, entity_id, ip, created_at)

**Key technical rules**
- Every payment request has an idempotency key so a retry never pays twice.
- Webhooks from providers are verified by signature before any state change.
- Payment states: created, submitted, pending, paid, failed, reversed. Only the orchestrator changes state.
- All secrets in environment variables or a secrets manager. None in code.
- Backups daily, tested restore monthly.

---

## 9. User flows (keep these simple)

**Employer, first payment**
1. Sign up, verify email, set up company (2 minutes).
2. Fund account by bank transfer (show virtual account number, copy button).
3. Add worker (name, email, pay amount).
4. Worker accepts invite and signs contract.
5. Click Pay on worker row, review fee summary, confirm.
6. See status change to Paid.

**Worker, first withdrawal**
1. Open invite link, set password.
2. Verify identity (BVN or NIN, selfie).
3. Add Nigerian bank account (name check auto-fills the name).
4. See balance, tap Withdraw, enter amount.
5. Review naira amount, fee and stamp duty, confirm with OTP.
6. Receive receipt by email and in the app.

**Design rules**
- One primary action per screen.
- Show money in the currency the user chose, with the naira equivalent beside it.
- Never show blockchain jargon. Use "USD balance", "send to bank", "wallet address" only where needed.
- Every fee shown before confirmation.
- Plain-language error messages with one next step.

---

## 10. Security and risk requirements

- Two-factor authentication required for employer admins and for any withdrawal.
- Role-based access control: only owners can fund or pay.
- Encryption in transit (TLS) and at rest for personal data and bank details.
- BVN and NIN stored encrypted, shown masked (last 4 digits) in the UI.
- Rate limiting on login, OTP and withdrawal endpoints.
- Withdrawal limits for new accounts (for example, daily limit until first successful KYC).
- Fraud rules: flag new bank accounts, large first payments and mismatched account names for manual review.
- Audit log for every money-related action.
- Privacy policy and terms of service reviewed by a Nigerian lawyer before launch.
- Data protection: publish a privacy notice, record consent at signup, and allow data access and deletion requests.

---

## 11. Compliance requirements (build inputs)

These are requirements the product must support. Confirm each with a Nigerian fintech lawyer before launch.

1. Confirm whether PayCrew's activity needs its own SEC or CBN registration, or whether the reseller arrangement with Quidax covers it.
2. Confirm who holds customer funds between funding and payout, and document it in the terms.
3. Confirm withholding tax and reporting obligations for payments to workers under the Nigeria Tax Act 2025.
4. Build stamp duty into the withdrawal screen, as required on naira withdrawals.
5. Register with the Nigeria Data Protection Commission as a data controller if required by volume.
6. Keep KYC records for the period the law requires.

---

## 12. Metrics

**North star:** monthly payment volume (USD equivalent) processed.

**Activation:** % of new employers who make a first payment within 7 days of signup. Target: 40%.

**Retention:** % of employers paying again in month 2. Target: 60%.

**Worker conversion:** % of invited workers who complete KYC and sign a contract within 3 days. Target: 70%.

**Failure rate:** % of payouts failing. Target: under 2%.

**Support load:** tickets per 10 payments. Target: under 1.

---

## 13. Development plan (12 weeks, solo)

| Week | Focus | Deliverables |
|---|---|---|
| 1 | Setup and decisions | Repo, hosting, auth, database schema. Sign up for Quidax and KYC sandboxes. Confirm reseller terms in writing. |
| 2 | Identity and company | Employer sign up, 2FA, company setup, roles. |
| 3 | Ledger and funding | Ledger service, virtual account funding (sandbox), balance view. |
| 4 | Workers and invites | Add worker, invite email, worker sign up, password setup. |
| 5 | KYC integration | BVN and NIN checks via chosen provider, result storage, KYC status in UI. |
| 6 | Payout methods | Bank account name check, wallet address validation, store verified methods. |
| 7 | Contracts | Contract template, PDF generation, signing flow, stored copy. |
| 8 | Payments | Payment orchestrator, Quidax payout adapter (sandbox), idempotency, webhook handling. |
| 9 | Worker withdrawal | Withdraw screen, fee and stamp duty display, OTP confirmation, receipts. |
| 10 | Admin and monitoring | KYC queue, payout monitor, audit log, alerts, Sentry. |
| 11 | Testing and security | End-to-end tests for money flows, penetration check basics, rate limiting, backup test. Lawyer review of terms. |
| 12 | Pilot launch | Onboard 3 to 5 pilot employers with real payments below a set cap. Fix issues daily. |

**Milestones**
- End of week 4: a worker can sign up and be invited by an employer.
- End of week 9: a complete payment and withdrawal works in sandbox.
- End of week 12: first live payment with a pilot employer.

**Testing before live money**
- Unit tests for ledger math and fee calculation.
- Integration tests against provider sandboxes.
- Replay tests for webhooks (duplicate and out-of-order events).
- Manual test checklist for every money flow, run before each release.

---

## 14. Team and cost (solo, MVP)

**Your time:** full-time for 12 weeks, or about 30 to 35 hours per week alongside other work.

**Monthly running costs (estimate)**
- Hosting and database: $30 to $80
- Email and SMS: $20 to $60, depending on volume
- KYC checks: pass-through, about ₦10 to ₦60 per check at listed rates
- Error and uptime monitoring: $0 to $30
- Domain, legal templates, lawyer review: one-off, budget for a lawyer consultation

---

## 15. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Provider changes terms or pricing | High | Adapter layer, second provider as backup, written terms before launch. |
| Regulator issues new rules | High | Track SEC and CBN updates, keep a lawyer on retainer, design for quick changes. |
| Payment sent twice or lost | High | Idempotency keys, ledger reconciliation daily, webhook replay tests. |
| Fraud on new accounts | Medium | Limits for new accounts, manual review rules, KYC required before withdrawal. |
| Worker drop-off during KYC | Medium | Clear instructions, retry flow, support link, short forms. |
| Competitor with more funding | Medium | Compete on simplicity, naira payout speed, clear fees, and fast support in pilot niche. |
| Solo capacity | High | Limit scope to MVP, use managed services, avoid custom infrastructure. |

---

## 16. Open questions to resolve before week 4

1. Does Quidax's reseller agreement allow PayCrew to brand the payout flow as its own?
2. Who is the legal party holding funds during payout?
3. Which KYC provider gives the best BVN and NIN success rate in sandbox testing?
4. What is the all-in cost per naira payout after partner fees and stamp duty?
5. Which first niche of employers do you have direct access to for the pilot?

---

## 17. Definition of done for MVP

- A pilot employer can fund, add a worker, pay, and see receipts.
- A worker can verify identity, sign a contract, and withdraw to a Nigerian bank.
- Every payment is recorded in the ledger and matches the provider's status.
- Admin can see failed KYC and failed payouts, and retry them.
- Terms, privacy notice and fee display are reviewed and live.
- No critical bugs open in the money flows.
