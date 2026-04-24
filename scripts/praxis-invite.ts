/**
 * Local-dev convenience CLI for `POST /api/praxis/invite`.
 *
 * Usage:
 *   npm run praxis:invite -- --email=jane@example.com --note="Phase 1 learner"
 *
 * Assumes the Next.js dev server is running at `NEXT_PUBLIC_SITE_URL`
 * (defaults to http://localhost:3000). Reads `PRAXIS_ADMIN_TOKEN` from
 * .env.local and forwards it as the `x-praxis-admin-token` header.
 */

interface Args {
  email: string;
  note?: string;
  site: string;
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = {};
  for (const raw of argv) {
    const m = raw.match(/^--([^=]+)=(.+)$/);
    if (!m) continue;
    const [, key, value] = m;
    if (key === 'email') args.email = value;
    if (key === 'note') args.note = value;
    if (key === 'site') args.site = value;
  }
  if (!args.email) {
    console.error('Usage: npm run praxis:invite -- --email=<addr> [--note=<text>] [--site=<url>]');
    process.exit(2);
  }
  return {
    email: args.email,
    note: args.note,
    site: args.site ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.PRAXIS_ADMIN_TOKEN;
  if (!token) {
    console.error('PRAXIS_ADMIN_TOKEN is not set in .env.local.');
    process.exit(2);
  }

  const endpoint = `${args.site.replace(/\/$/, '')}/api/praxis/invite`;
  console.log(`POST ${endpoint}  email=${args.email}`);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-praxis-admin-token': token,
    },
    body: JSON.stringify({ email: args.email, note: args.note }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status}`);
    console.error(body);
    process.exit(1);
  }
  console.log(body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
