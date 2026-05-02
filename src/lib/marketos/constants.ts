/**
 * MarketOS — small constants module.
 *
 * The demo org slug is the org served to anonymous public visitors.
 * Sourced from `NEXT_PUBLIC_MARKETOS_DEMO_ORG_SLUG` (see `.env.example`).
 * Falls back to `'nexus'` so local dev works even without an env file.
 */
export const DEMO_ORG_SLUG: string =
  process.env.NEXT_PUBLIC_MARKETOS_DEMO_ORG_SLUG ?? "nexus";
