"use client";

/**
 * CapitalOS Date Picker
 *
 * Hybrid text-input + calendar popover.
 *
 * Features:
 * - Editable text input — type the date directly in the configured format
 * - Format-aware parser with blur validation and auto-normalization
 * - Portal-based floating calendar (does not disrupt modal layout)
 * - CSS vars injected inline so the calendar looks correct outside [data-capitalos] scope
 * - Fully custom month / year header (bypasses react-day-picker caption entirely)
 * - Wide year range from currentYear-10 to currentYear+30
 * - Inline clear button
 */

import { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateFormatString } from "@/lib/capital-os/formatters";
import { cn } from "@/lib/utils";

// ── Month names ────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── Format / parse helpers ─────────────────────────────────────────

function applyFormat(date: Date, fmt: DateFormatString): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  switch (fmt) {
    case "DD/MM/YYYY": return `${d}/${m}/${y}`;
    case "MM/DD/YYYY": return `${m}/${d}/${y}`;
    case "YYYY-MM-DD": return `${y}-${m}-${d}`;
    case "DD.MM.YYYY": return `${d}.${m}.${y}`;
    default:           return `${d}/${m}/${y}`;
  }
}

function parseTyped(raw: string, fmt: DateFormatString): Date | null {
  const v = raw.trim();
  if (!v) return null;

  let day = 0, month = 0, year = 0;

  if (fmt === "DD/MM/YYYY") {
    [day, month, year] = v.split("/").map(Number);
  } else if (fmt === "MM/DD/YYYY") {
    const p = v.split("/").map(Number);
    [month, day, year] = p;
  } else if (fmt === "YYYY-MM-DD") {
    const p = v.split("-").map(Number);
    [year, month, day] = p;
  } else if (fmt === "DD.MM.YYYY") {
    [day, month, year] = v.split(".").map(Number);
  }

  if (!day || !month || !year || year < 1900 || year > 2200) return null;
  const result = new Date(year, month - 1, day);
  if (
    isNaN(result.getTime()) ||
    result.getDate() !== day ||
    result.getMonth() !== month - 1
  ) return null;
  return result;
}

// ── CapitalOS palette vars (hardcoded for Portal context) ──────────
// Portal renders at <body> level, outside [data-capitalos], so we
// inject the needed tokens inline on the floating wrapper.
const COS_PORTAL_VARS: React.CSSProperties = {
  // surfaces
  "--background":         "#0a0e1a",
  "--popover":            "#111827",
  "--popover-foreground": "#f9fafb",
  "--card":               "#111827",
  "--card-foreground":    "#f9fafb",
  // typography
  "--foreground":         "#f9fafb",
  "--muted":              "#1f2937",
  "--muted-foreground":   "#9ca3af",
  // accent / ring
  "--primary":            "#10b981",
  "--primary-foreground": "#ffffff",
  "--accent":             "#1f2937",
  "--accent-foreground":  "#f9fafb",
  "--ring":               "#10b981",
  "--border":             "#374151",
  // capitalos vars (used by Calendar classNames)
  "--cos-surface":        "#111827",
  "--cos-surface-2":      "#1f2937",
  "--cos-border":         "#374151",
  "--cos-border-subtle":  "#1f2937",
  "--cos-text":           "#f9fafb",
  "--cos-text-2":         "#9ca3af",
  "--cos-text-3":         "#6b7280",
  "--cos-accent":         "#10b981",
  colorScheme:            "dark",
} as React.CSSProperties;

// ── Component ──────────────────────────────────────────────────────

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  dateFormat?: DateFormatString;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
}

