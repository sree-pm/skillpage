# SkillPage Portfolio Architecture

## Goal

Make the professional portfolio a standalone SkillPage module that can evolve independently of Marketplace, Projects, Payments, Reputation, and Admin.

## Module boundaries

- `portfolio-core`: canonical portfolio content schema, page sections, themes, validation and versioning.
- `portfolio-editor`: browser editing experience. It owns editor state only and talks to portfolio-core contracts.
- `portfolio-renderer`: renders a published portfolio from a versioned document. It must not depend on marketplace state.
- `site-publishing`: publication, asset handling, domains, revisions and deployment status.
- `site-import`: later HTML/CSS/JS/ZIP ingestion. Imported sites are an isolated publishing mode and never execute inside the dashboard origin.
- `marketplace`: consumes published portfolio/profile data but does not own portfolio content.
- `projects`: contracts, milestones, deliverables and disputes.
- `payments`: Stripe Connect and payment state.

## Data ownership

Portfolio owns profile, services, projects, experience, testimonials, skills, page documents, themes and published versions. Marketplace owns jobs and proposals. Projects owns project contracts and milestones. Payments owns payment records and provider references.

Cross-module communication should use stable service contracts and domain events rather than direct table coupling.

## Page document

A page is represented as a versioned JSON document. Content is separate from presentation. A document contains ordered section nodes, section variants, and theme configuration. The same content can therefore be rendered by multiple themes without migration.

Example sources:

- `visual`: created by the SkillPage builder.
- `generated`: created from structured content by an AI-assisted workflow.
- `uploaded_static`: imported HTML/CSS/JS that has passed the publishing validation pipeline.

## Publishing security

Uploaded code must never execute in the authenticated application origin. Static imports will eventually be published under an isolated origin/domain boundary. Server-side builds, if added later, must run in a sandboxed build environment with explicit package/network limits. V1 supports static HTML/CSS/JS/assets only.

## Builder philosophy

SkillPage is not a general-purpose pixel editor. It is a constrained professional portfolio builder. Users can reorder sections, choose approved layout variants, edit content, change themes and adjust a small set of design controls. The renderer remains responsible for design quality, responsive behaviour and accessibility.

## Initial themes

- Minimal: restrained, typography-led, generous whitespace.
- Editorial: sophisticated typography and magazine-like hierarchy.
- Studio: project-first visual portfolio.
- Professional: structured and credible for consultants, PMs, developers and specialists.
- Bold: expressive typography and stronger visual personality.

## Future compatibility

The editor and renderer must only depend on the portfolio-core document contract. This allows the page builder implementation, hosting implementation, marketplace, and AI generation system to change independently.
