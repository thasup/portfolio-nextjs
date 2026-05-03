/**
 * Shared Praxis shell for all `/learn/*` routes.
 *
 * Mirrors the `.app-inner` container from the Praxis design reference
 * (`.windsurf/contents/praxis design/praxis/styles.css`):
 *
 *   max-width: 1280px; margin: 0 auto; padding: 28px 40px 80px;
 *
 * This gives every Praxis screen — library, new-topic, onboarding,
 * topic hub, unit — the same gutter and top/bottom breathing room.
 *
 * Route-group note: the `login` / `callback` / `not-invited` pages live
 * under `/learn/*` and inherit this shell. They use `min-h-[100svh]
 * flex items-center justify-center` internally, so the padded container
 * is a visual improvement (contained card) not a regression.
 */
import type { ReactNode } from "react";

export default function PraxisLearnLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div id="praxis-shell" className="praxis-shell">
      {children}
    </div>
  );
}
