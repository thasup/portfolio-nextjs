/**
 * Diagnostic: verifies the MarketOS seed has been applied.
 * Run with `npx tsx --env-file=.env.local scripts/check-marketos-seed.ts`.
 */
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const orgs = await prisma.marketosOrg.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });
  console.log('orgs:', JSON.stringify(orgs, null, 2));

  const totalMissions = await prisma.marketosMission.count();
  const totalBids = await prisma.marketosBid.count();
  const totalNotifications = await prisma.marketosNotification.count();
  console.log({
    totalMissions,
    totalBids,
    totalNotifications,
  });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
