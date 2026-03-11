# Thanachon Supasatian Portfolio

This repository contains a premium bilingual portfolio built with Next.js App
Router, TypeScript, TailwindCSS, and shadcn/ui. The site is designed as a
high-conversion narrative experience centered on first impression, attention
retention, and evidence-backed storytelling.

## Core Experience Goals

- Deliver clear professional positioning within the first 5 seconds.
- Show meaningful proof within the first 30 seconds.
- Support both English and Thai audiences with audience-appropriate messaging.
- Keep exploration inside the portfolio through deep dives, modals, and
  cross-linked evidence where appropriate.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- next-intl
- Framer Motion
- Google Analytics 4

## Getting Started

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Quality Expectations

- `npm run build` must succeed without errors.
- `npm run lint` must succeed before merge.
- Experience changes should be reviewed against performance, accessibility,
  bilingual quality, and the 60-second impact window.

## Architecture Notes

- App routes live under `src/app/`.
- Structured portfolio content lives in `src/data/`.
- Localized strings live in `messages/`.
- The timeline is a primary narrative surface, not just a résumé list.
- Supplemental detail should preserve reading context wherever possible.

## Deployment

The site deploys to Vercel. Static content should remain deterministic at build
time, while narrowly scoped server capabilities may be used where justified by
the implemented architecture.
