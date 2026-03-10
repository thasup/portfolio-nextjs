# Research: Bilingual Portfolio

**Branch**: `002-bilingual-portfolio` | **Date**: 2026-03-08 | **Context**: [plan.md](./plan.md)

## Summary of Findings

The research phase effectively resolved architectural ambiguity, integrating the localization and performance requirements defined in the `spec.md` directly.

### Topic 1: Static Data Governance

**Decision**: Maintain all structured content as checked-in TypeScript dictionaries inside `src/data/`.
**Rationale**: Guarantees deterministic builds, removes dependency on external proxies or API failures, and keeps the portfolio resilient when offline.
**Alternative Considered**: Runtime or prebuild fetches from third-party sources, which would reintroduce brittle network hops and break the "always-static" constraint.

### Topic 2: Dual-Language Routing Structure (`next-intl`)

**Decision**: Adopt **Strategy B**, mapping the default EN audience to the root directory `/[slug]` and TH visitors to `/th/[slug]`.
**Rationale**: Cleanest SEO architecture. A large portion of international technical recruiters expect `/[page]` URLs natively in English. A designated `/en/` branch is an annoyance for native audiences, whereas `/th/` explicitly clarifies locale variation without affecting English link structures.
**Alternative Considered**: Route prefix generation encompassing both locales (`/en/...` vs `/th/...`) heavily impacted back-link maintenance and global SEO routing patterns previously established.

### Topic 3: Vertical Scroll Story Mechanics

**Decision**: Use an Intersection Observer (CSS basis) coupled with Framer Motion exclusively for the progress timeline spine (Hybrid Approach).
**Rationale**: Yields a ~100 Lighthouse performance impact because pure CSS transforms manage massive 80vh scroll frames (minimizing main-thread layout recalculations). Framer Motion computes purely the tiny progress ticker and its localized variables via `useScroll` + `useSpring`.
**Alternative Considered**: Full `useScroll` binding everywhere via Framer. Rejected because mapping 15 individual scene intersections through JS listeners risks scroll jank on mid-tier mobile devices.

### Topic 4: Central Modal Deep-Links

**Decision**: Manipulate `#project-[slug]` via standard native anchor strings and the `popstate` / `hashchange` browser APIs directly.
**Rationale**: Ensures hardware "Back" navigation closes the modal instantly. Completely circumvents the complex `<Suspense>` wrapper bugs endemic to `useSearchParams()` querying with Next 15's static compiler constraints (`generateStaticParams`).
**Alternative Considered**: Intercepting or Parallel routes. Thrown out strictly because they implicitly demand a server runtime renderer (non-compatible with static generation logic optimization across the vast majority of files).

### Topic 5: Vercel Hybrid Static Strategy

**Decision**: Completely purge the explicit `output: 'export'` variable constraint in `next.config.ts`, returning responsibility to Vercel's hybrid system.
**Rationale**: API routes run via Vercel Edge/Serverless functions (`/api/contact`), thus the pure Export constraint throws build compiler errors. Omitting `export` enables pre-rendering without stripping serverless.
**Alternative Considered**: Migrating from Netlify Forms without a serverless capability. Resend integration demanded an outbound post structure that couldn't be natively handled inside standard static HTML attribute limits securely.