export function CapitalOSDatePicker({
  value,
  onChange,
  dateFormat = "DD/MM/YYYY",
  placeholder,
  disabled,
  fromYear,
  toYear,
  className,
}: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  const yearFrom = fromYear ?? currentYear - 10;
  const yearTo   = toYear   ?? currentYear + 30;

  const years = Array.from({ length: yearTo - yearFrom + 1 }, (_, i) => yearFrom + i);

  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState<string>(
    value ? applyFormat(value, dateFormat) : "",
  );
  const [hasError, setHasError] = useState(false);
  const [navMonth, setNavMonth] = useState<Date>(value ?? new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  const hintText = placeholder ?? dateFormat;

  // ── Sync inputText when external value or format changes ──
  useEffect(() => {
    setInputText(value ? applyFormat(value, dateFormat) : "");
    setHasError(false);
  }, [value, dateFormat]);

  // ── When opening, navigate calendar to selected date ──
  useEffect(() => {
    if (open) setNavMonth(value ?? new Date());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Calendar nav helpers ──
  const goPrevMonth = () =>
    setNavMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () =>
    setNavMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // ── Handlers ──

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);
    setHasError(false);
    if (!raw.trim()) { onChange(undefined); return; }
    const parsed = parseTyped(raw, dateFormat);
    if (parsed) { onChange(parsed); }
  };

  const handleBlur = () => {
    if (!inputText.trim()) { setHasError(false); return; }
    const parsed = parseTyped(inputText, dateFormat);
    if (!parsed) {
      setHasError(true);
    } else {
      setInputText(applyFormat(parsed, dateFormat));
      setHasError(false);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange(date);
    setInputText(date ? applyFormat(date, dateFormat) : "");
    setHasError(false);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(undefined);
    setInputText("");
    setHasError(false);
    inputRef.current?.focus();
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* ── Anchor: text input + calendar toggle ── */}
      <PopoverPrimitive.Anchor asChild>
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-all",
            "bg-black/20",
            hasError
              ? "border-red-500 ring-1 ring-red-500/40"
              : "border-(--cos-border-subtle) focus-within:border-(--cos-accent) focus-within:ring-1 focus-within:ring-(--cos-accent)/30",
            disabled && "pointer-events-none opacity-50",
            className,
          )}
        >
          {/* Calendar toggle */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Open calendar"
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 transition-opacity hover:opacity-100"
            style={{ color: "var(--cos-text-3)", opacity: open ? 1 : 0.6 }}
          >
            <CalendarIcon className="h-4 w-4" />
          </button>

          {/* Editable text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder={hintText}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm font-medium outline-none",
              "placeholder:text-(--cos-text-3) placeholder:font-normal placeholder:opacity-60",
              hasError ? "text-red-400" : "text-(--cos-text)",
            )}
          />

          {/* Error hint */}
          {hasError && (
            <span className="shrink-0 text-[10px] text-red-400 font-medium">
              {dateFormat}
            </span>
          )}

          {/* Clear */}
          {value && !hasError && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear date"
              onClick={handleClear}
              className="shrink-0 rounded transition-opacity opacity-40 hover:opacity-100"
              style={{ color: "var(--cos-text-3)" }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </PopoverPrimitive.Anchor>

      {/*
        ── Portal: floats above the modal at body level ──
        We inject all required CSS vars inline so the calendar styles
        correctly without needing to be inside [data-capitalos].
      */}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          avoidCollisions
          collisionPadding={16}
          className={cn(
            "z-9999 rounded-2xl p-0 outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          style={{
            ...COS_PORTAL_VARS,
            background: "#111827",
            border: "1px solid #374151",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* ── Custom header: month/year dropdowns + prev/next ── */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={navMonth <= new Date(yearFrom, 0, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-30"
              style={{ color: "#9ca3af" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center justify-center gap-2">
              {/* Month select */}
              <select
                value={navMonth.getMonth()}
                onChange={(e) =>
                  setNavMonth(new Date(navMonth.getFullYear(), Number(e.target.value), 1))
                }
                className="rounded-lg px-2 py-1 text-sm font-semibold cursor-pointer outline-none appearance-none text-center"
                style={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f9fafb",
                  colorScheme: "dark",
                }}
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>

              {/* Year select */}
              <select
                value={navMonth.getFullYear()}
                onChange={(e) =>
                  setNavMonth(new Date(Number(e.target.value), navMonth.getMonth(), 1))
                }
                className="rounded-lg px-2 py-1 text-sm font-semibold cursor-pointer outline-none appearance-none text-center"
                style={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f9fafb",
                  colorScheme: "dark",
                }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={goNextMonth}
              disabled={navMonth >= new Date(yearTo, 11, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-30"
              style={{ color: "#9ca3af" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ── Calendar days grid (caption + nav hidden) ── */}
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleCalendarSelect}
            month={navMonth}
            onMonthChange={setNavMonth}
            initialFocus={false}
            className="p-4 pt-1"
            classNames={{
              caption: "hidden",
              nav: "hidden",
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
