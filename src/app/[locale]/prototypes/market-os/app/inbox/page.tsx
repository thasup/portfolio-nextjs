import { AppPage } from "@/components/prototypes/market-os/app/AppPage";
import { InboxView } from "@/components/prototypes/market-os/app/InboxView";
import { getOrgBySlug } from "@/lib/marketos/queries/orgs";
import { listNotifications } from "@/lib/marketos/queries/notifications";
import { getCurrentMember } from "@/lib/marketos/auth";
import { DEMO_ORG_SLUG } from "@/lib/marketos/constants";

/**
 * Inbox — spec §8.10. Anonymous visitors see an empty state because
 * notifications are member-scoped (RLS would reject anyway). The view
 * itself is a Client Component for the read-toggle interaction; once
 * Phase 3 ships the `markNotificationRead` action it will replace the
 * local-only `setItems` state.
 */
export default async function InboxPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org)
    return (
      <AppPage>
        <p
          style={{
            color: "#7a7f79",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 14,
          }}
        >
          Demo org not seeded.
        </p>
      </AppPage>
    );

  const member = await getCurrentMember(org.slug);
  if (!member) {
    return (
      <AppPage>
        <h1
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: "#1e3a2f",
            margin: "0 0 12px",
            letterSpacing: "-0.03em",
          }}
        >
          Inbox
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 14,
            color: "#7a7f79",
          }}
        >
          Sign in to see your notifications.
        </p>
      </AppPage>
    );
  }

  const initial = await listNotifications(member.id, { limit: 50 });
  return <InboxView initial={initial} />;
}
