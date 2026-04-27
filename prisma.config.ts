/**
 * Prisma config — replaces the deprecated `package.json#prisma` block.
 *
 * Why this file exists:
 *   1. Prisma 6.19 + 7 deprecated `package.json#prisma` for config. The
 *      file moved here.
 *   2. Prisma CLI auto-loads `.env` only. This project follows the Next.js
 *      convention of `.env.local` for secrets, so we explicitly load it
 *      below before `defineConfig` is evaluated.
 *
 * Order of env loading (first wins, no override):
 *   .env.local    →  developer secrets, gitignored
 *   .env          →  shared defaults, optional, may be committed
 *
 * Once both files are loaded, `process.env` holds DATABASE_URL +
 * DIRECT_URL, and the `env(...)` calls inside `prisma/schema.prisma`
 * resolve correctly.
 */
import { config as loadEnv } from 'dotenv';
import path from 'node:path';

import { defineConfig } from 'prisma/config';

loadEnv({ path: path.resolve(process.cwd(), '.env.local'), override: false });
loadEnv({ path: path.resolve(process.cwd(), '.env'),       override: false });

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
});
