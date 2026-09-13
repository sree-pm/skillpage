# SkillPage — Sitemap, Screen Architecture & Wireframe Blueprint

**Version:** 1.0  
**Date:** September 13, 2026  
**Status:** Product architecture and UI wireframe plan  
**Companion documents:** `FOUNDING_DOCUMENT.md`, `SKILLPAGE_DESIGN_SYSTEM.md`

---

## 1. Purpose

This document turns the founding vision and design system into a buildable information architecture: all public pages, seller/buyer application screens, shared project screens, superadmin operations screens, route ownership, navigation, edge states, and a wireframe-production plan.

The platform has four distinct but connected surfaces:

1. **Public discovery:** skill pages, company pages, jobs, talent directory, trust pages and marketing.
2. **Seller workspace:** profile, services, job discovery, proposals, projects, earnings and reputation.
3. **Buyer workspace:** company page, jobs, candidate comparison, projects, payments and team tools.
4. **Operations workspace:** superadmin controls for moderation, payments, risk, disputes, support, content and analytics.

**Design rule:** one account may operate as a seller, buyer and organisation member. Navigation changes by active workspace; data is not duplicated.

---

## 2. Product Navigation Model

### 2.1 Global Navigation

| User state | Desktop navigation | Mobile navigation |
|---|---|---|
| Visitor | Logo, Explore, Jobs, Talent, How it works, Trust, Pricing, Sign in, Create account | Logo, search, menu drawer |
| Seller | Logo, global search, Workspace switcher, Messages, Notifications, Avatar | Bottom tabs: Home, Discover, Projects, Messages, Profile |
| Buyer | Logo, global search, Workspace switcher, Messages, Notifications, Avatar | Bottom tabs: Home, Jobs, Projects, Messages, Profile |
| Superadmin | Logo, Operations navigation, global case search, alerts, admin profile | Desktop-first; mobile supports triage only |

### 2.2 Workspace Switcher

A user who has multiple contexts sees:

```text
Current workspace: Personal seller profile
  • Seller workspace
  • Buyer workspace — Acme Ltd
  • Buyer workspace — Personal hiring
  • Create organisation
```

The switcher must retain the last route when it exists in the destination context, otherwise go to that workspace home screen.

### 2.3 Shared System Screens

All roles need these screens:

| Route | Screen |
|---|---|
| `/login` | Sign in |
| `/signup` | Create account |
| `/verify-email` | Email verification |
| `/forgot-password` | Password recovery |
| `/onboarding` | Role/intent selection |
| `/notifications` | Notification centre |
| `/messages` | Universal inbox |
| `/help` | Help centre |
| `/report` | Report content/user entry flow |
| `/settings/security` | Password, passkeys, MFA, devices, sessions |
| `/settings/privacy` | Data use, export, deletion, consent |
| `/status` | Service status |

---

## 3. Complete Sitemap

