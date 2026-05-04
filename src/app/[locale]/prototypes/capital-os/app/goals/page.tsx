"use client";

import { useState, useMemo } from "react";
import { Plus, Target, TrendingUp, CheckCircle, Clock, Pencil, Trash2, CalendarDays, Sparkles } from "lucide-react";
import { useCapitalData } from "@/lib/capital-os/hooks";
import { fmtCurrency } from "@/lib/capital-os/format";
import { GoalModal } from "@/components/prototypes/capital-os/GoalModal";
import { CapitalGoal, CapitalGoalPriority, CapitalGoalCategory } from "@/lib/capital-os/types";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { computeGoalInsights } from "@/lib/capital-os/insights";
import type { DateFormatString } from "@/lib/capital-os/formatters";

// ── Constants ──────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  [CapitalGoalPriority.CRITICAL]: "#ef4444",
  [CapitalGoalPriority.HIGH]: "#f97316",
  [CapitalGoalPriority.MEDIUM]: "#3b82f6",
  [CapitalGoalPriority.LOW]: "#64748b",
};

const PRIORITY_BG: Record<string, string> = {
  [CapitalGoalPriority.CRITICAL]: "rgba(239,68,68,0.12)",
  [CapitalGoalPriority.HIGH]: "rgba(249,115,22,0.12)",
  [CapitalGoalPriority.MEDIUM]: "rgba(59,130,246,0.12)",
  [CapitalGoalPriority.LOW]: "rgba(100,116,139,0.12)",
};

const CATEGORY_EMOJI: Record<string, string> = {
  [CapitalGoalCategory.EMERGENCY_FUND]: "🛡️",
  [CapitalGoalCategory.RETIREMENT]: "🏖️",
  [CapitalGoalCategory.MAJOR_PURCHASE]: "🚗",
  [CapitalGoalCategory.DEBT_PAYOFF]: "💳",
  [CapitalGoalCategory.EDUCATION]: "📚",
  [CapitalGoalCategory.TRAVEL]: "✈️",
  [CapitalGoalCategory.WEDDING]: "💒",
  [CapitalGoalCategory.INVESTMENT]: "📈",
  [CapitalGoalCategory.BUSINESS]: "🏢",
  [CapitalGoalCategory.OTHER]: "🎯",
};

const CATEGORY_LABEL: Record<string, string> = {
  [CapitalGoalCategory.EMERGENCY_FUND]: "Emergency",
  [CapitalGoalCategory.RETIREMENT]: "Retirement",
  [CapitalGoalCategory.MAJOR_PURCHASE]: "Purchase",
  [CapitalGoalCategory.DEBT_PAYOFF]: "Debt Payoff",
  [CapitalGoalCategory.EDUCATION]: "Education",
  [CapitalGoalCategory.TRAVEL]: "Travel",
  [CapitalGoalCategory.WEDDING]: "Wedding",
  [CapitalGoalCategory.INVESTMENT]: "Investment",
  [CapitalGoalCategory.BUSINESS]: "Business",
  [CapitalGoalCategory.OTHER]: "Other",
};

// ── Helpers ────────────────────────────────────────────────────

function getTimeRemaining(deadline: string | null): { label: string; color: string } | null {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44));
  if (diffMs < 0) return { label: "Overdue", color: "#ef4444" };
  if (diffMonths <= 2) return { label: `${diffMonths}mo left`, color: "#f97316" };
  if (diffMonths <= 12) return { label: `${diffMonths}mo left`, color: "#eab308" };
  const years = Math.round(diffMonths / 12);
  return { label: `${years}y left`, color: "#64748b" };
}

// ── Skeleton ───────────────────────────────────────────────────

function GoalSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border overflow-hidden" style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface-2)" }}>
      <div className="flex gap-3 p-4">
        <div className="h-4 w-4 rounded-full bg-white/10 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded-full bg-white/10" />
            <div className="h-4 w-12 rounded-full bg-white/10" />
          </div>
          <div className="h-5 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-2 w-full rounded-full bg-white/10" />
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-4 w-20 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function GoalsPage() {
  const { accounts, goals, settings, isLoading, refresh } = useCapitalData();
  const dateFormat = (settings?.dateFormat as DateFormatString) ?? "DD/MM/YYYY";
  const monthlyBurnRate = settings?.runwayBurnRate ? settings.runwayBurnRate / 100 : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CapitalGoal | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "progress" | "name">("priority");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPageSaving, setIsPageSaving] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────

  type GoalPayload = {
    name: string; target: number; current: number; deadline: string | null;
    priority: CapitalGoalPriority; vehicle: string | null;
    monthlyAllocation?: number; linkedAccountId?: string | null;
    category?: string; description?: string | null;
  };

  const handleCreateGoal = async (data: GoalPayload) => {
    setIsPageSaving(true);
    try {
      const res = await fetch("/api/capital-os/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to create goal");
      }
      await refresh();
    } finally {
      setIsPageSaving(false);
    }
  };

  const handleUpdateGoal = async (data: GoalPayload) => {
    if (!editingGoal) return;
    setIsPageSaving(true);
    try {
      const res = await fetch(`/api/capital-os/goals/${editingGoal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to update goal");
      }
      await refresh();
    } finally {
      setIsPageSaving(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/capital-os/goals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to delete goal");
      }
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => { setEditingGoal(null); setIsModalOpen(true); };
  const openEditModal = (goal: CapitalGoal) => { setEditingGoal(goal); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingGoal(null); };

  // ── Filtered & Sorted goals ───────────────────────────────────

  const filteredGoals = useMemo(() => {
    let list = goals.filter(g => !g.archivedAt);
    if (filterPriority !== "ALL") list = list.filter(g => g.priority === filterPriority);
    return list.sort((a, b) => {
      if (sortBy === "priority") {
        const order = [CapitalGoalPriority.CRITICAL, CapitalGoalPriority.HIGH, CapitalGoalPriority.MEDIUM, CapitalGoalPriority.LOW];
        return order.indexOf(a.priority) - order.indexOf(b.priority);
      }
      if (sortBy === "deadline") {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === "progress") {
        const pa = a.target > 0 ? a.current / a.target : 0;
        const pb = b.target > 0 ? b.current / b.target : 0;
        return pb - pa;
      }
      return a.name.localeCompare(b.name);
    });
  }, [goals, filterPriority, sortBy]);

  // ── Summary stats ─────────────────────────────────────────────

  const activeGoals = goals.filter(g => !g.archivedAt);
  const totalSaved = activeGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = activeGoals.reduce((s, g) => s + g.target, 0);
  const totalMonthlyAllocation = activeGoals.reduce((s, g) => s + (g.monthlyAllocation ?? 0), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const completedCount = activeGoals.filter(g => g.completedAt || g.current >= g.target).length;

  const stats = [
    { label: "Total Monthly Contribution", value: fmtCurrency(totalMonthlyAllocation / 100), sub: "combined monthly", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Total Saved", value: fmtCurrency(totalSaved / 100), sub: "across all goals", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Total Target", value: fmtCurrency(totalTarget / 100), sub: "combined milestone", icon: <Target className="h-4 w-4" /> },
    { label: "Overall", value: `${overallProgress}%`, sub: "portfolio progress", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b px-6 py-5" style={{ borderColor: "var(--cos-border-subtle)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Financial Goals</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cos-text-3)" }}>
              Track progress towards life milestones and capital allocation targets
            </p>
          </div>
          <button
            onClick={openCreateModal}
            disabled={isPageSaving}
            className="flex items-center gap-2 rounded-xl bg-(--cos-accent) px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus className="h-4 w-4" />
            {isPageSaving ? "Saving…" : "Add Goal"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border p-4 space-y-2"
              style={{ background: "var(--cos-surface-2)", borderColor: "var(--cos-border-subtle)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "var(--cos-text-3)" }}>{s.label}</span>
                <span style={{ color: "var(--cos-accent)" }}>{s.icon}</span>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px]" style={{ color: "var(--cos-text-3)" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filter / Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", CapitalGoalPriority.CRITICAL, CapitalGoalPriority.HIGH, CapitalGoalPriority.MEDIUM, CapitalGoalPriority.LOW].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors border",
                filterPriority === p
                  ? "bg-(--cos-accent) text-white border-transparent"
                  : "border-(--cos-border-subtle) text-(--cos-text-2) hover:bg-white/5"
              )}
            >
              {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>Sort:</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-7 rounded-lg border text-xs px-2 w-28" style={{ borderColor: "var(--cos-border-subtle)", background: "transparent" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Goals Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <GoalSkeleton key={i} />)}
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-20" style={{ borderColor: "var(--cos-border-subtle)" }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--cos-surface-2)" }}>
              <Target className="h-8 w-8" style={{ color: "var(--cos-text-3)" }} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">{filterPriority !== "ALL" ? "No goals with this priority" : "No goals yet"}</p>
              <p className="text-sm" style={{ color: "var(--cos-text-3)" }}>
                {filterPriority !== "ALL" ? "Try a different filter." : "Define your first financial milestone to start tracking."}
              </p>
            </div>
            {filterPriority === "ALL" && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 rounded-xl bg-(--cos-accent) px-4 py-2 text-sm font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Add your first goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => {
              const progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
              const isCompleted = !!(goal.completedAt || goal.current >= goal.target);
              const color = PRIORITY_COLOR[goal.priority] ?? "#64748b";
              const bg = PRIORITY_BG[goal.priority] ?? "rgba(100,116,139,0.12)";
              const emoji = goal.category ? (CATEGORY_EMOJI[goal.category] ?? "🎯") : "🎯";
              const catLabel = goal.category ? (CATEGORY_LABEL[goal.category] ?? goal.category) : null;
              const timeChip = getTimeRemaining(goal.deadline);
              const isBeingDeleted = deletingId === goal.id;
              const remaining = Math.max(goal.target - goal.current, 0);
              const monthlyAllocation = goal.monthlyAllocation ?? 0;
              const monthsToTarget = monthlyAllocation > 0 ? Math.ceil(remaining / monthlyAllocation) : null;
              const description = goal.description?.trim();
              const topInsight = !isCompleted
                ? (() => {
                    const liquidAccounts = accounts.filter(a => !a.archivedAt && a.balance > 0);
                    const totalLiquid = liquidAccounts.reduce((s, a) => s + a.balance, 0) / 100;
                    const cardInsights = computeGoalInsights({
                      targetNum: goal.target / 100,
                      currentNum: goal.current / 100,
                      allocationNum: monthlyAllocation / 100,
                      deadline: goal.deadline ?? undefined,
                      category: goal.category ?? undefined,
                      monthlyBurnRate,
                      totalLiquid,
                      liquidAccountCount: liquidAccounts.length,
                    });
                    return cardInsights.find(i => i.level === "critical" || i.level === "warning") ?? cardInsights[0] ?? null;
                  })()
                : null;

              return (
                <div
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5",
                    isCompleted && "opacity-80"
                  )}
                  style={{
                    background: "var(--cos-surface-2)",
                    borderColor: isCompleted ? "var(--cos-positive)" : "var(--cos-border-subtle)",
                    boxShadow: isCompleted ? "0 0 0 1px var(--cos-positive)" : undefined,
                  }}
                >
                  {/* Priority stripe */}
                  <div className="absolute bottom-0 left-0 top-0 w-1" style={{ background: color }} />

                  {/* Header */}
                  <div className="pl-5 pr-4 pt-4 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ background: bg, color }}>
                            {goal.priority}
                          </span>
                          {catLabel && (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "var(--cos-surface-3)", color: "var(--cos-text-2)" }}>
                              {emoji} {catLabel}
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(34,197,94,0.15)", color: "var(--cos-positive)" }}>
                              ✓ Completed
                            </span>
                          ) : timeChip ? (
                            <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${timeChip.color}18`, color: timeChip.color }}>
                              <Clock className="h-2.5 w-2.5" />
                              {timeChip.label}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-sm font-semibold leading-tight truncate">{goal.name}</h3>
                        {description && (
                          <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: "var(--cos-text-3)" }}>{description}</p>
                        )}
                      </div>
                      {/* Action buttons */}
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEditModal(goal)}
                          disabled={isPageSaving || isBeingDeleted}
                          className="rounded-lg p-1.5 transition-colors hover:bg-white/10 disabled:opacity-40"
                          style={{ color: "var(--cos-text-3)" }}
                          title="Edit goal"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          disabled={isBeingDeleted || isPageSaving}
                          className="rounded-lg p-1.5 transition-colors hover:bg-red-500/20 text-red-400 disabled:opacity-50"
                          title="Delete goal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="pl-5 pr-4 pb-3 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="rounded-lg bg-black/10 px-2 py-1.5">
                        <p style={{ color: "var(--cos-text-3)" }}>Saved</p>
                        <p className="mt-0.5 font-semibold truncate">{fmtCurrency(goal.current / 100)}</p>
                      </div>
                      <div className="rounded-lg bg-black/10 px-2 py-1.5">
                        <p style={{ color: "var(--cos-text-3)" }}>Remaining</p>
                        <p className="mt-0.5 font-semibold truncate">{fmtCurrency(remaining / 100)}</p>
                      </div>
                      <div className="rounded-lg bg-black/10 px-2 py-1.5">
                        <p style={{ color: "var(--cos-text-3)" }}>Target</p>
                        <p className="mt-0.5 font-semibold truncate">{fmtCurrency(goal.target / 100)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span style={{ color: "var(--cos-text-3)" }}>Progress</span>
                      <span style={{ color: isCompleted ? "var(--cos-positive)" : "var(--cos-accent)" }}>{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: isCompleted ? "var(--cos-positive)" : "var(--cos-accent)" }}
                      />
                    </div>
                  </div>

                  <div className="border-t px-5 py-2.5 space-y-2" style={{ borderColor: "var(--cos-border-subtle)" }}>
                    {topInsight ? (
                      <div className="flex items-start gap-1.5">
                        <Sparkles
                          className="h-2.5 w-2.5 mt-0.5 shrink-0"
                          style={{ color: topInsight.level === "warning" ? "var(--cos-warning)" : "rgb(248 113 113)" }}
                        />
                        <p className="text-[10px] leading-relaxed" style={{ color: topInsight.level === "warning" ? "var(--cos-warning)" : "rgb(248 113 113)" }}>
                          {topInsight.title}
                        </p>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: "var(--cos-text-3)" }}>
                      <span className="truncate">{goal.vehicle || "No vehicle"}</span>
                      {goal.monthlyAllocation ? (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-2.5 w-2.5" />
                          {fmtCurrency(goal.monthlyAllocation / 100)}/mo
                        </span>
                      ) : null}
                      {monthsToTarget !== null && !isCompleted ? (
                        <span>{monthsToTarget} mo to target</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Goal card */}
            <button
              onClick={openCreateModal}
              disabled={isPageSaving}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all min-h-[180px] hover:border-(--cos-accent) hover:bg-(--cos-accent-muted,rgba(99,102,241,0.08)) disabled:opacity-40 disabled:pointer-events-none"
              style={{ borderColor: "var(--cos-border-subtle)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--cos-surface-3)", color: "var(--cos-text-3)" }}>
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">New Goal</p>
                <p className="text-xs" style={{ color: "var(--cos-text-3)" }}>Define a financial milestone</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        goal={editingGoal}
        accounts={accounts}
        monthlyBurnRate={monthlyBurnRate}
        dateFormat={dateFormat}
        onSave={editingGoal ? handleUpdateGoal : handleCreateGoal}
        onDelete={handleDeleteGoal}
      />
    </div>
  );
}
