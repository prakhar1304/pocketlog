import type { Transaction } from "../store/useTransactionStore";
import { getDatabase } from "./database";

type TxRow = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: string;
  date: string;
  note: string;
};

function rowToTransaction(row: TxRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    category: row.category as Transaction["category"],
    amount: row.amount,
    type: row.type as Transaction["type"],
    date: row.date,
    note: row.note ?? "",
  };
}

export async function fetchAllTransactions(): Promise<Transaction[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<TxRow>(
    `SELECT id, title, category, amount, type, date, note
     FROM transactions
     ORDER BY date DESC, id DESC`
  );
  return rows.map(rowToTransaction);
}

export async function insertTransaction(row: Transaction): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO transactions (id, title, category, amount, type, date, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.title,
      row.category,
      row.amount,
      row.type,
      row.date,
      row.note ?? "",
    ]
  );
}

export async function updateTransactionRow(
  id: string,
  patch: Partial<Omit<Transaction, "id">>
): Promise<void> {
  const db = await getDatabase();
  const cur = await db.getFirstAsync<TxRow>(
    `SELECT id, title, category, amount, type, date, note FROM transactions WHERE id = ?`,
    [id]
  );
  if (!cur) return;
  const next = {
    title: patch.title ?? cur.title,
    category: patch.category ?? cur.category,
    amount: patch.amount ?? cur.amount,
    type: patch.type ?? cur.type,
    date: patch.date ?? cur.date,
    note: patch.note ?? cur.note,
  };
  await db.runAsync(
    `UPDATE transactions SET title = ?, category = ?, amount = ?, type = ?, date = ?, note = ? WHERE id = ?`,
    [
      next.title,
      next.category,
      next.amount,
      next.type,
      next.date,
      next.note,
      id,
    ]
  );
}

export async function deleteTransactionRow(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
}
