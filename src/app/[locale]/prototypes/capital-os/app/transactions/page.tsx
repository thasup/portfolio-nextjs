"use client";

import { Receipt, Clock } from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col">
      <CapitalOSHeader
        title="Transactions"
        subtitle="Transaction log and categorization — coming in Phase 4"
      />
      <div
        className="flex flex-1 flex-col items-center justify-center gap-6 p-6"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: "var(--cos-accent-muted)",
            color: "var(--cos-accent)",
          }}
        >
          <Receipt className="h-10 w-10" />
        </div>
        <div className="text-center">
          <h2 id="transactions-coming-soon" className="mb-2 text-2xl font-bold">
            Transaction Log
          </h2>
          <p
            className="mx-auto max-w-md text-sm leading-relaxed"
            style={{ color: "var(--cos-text-2)" }}
          >
            Full transaction history from YNAB and Airtable with smart
            categorization, filtering, and AI-powered anomaly detection will be
            available in Phase 4.
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
          style={{
            background: "var(--cos-surface-2)",
            color: "var(--cos-text-3)",
          }}
        >
          <Clock className="h-3 w-3" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}