```text
skillpage.io
│
├── Public marketing and discovery
│   ├── /                              Landing page
│   ├── /explore                       Unified discovery/search
│   ├── /jobs                          Job directory
│   ├── /jobs/[jobSlug]                Public job detail
│   ├── /talent                        Talent directory
│   ├── /talent/[category]             Talent category directory
│   ├── /services                      Service/package directory
│   ├── /companies                     Buyer/company directory
│   ├── /how-it-works                  How SkillPage works
│   ├── /trust                         Trust & safety centre
│   ├── /fees                          Transparent payment-fee explainer
│   ├── /pricing                       Free and future Pro plans
│   ├── /resources                     Guides and templates hub
│   ├── /resources/[slug]              Resource article
│   ├── /help                          Help centre
│   ├── /legal/terms                   Terms
│   ├── /legal/privacy                 Privacy policy
│   ├── /legal/cookies                 Cookie policy
│   ├── /legal/disputes                Dispute policy
│   ├── /legal/prohibited-work         Prohibited work policy
│   ├── /login                         Sign in
│   ├── /signup                        Account creation
│   ├── /verify-email                  Email verification
│   └── /[handle]                      Public SkillPage (person or brand)
│
├── Seller workspace
│   ├── /seller/home                   Seller home
│   ├── /seller/profile                Profile editor
│   ├── /seller/profile/preview        Public-page preview
│   ├── /seller/services               Services/packages list
│   ├── /seller/services/new           Create service
│   ├── /seller/services/[id]/edit     Edit service
│   ├── /seller/portfolio              Evidence/portfolio library
│   ├── /seller/portfolio/new          Add evidence item
│   ├── /seller/discover               Job discovery feed
│   ├── /seller/discover/saved         Saved jobs
│   ├── /seller/jobs/[id]              Authenticated job detail
│   ├── /seller/proposals              Proposal pipeline
│   ├── /seller/proposals/new/[jobId]  Proposal composer
│   ├── /seller/proposals/[id]         Proposal detail
│   ├── /seller/projects               Project list
│   ├── /seller/projects/[id]          Seller project workspace
│   ├── /seller/projects/[id]/deliver  Milestone delivery flow
│   ├── /seller/earnings               Earnings overview
│   ├── /seller/payouts                Payout history and destination
│   ├── /seller/reputation             Reviews and trust evidence
│   ├── /seller/calendar               Availability and bookings
│   ├── /seller/messages               Seller-filtered inbox
│   ├── /seller/agents                 Future Pro Agent Control Centre
│   └── /seller/settings               Seller settings
│
├── Buyer workspace
│   ├── /buyer/home                    Buyer home
│   ├── /buyer/profile                 Brand/company profile editor
│   ├── /buyer/profile/preview         Public brand-page preview
│   ├── /buyer/jobs                    Job list: drafts/open/closed
│   ├── /buyer/jobs/new                Job-creation wizard
│   ├── /buyer/jobs/[id]               Buyer job management
│   ├── /buyer/jobs/[id]/edit          Edit job
│   ├── /buyer/jobs/[id]/proposals     Proposal inbox
│   ├── /buyer/jobs/[id]/compare       Candidate comparison
│   ├── /buyer/talent                  Talent search and saved talent
│   ├── /buyer/shortlists              Shortlist boards
│   ├── /buyer/projects                Project list
│   ├── /buyer/projects/[id]           Buyer project workspace
│   ├── /buyer/projects/[id]/fund       Fund milestone flow
│   ├── /buyer/projects/[id]/review     Review delivery flow
│   ├── /buyer/payments                Payment methods and funded milestones
│   ├── /buyer/billing                 Invoices and payment receipts
│   ├── /buyer/team                    Team member list
│   ├── /buyer/team/invite             Invite team member
│   ├── /buyer/messages                Buyer-filtered inbox
│   ├── /buyer/agents                  Future Pro Agent Control Centre
│   └── /buyer/settings                Organisation/workspace settings
│
├── Shared project and trust routes
│   ├── /projects/[id]                 Redirect to role-aware project workspace
│   ├── /projects/[id]/scope           Scope and agreement history
│   ├── /projects/[id]/milestones      Milestone list/timeline
│   ├── /projects/[id]/files           Deliverable library
│   ├── /projects/[id]/messages        Project conversation
│   ├── /projects/[id]/changes/new     Change request flow
│   ├── /projects/[id]/dispute/new     Open dispute flow
│   ├── /disputes/[id]                 Party-facing dispute case
│   └── /reviews/new/[projectId]       Double-blind review flow
│
└── Superadmin operations portal
    ├── /admin/dashboard               Operations dashboard
    ├── /admin/users                   Users directory
    ├── /admin/users/[id]              User detail and risk timeline
    ├── /admin/organisations            Organisations directory
    ├── /admin/organisations/[id]       Organisation detail
    ├── /admin/verification             Identity/company verification queue
    ├── /admin/jobs                    Job moderation queue
    ├── /admin/jobs/[id]               Moderation detail
    ├── /admin/projects                Active project oversight
    ├── /admin/disputes                Dispute queue
    ├── /admin/disputes/[id]           Dispute console
    ├── /admin/payments                Payment operations overview
    ├── /admin/payments/[id]           Payment/reconciliation detail
    ├── /admin/payouts                 Payout exceptions
    ├── /admin/chargebacks             Chargeback queue
    ├── /admin/risk                    Risk dashboard and alerts
    ├── /admin/reports                 Abuse/report queue
    ├── /admin/support                 Support inbox
    ├── /admin/support/[id]            Ticket detail
    ├── /admin/analytics               Marketplace analytics
    ├── /admin/content                 CMS and announcements
    ├── /admin/feature-flags           Feature controls
    ├── /admin/integrations            Stripe/email/analytics health
    ├── /admin/team                    Staff roles and permissions
    ├── /admin/audit-log               Privileged-action audit log
    └── /admin/settings                Platform configuration
```

### 3.1 Subdomain Routing

| URL | Destination |
|---|---|
| `skillpage.io/[handle]` | Canonical public skill/brand page for launch simplicity |
| `[handle].skillpage.io` | Branded alias to the canonical public page |
| `app.skillpage.io` | Authenticated application/workspaces |
| `admin.skillpage.io` | Staff-only operations portal |
| `help.skillpage.io` | Help centre, optional future split |

