/**
 * Standalone Vitest config for PRAXIS node-side unit tests.
 *
 * Kept separate from `vitest.config.ts` (which wires the Storybook
 * browser-test project) so that the PRAXIS unit suite doesn't depend
 * on Storybook plugins being installed.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
});
