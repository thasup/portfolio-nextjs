'use client';

import { useEffect, useState } from 'react';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import type { OrgAccent, OrgPeriod } from '@/lib/marketos/types';

/**
 * Local form state. Tracks both the server-side `OrgSettingsDTO`
 * fields and any UI-only fallbacks for anonymous viewers (where the
 * server defaults are still authoritative for display).
 */
interface SettingsForm {
  ratio: number;
  baseSplit: number;
  period: OrgPeriod;
  accent: OrgAccent;
  dark: boolean;
}

interface SettingsViewProps {
  orgName: string;
  memberCount: number;
  initial: SettingsForm;
  /** Approximate revenue (USD) used to render the live preview card. */
  revenueUsd: number;
}

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

const STORAGE_KEY = 'marketos:settings';

/**
 * Org-level settings + tweaks.
 *
 * Hydrates from the server-side `OrgSettingsDTO`. Anonymous visitors
 * still get a working preview because the server hands down whatever
 * is currently stored on the org. Local edits are kept in component
 * state until Phase 3 wires up the `updateOrgSettings` server action
 * — we also persist visual tweaks (dark/accent) to `localStorage` so
 * unauthenticated viewers can still customise their preview without
 * rewriting the org row.
 */
export function SettingsView({
  orgName,
  memberCount,
  initial,
  revenueUsd,
}: SettingsViewProps) {
  const [settings, setSettings] = useState<SettingsForm>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsForm>;
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    // Apply visual tweaks live to the data-marketos scope.
    const root = document.querySelector<HTMLElement>('[data-marketos]');
    if (root) {
      root.dataset.mkDark = settings.dark ? '1' : '0';
      root.dataset.mkAccent = settings.accent;
    }
  }, [settings, loaded]);

  const update = <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const missionPct = 100 - settings.baseSplit;
  const poolEstimate = Math.round((settings.ratio / 100) * revenueUsd);
  const missionsBudget = Math.round((poolEstimate * missionPct) / 100);
  const baseBudget = poolEstimate - missionsBudget;

  return (
    <AppPage>
      <h1
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 800,
          fontSize: 28,
          color: AC.dark,
          margin: '0 0 4px',
          letterSpacing: '-0.03em',
        }}
      >
        Settings
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 14,
          color: 'rgba(30,58,47,0.55)',
          margin: '0 0 28px',
          maxWidth: 640,
        }}
      >
        Org-level levers that shape how the market behaves. Visual tweaks persist locally; the
        org levers update the preview only until Phase 3 wires up the save action.
      </p>

      {/* Org levers */}
      <Card title="Org levers">
        <Row label="Organisation">
          <span
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 14,
              color: AC.dark,
            }}
          >
            {orgName} · {memberCount} member{memberCount === 1 ? '' : 's'}
          </span>
        </Row>
        <Row
          label="Payroll-to-revenue ratio"
          hint="Share of revenue that flows into the pool each period. Set annually."
        >
          <Slider
            value={settings.ratio}
            min={20}
            max={70}
            onChange={(v) => update('ratio', v)}
            unit="%"
          />
        </Row>
        <Row
          label="Base / mission split"
          hint="What share of the pool is reserved for guaranteed base comp vs. earned via missions."
        >
          <Slider
            value={settings.baseSplit}
            min={0}
            max={80}
            onChange={(v) => update('baseSplit', v)}
            unit="% base"
          />
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 12,
              color: AC.muted,
              margin: '6px 0 0',
            }}
          >
            Missions: <strong style={{ color: AC.dark }}>{missionPct}%</strong>
          </p>
        </Row>
        <Row label="Period length">
          <SegmentedControl
            value={settings.period}
            options={[
              { value: 'month', label: 'Month' },
              { value: 'quarter', label: 'Quarter' },
              { value: 'half', label: 'Half-year' },
            ]}
            onChange={(v) => update('period', v as OrgPeriod)}
          />
        </Row>

        {/* Live preview */}
        <div
          style={{
            background: AC.cream,
            borderRadius: 12,
            padding: '14px 16px',
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          <Preview label="Pool / period" value={`$${(poolEstimate / 1000).toFixed(0)}k`} />
          <Preview label="Missions budget" value={`$${(missionsBudget / 1000).toFixed(0)}k`} />
          <Preview label="Base comp" value={`$${(baseBudget / 1000).toFixed(0)}k`} />
        </div>
      </Card>

      {/* Tweaks */}
      <Card title="Appearance">
        <Row label="Dark mode">
          <Toggle value={settings.dark} onChange={(v) => update('dark', v)} />
        </Row>
        <Row label="Accent">
          <SegmentedControl
            value={settings.accent}
            options={[
              { value: 'orange', label: 'Orange' },
              { value: 'blue', label: 'Blue' },
              { value: 'green', label: 'Green' },
            ]}
            onChange={(v) => update('accent', v as OrgAccent)}
          />
        </Row>
      </Card>
    </AppPage>
  );
}

/* ─── Local primitives ──────────────────────────────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 20,
        boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 700,
          fontSize: 17,
          color: AC.dark,
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'center' }}>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 600,
            fontSize: 13,
            color: AC.dark,
          }}
        >
          {label}
        </div>
        {hint && (
          <div
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 11.5,
              color: AC.muted,
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {hint}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Slider({
  value,
  min,
  max,
  unit,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: AC.orange }}
      />
      <span
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 700,
          fontSize: 14,
          color: AC.dark,
          minWidth: 70,
          textAlign: 'right',
        }}
      >
        {value}
        {unit}
      </span>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      style={{
        position: 'relative',
        width: 42,
        height: 24,
        borderRadius: 999,
        border: 'none',
        background: value ? AC.orange : 'rgba(30,58,47,0.18)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transform: value ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform 0.15s',
        }}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'rgba(30,58,47,0.06)',
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              padding: '6px 14px',
              border: 'none',
              borderRadius: 8,
              background: active ? 'white' : 'transparent',
              color: active ? AC.dark : AC.muted,
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Preview({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 11,
          color: AC.muted,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 800,
          fontSize: 20,
          color: AC.dark,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
}
