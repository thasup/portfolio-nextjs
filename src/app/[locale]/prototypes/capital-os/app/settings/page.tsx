"use client";

import { Settings, Clock } from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <CapitalOSHeader title="Settings" subtitle="API connections, preferences, and data management" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6" style={{ minHeight: "60vh" }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "var(--cos-accent-2-muted)", color: "var(--cos-accent-2)" }}>
          <Settings className="h-10 w-10" />
        </div>
        <div className="text-center">
          <h2 id="settings-coming-soon" className="mb-2 text-2xl font-bold">Settings & Configuration</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed" style={{ color: "var(--cos-text-2)" }}>
            Manage API connections (YNAB, Airtable), configure sync schedules, set currency preferences, and control data retention policies.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium" style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}>
          <Clock className="h-3 w-3" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}
