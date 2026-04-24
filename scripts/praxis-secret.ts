/**
 * Cross-platform secret generator for `PRAXIS_INVITE_SECRET` and
 * `PRAXIS_ADMIN_TOKEN`. Avoids the `openssl` dependency that isn't
 * bundled with Windows PowerShell.
 *
 * Usage:
 *   npm run praxis:secret           # one 32-byte base64 secret
 *   npm run praxis:secret -- --count=2
 */
import { randomBytes } from 'node:crypto';

const count = (() => {
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--count=(\d+)$/);
    if (m) return Math.max(1, Math.min(10, Number(m[1])));
  }
  return 1;
})();

for (let i = 0; i < count; i += 1) {
  console.log(randomBytes(32).toString('base64'));
}
