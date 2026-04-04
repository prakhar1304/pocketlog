import { format, startOfDay, subDays } from "date-fns";

import type { Transaction } from "../store/useTransactionStore";
import type { BudgetGoal, Goal } from "../types/goal";

function sumExpensesInInclusiveDateRange(
  transactions: Transaction[],
  start: Date,
  end: Date
): number {
  const s = format(startOfDay(start), "yyyy-MM-dd");
  const e = format(startOfDay(end), "yyyy-MM-dd");
  return transactions
    .filter(
      (t) =>
        t.type === "expense" && t.date >= s && t.date <= e
    )
    .reduce((acc, t) => acc + t.amount, 0);
}

/** Last 7 days vs previous 7 days expense totals → % change. Null if no signal. */
export function weekOverWeekExpenseChange(
  transactions: Transaction[],
  now = new Date()
): {
  pct: number;
  thisWeek: number;
  prevWeek: number;
} | null {
  const end = startOfDay(now);
  const thisStart = subDays(end, 6);
  const prevEnd = subDays(end, 7);
  const prevStart = subDays(end, 13);

  const thisWeek = sumExpensesInInclusiveDateRange(
    transactions,
    thisStart,
    end
  );
  const prevWeek = sumExpensesInInclusiveDateRange(
    transactions,
    prevStart,
    prevEnd
  );

  if (thisWeek === 0 && prevWeek === 0) return null;
  if (prevWeek === 0 && thisWeek > 0) {
    return { pct: 100, thisWeek, prevWeek };
  }
  const pct = Math.round(((thisWeek - prevWeek) / prevWeek) * 100);
  return { pct, thisWeek, prevWeek };
}

/** Consecutive calendar days ending on `ref` with ≥1 transaction (any type). */
export function consecutiveDaysWithAnyTransaction(
  transactions: Transaction[],
  ref: Date = new Date()
): number {
  let d = startOfDay(ref);
  let n = 0;
  const max = 400;
  while (n < max) {
    const iso = format(d, "yyyy-MM-dd");
    const ok = transactions.some((t) => t.date === iso);
    if (!ok) break;
    n += 1;
    d = subDays(d, 1);
  }
  return n;
}

export function hasTransactionOnDate(
  transactions: Transaction[],
  day: Date
): boolean {
  const iso = format(startOfDay(day), "yyyy-MM-dd");
  return transactions.some((t) => t.date === iso);
}

export function budgetsOnTrackCounts(
  goals: Goal[],
  budgetSpend: Map<string, number>
): { onTrack: number; total: number } {
  const budgets = goals.filter((g): g is BudgetGoal => g.type === "budget");
  if (budgets.length === 0) return { onTrack: 0, total: 0 };
  let onTrack = 0;
  for (const g of budgets) {
    const spent = budgetSpend.get(g.id) ?? 0;
    if (spent < g.limit) onTrack += 1;
  }
  return { onTrack, total: budgets.length };
}

/** Last `count` calendar days ending at `ref`, oldest first. */
export function lastNDatesOldestFirst(ref: Date, count: number): Date[] {
  const end = startOfDay(ref);
  const out: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    out.push(subDays(end, i));
  }
  return out;
}

export function formatShortWeekday(d: Date): string {
  return format(d, "EEE");
}
