# PayCrew — Railway Production Deployment Guide

This guide details how to deploy the **PayCrew** monorepo to [Railway](https://railway.com) using private internal networking between Next.js (`@paycrew/web`) and NestJS (`@paycrew/api`), backed by managed PostgreSQL and Redis.

---

## Architecture Overview

```
                        [ End Users / Web Browsers ]
                                     │
                                     ▼ (HTTPS)
                      ┌──────────────────────────────┐
                      │    Service: paycrew-web      │
                      │       (Next.js 15)           │
                      │  Port: 3000 (Public Domain)  │
                      └──────────────┬───────────────┘
                                     │
                 Railway Private Mesh Network (Zero Latency)
                   INTERNAL_API_URL: http://paycrew-api.railway.internal:4000/api/v1
                                     │
                                     ▼ (Internal Wireguard)
                      ┌──────────────────────────────┐
                      │    Service: paycrew-api      │
                      │       (NestJS API)           │
                      │  Port: 4000 (Private Domain) │
                      └───────┬──────────────┬───────┘
                              │              │
                   PostgreSQL Database    Redis Cache
                      (Port: 5432)       (Port: 6379)
```

---

## 1. Create Railway Project & Databases

1. Log in to [Railway](https://railway.com) and create a **New Project**.
2. Click **Create** → **Database** → **Add PostgreSQL**.
3. Click **Create** → **Database** → **Add Redis**.

---

## 2. Deploy Service 1: `paycrew-api` (Backend)

1. In your Railway project, click **New** → **GitHub Repo** and select the repository.
2. In **Settings** for this service:
   * **Service Name**: `paycrew-api`
   * **Root Directory**: `/`
   * **Build Command**: `pnpm build:api`
   * **Start Command**: `pnpm start:api`
3. Under **Networking**:
   * Click **Generate Domain** if you need public Swagger API docs (`/api/docs`), or enable **Private Networking** (`paycrew-api.railway.internal`).
4. Under **Variables**, add the following:

| Variable | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `4000` | Listening port |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-referenced from Railway Postgres |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Auto-referenced from Railway Redis |
| `FRONTEND_URL` | `https://your-web-domain.up.railway.app` | Public URL of paycrew-web |
| `CORS_ORIGIN` | `https://your-web-domain.up.railway.app` | Allowed CORS origin |
| `JWT_SECRET` | *(64-character random string)* | Access token signing secret |
| `JWT_REFRESH_SECRET`| *(64-character random string)* | Refresh token signing secret |
| `KYC_ENCRYPTION_KEY`| *(32-character hex key)* | AES-256 key for PII (BVN/NIN) encryption |
| `QUIDAX_RAMP_BASE_URL` | `https://ramp-be.quidax.io` | Quidax Ramp API URL |
| `QUIDAX_RAMP_PRIVATE_KEY` | `sk_live_...` | Quidax Ramp Private API Key |
| `QUIDAX_RAMP_PUBLIC_KEY` | `pub_live_...` | Quidax Ramp Public API Key |
| `QUIDAX_BASE_URL` | `https://app.quidax.com/api/v1` | Quidax Exchange API |
| `QUIDAX_SECRET_KEY` | `sec_live_...` | Quidax Exchange Secret Key |
| `PREMBLY_BASE_URL` | `https://api.prembly.com` | Prembly Identity Verification |
| `PREMBLY_API_KEY` | `live_...` | Prembly API Key |
| `PREMBLY_APP_ID` | `app_...` | Prembly App ID |
| `KORAPAY_BASE_URL` | `https://api.korapay.com/merchant/api` | Korapay Virtual NUBANs |
| `KORAPAY_SECRET_KEY` | `sk_live_...` | Korapay Secret Key |

---

## 3. Deploy Service 2: `paycrew-web` (Frontend)

1. In the same project, click **New** → **GitHub Repo** and select the same repository.
2. In **Settings** for this service:
   * **Service Name**: `paycrew-web`
   * **Root Directory**: `/`
   * **Build Command**: `pnpm build:web`
   * **Start Command**: `pnpm start:web`
3. Under **Networking**:
   * Click **Generate Public Domain** (e.g. `paycrew-production.up.railway.app`).
4. Under **Variables**, add the following:

| Variable | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `3000` | Web server port |
| `INTERNAL_API_URL` | `http://${{paycrew-api.RAILWAY_PRIVATE_DOMAIN}}:4000/api/v1` | Fast private mesh backend connection |
| `NEXT_PUBLIC_API_URL` | `/api/proxy` | Same-origin proxy endpoint |

> **Note on Private Networking**: Because `INTERNAL_API_URL` uses Railway's private DNS (`${{paycrew-api.RAILWAY_PRIVATE_DOMAIN}}` or `paycrew-api.railway.internal`), browser calls to `/api/proxy/*` are proxied directly to NestJS without traversing the public internet, ensuring low latency and high security.

---

## 4. Run Migrations & Verify

1. Run migrations against your production database:
   ```bash
   railway run --service paycrew-api pnpm migration:run
   ```
2. Navigate to your `paycrew-web` domain to test:
   * Company registration & onboarding
   * Contractor invitation & onboarding KYC
   * Payroll batch run and currency conversion
