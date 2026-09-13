# SkillPage — Agentic Coding Brief & Gap-Fill Specification

**Version:** 1.0  
**Date:** September 13, 2026  
**Status:** Agent-executable build specification  
**Stack:** Cloudflare Workers (Hono), Durable Objects, D1 (SQLite), R2 (files), Queues, Email Routing + Workers Mail, Pages (frontend), Turnstile (CAPTCHA), Zero Trust (admin access)  
**Companion docs:** `FOUNDING_DOCUMENT.md`, `SKILLPAGE_DESIGN_SYSTEM.md`, `SKILLPAGE_SITEMAP_AND_WIREFRAMES.md`

---

## 1. Purpose

This document closes every gap that would block an agentic coding tool from generating a complete, deployable SkillPage MVP. It provides:

- **Backend API contracts** (routes, request/response schemas, Durable Object models)
- **Database schema** (D1 SQL with migrations)
- **Security model** (RBAC, sessions, passkeys, audit logging)
- **Payment abstraction** (Stripe Connect placeholders with legal warnings)
- **Dispute workflow state machine** (admin-console ready)
- **Email system** (Cloudflare Workers Mail + templates)
- **File upload** (R2 signed URLs, virus-scan hook placeholder)
- **Notification system** (in-app + email triggers)
- **Rate limiting & fraud hooks** (Turnstile, IP throttling, anomaly flags)
- **Test strategy** (unit, integration, E2E scaffolds)
- **Performance budget** (Cloudflare caching, edge KV, bundle targets)
- **Agent guardrails** (what to auto-generate vs. what to stub for human review)

**Goal:** An AI coding agent can generate 90%+ of the codebase from this brief + the design system + sitemap/wireframes. Human review is required only for payment/legal logic, security-critical paths, and AI-agent consent flows.

---

## 2. Architecture Overview

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Frontend (Cloudflare Pages)                                                  │
│ - Next.js 14 (App Router), TypeScript, Tailwind, Radix UI                   │
│ - Design tokens from SKILLPAGE_DESIGN_SYSTEM.md Section 2                    │
│ - Wireframe-to-component mapping from SKILLPAGE_SITEMAP_AND_WIREFRAMES.md    │
└──────────────────────────────────────────────────────────────────────────────┘
                                   ↕ HTTPS
┌──────────────────────────────────────────────────────────────────────────────┐
│ API Layer (Cloudflare Workers + Hono)                                        │
│ - RESTful routes (see Section 4)                                             │
│ - Auth middleware (JWT + Durable Object session store)                       │
│ - Rate limiting (Cloudflare Rate Limiting API + Turnstile)                   │
└──────────────────────────────────────────────────────────────────────────────┘
                                   ↕
┌──────────────────────────────────────────────────────────────────────────────┐
│ State & Storage                                                              │
│ - Durable Objects: user sessions, real-time project collaboration            │
│ - D1 (SQLite): relational data (users, jobs, proposals, projects, milestones)│
│ - R2: file uploads (portfolio evidence, deliverables)                        │
│ - Queues: async jobs (email sending, notifications, virus scan hooks)        │
│ - Email Routing + Workers Mail: transactional email                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (D1)

All tables use `INTEGER PRIMARY KEY AUTOINCREMENT` for D1 compatibility. Timestamps are ISO-8601 strings.

### 3.1 Core Tables

