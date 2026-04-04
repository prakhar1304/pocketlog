import { endOfMonth, parseISO, startOfMonth } from "date-fns";

import type { CategoryKey } from "../constants/theme";
import type { Transaction } from "../store/useTransactionStore";

export function spendInMonthForCategory(
  transactions: Transaction[],
  category: CategoryKey,
  ref: Date = new Date()
): number {
  const start = startOfMonth(ref);
  const end = endOfMonth(ref);
  return transactions
    .filter((t) => {
      if (t.type !== "expense" || t.category !== category) return false;
      const d = parseISO(t.date);
      return d >= start && d <= end;
    })
    .reduce((s, t) => s + t.amount, 0);
}
