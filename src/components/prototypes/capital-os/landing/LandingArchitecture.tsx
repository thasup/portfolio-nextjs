"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingArchitecture() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="architecture">
        <div className="container">
          <div className="arch-header reveal">
            <div className="section-label">Technical Architecture</div>
            <h2>Stack built to evolve.</h2>
            <p>
              Every architectural decision is a closed decision — made once,
              documented, not relitigated without a forcing function.
            </p>
          </div>

          <div className="stack-diagram reveal reveal-delay-1">
            <div className="stack-layer">
              <div className="stack-label">Interface</div>
              <div className="stack-cells">
                <div className="stack-cell highlight">
                  Next.js 15 App Router
                </div>
                <div className="stack-cell highlight">TypeScript</div>
                <div className="stack-cell">TailwindCSS 4</div>
                <div className="stack-cell">shadcn/ui</div>
                <div className="stack-cell">Recharts</div>
              </div>
            </div>
            <div className="stack-divider"></div>
            <div className="stack-layer">
              <div className="stack-label">AI Layer</div>
              <div className="stack-cells">
                <div className="stack-cell highlight">
                  OpenRouter (model-agnostic)
                </div>
                <div className="stack-cell">Vercel AI SDK</div>
                <div className="stack-cell">Gemini 2.0 Flash</div>
                <div className="stack-cell">Langfuse (tracing)</div>
              </div>
            </div>
            <div className="stack-divider"></div>
            <div className="stack-layer">
              <div className="stack-label">Data</div>
              <div className="stack-cells">
                <div className="stack-cell highlight">
                  PostgreSQL (Supabase)
                </div>
                <div className="stack-cell highlight">Prisma ORM</div>
                <div className="stack-cell">YNAB API (server-only)</div>
                <div className="stack-cell">Airtable API (server-only)</div>
              </div>
            </div>
            <div className="stack-divider"></div>
            <div className="stack-layer">
              <div className="stack-label">Infra</div>
              <div className="stack-cells">
                <div className="stack-cell">Vercel (hosting)</div>
                <div className="stack-cell">Vercel Cron Jobs</div>
                <div className="stack-cell">GitHub Actions (CI/CD)</div>
                <div className="stack-cell">Supabase Auth</div>
              </div>
            </div>
          </div>

          <div className="invariants reveal reveal-delay-2">
            <div className="invariant">
              <div className="invariant-icon">🔒</div>
              <div className="invariant-label">
                Server-side secrets only. Never client-exposed.
              </div>
            </div>
            <div className="invariant">
              <div className="invariant-icon">🗑️</div>
              <div className="invariant-label">
                Soft-delete everywhere. Financial history is forensic.
              </div>
            </div>
            <div className="invariant">
              <div className="invariant-icon">💴</div>
              <div className="invariant-label">
                Amounts in satangs in DB. Format in app layer only.
              </div>
            </div>
            <div className="invariant">
              <div className="invariant-icon">🔄</div>
              <div className="invariant-label">
                Model-agnostic AI. OpenRouter as abstraction layer.
              </div>
            </div>
            <div className="invariant">
              <div className="invariant-icon">📋</div>
              <div className="invariant-label">
                Prisma migration discipline. Never db push to production.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