Use reserved handles for system routes (`admin`, `app`, `help`, `jobs`, `talent`, `pricing`, `trust`, `support`, `api`, etc.).

---

## 4. Page Inventory and Required States

### 4.1 Public Pages

| Page | Primary goal | Must-have blocks | Essential states |
|---|---|---|---|
| Landing | Convert visitors to sign-up | Hero, fee promise, trust proof, user paths, how it works, job/talent preview, FAQs | Visitor, signed in, locale/currency variation |
| Explore | Find relevant jobs, people or services | Search, tabs, filters, result cards, saved search | Default, loading, no results, error |
| Jobs directory | Discover work | Filters, sort, job cards, alerts, pagination/infinite scroll | Empty category, expired job, logged-out apply prompt |
| Public job detail | Convert qualified sellers into applicants | Scope, buyer trust, budget, milestones, skills, report, apply | Open, paused, filled, expired, restricted |
| Talent directory | Convert buyers to shortlist/contact | Talent search, filters, proof/verification on cards | Empty, filtered no-results, private profile |
| Public SkillPage | Convert visitors to message, book or hire | Hero, proof/evidence, services, experience, reviews, availability, trust badges, CTA | Published, unpublished, private, not found |
| Trust centre | Explain safety and reduce payment anxiety | Funded-milestone process, verification, reviews, disputes, reporting | Region-specific policy, maintenance notice |
| Fees | Make 0% platform-fee claim precise | Fee calculator, examples, processor-fee disclaimers, currency note | Country/payment-method variation |
| Pricing | Explain Free vs future Pro | Feature comparison, transparent future plan status, FAQ | Pre-launch, Pro available, annual/monthly |

### 4.2 Seller Pages

| Page | Primary action | Must-have blocks | Edge states |
|---|---|---|---|
| Home | Apply or finish setup | onboarding meter, recommended jobs, pending actions, earnings, projects | New account, no matches, suspended/payout issue |
| Profile | Publish credible SkillPage | edit form, preview, profile readiness, handle, privacy, trust badges | Incomplete, unpublished, handle conflict |
| Services | Create direct-buy offers | service cards, price/scope, availability, checkout/hire settings | No services, draft, paused |
| Portfolio | Add proof of work | evidence cards, URLs/files, tags, verification status | Upload processing failure, duplicate evidence |
| Discover | Find work | saved filters, match criteria, job cards, alerts | No jobs, applied, job closed |
| Proposal composer | Send a compelling proposal | job context, structured approach, price, milestones, portfolio picker, preview | Validation errors, deadline passed, duplicate proposal |
| Proposals | Manage pipeline | statuses, filters, next action, archive | Empty, withdrawn, rejected, expired |
| Project workspace | Deliver successful work | timeline, milestones, messages, files, scope, change/dispute controls | Fund not received, overdue, revision, disputed, completed |
| Earnings | Understand money | available/pending/paid amounts, fee breakdown, tax exports | No earnings, failed payout, verification required |
| Reputation | Build trust | reviews, work evidence, response/on-time metrics, export | No completed work, review pending |
| Calendar | Manage availability | availability, bookings, calendar connection, time zone | Calendar disconnect/error |

### 4.3 Buyer Pages

| Page | Primary action | Must-have blocks | Edge states |
|---|---|---|---|
| Home | Post job or review candidates | active jobs, pending approvals, spend/funding status, recommended talent | New account, no jobs, payment setup missing |
| Profile | Create credible buyer/brand page | company identity, hiring summary, team, verification, public preview | Unverified, pending verification |
| Jobs | Manage hiring pipeline | drafts, open, paused, filled, archived; status filters | No jobs, moderation pending |
| Job wizard | Publish a clear job | stepper, saved draft, scope/budget/milestones, preview | Validation, draft recovery, policy warning |
| Proposal inbox | Choose best candidate | applicant cards, filters, notes, messages, shortlist, status | No proposals, late proposal, withdrawn |
| Compare | Make informed choice | 2–5 side-by-side candidates, evidence, price, availability, reliability, decision rationale | Different currencies, missing criteria |
| Talent | Proactively source talent | search, filters, saved talent, invite to job | No results, private seller |
| Shortlists | Collaborate on selection | boards, notes, collaborator mentions, job association | Empty list, permission restriction |
| Project workspace | Manage scope and approvals | timeline, funded milestones, delivery review, messages, change/dispute controls | Unfunded milestone, overdue delivery, disputed |
| Payments | Fund work safely | payment methods, payment status, fee disclosure, balance/history | Card failed, SCA needed, verification needed |
| Billing | Accounting clarity | invoices, receipts, exports, VAT data | No invoices, export unavailable |
| Team | Control collaboration | members, roles, invites, approval limits | Invite pending, seat limit, role conflict |

