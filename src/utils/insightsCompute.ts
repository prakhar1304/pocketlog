import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from "date-fns";

import type { CategoryKey } from "../constants/theme";
import { LightColors } from "../constants/theme";
import type { Transaction } from "../store/useTransactionStore";

export function filterByCalendarMonth(
  transactions: Transaction[],
  ref: Date
): Transaction[] {
  const prefix = format(startOfMonth(ref), "yyyy-MM");
  return transactions.filter((t) => t.date.startsWith(prefix));
}

export function sumExpenses(txns: Transaction[]) {
  return txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
}

export function sumIncome(txns: Transaction[]) {
  return txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
}

export function expensesByCategory(
  txns: Transaction[]
): Partial<Record<CategoryKey, number>> {
  const m: Partial<Record<CategoryKey, number>> = {};
  for (const t of txns) {
    if (t.type !== "expense") continue;
    m[t.category] = (m[t.category] ?? 0) + t.amount;
  }
  return m;
}

export function biggestCategory(
  byCat: Partial<Record<CategoryKey, number>>
): { key: CategoryKey; amount: number } | null {
  let best: CategoryKey | null = null;
  let max = 0;
  for (const [k, v] of Object.entries(byCat)) {
    if (typeof v === "number" && v > max) {
      max = v;
      best = k as CategoryKey;
    }
  }
  return best ? { key: best, amount: max } : null;
}

export type DonutSeg = {
  key: CategoryKey;
  value: number;
  percent: number;
  color: string;
  label: string;
};

export function toDonutSegments(
  byCat: Partial<Record<CategoryKey, number>>,
  labelFor: (k: CategoryKey) => string,
  categoryColors: Record<CategoryKey, string> = LightColors.categories as Record<
    CategoryKey,
    string
  >
): DonutSeg[] {
  const entries = Object.entries(byCat).filter(
    ([, v]) => typeof v === "number" && v > 0
  ) as [CategoryKey, number][];
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total <= 0) return [];
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      key: k,
      value: v,
      percent: Math.round((v / total) * 100),
      color: categoryColors[k],
      label: labelFor(k),
    }));
}

export function daysInMonth(ref: Date) {
  return Number(format(endOfMonth(ref), "d"));
}

/** Mean expense per calendar day in that month (includes zero days). */
export function avgDailyExpense(monthExpenseTotal: number, ref: Date) {
  const d = daysInMonth(ref);
  return d > 0 ? Math.round(monthExpenseTotal / d) : 0;
}

export function topExpenseTransactions(txns: Transaction[], n: number) {
  return [...txns]
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

export function weekDailyExpenses(
  transactions: Transaction[],
  weekStart: Date
): number[] {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(start, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  return days.map((d) => {
    const iso = format(d, "yyyy-MM-dd");
    return transactions
      .filter((t) => t.type === "expense" && t.date === iso)
      .reduce((s, t) => s + t.amount, 0);
  });
}

export function thisAndLastWeekDaily(transactions: Transaction[], ref = new Date()) {
  const thisStart = startOfWeek(ref, { weekStartsOn: 1 });
  const lastStart = subWeeks(thisStart, 1);
  return {
    thisWeek: weekDailyExpenses(transactions, thisStart),
    lastWeek: weekDailyExpenses(transactions, lastStart),
    dayLabels: ["M", "T", "W", "T", "F", "S", "S"] as const,
  };
}

export function canGoToNextMonth(selected: Date, today = new Date()) {
  return isBefore(endOfMonth(selected), endOfMonth(today));
}
