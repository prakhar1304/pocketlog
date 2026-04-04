import type { CategoryKey } from "../constants/theme";
import type { Transaction } from "../store/useTransactionStore";

export type TransactionChipFilter =
  | "all"
  | "income"
  | "expense"
  | CategoryKey;

export function filterTransactions(
  transactions: Transaction[],
  query: string,
  chip: TransactionChipFilter
): Transaction[] {
  const q = query.trim().toLowerCase();
  return transactions.filter((t) => {
    if (q) {
      const hay = `${t.title} ${t.note} ${t.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (chip === "all") return true;
    if (chip === "income" || chip === "expense") return t.type === chip;
    return t.category === chip;
  });
}
