import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CategoryKey } from "../constants/theme";
import {
  DUMMY_TRANSACTIONS,
  anchorDummyTransactionsToToday,
} from "../utils/seedData";

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
  seedIfEmpty: () => void;
  addTransaction: (t: Omit<Transaction, "id"> & { id?: string }) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;
};

function generateId() {
  return `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      seedIfEmpty: () => {
        if (get().transactions.length === 0) {
          set({
            transactions: anchorDummyTransactionsToToday([...DUMMY_TRANSACTIONS]),
          });
        }
      },
      addTransaction: (t) => {
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
        set((s) => ({
          transactions: [row, ...s.transactions],
        }));
      },
      updateTransaction: (id, patch) => {
        set((s) => ({
          transactions: s.transactions.map((row) =>
            row.id === id ? { ...row, ...patch } : row
          ),
        }));
      },
      deleteTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((row) => row.id !== id),
        }));
      },
    }),
    {
      name: "pocketlog-transactions",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