```sql
-- Users (auth + profile)
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- UUID
  email TEXT UNIQUE NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  password_hash TEXT, -- nullable for OAuth-only users
  passkey_credentials TEXT, -- JSON array of WebAuthn credentials
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'admin', 'superadmin'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT,
  is_banned INTEGER NOT NULL DEFAULT 0,
  ban_reason TEXT,
  ban_expires_at TEXT
);

-- Profiles (public skill/brand pages)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL, -- myname.skillpage.io
  display_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  location TEXT,
  timezone TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available', -- 'available', 'busy', 'unavailable'
  website_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  verification_type TEXT, -- 'identity', 'organisation'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 0
);

-- Skills (tag system)
CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Profile skills (many-to-many)
CREATE TABLE profile_skills (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

-- Services (packaged offers)
CREATE TABLE services (
  id TEXT PRIMARY KEY, -- UUID
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_minor_units INTEGER NOT NULL, -- e.g., 50000 = £500.00
  currency TEXT NOT NULL DEFAULT 'GBP',
  delivery_days INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Portfolio evidence
CREATE TABLE portfolio_items (
  id TEXT PRIMARY KEY, -- UUID
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image', 'video', 'link', 'file'
  media_url TEXT NOT NULL,
  source_url TEXT, -- GitHub repo, live site
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Jobs (buyer postings)
CREATE TABLE jobs (
  id TEXT PRIMARY KEY, -- UUID
  buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL, -- 'project', 'part_time', 'full_time', 'consultation'
  budget_minor_units INTEGER, -- nullable for hourly
  budget_currency TEXT DEFAULT 'GBP',
  hourly_rate_minor_units INTEGER, -- nullable for fixed
  duration_days INTEGER,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'paused', 'filled', 'closed', 'removed'
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT,
  removed_reason TEXT,
  removed_by TEXT REFERENCES users(id)
);

-- Job skills (many-to-many)
CREATE TABLE job_skills (
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Proposals (seller applications)
CREATE TABLE proposals (
  id TEXT PRIMARY KEY, -- UUID
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_price_minor_units INTEGER,
  proposed_duration_days INTEGER,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'interviewing', 'accepted', 'rejected', 'withdrawn'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Projects (hired engagements)
CREATE TABLE projects (
  id TEXT PRIMARY KEY, -- UUID
  job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
  buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'disputed'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  cancelled_reason TEXT,
  dispute_id TEXT REFERENCES disputes(id) ON DELETE SET NULL
);

-- Milestones (payment tranches)
CREATE TABLE milestones (
  id TEXT PRIMARY KEY, -- UUID
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'funded', 'delivered', 'approved', 'revised', 'disputed'
  due_date TEXT,
  delivered_at TEXT,
  approved_at TEXT,
  payment_intent_id TEXT, -- Stripe PaymentIntent ID
  payout_id TEXT, -- Stripe Transfer ID
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Deliverables (files/links per milestone)
CREATE TABLE deliverables (
  id TEXT PRIMARY KEY, -- UUID
  milestone_id TEXT NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL,
  media_url TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);

-- Messages (project conversations)
CREATE TABLE messages (
  id TEXT PRIMARY KEY, -- UUID
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Reviews (double-blind)
CREATE TABLE reviews (
  id TEXT PRIMARY KEY, -- UUID
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible INTEGER NOT NULL DEFAULT 0, -- visible after both submit or timeout
  created_at TEXT NOT NULL,
  UNIQUE(project_id, reviewer_id)
);

-- Disputes (admin-resolved)
CREATE TABLE disputes (
  id TEXT PRIMARY KEY, -- UUID
  milestone_id TEXT NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  opened_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  requested_outcome TEXT NOT NULL, -- 'revision', 'release', 'refund', 'split'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'mediation', 'adjudication', 'resolved', 'appealed'
  assigned_to TEXT REFERENCES users(id), -- admin user
  resolution TEXT, -- admin decision notes
  resolved_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Audit log (admin actions)
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL, -- 'ban_user', 'release_funds', 'refund_buyer', etc.
  target_type TEXT NOT NULL, -- 'user', 'job', 'project', 'milestone', 'dispute'
  target_id TEXT NOT NULL,
  before_state TEXT, -- JSON
  after_state TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);

-- Notifications (in-app + email triggers)
CREATE TABLE notifications (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'proposal_received', 'milestone_funded', 'dispute_opened', etc.
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  email_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Feature flags (admin-controlled)
CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 0,
  rollout_percentage INTEGER DEFAULT 100,
  description TEXT,
  updated_at TEXT NOT NULL
);
```

### 3.2 Indexes