### 4.4 Admin Pages

Every admin table needs: global search, saved filters, date range, role-aware actions, export permission checks, clear empty/loading/error states, bulk action safeguards, and audit-log links.

| Page | Primary goal | Must-have modules |
|---|---|---|
| Admin dashboard | Detect operational risk early | KPI cards, queues, alerts, platform health, trend charts |
| Users | Investigate/enforce safely | user timeline, verification, reports, projects, payment/risk indicators, action history |
| Verification | Approve/reject proportionately | documents, liveness/provider outcome, reviewer notes, reason templates |
| Jobs | Maintain listing quality | job preview, report flags, moderation decision, appeal state |
| Disputes | Resolve fairly and consistently | evidence ledger, policy checklist, internal notes, decision workflow, communications |
| Payments | Reconcile and address exceptions | payment events, transfer/payout status, refunds, chargebacks, fee visibility |
| Risk | Prioritise fraud prevention | risk rules, case queue, linked-account graph, review outcomes |
| Support | Resolve user problems | ticket, user context, macros, internal notes, SLA clock |
| Analytics | Measure liquidity and trust | acquisition/activation/conversion/retention, GMV, disputes, cohorts |
| Flags | Safely launch features | segment, owner, expiry, metrics, kill switch |
| Audit log | Accountability | actor, action, target, before/after, timestamp, IP/session reference |

---

## 5. Key End-to-End Flows

### Flow A — Seller: Sign up to first funded project

```text
Landing → Sign up → Choose "Find work" → Seller onboarding
→ Publish SkillPage → Discover jobs → Job detail → Proposal composer
→ Buyer messages/interviews → Scope agreement → Buyer funds milestone
→ Seller workspace receives "Funded — start work" state
```

**Success condition:** first milestone is funded, not merely a profile published or proposal submitted.

### Flow B — Buyer: Sign up to first funded hire

```text
Landing → Sign up → Choose "Hire talent" → Buyer onboarding
→ Payment setup → Job creation wizard → Publish
→ Proposal inbox → Compare → Select seller → Scope agreement
→ Fee disclosure → Fund milestone → Project workspace opens
```

**Success condition:** buyer understands exactly what is funded, who pays processor fees, delivery criteria and what happens if there is a dispute.

### Flow C — Milestone delivery and approval

```text
Funded milestone → Seller delivery → Buyer notification
→ Review deliverable → Approve / request revision / request change / dispute
→ Payment completion or disputed state → Both invited to review at project completion
```

### Flow D — Admin: Dispute handling

```text
Dispute created → automatic evidence snapshot → triage/risk classification
→ assigned case manager → counterparty response → mediation
→ permitted decision approval → payment provider action where applicable
→ user communications → appeal window → final audit record
```

---

## 6. Wireframe Set

The following screens are the **minimum critical wireframe pack**. Build desktop first at 1440 px and mobile versions at 390 px for every public, seller and buyer critical flow. Admin is desktop-first (1440 px) with a mobile triage view only.

### 6.1 Wireframes to Produce First

| ID | Screen | Viewport | Purpose |
|---|---|---:|---|
| WF-01 | Landing page | 1440, 390 | Public conversion and trust proposition |
| WF-02 | Public SkillPage | 1440, 390 | Seller proof-of-work and direct-hire conversion |
| WF-03 | Explore/search results | 1440, 390 | Cross-market discovery |
| WF-04 | Job detail | 1440, 390 | Seller decision to apply |
| WF-05 | Seller onboarding | 1440, 390 | Activation to profile publish |
| WF-06 | Seller dashboard | 1440, 390 | Daily seller operating view |
| WF-07 | Proposal composer | 1440, 390 | High-quality application flow |
| WF-08 | Buyer onboarding | 1440, 390 | Activation and payment readiness |
| WF-09 | Job creation wizard | 1440, 390 | Create an unambiguous hireable brief |
| WF-10 | Buyer proposal inbox | 1440, 390 | Screen and shortlist candidates |
| WF-11 | Candidate comparison | 1440 | Make an explainable hiring decision |
| WF-12 | Project workspace | 1440, 390 | Shared work, scope, milestones and messaging |
| WF-13 | Fund milestone checkout | 1440, 390 | Payment clarity and consent |
| WF-14 | Delivery review | 1440, 390 | Approve/revise/dispute outcome |
| WF-15 | Dispute intake | 1440, 390 | Fair, evidence-led escalation |
| WF-16 | Admin operations dashboard | 1440 | Superadmin triage |
| WF-17 | Admin dispute console | 1440 | Case manager decision workspace |
| WF-18 | Agent Control Centre | 1440, 390 | Future Pro feature controls |

