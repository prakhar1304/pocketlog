import type { Transaction } from "../store/useTransactionStore";

function escField(s: string) {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function transactionsToCsv(transactions: Transaction[]) {
  const header = "date,title,category,type,amount,note";
  const lines = transactions.map((t) =>
    [
      t.date,
      escField(t.title),
      t.category,
      t.type,
      String(t.amount),
      escField(t.note ?? ""),
    ].join(",")
  );
  return [header, ...lines].join("\n");
}