```sql
CREATE INDEX idx_profiles_handle ON profiles(handle);
CREATE INDEX idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX idx_proposals_job_status ON proposals(job_id, status);
CREATE INDEX idx_projects_buyer_seller ON projects(buyer_id, seller_id);
CREATE INDEX idx_milestones_project_status ON milestones(project_id, status);
CREATE INDEX idx_messages_project_created ON messages(project_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

## 4. API Contracts (Hono on Workers)

All routes return JSON. Errors use `{ "error": { "code": "STRING", "message": "STRING" } }`.

### 4.1 Auth & Users

| Method | Route | Description | Agent action |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Email/password signup + email verification trigger | ✅ Auto-generate |
| `POST` | `/api/auth/login` | JWT issuance | ✅ Auto-generate |
| `POST` | `/api/auth/passkey/register` | WebAuthn registration stub | ⚠️ Stub for human review |
| `POST` | `/api/auth/passkey/login` | WebAuthn login stub | ⚠️ Stub for human review |
| `GET` | `/api/users/me` | Current user profile | ✅ Auto-generate |
| `PATCH` | `/api/users/me` | Update profile | ✅ Auto-generate |
| `POST` | `/api/users/me/verify-email` | Email verification token exchange | ✅ Auto-generate |

### 4.2 Profiles & Skills

| Method | Route | Description | Agent action |
|---|---|---|---|
| `GET` | `/api/profiles/:handle` | Public skill page data | ✅ Auto-generate |
| `POST` | `/api/profiles` | Create profile (on signup) | ✅ Auto-generate |
| `PATCH` | `/api/profiles/:id` | Update profile | ✅ Auto-generate |
| `POST` | `/api/profiles/:id/skills` | Add skills | ✅ Auto-generate |
| `DELETE` | `/api/profiles/:id/skills/:skillId` | Remove skill | ✅ Auto-generate |

### 4.3 Services & Portfolio

| Method | Route | Description | Agent action |
|---|---|---|---|
| `GET` | `/api/services?profileId=` | List services | ✅ Auto-generate |
| `POST` | `/api/services` | Create service | ✅ Auto-generate |
| `PATCH` | `/api/services/:id` | Update service | ✅ Auto-generate |
| `GET` | `/api/portfolio?profileId=` | List portfolio items | ✅ Auto-generate |
| `POST` | `/api/portfolio` | Create portfolio item (R2 signed URL flow) | ✅ Auto-generate |
| `DELETE` | `/api/portfolio/:id` | Delete item | ✅ Auto-generate |

### 4.4 Jobs & Proposals

| Method | Route | Description | Agent action |
|---|---|---|---|
| `GET` | `/api/jobs` | Job feed (filters: status, skills, budget) | ✅ Auto-generate |
| `POST` | `/api/jobs` | Create job | ✅ Auto-generate |
| `GET` | `/api/jobs/:id` | Job detail | ✅ Auto-generate |
| `PATCH` | `/api/jobs/:id` | Update job | ✅ Auto-generate |
| `POST` | `/api/jobs/:id/proposals` | Submit proposal | ✅ Auto-generate |
| `GET` | `/api/jobs/:id/proposals` | List proposals (buyer only) | ✅ Auto-generate |
| `PATCH` | `/api/proposals/:id` | Update status (accept/reject) | ✅ Auto-generate |

### 4.5 Projects & Milestones

| Method | Route | Description | Agent action |
|---|---|---|---|
| `POST` | `/api/projects` | Create project from accepted proposal | ✅ Auto-generate |
| `GET` | `/api/projects/:id` | Project detail | ✅ Auto-generate |
| `PATCH` | `/api/projects/:id` | Update project (scope change stub) | ⚠️ Stub change-request logic |
| `POST` | `/api/milestones` | Create milestone | ✅ Auto-generate |
| `POST` | `/api/milestones/:id/fund` | Fund milestone (Stripe PaymentIntent stub) | ⚠️ Stub payment logic |
| `POST` | `/api/milestones/:id/deliver` | Submit deliverable (R2 upload) | ✅ Auto-generate |
| `POST` | `/api/milestones/:id/approve` | Approve milestone (release funds stub) | ⚠️ Stub payout logic |
| `POST` | `/api/milestones/:id/revise` | Request revision | ✅ Auto-generate |

### 4.6 Disputes

| Method | Route | Description | Agent action |
|---|---|---|---|
| `POST` | `/api/disputes` | Open dispute (milestone → disputed state) | ✅ Auto-generate |
| `GET` | `/api/disputes/:id` | Dispute detail (parties + admin) | ✅ Auto-generate |
| `PATCH` | `/api/disputes/:id` | Admin update (assign, resolve) | ⚠️ Stub finance approval workflow |

### 4.7 Messages & Notifications

| Method | Route | Description | Agent action |
|---|---|---|---|
| `GET` | `/api/messages?projectId=` | Project messages | ✅ Auto-generate |
| `POST` | `/api/messages` | Send message | ✅ Auto-generate |
| `GET` | `/api/notifications` | In-app notifications | ✅ Auto-generate |
| `PATCH` | `/api/notifications/:id` | Mark as read | ✅ Auto-generate |

### 4.8 Admin

| Method | Route | Description | Agent action |
|---|---|---|---|
| `GET` | `/api/admin/users` | User directory (filters, search) | ✅ Auto-generate |
| `PATCH` | `/api/admin/users/:id` | Ban/reinstate user | ⚠️ Stub two-person approval |
| `GET` | `/api/admin/jobs` | Job moderation queue | ✅ Auto-generate |
| `PATCH` | `/api/admin/jobs/:id` | Remove/warn job | ✅ Auto-generate |
| `GET` | `/api/admin/disputes` | Dispute queue | ✅ Auto-generate |
| `PATCH` | `/api/admin/disputes/:id` | Assign/resolve dispute | ⚠️ Stub finance approval |
| `GET` | `/api/admin/audit-log` | Audit log (filterable) | ✅ Auto-generate |

---

## 5. Security Model

### 5.1 Authentication

- **Primary:** JWT (HS256) issued by Workers, stored in `__Host-` secure cookie.
- **Secondary:** WebAuthn passkeys (stubbed; human to integrate Cloudflare Turnstile + WebAuthn later).
- **Session store:** Durable Object per user (tracks active sessions, IP, device).

### 5.2 Authorization (RBAC)

| Role | Permissions |
|---|---|
| `user` | Own resources only (profiles, jobs, proposals, projects) |
| `admin` | User/job moderation, dispute assignment, content removal |
| `superadmin` | All admin + feature flags, audit log export, staff management |

Middleware enforces:
```ts
function requireRole(allowed: string[]) {
  return (c: Context, next: Function) => {
    const user = c.get('user');
    if (!allowed.includes(user.role)) return c.json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }, 403);
    return next();
  };
}
```

### 5.3 Audit Logging

Every admin action (ban, refund, dispute resolution) writes to `audit_log` table with:
- `actor_id`, `action`, `target_type`, `target_id`
- `before_state`, `after_state` (JSON snapshots)
- `ip_address`, `user_agent`

Agent can auto-generate audit writes for all `PATCH/DELETE` admin routes.

---

## 6. Payment Abstraction (Stripe Connect Stub)

**Legal warning:** Do NOT represent this as escrow until legal/payments review confirms safeguarding compliance in UK/EU.

### 6.1 Fund Milestone Flow (Stub)

```ts
// POST /api/milestones/:id/fund
// 1. Create Stripe PaymentIntent (amount = milestone.amount_minor_units)
// 2. Store payment_intent_id in milestones table
// 3. Return client_secret to frontend
// 4. On webhook `payment_intent.succeeded`:
//    - Update milestone.status = 'funded'
//    - Trigger notification to seller
```

Agent generates:
- PaymentIntent creation code (test mode)
- Webhook handler stub (verify signature, update DB)
- Frontend Stripe Elements integration (from `SKILLPAGE_SITEMAP_AND_WIREFRAMES.md` WF-13)

Human must review:
- Legal disclaimer text ("Platform fee £0. Payment processor fee shown before funding.")
- Refund/chargeback handling
- Payout flow (Stripe Transfer to seller Connect account)

---

## 7. Dispute Workflow State Machine

```text
open → mediation → adjudication → resolved
                 ↘              ↗
                  appealed ────┘
