"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { X, Save, Target, CalendarIcon, Info, TrendingUp, Sparkles, Trash2, AlertTriangle } from "lucide-react";
import { CapitalGoal, CapitalGoalPriority, CapitalGoalCategory, CapitalAccount } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: CapitalGoal | null;
  accounts?: CapitalAccount[];
  monthlyBurnRate?: number;
  onSave: (data: {
    name: string;
    target: number;
    current: number;
    deadline: string | null;
    priority: CapitalGoalPriority;
    vehicle: string | null;
    monthlyAllocation?: number;
    linkedAccountId?: string | null;
    category?: string;
    description?: string | null;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const priorityOptions: { value: CapitalGoalPriority; label: string; color: string }[] = [
  { value: CapitalGoalPriority.CRITICAL, label: "Critical", color: "#ef4444" },
  { value: CapitalGoalPriority.HIGH, label: "High", color: "#f97316" },
  { value: CapitalGoalPriority.MEDIUM, label: "Medium", color: "#3b82f6" },
  { value: CapitalGoalPriority.LOW, label: "Low", color: "#64748b" },
];

const goalCategories: { value: string; label: string; icon: string; insight: string }[] = [
  { value: CapitalGoalCategory.EMERGENCY_FUND, label: "Emergency", icon: "🛡️", insight: "Safety buffer for unexpected expenses" },
  { value: CapitalGoalCategory.RETIREMENT, label: "Retirement", icon: "🏖️", insight: "Long-term wealth accumulation" },
  { value: CapitalGoalCategory.MAJOR_PURCHASE, label: "Purchase", icon: "🚗", insight: "Vehicle, home, or large asset" },
  { value: CapitalGoalCategory.DEBT_PAYOFF, label: "Debt Payoff", icon: "💳", insight: "Liability reduction goal" },
  { value: CapitalGoalCategory.EDUCATION, label: "Education", icon: "📚", insight: "Learning and skill investment" },
  { value: CapitalGoalCategory.TRAVEL, label: "Travel", icon: "✈️", insight: "Experience and adventure fund" },
  { value: CapitalGoalCategory.WEDDING, label: "Wedding", icon: "💒", insight: "Life milestone planning" },
  { value: CapitalGoalCategory.INVESTMENT, label: "Investment", icon: "📈", insight: "Wealth-building portfolio fund" },
  { value: CapitalGoalCategory.BUSINESS, label: "Business", icon: "🏢", insight: "Entrepreneurship capital reserve" },
  { value: CapitalGoalCategory.OTHER, label: "Other", icon: "🎯", insight: "Custom savings target" },
];

export function GoalModal({ isOpen, onClose, goal, accounts = [], monthlyBurnRate = 0, onSave, onDelete }: GoalModalProps) {
  const isEditing = !!goal;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<CapitalGoalPriority>(CapitalGoalPriority.MEDIUM);
  const [vehicle, setVehicle] = useState("");
  const [monthlyAllocation, setMonthlyAllocation] = useState("");
  const [linkedAccountId, setLinkedAccountId] = useState<string>("");
  const [category, setCategory] = useState<string>(CapitalGoalCategory.OTHER);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setName(goal.name);
        setDescription(goal.description ?? "");
        setTarget((goal.target / 100).toString());
        setCurrent((goal.current / 100).toString());
        setDeadline(goal.deadline ? new Date(goal.deadline) : undefined);
        setPriority(goal.priority);
        setVehicle(goal.vehicle ?? "");
        setMonthlyAllocation(goal.monthlyAllocation ? (goal.monthlyAllocation / 100).toString() : "");
        setLinkedAccountId(goal.linkedAccountId ?? "");
        setCategory(goal.category ?? CapitalGoalCategory.OTHER);
      } else {
        setName("");
        setDescription("");
        setTarget("");
        setCurrent("");
        setDeadline(undefined);
        setPriority(CapitalGoalPriority.MEDIUM);
        setVehicle("");
        setMonthlyAllocation("");
        setLinkedAccountId("");
        setCategory(CapitalGoalCategory.OTHER);
      }
      setErrors({});
      setSaveError(null);
      setConfirmDelete(false);
    }
  }, [isOpen, goal]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Goal name is required";
    if (!target || Number(target) <= 0) newErrors.target = "Target amount must be greater than 0";
    if (current && Number(current) < 0) newErrors.current = "Current amount cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError(null);
    onClose();
    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        target: Math.round(Number(target) * 100),
        current: Math.round(Number(current || 0) * 100),
        deadline: deadline ? format(deadline, "yyyy-MM-dd") : null,
        priority,
        vehicle: vehicle.trim() || null,
        monthlyAllocation: monthlyAllocation ? Math.round(Number(monthlyAllocation) * 100) : undefined,
        linkedAccountId: linkedAccountId || null,
        category,
        description: description.trim() || null,
      });
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!goal || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(goal.id);
      onClose();
    } catch {
      setSaveError("Failed to delete goal. Please try again.");
      setConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const targetNum = Number(target) || 0;
  const currentNum = Number(current) || 0;
  const progress = targetNum > 0 ? Math.min(100, Math.round((currentNum / targetNum) * 100)) : 0;
  const allocationNum = Number(monthlyAllocation) || 0;
  const remaining = Math.max(0, targetNum - currentNum);

  // CapitalOS Intelligence: Goal feasibility calculations (FIXED: was inverted)
  const monthsToGoal = allocationNum > 0 ? Math.ceil(remaining / allocationNum) : null;
  const isOnTrack = monthsToGoal !== null && deadline
    ? new Date(deadline).getTime() > new Date(Date.now()).setMonth(new Date().getMonth() + monthsToGoal)
    : null;
  const goalInsight = monthsToGoal
    ? isOnTrack === true
      ? { type: "success", message: `On track! At ฿${allocationNum.toLocaleString()}/mo you'll reach this goal in ${monthsToGoal} months.` }
      : isOnTrack === false
        ? { type: "warning", message: `At ฿${allocationNum.toLocaleString()}/mo, you'll reach this goal in ${monthsToGoal} months — consider increasing your allocation.` }
        : { type: "success", message: `You'll reach this goal in ${monthsToGoal} months at current rate.` }
    : deadline
      ? { type: "info", message: "Set a monthly allocation to see timeline insights." }
      : null;

  const categoryInsight = goalCategories.find(c => c.value === category);
  const liquidAccounts = accounts.filter(a => !a.archivedAt && a.balance > 0);
  const totalLiquid = liquidAccounts.reduce((sum, a) => sum + a.balance, 0) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{
          background: "var(--cos-surface)",
          borderColor: "var(--cos-border-subtle)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--cos-accent)]" />
            <h2 className="text-lg font-bold">
              {isEditing ? "Edit Goal" : "Create New Goal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
          {/* Save error banner */}
          {saveError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {saveError}
            </div>
          )}

          {/* Goal Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              Goal Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, New Car, Vacation"
              className="w-full rounded-xl border bg-black/20 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
              style={{ borderColor: errors.name ? "#ef4444" : "var(--cos-border-subtle)" }}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)]">
              Description
              <span className="ml-2 text-[10px] font-normal text-[var(--cos-text-3)]">optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context or note about this goal…"
              rows={2}
              maxLength={300}
              className="w-full resize-none rounded-xl border bg-black/20 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
              style={{ borderColor: "var(--cos-border-subtle)" }}
            />
          </div>

          {/* Amounts Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
                Target Amount
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">฿</span>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border bg-black/20 py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                  style={{ borderColor: errors.target ? "#ef4444" : "var(--cos-border-subtle)" }}
                />
              </div>
              {errors.target && <p className="text-xs text-red-500">{errors.target}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
                Current Amount
                <Info className="h-3.5 w-3.5 opacity-50" />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">฿</span>
                <input
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border bg-black/20 py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                  style={{ borderColor: errors.current ? "#ef4444" : "var(--cos-border-subtle)" }}
                />
              </div>
              {errors.current && <p className="text-xs text-red-500">{errors.current}</p>}
            </div>
          </div>

          {/* Progress Preview */}
          {targetNum > 0 && (
            <div className="space-y-2 rounded-xl bg-black/10 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--cos-text-3)]">Progress Preview</span>
                <span className="font-medium text-[var(--cos-accent)]">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[var(--cos-accent)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--cos-text-3)]">
                {fmtCurrency(currentNum)} of {fmtCurrency(targetNum)}
              </p>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Goal Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {goalCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "rounded-xl border px-1 py-2 text-[10px] font-medium transition-all text-center",
                    category === cat.value
                      ? "border-[var(--cos-accent)] bg-[var(--cos-accent-muted)] text-[var(--cos-accent)]"
                      : "border-[var(--cos-border-subtle)] bg-black/10 hover:bg-black/20 text-[var(--cos-text-2)]"
                  )}
                  title={cat.insight}
                >
                  <span className="text-base">{cat.icon}</span>
                  <div className="mt-0.5 truncate leading-tight">{cat.label}</div>
                </button>
              ))}
            </div>
            {categoryInsight && (
              <p className="text-xs text-[var(--cos-info)] flex items-center gap-1">
                <Info className="h-3 w-3" />
                {categoryInsight.insight}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              Target Deadline
              <span className="ml-auto text-[10px] font-normal text-[var(--cos-text-3)]">optional</span>
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={deadline ? format(deadline, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const parsed = parseISO(e.target.value);
                    setDeadline(isValid(parsed) ? parsed : undefined);
                  } else {
                    setDeadline(undefined);
                  }
                }}
                className="flex-1 rounded-xl border bg-black/20 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                style={{ borderColor: "var(--cos-border-subtle)", colorScheme: "dark" }}
              />
              {deadline && (
                <button
                  type="button"
                  onClick={() => setDeadline(undefined)}
                  className="rounded-xl border px-3 py-2 text-xs text-[var(--cos-text-3)] hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--cos-border-subtle)" }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Monthly Allocation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Monthly Allocation
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">฿</span>
              <input
                type="number"
                value={monthlyAllocation}
                onChange={(e) => setMonthlyAllocation(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border bg-black/20 py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              />
            </div>
          </div>

          {/* Linked Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)]">Linked Account</label>
            <Select value={linkedAccountId || "__none__"} onValueChange={(v) => setLinkedAccountId(v === "__none__" ? "" : v)}>
              <SelectTrigger
                className="w-full rounded-xl border bg-black/20 py-3 px-4 text-sm h-auto"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              >
                <SelectValue placeholder="Not linked to an account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not linked to an account</SelectItem>
                {liquidAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} — {fmtCurrency(account.balance / 100)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feasibility Insight */}
          {goalInsight && (
            <div
              className={cn(
                "rounded-xl p-4 border space-y-2",
                goalInsight.type === "success" && "bg-[var(--cos-positive-muted)] border-[var(--cos-positive)]/30",
                goalInsight.type === "warning" && "bg-[var(--cos-warning-muted)] border-[var(--cos-warning)]/30",
                goalInsight.type === "info" && "bg-[var(--cos-info-muted)] border-[var(--cos-info)]/30"
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className={cn(
                  "h-4 w-4",
                  goalInsight.type === "success" && "text-[var(--cos-positive)]",
                  goalInsight.type === "warning" && "text-[var(--cos-warning)]",
                  goalInsight.type === "info" && "text-[var(--cos-info)]"
                )} />
                <span className="text-sm font-semibold">CapitalOS Insight</span>
              </div>
              <p className={cn(
                "text-xs",
                goalInsight.type === "success" && "text-[var(--cos-positive)]",
                goalInsight.type === "warning" && "text-[var(--cos-warning)]",
                goalInsight.type === "info" && "text-[var(--cos-info)]"
              )}>
                {goalInsight.message}
              </p>
              {monthsToGoal && totalLiquid > 0 && (
                <p className="text-xs text-[var(--cos-text-3)]">
                  Liquid capital available: {fmtCurrency(totalLiquid)} across {liquidAccounts.length} accounts
                </p>
              )}
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)]">Priority Level</label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriority(option.value)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    priority === option.value
                      ? "border-[var(--cos-accent)] bg-[var(--cos-accent-muted)]"
                      : "border-[var(--cos-border-subtle)] bg-black/10 hover:bg-black/20"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ background: option.color }} />
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Investment Vehicle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Investment Vehicle
            </label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="e.g., Savings Account, S&P 500 ETF, Government Bonds"
              className="w-full rounded-xl border bg-black/20 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
              style={{ borderColor: "var(--cos-border-subtle)" }}
            />
          </div>
        </div>

        {/* Footer */}
        {confirmDelete ? (
          <div
            className="border-t p-4 space-y-3"
            style={{ borderColor: "var(--cos-border-subtle)" }}
          >
            <p className="text-sm text-center" style={{ color: "var(--cos-text-2)" }}>
              This will archive the goal — are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting…" : "Delete Goal"}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 border-t p-6"
            style={{ borderColor: "var(--cos-border-subtle)" }}
          >
            {isEditing && onDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-[var(--cos-accent)] px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Saving…" : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditing ? "Update Goal" : "Create Goal"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
