# Nexus OS & Praxis Learning Platform

**Nexus** is the unified digital infrastructure and universal portfolio. It is the evolution of `thanachon.me` from a static historical resume into a living, high-performance staging ground for all active software ventures, systems, and experiments. Think of it as the core "operating system" of the digital presence.

**Praxis** is an AI-powered personalized learning platform, initially designed to help with sales training, and is one of the primary sub-projects housed within this architecture.

## The Architecture: OS vs. Application

* **The OS (Nexus):** Nexus provides the overarching shell, global navigation, and core layout. It owns the root domain (`thanachon.me`), handling the global identity and portfolio index.
* **The Application (Praxis):** Praxis is a specific "app" running on that system. It lives one layer down, operating exclusively within the `/learn` route directory (`thanachon.me/learn`).
* **Shared Infrastructure:** Praxis is built to completely leverage Nexus's technical foundation. Instead of spinning up a new repository, Vercel project, and component library for every new idea, Praxis uses the exact same Next.js 15 App Router, Tailwind v4 configuration, and Claude API routing that Nexus already provides.
* **Design System Synergy:** Nexus provides the unopinionated "Liquid Glass" design primitives—the rigid layout grids, the monospace system tags, and the high-contrast monochromatic base. Praxis inherits this strict geometry but applies its own domain-specific layer on top, such as conversational AI UI components, template download cards, and specific accent colors to guide the learner's experience.

In short, Nexus is the structural grid built to explore ideas efficiently, and Praxis is the first major proof-of-concept proving that this unified architecture works.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS v4
- shadcn/ui
- next-intl
- Framer Motion
- Claude API (for Praxis intelligence)
- PostgreSQL & Prisma (via Supabase)

## Getting Started

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Core Experience Goals

- Deliver a high-performance staging ground for active software ventures.
- Provide a clear, unopinionated design primitive (Nexus) that applications (like Praxis) can build upon.
- Ensure seamless global navigation while allowing domain-specific experiences to flourish.
- Keep exploration inside the portfolio through deep dives, and cross-linked evidence where appropriate.

## Quality Expectations

- `npm run build` must succeed without errors.
- `npm run lint` must succeed before merge.
- Experience changes should be reviewed against performance, accessibility, bilingual quality, and the core structural grid guidelines.

## Architecture Notes

- App routes live under `src/app/`.
- `src/app/(nexus)/` can be conceptualized as the OS core, whereas `src/app/learn/` holds the Praxis application.
- Global styling is managed in `src/styles/globals.css`, while Praxis-specific overrides and design system additions live in `src/styles/praxis.css`.
- Localized strings live in `messages/`.

## Deployment

The site deploys to Vercel. Static content should remain deterministic at build time, while narrowly scoped server capabilities may be used where justified by the implemented architecture.
