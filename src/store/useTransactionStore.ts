import { create } from "zustand";

import type { CategoryKey } from "../constants/theme";
import {
  deleteTransactionRow,
  insertTransaction,
  updateTransactionRow,
} from "../db/transactionsRepo";

export type Transaction = {
  id: string;
  title: string;
  category: CategoryKey;
  amount: number;
  type: "income" | "expense";
  date: string;
  note: string;
};

type TransactionState = {
  transactions: Transaction[];
  addTransaction: (
    t: Omit<Transaction, "id"> & { id?: string }
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    patch: Partial<Omit<Transaction, "id">>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

function generateId() {
  return `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: [],
  addTransaction: async (t) => {
    const id = t.id ?? generateId();
    const row: Transaction = {
      id,
      title: t.title,
      category: t.category,
      amount: t.amount,
      type: t.type,
      date: t.date,
      note: t.note,
    };
    await insertTransaction(row);
    set((s) => ({
      transactions: [row, ...s.transactions],
    }));
  },
  updateTransaction: async (id, patch) => {
    await updateTransactionRow(id, patch);
    set((s) => ({
      transactions: s.transactions.map((row) =>
        row.id === id ? { ...row, ...patch } : row
      ),
    }));
  },
  deleteTransaction: async (id) => {
    await deleteTransactionRow(id);
    set((s) => ({
      transactions: s.transactions.filter((row) => row.id !== id),
    }));
  },
}));
