import {
  format,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

import type { Transaction } from "../store/useTransactionStore";

export type TransactionSection = {
  title: string;
  dateKey: string;
  data: Transaction[];
};

function sectionTitleForDateKey(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return "TODAY";
  if (isYesterday(d)) return "YESTERDAY";
  return format(d, "MMM d, yyyy").toUpperCase();
}

/** Newest days first; preserves stable order within a day (list order). */
export function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionSection[] {
  const sorted = [...transactions].sort((a, b) => {
    const c = b.date.localeCompare(a.date);
    if (c !== 0) return c;
    return b.id.localeCompare(a.id);
  });

  const byDay = new Map<string, Transaction[]>();
  for (const t of sorted) {
    const list = byDay.get(t.date) ?? [];
    list.push(t);
    byDay.set(t.date, list);
  }

  const keys = [...byDay.keys()].sort((a, b) => b.localeCompare(a));
  return keys.map((dateKey) => ({
    title: sectionTitleForDateKey(dateKey),
    dateKey,
    data: byDay.get(dateKey)!,
  }));
}
