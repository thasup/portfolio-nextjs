import { AppPage } from "@/components/prototypes/market-os/app/AppPage";
import { SettingsView } from "@/components/prototypes/market-os/app/SettingsView";
import { getOrgBySlug, getOrgSettings } from "@/lib/marketos/queries/orgs";
import { getCurrentPool } from "@/lib/marketos/queries/pool";
import { DEMO_ORG_SLUG } from "@/lib/marketos/constants";
import type { OrgAccent, OrgPeriod } from "@/lib/marketos/types";

/**
 * Settings — spec §8.11. Hydrates the live preview from the org's
 * actual current revenue + settings; visual tweaks (dark/accent) still
 * round-trip through `localStorage` until Phase 3 wires the
 * `updateOrgSettings` action.
 */
export default async function SettingsPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org) {
    return (
      <AppPage>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#7a7f79",
            fontSize: 14,
          }}
        >
          Demo org not seeded.
        </p>
      </AppPage>
    );
  }

  const [settings, pool] = await Promise.all([
    getOrgSettings(org.id),
    getCurrentPool(org.id),
  ]);

  return (
    <SettingsView
      orgName={org.name}
      memberCount={org.memberCount}
      revenueUsd={pool?.revenueUsd ?? 600_000}
      initial={{
        ratio: settings?.ratio ?? 45,
        baseSplit: settings?.baseSplit ?? 60,
        period: (settings?.period ?? "quarter") as OrgPeriod,
        accent: (settings?.accent ?? "orange") as OrgAccent,
        dark: settings?.dark ?? false,
      }}
    />
  );
}
