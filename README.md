# SkillPage Monorepo

Free marketplace platform where sellers publish a public SkillPage, buyers post jobs, and work is delivered through milestone-based projects.

Full product specification lives in [`docs/`](./docs):

- [`FOUNDING_DOCUMENT.md`](./docs/FOUNDING_DOCUMENT.md) — vision, business model, GTM
- [`SKILLPAGE_DESIGN_SYSTEM.md`](./docs/SKILLPAGE_DESIGN_SYSTEM.md) — tokens, components, accessibility
- [`SKILLPAGE_SITEMAP_AND_WIREFRAMES.md`](./docs/SKILLPAGE_SITEMAP_AND_WIREFRAMES.md) — sitemap, 18 wireframes
- [`SKILLPAGE_AGENT_CODING_BRIEF.md`](./docs/SKILLPAGE_AGENT_CODING_BRIEF.md) — API contracts, DB schema, security model

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI — deployed on **Cloudflare Pages** |
| API | **Hono** on **Cloudflare Workers** |
| Database | **Cloudflare D1** (SQLite) |
| File storage | **Cloudflare R2** |
| Async jobs | **Cloudflare Queues** |
| Email | **Cloudflare Email Routing / Workers Mail** |
| Bot protection | **Cloudflare Turnstile** |

## Structure

```text
skillpage/
├── apps/
│   ├── web/          Next.js frontend (Cloudflare Pages)
│   └── api/          Hono API worker (Cloudflare Workers + D1 + R2 + Queues)
├── packages/
│   └── design-tokens/  Shared design tokens (CSS + TS)
├── docs/             Product specification (founding doc, design system, sitemap, coding brief)
└── .github/workflows/  CI/CD
```

## Getting started

### Prerequisites

- Node.js >= 18.17
- A Cloudflare account with Wrangler CLI (`npm i -g wrangler`)

### Install

```bash
npm install
```

### API (apps/api)

```bash
cd apps/api
cp .dev.vars.example .dev.vars   # fill in JWT_SECRET, STRIPE_SECRET_KEY, TURNSTILE_SECRET
wrangler d1 create skillpage-db  # then paste the returned database_id into wrangler.toml
npm run db:migrate:local
npm run dev
```

### Web (apps/web)

```bash
cd apps/web
cp .env.local.example .env.local  # set NEXT_PUBLIC_API_URL to the local worker URL
npm run dev
```

## Deployment

- **API:** `wrangler deploy` from `apps/api` (or via the CI workflow on push to `main`)
- **Web:** Connect the repo to Cloudflare Pages (build command `npm run build --workspace=apps/web`, output `apps/web/.next` via `@cloudflare/next-on-pages`) or use `npm run pages:build` + `wrangler pages deploy`

## What is stubbed vs. production-ready

Per [`SKILLPAGE_AGENT_CODING_BRIEF.md`](./docs/SKILLPAGE_AGENT_CODING_BRIEF.md) Section 13, the following are intentionally left as **stubs with TODOs** pending human/legal/security review:

- Stripe Connect payment capture, refunds, payouts (Section 6)
- Dispute finance approval workflow (Section 7)
- WebAuthn passkeys (Section 5.1)
- Fraud-detection thresholds (Section 10.3)
- Legal page copy (`/legal/*`)

Everything else (CRUD APIs, auth, profiles, jobs, proposals, milestones state machine, email templates, D1 schema, UI components) is functional scaffolding ready to extend.
