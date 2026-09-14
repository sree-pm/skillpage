# SkillPage Monorepo

**Free marketplace platform where sellers publish a public SkillPage, buyers post jobs, and work is delivered through milestone-based projects.**

Full product specification lives in [`docs/`](./docs):

- [`FOUNDING_DOCUMENT.md`](./docs/FOUNDING_DOCUMENT.md) — vision, business model, GTM
- [`SKILLPAGE_DESIGN_SYSTEM.md`](./docs/SKILLPAGE_DESIGN_SYSTEM.md) — tokens, components, accessibility
- [`SKILLPAGE_SITEMAP_AND_WIREFRAMES.md`](./docs/SKILLPAGE_SITEMAP_AND_WIREFRAMES.md) — sitemap, 18 wireframes
- [`SKILLPAGE_AGENT_CODING_BRIEF.md`](./docs/SKILLPAGE_AGENT_CODING_BRIEF.md) — API contracts, DB schema, security model

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI — **Cloudflare Pages** |
| API | **Hono** on **Cloudflare Workers** |
| Database | **Cloudflare D1** (SQLite) |
| File storage | **Cloudflare R2** |
| Async jobs | **Cloudflare Queues** |
| Email | **Cloudflare Email Routing / Workers Mail** (stubbed) |
| Bot protection | **Cloudflare Turnstile** (stubbed) |

## Structure

```text
skillpage/
├── apps/
│   ├── web/          Next.js frontend (Cloudflare Pages)
│   └── api/          Hono API worker (Cloudflare Workers + D1 + R2 + Queues)
├── packages/
│   └── design-tokens/  Shared design tokens (CSS + TS)
├── docs/             Product specification
├── DEPLOYMENT.md     Deployment runbook
└── .github/workflows/  CI/CD (manual-only trigger)
```

## Quick Start

### Prerequisites

- Node.js >= 18.17
- Wrangler CLI (`npm i -g wrangler`)
- Cloudflare account

### Install

```bash
npm install
```

### API (Local Development)

```bash
cd apps/api
cp .dev.vars.example .dev.vars
# Edit .dev.vars with JWT_SECRET, STRIPE_SECRET_KEY, TURNSTILE_SECRET
wrangler d1 create skillpage-db  # Copy database_id to wrangler.toml
npm run db:migrate:local
npm run dev  # Runs on http://localhost:8787
```

### Frontend (Local Development)

```bash
cd apps/web
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8787
npm run dev  # Runs on http://localhost:3000
```

### Test the MVP

1. **Signup:** Go to `http://localhost:3000/signup`
2. **Login:** Go to `http://localhost:3000/login`
3. **Browse jobs:** Go to `http://localhost:3000/jobs`
4. **Seller dashboard:** Go to `http://localhost:3000/seller/home`
5. **Buyer dashboard:** Go to `http://localhost:3000/buyer/home`

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full deployment runbook.

### Quick Deploy

```bash
# API
cd apps/api
wrangler deploy

# Frontend
cd apps/web
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name=skillpage
```

## What's Implemented

### ✅ Backend API (100%)

- **Auth:** Signup, login, JWT issuance
- **Profiles:** CRUD, public skill pages
- **Jobs:** CRUD, status management
- **Proposals:** Submit, view, update status
- **Projects:** Create, view, update status
- **Milestones:** Create, fund (stub), deliver, approve, revise
- **Disputes:** Open, view, admin update
- **Messages:** Project chat
- **Notifications:** In-app notifications
- **Uploads:** R2 signed URLs
- **Admin:** User ban/reinstate, dispute queue, audit log
- **Database:** Full D1 schema with migrations
- **Email:** 8 templates (stubbed queue consumer)
- **Audit:** Immutable action logging

### ✅ Frontend (95%)

- **Public:** Landing page, jobs directory, job detail
- **Auth:** Signup, login
- **Seller workspace:** Dashboard, profile editor, discover, proposals, projects
- **Buyer workspace:** Dashboard, jobs list, job creation, projects
- **Shared:** Project workspace (milestones, messages)
- **Design system:** Tokens, Tailwind config, Radix UI components
- **Mobile:** Responsive layouts (390px+)

### ⚠️ Stubbed (Requires Human Review)

- **Stripe Connect:** Payment capture, refunds, payouts (Section 6 of coding brief)
- **Dispute finance approval:** Two-person sign-off workflow (Section 7)
- **WebAuthn passkeys:** Authentication (Section 5.1)
- **Fraud detection:** Risk scoring, linked-account graph (Section 10.3)
- **Email sending:** Queue consumer implementation (Section 8)
- **Legal pages:** `/legal/terms`, `/legal/privacy`, `/legal/disputes` (use legal template service)

## CI/CD

GitHub Actions workflow is **manual-only** to avoid consuming Actions minutes automatically.

To deploy:
1. Go to GitHub repo > Actions > "Deploy (Manual)"
2. Click "Run workflow"
3. Check "Deploy to production"
4. Click "Run workflow"

## Next Steps (Post-MVP)

1. **Stripe Connect integration** — onboard sellers/buyers, implement funded milestone flow
2. **Email queue consumer** — use Cloudflare Queues + Workers Mail or third-party (SendGrid, Postmark)
3. **Dispute resolution UI** — admin console with evidence timeline, finance approval
4. **WebAuthn passkeys** — Cloudflare Turnstile + WebAuthn API
5. **Fraud detection** — risk scoring, rate limiting, anomaly detection
6. **Legal pages** — generate with legal template service
7. **Analytics** — PostHog or Plausible for product analytics
8. **Monitoring** — Sentry for error tracking, Cloudflare Analytics for performance

## License

Private — All rights reserved.
