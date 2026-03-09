---
description: "Task list for Cycle 2: Bilingual Portfolio"
---

# Tasks: Bilingual Portfolio (Cycle 2)

**Input**: Design documents from `/specs/002-bilingual-portfolio/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/architecture.md, quickstart.md

**Organization**: Tasks are grouped by logical phased implementation blocks representing Cycle 2 new additions. Cycle 1 tasks (T001–T082) are complete and not duplicated here.

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Can run in parallel with other `[P]` tasks in the block
- **Story IDs Map**: 
  - `[US1]` - 5-Second Impression (Hero)
  - `[US2]` - Vertical Narrative Timeline
  - `[US3]` - Centralized Portfolio Showcase (Modal)
  - `[US4]` - Bilingual Toggle Support
  - `[US5]` - Structured Direct Contact

---

## Phase A: CYCLE 2 INFRASTRUCTURE (blocks everything in this cycle)

**Purpose**: Setup Vercel hosting, next-intl, Airtable integration, and GA4 tracking base.

- [x] A001 Remove Netlify config, migrate to Vercel
  - Remove `netlify.toml` and any `@netlify/*` packages from `package.json`.
  - Remove `output: 'export'` from `next.config.ts`.
  - Create `vercel.json` with security headers + cache headers per plan.
  - Update `README.md` deployment section.
- [x] A002 [P] Install Cycle 2 dependencies via `package.json`
  - `npm install next-intl resend tsx`
  - `npm install -D @types/gtag.js`
- [x] A003 Configure next-intl middleware in `src/middleware.ts`
  - Support locales: `['en', 'th']`, default: `'en'`, matcher ignores `/_next`, `/api`.
- [x] A004 Configure next-intl in `next.config.ts`
  - Wrap config with `withNextIntl()`. Verify build compiles.
- [x] A005 [P] Migrate `app/` to `[locale]` routing
  - Rename `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`.
  - Move `page.tsx`, `about/`, `contact/`, `projects/` into `src/app/[locale]/`.
  - Create new root `src/app/layout.tsx` (minimal html/body).
- [x] A006 [P] Add Sarabun Thai font in `src/lib/fonts.ts`
  - Setup Sarabun Google Font (subsets/weights). Apply to `[locale]/layout.tsx` and `globals.css` when `lang="th"`.
- [x] A007 [P] Create `messages/en.json` — complete EN string file
  - Define `nav.*`, `hero.*`, `timeline.*`, `projects.*`, `skills.*`, etc., from content canvas.
- [x] A008 [P] Create `messages/th.json` — complete TH string file
  - Mirror `en.json` exactly with Thai translations mapping canvas.
- [x] A009 [P] Write `scripts/fetch-airtable.ts` — Airtable prebuild fetcher
  - Fetch tables, write to `src/data/generated/values.ts` and `reflections.ts`. Wrap in gracefully failing `try/catch`. Add `"prebuild"` to `package.json`. Add to `.gitignore`.
- [x] A010 [P] Update all data files with bilingual fields in `src/data/`
  - Timeline, projects, skills, testimonials, value propositions fields updated (e.g., `titleEn`, `titleTh`). Create `src/data/timelineChapters.ts`.
- [x] A011 [P] Add new TypeScript types for Cycle 2 in `src/types/`
  - Update `modal.ts`, `timeline.ts`, and adapt existing types for bilingual fields.
- [x] A012 Update `src/lib/analytics.ts` — complete event system
  - Map typed GA4 constants, define `trackEvent()`, `trackTimeOnPage()`, scroll depths, section visibility trackers.
- [x] A013 [P] Write `src/hooks/useModal.ts` and `src/components/modal/ModalContext.tsx`
  - Implement Provider state (`isOpen`, `payload`). Tie to MODAL_OPEN and MODAL_CLOSE GA4 events. Add wrapper to `[locale]/layout.tsx`.
- [x] A014 [P] Write `src/hooks/useHashModal.ts` — hash URL sync
  - Read `window.location.hash` to trigger `open()`, write mapping state, and add `popstate` listeners.

---

## Phase B: MODAL SYSTEM (blocks Phase D and E)

**Purpose**: Implement full-screen localized modal popovers (`[US3]`).

- [x] B001 [US3] Build `src/components/modal/Modal.tsx` — centralized modal shell
  - Use shadcn Dialog with custom override (`z-[200]`, backdrop blur). Add focus trap, Escape closure, Framer Motion fade-up.
- [x] B002 [P] [US3] Build `src/components/modal/content/ProjectModal.tsx`
  - Consume project slug. Layout: Hero image, badges, problem/approach localized descriptions, Swiper gallery, GitHub/live links. Track `MODAL_SCROLL_DEPTH`.
- [x] B003 [P] [US3] Build `src/components/modal/content/TimelineModal.tsx`
  - Consume event id. Layout: localized description/impact, related skills. Cross-trigger to `ProjectModal` on related thumbnails.
- [x] B004 [P] [US3] Build `src/components/modal/content/CertificateModal.tsx`
  - Consume certificate id. Layout: badge image, issuer, localized verification info.
- [x] B005 [P] [US3] Build `src/components/modal/content/TestimonialModal.tsx`
  - Consume testimonial id. Layout: localized quote, author name/role, and avatar.

---

## Phase C: LOCALIZATION COMPONENTS (blocks Phase D)

**Purpose**: Wire translation and switching mechanics (`[US4]`).

- [x] C001 [P] [US4] Build `src/components/layout/LanguageToggle.tsx`
  - Client component calling `router.replace()` + cookie setup. Fire `LANGUAGE_TOGGLE` event.
- [x] C002 [P] [US4] Update `src/components/layout/Navbar.tsx`
  - Inject `LanguageToggle`. Replace hardcoded strings with `useTranslations()`.
- [x] C003 [P] [US4] Build `src/components/shared/LocalizedText.tsx`
  - Yields correct field string relying on `useLocale()`. Handles edge-case fallbacks.
- [x] C004 [P] [US4] Update `src/app/[locale]/layout.tsx` for Thai typography
  - Push `'font-sarabun leading-loose'` to body when `locale === 'th'`. Set html `lang`.
- [x] C005 [P] [US4] Add locale-aware metadata to all pages in `src/app/[locale]/`
  - Update `generateMetadata` on `page.tsx`, `about/page.tsx`, `contact/page.tsx`, `projects/page.tsx`. Use `hreflang` alternate links mapping EN/TH OG images.

---

## Phase D: TIMELINE REBUILD — VERTICAL SCROLL NARRATIVE

**Purpose**: The primary apple-tier narrative component (`[US2]`).
*(Depends on: A010, A011, B001, C003)*

- [x] D001 [P] [US2] Build `src/components/timeline/TimelineSpine.tsx`
  - Build fixed left-side progress indicator mapping chapter waypoints tracking `scrollYProgress` using Framer Motion. Hide on mobile.
- [x] D002 [P] [US2] Build `src/components/timeline/ChapterBreak.tsx`
  - Setup full-viewport component. Render muted chapter number, localized title, background opacity gradients. Trigger `TIMELINE_SCENE_ENTER`.
- [x] D003 [P] [US2] Build `src/components/timeline/EventScene.tsx`
  - Create two-column desktop layout (content / abstract SVG art). Alternate left/right based on index. Trigger Intersection Observer reveals + `TIMELINE_SCENE_ENTER`. Bind "Deep Dive →" to `useModal()`.
- [x] D004 [US2] Build `src/components/timeline/TimelineSection.tsx` — orchestrator
  - Read fetched data to interleave `ChapterBreak` with `EventScene`. Monitor active chapters for spine injection.
- [x] D005 [US2] Replace Timeline import in `src/app/[locale]/page.tsx`
  - Purge legacy timeline blocks, map new orchestrator layout. Ensure deep dives correctly pop to modal views.

---

## Phase E: PROJECT SYSTEM UPDATE

**Purpose**: Adapt projects into the centralized modal-centric architecture.
*(Depends on: A010, B001, B002)*

- [ ] E001 [US3] Update `src/components/projects/ProjectCard.tsx`
  - Switch native link routes to `useModal().open()`. Hook up layoutId mapping for Framer Motion shared transitions. Handle tracking events. Use `LocalizedText`.
- [ ] E002 [P] [US3] Update `src/components/sections/Projects.tsx`
  - Wire up `PROJECT_FILTER_CHANGE` event integration and rewrite headers.
- [ ] E003 [US3] Update `src/app/[locale]/projects/[slug]/page.tsx`
  - Maintain page strictly for explicit SEO links. Inject JSON-LD structured schema. Re-use `ProjectDetailContent`.

---

## Phase F: ANALYTICS INSTRUMENTATION

**Purpose**: Wire deep behavioral tracking explicitly mapped in Spec.

- [ ] F001 Add scroll depth + time tracking to `src/app/[locale]/layout.tsx`
  - Add standard `setTimeout` metrics (30s, 60s...) and `SCROLL_DEPTH` intersection mappings via a dedicated client `<Analytics/>`.
- [ ] F002 [P] Add `SECTION_VISIBLE` tracking to all sections
  - Push GA tracking parameters explicitly to `src/components/shared/ScrollReveal.tsx`.
- [ ] F003 [P] [US1] Add `HERO_CTA_CLICK` tracking to `src/components/sections/Hero.tsx`
  - Map specific intents targeting Hero CTAs and Navigation resumes natively.
- [ ] F004 [US2] Add `TIMELINE_PROGRESS` tracking to `src/components/timeline/TimelineSection.tsx`
  - Compute active intersections mapping to 25%, 50%, etc., using `scrollYProgress`.
- [ ] F005 [P] Verify GA4 receives all events via `docs/GA4_SETUP.md`
  - Create documentation referencing custom schema metrics (lang, theme) expected via external integrations manually.

---

## Phase G: CONTENT & IMAGES

**Purpose**: Fill data structures with provided values and placeholder art.

- [ ] G001 [P] Create styled placeholder images for all 6 projects
  - Build `scripts/generate-placeholders.ts` (using `sharp` or `canvas`) outputting gradient localized artwork to `public/images/projects/[slug]`.
- [ ] G002 [P] Create OG images for EN and TH
  - Emit `public/images/og-default.webp` and `public/images/og-th.webp`.
- [ ] G003 [P] Populate complete bilingual content in all data files
  - Fill `src/data/` items precisely aligning against provided specification matrices. Comment TODOs onto fake data blocks explicitly.
- [ ] G004 [P] Add About page bilingual content
  - Update `src/app/[locale]/about/page.tsx` applying full bio translations. Hydrate "What I Stand For" via injected value mappings.

---

## Phase H: FINAL POLISH & LAUNCH READINESS

**Purpose**: Execute rigid completion testing targets ensuring high-conversion outcomes.

- [ ] H001 Comprehensive dark mode audit (both locales)
  - Verify visibility, contrast, and suppress theme flicker hydration hydration in components.
- [ ] H002 [P] Mobile QA pass (both locales, both themes)
  - Validate touch targets on iPhone Safari, Android Chrome. Verify full screen modals and unconstrained localized text.
- [ ] H003 Performance audit + optimization
  - Resolve Lighthouse CI targets on Desktop (100) / Mobile (95). Add mandatory sizes to `next/image`, verify font preload mechanics.
- [ ] H004 [P] Accessibility audit
  - Map axe DevTools testing. Confirm modal traps, Escape closures, contrast ratios.
- [ ] H005 [P] Update `README.md` — Cycle 2 complete rewrite
  - Ensure updated Tech Stack, Deployment commands, Custom Dimensions, i18n instructions logic are all explicitly listed.
- [ ] H006 Set Vercel environment variables
  - Commit live vars for `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `AIRTABLE_PROXY_URL` in the provider portal.
- [ ] H007 Configure custom domain on Vercel
  - Final SSL, DNS, and `www` mapping validations executed cleanly on Vercel dashboard locking URLs mapping correctly natively.

---

## EXECUTION STRATEGY

### Milestone 1: Structural Integrity (Phase A -> C)
Deploy Vercel, setup routing locale intercepts, and lock Modal triggers in isolation.
*(MVP Checkpoint: Multi-lingual rendering and blank modal execution functions natively).*

### Milestone 2: Product Showcasing (Phase D -> E)
Interleave timeline and projects into the visual scroll hierarchy.
*(MVP Checkpoint: Core project logic works entirely using Apple-target scroll reveals).*

### Milestone 3: Data & Deployment (Phase F -> H)
Implement tracking, hydrate final image assets, evaluate rigid checks, and commit domain configs.
*(MVP Checkpoint: Launch asset ready).*
