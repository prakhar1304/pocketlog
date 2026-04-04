import {
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

import type { Transaction } from "../store/useTransactionStore";

export function selectTotals(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export type DaySpend = {
  date: Date;
  label: string;
  amount: number;
  iso: string;
  isToday: boolean;
};

export function getLast7DaysExpenseByDay(
  transactions: Transaction[],
  now = new Date()
): DaySpend[] {
  const end = startOfDay(now);
  const start = subDays(end, 6);
  const days = eachDayOfInterval({ start, end });
  const todayIso = format(end, "yyyy-MM-dd");

  return days.map((d) => {
    const iso = format(d, "yyyy-MM-dd");
    const amount = transactions
      .filter((t) => t.type === "expense" && t.date === iso)
      .reduce((s, t) => s + t.amount, 0);
    return {
      date: d,
      label: format(d, "EEE"),
      amount,
      iso,
      isToday: iso === todayIso,
    };
  });
}

export function weeklyExpenseTotal(days: DaySpend[]) {
  return days.reduce((s, d) => s + d.amount, 0);
}

/** Mean expense per day across the 7-day window (including zero days). */
export function averageDailySpend(days: DaySpend[]) {
  const total = weeklyExpenseTotal(days);
  return Math.round(total / 7);
}

export function recentTransactions(
  transactions: Transaction[],
  limit = 5
): Transaction[] {
  return [...transactions]
    .sort((a, b) => {
      const da = parseISO(a.date).getTime();
      const db = parseISO(b.date).getTime();
      if (db !== da) return db - da;
      return b.id.localeCompare(a.id);
    })
    .slice(0, limit);
}
