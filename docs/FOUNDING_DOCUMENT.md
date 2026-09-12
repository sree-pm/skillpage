# SkillPage — Founding Document

**Version:** 1.0  
**Date:** September 12, 2026  
**Status:** Pre-launch MVP

---

## Executive Summary

SkillPage is a **free, agentic-first marketplace for skill monetization** — enabling freelancers, part-time workers, and full-time remote employees to showcase their skills, find work, and get paid securely without platform fees. Unlike Fiverr (20% fees) or Upwork (0–15% + Connects), SkillPage charges **0% commission** — users pay only payment processing fees (Stripe: 1.5% + 20p) [web:57][web:59][web:115].

**Core value proposition:** Keep 98.5% of your earnings, not 75–80%.

**Launch strategy:** Free platform for both buyers and sellers, Stripe escrow for trust, AI agents as Pro tier monetization at 1,000+ users.

---

## Vision

### The Future of Work

Elon Musk's prediction: *"In the future, skill monetization will replace jobs for sake."* [User query]

SkillPage is the infrastructure for this future:
- **Every individual** has a personal skill page (myname.skillpage.io) — their skill is the product, not their time.
- **AI agents** handle commodity work (proposals, scoping, milestone tracking) — humans focus on judgment-driven tasks where they earn 34–44% more [web:46].
- **Agent-to-agent commerce** — buyer agents post jobs, seller agents bid, AI mediates delivery. Humans step in only for edge cases.
- **Portable reputation** — verifiable credentials (VCs) stored in R2/IPFS, exportable across platforms. Users own their data, not a marketplace [web:153].

### Long-Term North Star

> **Become the trust layer for the $4.8T freelance + remote work economy** — not a marketplace that extracts value, but infrastructure that enables value creation [web:43][web:48].

---

## Problem

### Core Pain Points (Validated by Data)

| Problem | Who Suffers | Data |
|---|---|---|
| **Punitive fees** | Sellers | Fiverr: 20% + 5.5% client fee; Upwork: 0–15% + Connects (~$0.15 each) — effective 23%+ total cost [web:57][web:59] |
| **Platform owns relationships** | Sellers | Can't email clients or take work off-platform without breaching ToS [web:50] |
| **Arbitrary bans** | Sellers | Sudden account closures with no appeal — 7-year, $500K earner banned overnight [web:51][web:61] |
| **Non-payment / ghosting** | Sellers | 58% of freelancers report non-payment or delayed payment at some point [web:141] |
| **Fraud / fake portfolios** | Buyers | No identity verification; stolen work common [web:163][web:167] |
| **Hard to choose reliable party** | Both | Reviews are easy to game; no verified credentials or portable reputation [web:165] |
| **Late payments / late delivery** | Both | Vague invoicing terms; no auto-release mechanism; no milestone tracking [web:150][web:152] |

### Market Trends

| Trend | Data | Implication |
|---|---|---|
| **Freelancing is growing** | Skilled-knowledge-worker freelance share: 28% → 38% in one year [web:36] | TAM expanding |
| **Marketplaces are shrinking** | Upwork lost ~47K active clients in a year (stock -56% YTD); Fiverr buyers -13.6% YoY [web:59] | Incumbents vulnerable |
| **AI is hollowing out commodity work** | Writing gigs -30%, dev gigs -21%, design -17% within 8 months of ChatGPT [web:45] | Need AI agents, not just UI |
| **AI-skilled freelancers earn premium** | AI-literate freelancers earn 44% more; non-AI writers lost 30% of rates [web:46] | AI agents = differentiation |
| **Corporate spend on marketplaces falling** | 0.66% → 0.14% of total spend (2021–2025); AI model spend rose to ~3% [web:46] | Shift to direct hiring |

---

## Solution

### Core Principles