### 6.2 Wireframe Visual Brief

All high-fidelity wireframes must use the system's tokens:

- Page background: `#FFFFFF` light / `#0B0F14` dark
- Surface: `#F5F7FA` light / `#11161D` dark
- Primary action/trust: `#4F9CF9`
- AI-only accent: `#7C5CFF`
- Success: `#2FBF71`; warning: `#F59E0B`; error/dispute: `#EF4444`
- 8 px spacing rhythm
- Card radius: 12–16 px
- Minimum visible interactive target: 44 px
- System font stack: Inter / platform system fonts

### 6.3 Screen Sketches

#### WF-01 — Landing Page (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SkillPage     Explore  Jobs  Talent  How it works  Trust       Sign in [Join]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│             Your skills deserve more than a marketplace profile.             │
│      Build your SkillPage. Find trusted work. Keep 100% of your price.       │
│                                                                              │
│       [Create your free SkillPage]    [Hire trusted talent]                  │
│                                                                              │
│   ✓ Free profiles and job posting  ✓ Clear processor fees  ✓ Funded work    │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Proof of work]        [Funded milestones]       [Trust signals]            │
│  Public page + evidence Payment status + scope    Verified evidence/reviews  │
├──────────────────────────────────────────────────────────────────────────────┤
│  How it works:  1 Create profile  →  2 Agree scope  →  3 Fund work  →  4 Ship│
├──────────────────────────────────────────────────────────────────────────────┤
│  Featured talent                     Latest opportunities                    │
│  [Talent card] [Talent card]         [Job card] [Job card]                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Transparent pricing: Platform fee £0 | You only pay processor charges       │
│  [See fee examples]                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  Footer: Product | Trust | Resources | Legal | Status                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-02 — Public SkillPage (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SkillPage logo   Search                                      [Sign in]        │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Avatar]  Alex Morgan   ✓ Identity verified                                  │
│           AI automation & growth systems for ambitious SMEs                  │
│           London · Remote · Available from 18 Sep                            │
│           [Message] [Book a call] [Invite to job]                            │
├───────────────────────────────┬──────────────────────────────────────────────┤
│ About / expertise             │ Trust snapshot                               │
│ Clear positioning, outcomes   │ ✓ Identity verified                          │
│ and working preferences       │ 18 funded projects · 94% on time             │
│                               │ 4.9 (16 verified reviews)                    │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ Proof of work                 │ Services                                     │
│ [Evidence card] [Evidence]    │ [Automation audit £…] [MVP build £…]         │
│ Results, media, source links  │ [Request custom proposal]                    │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ Experience and credentials    │ Availability / calendar                       │
│ Timeline / verified badges    │ [Calendar slots]                              │
├───────────────────────────────┴──────────────────────────────────────────────┤
│ Reviews (double-blind verified after project completion)                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-04 — Job Detail (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Back to jobs                         Save job                     [Apply]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Build an AI-enabled research workflow                                           │
│ Fixed project · £2,000–£3,000 · Remote · 3–4 weeks                             │
│ Posted 1 day ago · 12 proposals · Application closes in 6 days                 │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ Outcome                                │ Buyer trust                          │
│ Build a repeatable pipeline that…      │ Acme Ltd ✓ Organisation verified     │
│                                       │ 8 projects funded · 100% paid on time│
│ Requirements                           │ Average response: 8h                 │
│ • Research automation                  │ [View brand page] [Report listing]   │
│ • API integration                      │                                      │
│                                       │ Apply panel                           │
│ Milestones                             │ [Your proposed amount]                │
│ 1. Discovery £600                      │ [Estimated timeline]                  │
│ 2. Build £1,400                        │ [Start proposal]                      │
│ 3. Handover £800                       │                                      │
│ Payment begins only after the first    │ Fees                                 │
│ milestone is funded.                   │ Platform £0 · processor shown later  │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

#### WF-07 — Proposal Composer (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Job detail               Proposal for "AI research workflow"     [Save draft]│
├───────────────────────────────────────┬──────────────────────────────────────┤
│ Your proposal                          │ Job context                           │
│ Why you are a fit                      │ Outcome, budget, timeline, buyer      │
│ [Rich text editor]                     │ trust snapshot                         │
│                                       │                                      │
│ Your approach                           │ Attach relevant proof                  │
│ [Step 1] [Step 2] [Step 3]             │ [Portfolio item] [Portfolio item]     │
│                                       │                                      │
│ Commercials                             │ Proposal quality checklist             │
│ Price [£       ] Currency [GBP]        │ ✓ clear outcome                         │
│ Timeline [  ] Start [  ]               │ ⚠ add an example of similar work       │
│                                       │ ✓ payment is milestone based           │
│ Proposed milestones                     │                                      │
│ [Milestone card +]                      │                                      │
│                                       │                                      │
│             [Preview proposal] [Submit proposal]                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-09 — Buyer Job Creation Wizard (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Create a job                                        Saved 2 seconds ago       │
│ ① Work type — ② Outcome — ③ Scope — ④ Budget — ⑤ Milestones — ⑥ Review       │
├───────────────────────────────┬──────────────────────────────────────────────┤
│ Step 3: Define the scope      │ Live listing preview                           │
│ What successful delivery      │ Job title                                      │
│ looks like *                  │ Budget / duration / remote details              │
│ [Textarea]                    │                                                │
│ What is included?             │ "Your requirements will appear here."          │
│ [Checklist + custom item]     │                                                │
│ What is out of scope?         │ Trust & fee notice                              │
│ [Textarea]                    │ Platform fee £0. Payment processor fee is      │
│ Attach files/examples         │ disclosed before funding.                        │
│ [Dropzone]                    │                                                │
│ [Back] [Continue]             │                                                │
└───────────────────────────────┴──────────────────────────────────────────────┘
```

#### WF-10 — Buyer Proposal Inbox (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ AI research workflow  |  12 proposals  |  [Compare selected (0)]             │
├───────────────┬──────────────────────────────────────────────────────────────┤
│ Filters       │ [ ] Alex Morgan  ✓ ID verified  4.9 (16)                      │
│ Rate           │ £2,800 · 3 weeks · Available 18 Sep                           │
│ Availability   │ Relevant proof: [Research automation] [API integration]       │
│ Verification   │ "I would approach this in three stages…"                      │
│ On-time rate   │ 94% on time · 8h response · 18 funded projects                │
│ [Apply]        │ [Message] [Shortlist] [View proposal]                         │
│               ├──────────────────────────────────────────────────────────────┤
│                │ [ ] Priya Shah ...                                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

#### WF-11 — Candidate Comparison (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Proposal inbox         Compare candidates (up to 5)                         │
├──────────────────────────┬────────────────────┬──────────────────────────────┤
│                           │ Alex Morgan        │ Priya Shah                   │
│                           │ [Avatar] ✓         │ [Avatar] ✓                   │
├──────────────────────────┼────────────────────┼──────────────────────────────┤
│ Proposed price            │ £2,800             │ £2,500                       │
│ Timeline                  │ 3 weeks            │ 4 weeks                      │
│ Relevant evidence         │ 3 verified examples│ 2 examples                   │
│ On-time delivery          │ 94% (18 projects)  │ 98% (10 projects)            │
│ Buyer response feedback   │ Strong              │ Strong                       │
│ Proposed milestones       │ [View]             │ [View]                       │
│ Your private notes        │ [Textarea]         │ [Textarea]                   │
├──────────────────────────┴────────────────────┴──────────────────────────────┤
│ [Message] [Shortlist] [Choose Alex and agree scope]                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-12 — Shared Project Workspace (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Project: AI research workflow     Buyer: Acme Ltd  Seller: Alex Morgan        │
│ Status: In progress · Milestone 2 of 3 · [Scope] [Files] [Messages] [More]   │
├───────────────────────┬────────────────────────────────┬─────────────────────┤
│ Milestones            │ Activity and conversation       │ Project context     │
│ ✓ 1 Discovery £600    │ Seller: Discovery findings…     │ Total: £2,800       │
│ ● 2 Build £1,400      │ [Attachment]                    │ Funded: £1,400      │
│ ○ 3 Handover £800     │ Buyer: Please include…          │ Next due: 22 Sep    │
│                       │ [Type a message…]               │ [View agreement]    │
│ [Request change]      │                                  │                     │
│ [Open dispute]        │                                  │                     │
├───────────────────────┴────────────────────────────────┴─────────────────────┤
│ Current milestone: Build · Funded £1,400 · Due 22 Sep                         │
│ [Seller: Deliver milestone] / [Buyer: Review delivery]                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-13 — Fund Milestone (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Fund Milestone 1 of 3                                                        │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ Review agreement                       │ Payment summary                       │
│ Deliverable: Discovery workshop + plan │ Milestone amount        £600.00       │
│ Due: 10 October                        │ Platform fee             £0.00         │
│ Acceptance criteria: …                 │ Payment processor fee    £X.XX         │
│ Release rule: You approve delivery,    │ Total today              £XXX.XX       │
│ request revision, open dispute, or it  │                                        │
│ follows the agreed inactivity policy.  │ [Card / bank payment element]          │
│                                       │ [ ] I agree to the project terms       │
│ [View agreement PDF]                   │ [Fund £XXX.XX]                         │
├───────────────────────────────────────┴──────────────────────────────────────┤
│ You are not paying a SkillPage marketplace commission. Third-party payment    │
│ charges are shown above. Payment protection depends on payment method/region. │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-14 — Delivery Review (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Review delivery — Milestone 2: Build                                           │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ Seller delivery                        │ Milestone agreement                   │
│ "The workflow is live. Included…"     │ Amount: £1,400 funded                  │
│ [File] [Live link] [Repository]       │ Acceptance criteria:                    │
│ [Version history]                     │ • Data collection works                 │
│                                       │ • Dashboard deployed                    │
│ Your decision                          │ Deadline: 22 Sep                         │
│ [Approve and release payment]         │                                        │
│ [Request revision]                    │ Need help?                               │
│ [Propose scope/deadline change]       │ [Open a dispute]                         │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

#### WF-15 — Dispute Intake (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Open a dispute — Milestone 2: Build                         Step 1 of 3       │
├──────────────────────────────────────────────────────────────────────────────┤
│ What best describes the issue?                                                 │
│ ( ) Work does not meet agreed acceptance criteria                              │
│ ( ) Work was not delivered by the agreed date                                  │
│ ( ) Payment or funding issue                                                   │
│ ( ) Other                                                                    │
│                                                                              │
│ What outcome are you requesting?                                              │
│ ( ) Revision plan  ( ) Release payment  ( ) Refund  ( ) Split/other          │
│                                                                              │
│ Explain what happened (visible to the other party)                            │
│ [Textarea]                                                                    │
│                                                                              │
│ Evidence is automatically attached: agreement versions, timeline, messages,  │
│ deliverables. Add optional supporting files.                                  │
│ [Back] [Continue]                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-16 — Admin Operations Dashboard (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SkillPage Ops    Dashboard Users Jobs Disputes Payments Risk Support  [Admin] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Today                                                                    [↻]  │
│ [New users 124] [Active projects 87] [Open disputes 6] [Risk alerts 11]      │
│ [Payment exceptions 3] [Support SLA 92%]                                      │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ Priority queues                      │ Marketplace health                     │
│ • 6 disputes need assignment         │ [User activation trend chart]          │
│ • 11 high-risk reports               │ [Funded milestone completion chart]    │
│ • 3 payout exceptions                │ [Dispute rate chart]                   │
│ • 18 verification reviews            │                                        │
│ [Open triage queue]                  │                                        │
├──────────────────────────────────────┴───────────────────────────────────────┤
│ Integration status: Payments ✓ Email ✓ Search ✓ Storage ✓                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-17 — Admin Dispute Console (Desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Disputes  Case #DSP-1042  Open · High priority  Assigned: Unassigned       │
├───────────────────────┬────────────────────────────────┬─────────────────────┤
│ Case facts            │ Evidence timeline              │ Case actions        │
│ £1,400 milestone      │ 12 Sep: scope agreed           │ [Assign to me]      │
│ Buyer: Acme Ltd       │ 13 Sep: funded                 │ [Request response]  │
│ Seller: Alex Morgan   │ 22 Sep: delivery submitted     │ [Send mediation]    │
│ Request: Refund       │ 23 Sep: dispute opened         │                     │
│ SLA: 18h remaining    │ [Messages] [Files] [Versions]  │ Proposed outcome    │
│                       │                                  │ ( ) release seller  │
│ Internal notes        │                                  │ ( ) refund buyer    │
│ [Private note…]       │                                  │ ( ) split            │
│                       │                                  │ [Submit for approval]│
├───────────────────────┴────────────────────────────────┴─────────────────────┤
│ Immutable audit trail: all actions, communications and payment events         │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-18 — Agent Control Centre (Future Pro)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Your Work Agent                                      Plan: Pro                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Status: [Assist mode ▾]  ● Active          [Pause agent]                      │
│ Drafts and recommends. It will not send, hire, pay or change scope for you.   │
├───────────────────────────────┬──────────────────────────────────────────────┤
│ Permissions                   │ Recent activity                               │
│ ☑ Draft proposals             │ 10:14 — Drafted proposal for "Research…"     │
│ ☑ Suggest job matches         │          [Review] [Dismiss]                   │
│ ☐ Send messages automatically │ 09:30 — Flagged scope risk in Project Atlas   │
│ ☐ Submit proposals automatically│          [View rationale]                     │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ Guardrails                    │ Data and memory                               │
│ Max rate: £___                │ Connected: Profile, portfolio, projects       │
│ Working hours: ___            │ [Manage access] [Export memory] [Delete]      │
│ Default tone: Professional    │                                               │
│ [Save changes]                │                                               │
└───────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 7. Mobile Wireframe Rules

For 390 px mobile designs:

- Use a single primary action per viewport.
- Convert sidebars to drawers or segmented controls.
- Convert comparison tables into candidate cards with a fixed comparison tray.
- Preserve critical trust information near the top: verification, fee transparency, funded status, milestone due date and report/dispute controls.
- Use sticky bottom actions for Apply, Continue, Submit proposal, Fund, Deliver and Review.
- Project workspace mobile layout: top status bar → current milestone card → activity/messages tabs → fixed next action.
- Never hide dispute, report or payment-fee information behind obscure menus.

---

## 8. Wireframe Delivery Format

### 8.1 Figma File Structure

```text
00 Cover & principles
01 Sitemap & flows
02 Foundations (tokens, grids, type, icons)
03 Components (atoms, molecules, organisms)
04 Wireframes — Public
05 Wireframes — Seller
06 Wireframes — Buyer
07 Wireframes — Shared project & trust
08 Wireframes — Admin
09 Hi-fi UI — Public
10 Hi-fi UI — App
11 Prototypes
12 Research and annotations
```

### 8.2 Naming Convention

```text
[Area] / [Screen] / [State] / [Viewport]

Examples:
Public / Job detail / Open / Desktop
Seller / Proposal composer / Validation error / Mobile
Buyer / Fund milestone / Fee disclosed / Desktop
Admin / Dispute console / Evidence expanded / Desktop
```

### 8.3 Mandatory States Per Important Screen

Every critical screen must have at least:

- Default/loading state
- Happy-path populated state
- Empty/no-results state
- Error/validation state
- Permission/restricted state where relevant
- Mobile variation

Wireframes should establish hierarchy and flows before pixel polish; Figma's information-architecture guidance similarly treats wireframes as a way to test layouts and navigation before investing in high-detail UI. [web:170][web:178]

---

## 9. Priority Build Sequence

### Release 0 — Public SkillPage Builder

- Landing page
- Sign-up/authentication
- Seller onboarding
- Profile editor and public SkillPage
- Portfolio evidence and service cards
- Direct contact/request form

### Release 1 — Marketplace Core

- Buyer onboarding and company pages
- Jobs directory and job posting
- Seller job discovery and proposals
- Messaging
- Buyer proposal inbox, shortlist and candidate comparison
- Admin users/jobs/report queue

### Release 2 — Trust Transactions

- Project agreement and milestone workspace
- Payment-provider onboarding
- Funded-milestone payment experience
- Delivery review, revisions and change requests
- Reviews and reputation
- Disputes, payment operations and risk portal

### Release 3 — Pro Agents

- Seller/buyer Pro subscriptions
- Drafting, summaries, recommendations and reminders
- Agent Control Centre
- Audit, consent and guardrail systems
- No irreversible agent action without explicit governance and approval design

---

## 10. Acceptance Criteria

The architecture and wireframes are ready for visual design/development only when:

1. A seller can publish a credible page and submit a proposal in a tested flow.
2. A buyer can post a clear job, compare applicants and fund a defined milestone.
3. Both parties can see exactly what is agreed, funded, due and required next.
4. Every money-related UI shows third-party charges and the platform's £0 Free-plan fee before commitment.
5. A dispute can be opened, evidenced and resolved through a traceable admin path.
6. Admin functions are role-separated, auditable and safe for payment-affecting actions.
7. Mobile flows preserve trust, status and primary action clarity.
8. All key flows meet WCAG 2.2 AA requirements; WCAG 2.2 is an ISO/IEC 40500:2025 standard with W3C quick-reference resources for implementation review. [web:168][web:182]
9. Future AI screens retain human control, explainability, permissions, logs and immediate pause controls.

---

## 11. Immediate Next Step

Create the initial high-fidelity wireframe board from **WF-01 through WF-18**, then test four critical flows with real users before building:

1. Seller publishes profile and applies to a job.
2. Buyer posts a job and compares candidates.
3. Buyer funds and seller delivers a milestone.
4. Either party opens a dispute.

The best first prototype is not the whole marketplace. It is a functioning seller SkillPage, a buyer job post, a proposal, and one funded-milestone project workspace — because that is the smallest loop that proves SkillPage's trust proposition.
