"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Save, Target, CalendarIcon, Info, TrendingUp, ChevronDown, Sparkles } from "lucide-react";
import { CapitalGoal, CapitalGoalPriority, CapitalAccount } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  }) => Promise<void>;
}

const priorityOptions: { value: CapitalGoalPriority; label: string; color: string }[] = [
  { value: CapitalGoalPriority.CRITICAL, label: "Critical", color: "#ef4444" },
  { value: CapitalGoalPriority.HIGH, label: "High", color: "#f97316" },
  { value: CapitalGoalPriority.MEDIUM, label: "Medium", color: "#3b82f6" },
  { value: CapitalGoalPriority.LOW, label: "Low", color: "#64748b" },
];

const goalCategories = [
  { value: "emergency", label: "Emergency Fund", icon: "🛡️", insight: "Safety buffer for unexpected expenses" },
  { value: "retirement", label: "Retirement", icon: "🏖️", insight: "Long-term wealth accumulation" },
  { value: "major_purchase", label: "Major Purchase", icon: "🚗", insight: "Vehicle, home, or large asset" },
  { value: "debt_payoff", label: "Debt Payoff", icon: "💳", insight: "Liability reduction goal" },
  { value: "education", label: "Education", icon: "📚", insight: "Learning and skill investment" },
  { value: "travel", label: "Travel", icon: "✈️", insight: "Experience and adventure fund" },
  { value: "wedding", label: "Wedding", icon: "💒", insight: "Life milestone planning" },
  { value: "other", label: "Other Goal", icon: "🎯", insight: "Custom savings target" },
];

export function GoalModal({ isOpen, onClose, goal, accounts = [], monthlyBurnRate = 0, onSave }: GoalModalProps) {
  const isEditing = !!goal;
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<CapitalGoalPriority>(CapitalGoalPriority.MEDIUM);
  const [vehicle, setVehicle] = useState("");
  const [monthlyAllocation, setMonthlyAllocation] = useState("");
  const [linkedAccountId, setLinkedAccountId] = useState<string>("");
  const [category, setCategory] = useState<string>("other");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setName(goal.name);
        setTarget((goal.target / 100).toString());
        setCurrent((goal.current / 100).toString());
        setDeadline(goal.deadline ? new Date(goal.deadline) : undefined);
        setPriority(goal.priority);
        setVehicle(goal.vehicle ?? "");
        setMonthlyAllocation("");
        setLinkedAccountId("");
        setCategory("other");
      } else {
        setName("");
        setTarget("");
        setCurrent("");
        setDeadline(undefined);
        setPriority(CapitalGoalPriority.MEDIUM);
        setVehicle("");
        setMonthlyAllocation("");
        setLinkedAccountId("");
        setCategory("other");
      }
      setErrors({});
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
      });
      onClose();
    } catch (error) {
      console.error("Failed to save goal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const targetNum = Number(target) || 0;
  const currentNum = Number(current) || 0;
  const progress = targetNum > 0 ? Math.min(100, Math.round((currentNum / targetNum) * 100)) : 0;
  const allocationNum = Number(monthlyAllocation) || 0;
  const remaining = targetNum - currentNum;

  // CapitalOS Intelligence: Goal feasibility calculations
  const monthsToGoal = allocationNum > 0 ? Math.ceil(remaining / allocationNum) : null;
  const projectedDate = monthsToGoal && deadline
    ? new Date(deadline).getTime() > new Date().setMonth(new Date().getMonth() + monthsToGoal)
    : null;
  const goalInsight = monthsToGoal
    ? projectedDate
      ? { type: "warning", message: `At ฿${allocationNum.toLocaleString()}/mo, you'll reach this goal in ${monthsToGoal} months. Consider increasing allocation.` }
      : { type: "success", message: `On track! You'll reach this goal in ${monthsToGoal} months.` }
    : deadline
      ? { type: "info", message: "Set a monthly allocation to see timeline insights." }
      : null;

  // CapitalOS Intelligence: Category-specific insights
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
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
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

          {/* Amounts Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Target Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
                Target Amount
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">
                  ฿
                </span>
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

            {/* Current Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
                Current Amount
                <Info className="h-3.5 w-3.5 opacity-50" />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">
                  ฿
                </span>
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

          {/* Category - CapitalOS Intelligence Layer */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Goal Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {goalCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-xs font-medium transition-all text-center",
                    category === cat.value
                      ? "border-[var(--cos-accent)] bg-[var(--cos-accent-muted)] text-[var(--cos-accent)]"
                      : "border-[var(--cos-border-subtle)] bg-black/10 hover:bg-black/20 text-[var(--cos-text-2)]"
                  )}
                  title={cat.insight}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <div className="mt-1 truncate">{cat.label}</div>
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

          {/* Deadline with Shadcn/UI Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              Target Deadline
            </label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border bg-black/20 py-3 px-4 text-sm hover:bg-black/30",
                    !deadline && "text-muted-foreground"
                  )}
                  style={{ borderColor: "var(--cos-border-subtle)" }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {deadline ? format(deadline, "PPP") : <span className="text-[var(--cos-text-3)]">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                style={{
                  background: "var(--cos-surface)",
                  borderColor: "var(--cos-border-subtle)",
                }}
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    setDeadline(date);
                    setDateOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-[var(--cos-text-3)]">
              Setting a deadline enables CapitalOS to generate timeline insights and alerts.
            </p>
          </div>

          {/* Monthly Allocation - Intelligence Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Monthly Allocation
              <Info className="h-3.5 w-3.5 opacity-50" />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">
                ฿
              </span>
              <input
                type="number"
                value={monthlyAllocation}
                onChange={(e) => setMonthlyAllocation(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border bg-black/20 py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              />
            </div>
            <p className="text-xs text-[var(--cos-text-3)]">
              How much you plan to contribute monthly. Used by CapitalOS intelligence to generate timeline insights.
            </p>
          </div>

          {/* Linked Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)]">
              Linked Account
            </label>
            <div className="relative">
              <select
                value={linkedAccountId}
                onChange={(e) => setLinkedAccountId(e.target.value)}
                className="w-full rounded-xl border bg-black/20 py-3 px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)] cursor-pointer"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              >
                <option value="">Not linked to an account</option>
                {liquidAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} — {fmtCurrency(account.balance / 100)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cos-text-3)] pointer-events-none" />
            </div>
            <p className="text-xs text-[var(--cos-text-3)]">
              Link to track real-time balance updates in the intelligence layer.
            </p>
          </div>

          {/* CapitalOS Intelligence Insights */}
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
                <span className="text-sm font-semibold text-[var(--cos-text)]">CapitalOS Insight</span>
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
                <p className="text-xs text-[var(--cos-text-3)] mt-1">
                  Available liquid capital: {fmtCurrency(totalLiquid)} across {liquidAccounts.length} accounts
                </p>
              )}
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cos-text-2)]">
              Priority Level
            </label>
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
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: option.color }}
                    />
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
            <p className="text-xs text-[var(--cos-text-3)]">
              Where the funds are held. Used by intelligence layer to track performance and suggest optimizations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t p-6"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
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
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "Update Goal" : "Create Goal"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