```

**Agent can auto-generate:**
- Dispute creation (POST `/api/disputes`) → sets `milestone.status = 'disputed'`
- Evidence snapshot (copy project messages, deliverables, milestone agreement into dispute record)
- Admin assignment (PATCH `/api/admin/disputes/:id`)
- Resolution template (release/refund/split) with audit log write

**Human must design:**
- Finance approval workflow (two-person sign-off for refunds >£500)
- Payment-provider reconciliation (Stripe Transfer reversal vs. manual refund)
- Appeal window logic (7 days to appeal; freeze funds during appeal)

---

## 8. Email System (Cloudflare Workers Mail)

### 8.1 Templates

| Template | Trigger | Variables |
|---|---|---|
| `welcome` | Signup | `{{displayName}}`, `{{profileUrl}}` |
| `verify-email` | Signup | `{{verificationToken}}`, `{{verifyUrl}}` |
| `proposal-received` | Seller submits proposal | `{{jobTitle}}`, `{{sellerName}}` |
| `milestone-funded` | Payment succeeds | `{{milestoneTitle}}`, `{{projectTitle}}` |
| `milestone-delivered` | Seller delivers | `{{milestoneTitle}}`, `{{deliverableUrl}}` |
| `dispute-opened` | Dispute created | `{{disputeId}}`, `{{milestoneTitle}}` |
| `admin-dispute-assigned` | Admin assigned | `{{disputeId}}`, `{{assignedTo}}` |

Agent generates:
- Email template HTML (inline CSS, responsive)
- Workers Mail sending function (`sendEmail(to, template, vars)`)
- Queue consumer for async email (avoid blocking API responses)

---

## 9. File Upload (R2 Signed URLs)

**Flow:**
1. Frontend requests signed URL: `POST /api/uploads/sign` with `{ fileName, contentType }`
2. Worker generates R2 presigned PUT URL (5-minute expiry)
3. Frontend uploads directly to R2
4. On upload success, frontend calls `POST /api/portfolio` or `POST /api/milestones/:id/deliver` with R2 object key

Agent generates:
- R2 bucket setup script (`wrangler r2 bucket create skillpage-files`)
- Signed URL endpoint
- Virus-scan hook stub (Queue consumer that scans new uploads; human integrates ClamAV or third-party)

---

## 10. Rate Limiting & Fraud Hooks

### 10.1 Rate Limiting

Use Cloudflare Rate Limiting API:
- `/api/auth/*`: 5 requests/minute/IP
- `/api/jobs`: 30 requests/minute/IP
- `/api/proposals`: 10 proposals/hour/user

Agent generates:
- `wrangler.toml` rate limiting rules
- Middleware that returns `429 Too Many Requests` with `Retry-After` header

### 10.2 Turnstile (CAPTCHA)

- Protect `/api/auth/signup`, `/api/jobs`, `/api/proposals`
- Agent generates Turnstile widget integration + server-side token verification stub

### 10.3 Fraud Flags

Add `risk_score` column to `users` table (0–100). Agent generates:
- Basic rules: new account + high-value job → `risk_score += 20`
- Reused payment instrument → `risk_score += 30`
- Off-platform contact attempt (regex in messages) → flag for admin review

Human designs:
- Thresholds for auto-suspend vs. manual review
- Linked-account graph (Durable Object for identity clustering)

---

## 11. Test Strategy

### 11.1 Unit Tests (Vitest)

Agent generates:
- Component tests (Button, Input, Card) with accessibility assertions
- Utility function tests (currency formatting, date helpers)

### 11.2 Integration Tests (Vitest + Miniflare)

Agent generates:
- API route tests (D1 in-memory, R2 mock)
- Auth flow tests (signup → verify email → login)

### 11.3 E2E Tests (Playwright)

Agent generates:
- Test scaffolds for 4 critical flows (Section 11 of `SKILLPAGE_SITEMAP_AND_WIREFRAMES.md`):
  1. Seller publishes profile + applies to job
  2. Buyer posts job + compares candidates
  3. Buyer funds + seller delivers milestone
  4. Dispute intake

Human writes:
- Test data factories (realistic jobs, proposals, milestones)
- Assertions for trust signals, fee disclosure, audit log entries

---

## 12. Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| First Contentful Paint | <1.5s | Cloudflare Pages edge caching, image optimization |
| Time to Interactive | <3s | Code splitting, lazy-load non-critical components |
| API latency (p95) | <100ms | Durable Objects for hot paths, D1 indexes, KV cache for profiles |
| Bundle size (JS) | <200KB gzipped | Tree-shaking, remove unused Radix components |

Agent generates:
- `wrangler.toml` with caching rules
- Next.js config for code splitting
- D1 index creation scripts (Section 3.2)

---

## 13. Agent Guardrails

### 13.1 Auto-Generate (Safe)

- All CRUD APIs (Section 4)
- Database migrations (Section 3)
- Component library (Section 3 of `SKILLPAGE_DESIGN_SYSTEM.md`)
- Wireframe-to-component mapping (Section 6.3 of `SKILLPAGE_SITEMAP_AND_WIREFRAMES.md`)
- Email templates (Section 8)
- File upload flow (Section 9)
- Rate limiting config (Section 10.1)

### 13.2 Stub for Human Review (Critical)

- Payment logic (Stripe Connect, refunds, chargebacks) — Section 6
- Dispute finance approval workflow — Section 7
- WebAuthn passkeys — Section 5.1
- Admin two-person approval — Section 5.3
- Fraud detection thresholds — Section 10.3
- AI agent consent flows — Section 7 of `SKILLPAGE_DESIGN_SYSTEM.md`

### 13.3 Do Not Auto-Generate (Legal/Compliance)

- Terms of Service, Privacy Policy, Cookie Policy (use legal template service)
- Dispute policy wording (`/legal/disputes`)
- Prohibited work policy (`/legal/prohibited-work`)
- Fee disclosure wording (must match Stripe Connect legal requirements)

---

## 14. Deployment Checklist

### 14.1 Cloudflare Setup

```bash
# 1. Create Pages project
wrangler pages project create skillpage

# 2. Create Workers (API)
wrangler worker create skillpage-api

# 3. Create D1 database
wrangler d1 create skillpage-db

# 4. Create R2 bucket
wrangler r2 bucket create skillpage-files

# 5. Create Queues
wrangler queues create skillpage-email-queue

# 6. Enable Email Routing
# (via dashboard or wrangler email routing create)

# 7. Configure Turnstile
# (via dashboard: generate sitekey + secret)
```

### 14.2 Environment Variables

```ini
# .dev.vars (local)
DATABASE_URL="wrangler d1 execute skillpage-db --local"
R2_BUCKET="skillpage-files"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
TURNSTILE_SECRET="1x0000000000000000000000000000000AA"
JWT_SECRET="dev-secret-change-in-prod"

# Production (via wrangler secret)
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
TURNSTILE_SECRET
JWT_SECRET
```

### 14.3 CI/CD (GitHub Actions)

Agent generates:
- `.github/workflows/deploy.yml` (Pages + Workers deploy on push to `main`)
- Preview deployments for PRs

---

## 15. Immediate Next Step for Agent

**Prompt to coding agent:**

```text
You are building SkillPage on Cloudflare stack (Pages + Workers + D1 + R2 + Queues + Email Routing).

Context:
- docs/FOUNDING_DOCUMENT.md (vision, business model)
- docs/SKILLPAGE_DESIGN_SYSTEM.md (tokens, components, accessibility, agent-ready architecture)
- docs/SKILLPAGE_SITEMAP_AND_WIREFRAMES.md (sitemap, page inventory, 18 wireframes)
- docs/SKILLPAGE_AGENT_CODING_BRIEF.md (this document: API contracts, DB schema, security, payments stub, email, file upload, rate limiting, tests, performance)

Rules:
1. Use Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI, Lucide React.
2. All components must use semantic design tokens from SKILLPAGE_DESIGN_SYSTEM.md Section 2.
3. Every interactive element must meet WCAG 2.2 AA (Section 10 of design system).
4. Do NOT implement real payment logic, dispute finance approval, or WebAuthn — generate stubs with TODO comments for human review.
5. For AI features, follow Section 7 of design system: draft/recommend/explain, then request consent; no autonomous irreversible actions.
6. Use Cloudflare Workers (Hono) for API, D1 for DB, R2 for files, Queues for async email/notifications.

Task: Generate the complete codebase for Phase 0 (Foundation) + Phase 1 (Public SkillPage + Auth) from wireframes WF-01, WF-02, WF-05 and sitemap Section 3.

Output:
- Full Next.js app structure
- Design token files (CSS + TS)
- Atomic components (Button, Input, Avatar, Badge, Card, Modal, Toast)
- Landing page (WF-01), Public SkillPage (WF-02), Seller onboarding (WF-05)
- Auth flows (signup, login, email verification)
- D1 schema migrations (Section 3 of this brief)
- API routes for users, profiles, skills (Section 4.1–4.2)
- Storybook stories for components
- Playwright E2E test scaffolds for Flow 1 (seller publishes profile + applies to job)
```

---

## 16. Acceptance Criteria

The agent-generated codebase is ready for human review when:

1. **All CRUD APIs** from Section 4 are implemented with D1 migrations.
2. **All wireframes WF-01–WF-18** have corresponding React components using design tokens.
3. **Security middleware** (JWT, RBAC, audit logging) is in place.
4. **Payment, dispute finance, WebAuthn** are stubbed with clear TODOs.
5. **Email templates** are generated and queued.
6. **File upload** uses R2 signed URLs.
7. **Rate limiting** and Turnstile are configured.
8. **Test scaffolds** exist for 4 critical flows.
9. **Performance budget** is met (bundle <200KB gzipped, FCP <1.5s).
10. **Legal pages** (`/legal/terms`, `/legal/privacy`, `/legal/disputes`, `/legal/prohibited-work`) are placeholders with legal-review TODOs.

---

**Final note:** This brief is designed to make an agentic coding tool 90%+ autonomous. Human review focuses on payments/legal, security-critical paths, and AI consent flows — exactly the gaps identified in the original "What an agent CANNOT do" table.
