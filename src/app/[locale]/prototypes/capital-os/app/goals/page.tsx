"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Target,
  Calendar,
  Plus,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { GoalModal } from "@/components/prototypes/capital-os/GoalModal";
import { useCapitalData } from "@/lib/capital-os/hooks";
import { CapitalGoal, CapitalGoalPriority } from "@/lib/capital-os/types";
import { fmtCurrency, fmtDate } from "@/lib/capital-os/format";

export default function GoalsPage() {
  const { goals, accounts, settings, refresh } = useCapitalData();
  const toTHB = (v: number) => v / 100;
  const monthlyBurnRate = settings?.runwayBurnRate ? settings.runwayBurnRate / 100 : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CapitalGoal | null>(null);

  const handleCreateGoal = async (data: {
    name: string;
    target: number;
    current: number;
    deadline: string | null;
    priority: CapitalGoalPriority;
    vehicle: string | null;
    monthlyAllocation?: number;
    linkedAccountId?: string | null;
    category?: string;
  }) => {
    const res = await fetch("/api/capital-os/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create goal");
    await refresh();
  };

  const handleUpdateGoal = async (data: {
    name: string;
    target: number;
    current: number;
    deadline: string | null;
    priority: CapitalGoalPriority;
    vehicle: string | null;
    monthlyAllocation?: number;
    linkedAccountId?: string | null;
    category?: string;
  }) => {
    if (!editingGoal) return;
    const res = await fetch(`/api/capital-os/goals/${editingGoal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update goal");
    await refresh();
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal: CapitalGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const priorityColor: Record<string, string> = {
    [CapitalGoalPriority.CRITICAL]: "#ef4444",
    [CapitalGoalPriority.HIGH]: "#f97316",
    [CapitalGoalPriority.MEDIUM]: "#3b82f6",
    [CapitalGoalPriority.LOW]: "#64748b",
  };

  const priorityBg: Record<string, string> = {
    [CapitalGoalPriority.CRITICAL]: "rgba(239, 68, 68, 0.12)",
    [CapitalGoalPriority.HIGH]: "rgba(249, 115, 22, 0.12)",
    [CapitalGoalPriority.MEDIUM]: "rgba(59, 130, 246, 0.12)",
    [CapitalGoalPriority.LOW]: "rgba(100, 116, 139, 0.12)",
  };

  return (
    <div className="flex flex-col">
      <CapitalOSHeader
        title="Financial Goals"
        subtitle="Track progress towards life milestones and capital allocation targets"
      />
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round((goal.current / goal.target) * 100),
            );
            const isCompleted = progress >= 100;
            const color = priorityColor[goal.priority] ?? "#64748b";
            const bg = priorityBg[goal.priority] ?? "rgba(100, 116, 139, 0.12)";

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className="group relative overflow-hidden rounded-xl border transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                {/* Priority stripe */}
                <div
                  className="absolute bottom-0 left-0 top-0 w-1"
                  style={{ background: color }}
                />

                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                          style={{ background: bg, color }}
                        >
                          {goal.priority}
                        </span>
                        {goal.deadline && (
                          <span
                            className="flex items-center gap-1 text-[10px]"
                            style={{ color: "var(--cos-text-3)" }}
                          >
                            <Calendar className="h-3 w-3" />
                            {fmtDate(goal.deadline)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold">{goal.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10"
                        style={{ color: "var(--cos-text-3)" }}
                        title="Edit goal"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {isCompleted ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0"
                          style={{ color: "var(--intent-success)" }}
                        />
                      ) : (
                        <Target
                          className="h-5 w-5 shrink-0 opacity-30 transition-opacity group-hover:opacity-60"
                          style={{ color: "var(--cos-text-3)" }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4 px-4 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span style={{ color: "var(--cos-text-3)" }}>
                        Progress
                      </span>
                      <span
                        style={{
                          color: isCompleted
                            ? "var(--cos-positive)"
                            : "var(--cos-accent)",
                        }}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full"
                      style={{ background: "var(--cos-surface-3)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: isCompleted
                            ? "var(--cos-positive)"
                            : "var(--cos-accent)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-0.5">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--cos-text-3)" }}
                      >
                        Current
                      </p>
                      <p className="text-sm font-bold">
                        {fmtCurrency(toTHB(goal.current))}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--cos-text-3)" }}
                      >
                        Target
                      </p>
                      <p className="text-sm font-bold">
                        {fmtCurrency(toTHB(goal.target))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="border-t border-dashed px-4 py-3"
                  style={{ borderColor: "var(--cos-border-subtle)" }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="h-3 w-3"
                      style={{ color: "var(--cos-text-3)" }}
                    />
                    <p
                      className="text-[10px] italic"
                      style={{ color: "var(--cos-text-3)" }}
                    >
                      Vehicle:{" "}
                      <span
                        className="not-italic font-medium"
                        style={{ color: "var(--cos-text)" }}
                      >
                        {goal.vehicle || "Not specified"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Goal card */}
          <button
            id="btn-add-goal"
            onClick={openCreateModal}
            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 transition-all hover:border-[var(--cos-accent)] hover:bg-[var(--cos-accent-muted)]"
            style={{ borderColor: "var(--cos-border)" }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full transition-colors"
              style={{
                background: "var(--cos-surface-2)",
                color: "var(--cos-text-3)",
              }}
            >
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Add New Goal</p>
              <p className="text-xs" style={{ color: "var(--cos-text-3)" }}>
                Define a new financial milestone
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        goal={editingGoal}
        accounts={accounts}
        monthlyBurnRate={monthlyBurnRate}
        onSave={editingGoal ? handleUpdateGoal : handleCreateGoal}
      />
    </div>
  );
}
