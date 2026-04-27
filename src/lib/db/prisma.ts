/**
 * Shared Prisma client for the Nexus monorepo.
 *
 * Used by both Praxis (going forward) and MarketOS (from day 1) for any
 * Postgres access that should benefit from generated types and a single
 * pooled connection. Auth still flows through `@supabase/ssr`; only the
 * database layer is unified.
 *
 * Why the global cache? Next.js dev mode HMR re-evaluates modules on
 * every change, which would otherwise leak `PrismaClient` instances
 * (and their connection pools) until the dev server is restarted. The
 * `global as unknown as { ... }` pattern is the canonical Next.js +
 * Prisma workaround.
 *
 * Production:
 *   - The runtime uses `DATABASE_URL` (the *pooled* PgBouncer URL on
 *     port 6543, with `?pgbouncer=true&connection_limit=1`).
 *   - Migrations use `DIRECT_URL` (port 5432) — Prisma reads it from
 *     `prisma/schema.prisma`'s `datasource.directUrl`.
 *
 * Authorization model:
 *   - This client is privileged (bypasses Postgres RLS). Every server
 *     action / query must enforce auth in application code before
 *     touching it. See `src/lib/marketos/auth.ts` for the helpers.
 *   - For paths that *require* RLS (anonymous reads against praxis
 *     tables — currently none), use the existing Supabase JS client
 *     instead.
 *
 * Server-only: importing this from a client component will fail at
 * build time thanks to `'server-only'`.
 */
import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