| Principle | How It Manifests |
|---|---|
| **0% commission, usage-based only** | Pay for compute/storage (Cloudflare), not a percentage of earnings — undercuts Fiverr 13x [web:115] |
| **Self-hostable, open-core** | MIT/AGPL core — anyone can deploy; no one can ban you from your own instance |
| **Agent-first, human-second** | AI agents handle 80% of work (proposals, scoping, tracking); humans handle judgment calls |
| **Portable reputation** | Verifiable credentials (VCs) stored in R2/IPFS — exportable to any platform [web:153] |
| **Proof-of-work, not claims** | AI auto-generates skill pages from GitHub, LinkedIn, Cal.com — evidence, not assertions |

### Product Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HUMAN LAYER (UI)                             │
│  Skill Page (HTML) │ Dashboard │ Agent Chat │ Dispute Console  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   AGENT LAYER (AI Twins) — Phase 2+             │
│  Freelancer Agent: scopes, quotes, delivers, learns            │
│  Client Agent: posts jobs, evaluates bids, manages escrow      │
│  Matchmaking Agent: routes jobs to best-fit agents             │
│  Dispute Agent: mediates conflicts with evidence               │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                 REPUTATION & IDENTITY LAYER                     │
│  Verifiable Credentials (VCs) │ Portable Reviews │ On-chain    │
│  Proof-of-work attestations (GitHub commits, deployed code)    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                 MARKETPLACE & PAYMENT LAYER                     │
│  Escrow (Stripe) │ Dispute resolution │ 0% commission           │
│  Pay only for infra (active users, compute, storage)           │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER (Cloudflare)               │
│  Workers (compute) │ Durable Objects (state) │ R2 (storage)    │
│  One-command deploy │ Self-hostable │ Open-core (MIT)          │
└─────────────────────────────────────────────────────────────────┘
```

### MVP Feature Set (Launch)

| Feature | Priority | Why Essential |
|---|---|---|
| **User profiles + subdomains** (myname.skillpage.io) | P0 | Solves "I couldn't ship a portfolio for 5 years" [web:133] |
| **Job/project postings** (free, unlimited) | P0 | Liquidity — buyers post, sellers apply |
| **Stripe escrow + milestone payments** (30/30/30/10) | P0 | Solves non-payment/ghosting — 68% more retention with escrow [web:147] |
| **Dispute resolution** (manual, support ticket) | P0 | Trust layer — process for conflicts |
| **Reviews + ratings** (post-project) | P1 | Social proof — helps buyers choose [web:167] |
| **Basic search/filter** (skill, rate, location) | P1 | Discoverability |
| **Email notifications** (milestone funded/delivered/approved) | P1 | UX — keep parties in loop |
| **KYC verification** (optional badge) | P2 | Fraud prevention [web:163][web:166] |
| **Portfolio authenticity check** (manual) | P2 | Trust — catch stolen work [web:167] |

### Phase 2+ Features (Monetization)

| Feature | Pricing | Target |
|---|---|---|
| **Seller Pro** (AI agents for proposals, scoping, tracking) | $20/mo | 10–20% of active sellers |
| **Buyer Pro** (AI hiring, team seats, analytics) | $50/mo | 5–10% of active buyers |
| **Enterprise** (SSO, custom workflows, dedicated support) | £99– £299/mo | 1–2% of buyers |

---

## Business Model

### Revenue Streams

| Stream | Phase | Pricing | Unit Economics |
|---|---|---|---|
| **Payment partner fees** (Stripe, Wise) | Phase 1 | 0.25–0.5% of volume [web:115][web:112] | £100k/mo volume = £250– £500/mo |
| **Seller Pro** | Phase 2 | $20/mo | 1,000 sellers = $20k/mo |
| **Buyer Pro** | Phase 3 | $50/mo | 100 buyers = $5k/mo |
| **Enterprise** | Phase 4 | £99– £299/mo | 10 teams = £1k– £3k/mo |

### Unit Economics (Phase 2: 1,000 sellers, 100 buyers)

| Metric | Value |
|---|---|
| **Revenue** | $20k (Seller Pro) + $5k (Buyer Pro) + $0.5k (partner fees) = $25.5k/mo |
| **Infra cost** (Cloudflare) | ~$300/mo (Workers, Durable Objects, R2) |
| **Support cost** | ~$1k/mo (1 FTE) |
| **Margin** | ~96% |

### Pricing vs Competitors

| Platform | Seller Cost (on £1,000 project) | Buyer Cost | Total Cost |
|---|---|---|---|
| **Fiverr** | 20% (£200) | 5.5% (£55) | £255 (25.5%) [web:57] |
| **Upwork** | 10% (£100) + Connects (~ £10) | 5% (£50) | £160 (16%) [web:57][web:59] |
| **Contra (free)** | 0% | $2–$29 (~ £2– £23) [web:130][web:136] | £2– £23 |
| **SkillPage (free)** | 0% + Stripe (1.5% + 20p = £15.20) | 0% + Stripe (same) | £15.20 (1.52%) |
| **SkillPage (Pro)** | $20/mo + Stripe | $0 (free) or $50/mo (Pro) | Varies |

**Pitch:** "Keep 98.5% of your earnings — not 75–80%."

---

## Go-to-Market Strategy

### Phase 1 (0–6 months): Liquidity First

| Goal | Tactic | Metric |
|---|---|---|
| **1,000 active users** | Free platform, Stripe escrow, 0% fees | Signups, active projects |
| **Product Hunt launch** | Week 9–12, "Fiverr killer: 0% fees" [web:83] | 500+ upvotes, 200 signups |
| **Content marketing** | SEO: "0% commission freelance platform", "Stripe escrow alternative" | Organic traffic |
| **Referral program** | "Invite 3 friends, get 1 month Pro free" | Viral coefficient >1.0 |

### Phase 2 (6–12 months): Monetization

| Goal | Tactic | Metric |
|---|---|---|
| **10% Seller Pro conversion** | AI agents for proposals, milestone tracking | $20k/mo ARR |
| **5% Buyer Pro conversion** | AI hiring, team seats, analytics | $5k/mo ARR |
| **Enterprise pilots** | 3–5 teams @ £149/mo | £500– £750/mo ARR |

### Phase 3 (12–24 months): Scale

| Goal | Tactic | Metric |
|---|---|---|
| **10,000 active users** | Paid ads (Google, LinkedIn), partnerships | 10x growth |
| **International expansion** | Regional pricing (₹1,500/mo India, R200/mo SA) | 30% non-UK users |
| **AI agent marketplace** | Third-party agents (Figma-to-code, SEO audit) | 10+ agents, revenue share |

---

## Competitive Landscape

| Competitor | Model | Weakness | Your Advantage |
|---|---|---|---|
| **Fiverr** | 20% + 5.5% fees [web:57] | Punitive fees, race to bottom | 0% fees, AI agents |
| **Upwork** | 0–15% + Connects [web:59] | Bans for off-platform contact | Self-hostable, no bans |
| **Contra** | 0% commission, $29/mo Pro [web:130] | No AI agents, no escrow | AI agents, Stripe escrow |
| **Stan Store** | $29–$99/mo, no free plan [web:125][web:135] | Creator storefronts, not freelance | Free core, freelance focus |
| **LinkedIn** | Free job posts, no escrow [web:165] | No trust layer, no payments | Escrow, dispute resolution |
| **Deel/Remote.com** | Payroll for full-time | No freelance/project support | All work types (freelance, part-time, full-time) |

---

## Moat (Why Uncopyable)

| Moat Type | How It's Built | Why Hard to Copy |
|---|---|---|
| **Agent reputation graph** | Every interaction signed as VC — portable across instances [web:153] | Network effects — can't fork without losing history |
| **Proof-of-work verification** | AI verifies deliverables (GitHub commits, deployed URLs) [web:167] | Data moat — incumbents can't retroactively verify past work |
| **Open-core + self-hostable** | MIT/AGPL core — anyone can deploy [web:97][web:101] | Community trust — can't ban users from their own data |
| **Usage-based pricing** | Charge for infra (active users, compute), not earnings [web:115] | Structural cost advantage — 0% commission undercuts all |
| **AI-native UX** | Skill pages auto-generated from digital exhaust [web:133] | UX moat — incumbents are UI-first, agent-second |

---

## 90-Day Launch Plan

| Week | Milestone | Owner |
|---|---|---|
| **1–4** | Build MVP (profiles, job posts, Stripe escrow, disputes) | Engineering |
| **5–8** | Beta test (50 sellers + 20 buyers — friends, network) | Product + Community |
| **9–12** | Public launch (Product Hunt, Twitter, LinkedIn, Reddit r/forhire) [web:83] | Marketing |
| **13–24** | Grow to 1,000 users (content, SEO, referrals) | Growth |
| **25+** | Introduce Seller Pro ($20/mo with AI agents) | Product + Engineering |

### Key Metrics (First 90 Days)

| Metric | Target |
|---|---|
| **Signups** | 500 (sellers + buyers) |
| **Active projects** | 100 (funded escrow) |
| **Completed projects** | 50 (milestone paid out) |
| **NPS** | 50+ (measure trust, ease of use) |
| **Churn** | <5% (free tier, so low expected) |

---

## Financial Projections

| Phase | Timeline | Users | Revenue | Infra Cost | Margin |
|---|---|---|---|---|---|
| **Phase 1 (Launch)** | 0–6 mo | 1,000 | $0 (free) + $0.5k (partner fees) | $50/mo | ~90% |
| **Phase 2 (Monetize)** | 6–12 mo | 5,000 | $25k/mo (Pro tiers) + $1k (partner) | $300/mo | ~96% |
| **Phase 3 (Scale)** | 12–24 mo | 10,000 | $225k/mo (Pro + Enterprise) + $5k (partner) | $2k/mo | ~99% |

**Assumptions:**
- 10% Seller Pro conversion (500/5,000 sellers @ $20/mo = $10k/mo)
- 5% Buyer Pro conversion (250/5,000 buyers @ $50/mo = $12.5k/mo)
- 1% Enterprise (50/5,000 buyers @ £149/mo = £7.5k/mo ~ $9.5k/mo)
- Stripe partner fees: 0.5% of $1M/mo volume = $5k/mo

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **No revenue at launch** | High (by design) | Medium | Keep infra costs near-zero (Cloudflare free tiers); monetize at 1k users |
| **Stripe partner fees < expectations** | High | Low | Don't rely on this — bonus revenue, not core |
| **Fraud/scams without AI** | Medium | High | Manual review for first 100 disputes; add AI verification at Phase 2 [web:167] |
| **Users skip escrow (direct payments)** | Medium | High | Make escrow default flow; educate on benefits (68% more retention) [web:147] |
| **Competitor copies (Contra adds escrow)** | Low | Medium | Moat is speed + community — ship fast, build brand loyalty |
| **Buyer Pro converts <5%** | Medium | Medium | Keep core free; Pro is for power users only [web:136] |
| **Price sensitivity in emerging markets** | High | Medium | Regional pricing (₹1,500/mo India, R200/mo SA) |

---

## Appendix: Key Data Sources

| Topic | Source |
|---|---|
| **Fiverr/Upwork fees** | [web:57][web:59] |
| **Freelance market size** | [web:41][web:43][web:48] |
| **Escrow effectiveness** | [web:147] |
| **Milestone best practices** | [web:140][web:142][web:149][web:152] |
| **AI agent marketplaces** | [web:95][web:96][web:99][web:153][web:156][web:160] |
| **Competitor pricing** | [web:125][web:130][web:135][web:136] |
| **Payment gateway fees** | [web:112][web:115][web:117][web:118] |
| **Verification best practices** | [web:163][web:166][web:167] |

---

## Next Steps

1. **Build MVP** (Weeks 1–4): Profiles, job posts, Stripe escrow, disputes.
2. **Beta test** (Weeks 5–8): 50 sellers + 20 buyers — iterate on UX.
3. **Launch** (Weeks 9–12): Product Hunt, social, Reddit — aim for 500 signups.
4. **Grow** (Weeks 13–24): Content, SEO, referrals — reach 1,000 users.
5. **Monetize** (Week 25+): Seller Pro ($20/mo with AI agents).

**Founding principle:** *Infrastructure, not a marketplace. Enable value creation, don't extract it.*
