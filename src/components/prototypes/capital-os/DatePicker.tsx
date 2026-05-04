"use client";

/**
 * CapitalOS Date Picker
 *
 * Shadcn Calendar + Radix Popover (no Portal) so it inherits
 * [data-capitalos] CSS variables correctly in both modal and page contexts.
 *
 * Features:
 * - Month / year dropdowns (captionLayout="dropdown-buttons")
 * - Displays date in user-configured format (DD/MM/YYYY default)
 * - Inline clear button
 * - All past dates allowed (no min restriction)
 */

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/capital-os/formatters";
import type { DateFormatString } from "@/lib/capital-os/formatters";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  /** User's preferred date display format */
  dateFormat?: DateFormatString;
  placeholder?: string;
  disabled?: boolean;
  /** Earliest year shown in the year dropdown */
  fromYear?: number;
  /** Latest year shown in the year dropdown */
  toYear?: number;
  className?: string;
}

export function CapitalOSDatePicker({
  value,
  onChange,
  dateFormat = "DD/MM/YYYY",
  placeholder = "Pick a date…",
  disabled,
  fromYear = 2010,
  toYear = 2040,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const displayText = value ? formatDate(value, dateFormat) : null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* ── Trigger button ── */}
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-sm text-left",
            "bg-black/20 transition-colors focus:outline-none focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          style={
            {
              borderColor: "var(--cos-border-subtle)",
              color: displayText ? "var(--cos-text)" : "var(--cos-text-3)",
              "--tw-ring-color": "var(--cos-accent)",
            } as React.CSSProperties
          }
        >
          <CalendarIcon
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--cos-text-3)" }}
          />

          <span className="flex-1">
            {displayText ?? placeholder}
          </span>

          {/* Inline clear */}
          {value && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange(undefined);
                }
              }}
              className="rounded p-0.5 transition-colors hover:bg-white/10"
              style={{ color: "var(--cos-text-3)" }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverPrimitive.Trigger>

      {/*
        ── Content (no Portal!) ──
        Rendering without PopoverPrimitive.Portal keeps the element inside
        [data-capitalos] so all CSS custom properties resolve correctly.
        z-[200] ensures it floats above modal scroll content.
      */}
      <PopoverPrimitive.Content
        align="start"
        sideOffset={6}
        avoidCollisions
        className={cn(
          "z-200 rounded-xl shadow-2xl outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        )}
        style={{
          background: "var(--cos-surface)",
          border: "1px solid var(--cos-border-subtle)",
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date ?? undefined);
            if (date) setOpen(false);
          }}
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
          className="p-3"
          classNames={{
            caption_dropdowns: "flex gap-2 items-center",
            dropdown: cn(
              "rounded-lg border px-2 py-1 text-xs font-medium cursor-pointer",
              "bg-black/20 focus:outline-none focus:ring-1",
            ),
          }}
          styles={{
            dropdown: {
              borderColor: "var(--cos-border-subtle)",
              color: "var(--cos-text)",
              colorScheme: "dark",
            },
          }}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
