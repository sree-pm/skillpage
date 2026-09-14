# SkillPage Portfolio: 90-95% Target Status

This branch treats Portfolio as an independent product module. Marketplace, projects, payments and reputation consume published portfolio state; they do not own the editor or portfolio document.

## Implemented on this branch

- Versioned `PortfolioDocument` schema in `@skillpage/portfolio-core`.
- Five visual directions: Minimal, Editorial, Studio, Professional, Bold.
- Reusable renderer separated from the editor.
- Visual Studio with content, design, structure and settings panels.
- HTML5 drag-and-drop section ordering.
- Add, hide/show, remove and variant selection for sections.
- Desktop, tablet and mobile preview modes.
- Undo/redo history.
- Local draft persistence with dirty/saved state.
- API save and publish integration with local fallback.
- Versioned D1 portfolio storage and explicit publish state.
- Public API endpoint for a published portfolio by handle.
- SEO title/description and visibility controls.
- Static-site import data model and isolated publishing boundary documentation.
- CI build/typecheck workflow added.
- Portfolio core document tests added.

## Deliberately not marked complete

- Public custom-domain runtime. The current Next.js app uses static export, so dynamic portfolio URLs should be served by a dedicated public edge renderer rather than forcing dynamic routes into the authenticated app.
- Full ZIP extraction/publishing runtime. The database/R2 contract exists, but safe archive parsing and isolated serving need to be integrated and tested as a separate deployment boundary.
- Rich structured content management for every content type. The current Studio establishes the editor shell; project/service/experience/testimonial CRUD needs the next editor pass.
- Image/media upload UX and asset transformation.
- Accessibility audit and automated Lighthouse/axe gates.
- Production auth/session hardening from the wider SkillPage audit.
- Real-money marketplace/payment implementation. Stripe Connect and project state machines remain separate modules.

## Quality rule

Do not call this production-ready merely because the UI looks complete. A 90-95% release candidate requires working persistence, public rendering, safe asset handling, rollback, automated tests, accessibility checks, observability and the security fixes identified in the wider SkillPage audit.
