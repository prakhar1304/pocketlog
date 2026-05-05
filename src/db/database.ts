import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import type { Goal } from "../types/goal";

const DB_NAME = "pocketlog.db";

/** Shape of legacy persisted transactions (Zustand + AsyncStorage). */
type LegacyTransaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note?: string;
};

const LEGACY_TX_KEY = "pocketlog-transactions";
const LEGACY_GOALS_KEY = "pocketlog-goals";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function runMigrations(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  const current = row?.user_version ?? 0;
  if (current < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income','expense')),
        date TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL
      );
      PRAGMA user_version = 1;
    `);
  }
}

function parsePersistedState<T>(raw: string | null): T | null {
  if (raw == null) return null;
  try {
    const parsed = JSON.parse(raw) as { state?: T };
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

async function importLegacyTransactionsIfNeeded(db: SQLite.SQLiteDatabase) {
  const countRow = await db.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) AS c FROM transactions"
  );
  if ((countRow?.c ?? 0) > 0) {
    await AsyncStorage.removeItem(LEGACY_TX_KEY);
    return;
  }
  const raw = await AsyncStorage.getItem(LEGACY_TX_KEY);
  const slice = parsePersistedState<{ transactions: LegacyTransaction[] }>(raw);
  const txs = slice?.transactions;
  if (!Array.isArray(txs) || txs.length === 0) {
    await AsyncStorage.removeItem(LEGACY_TX_KEY);
    return;
  }
  await db.withTransactionAsync(async () => {
    for (const t of txs) {
      await db.runAsync(
        `INSERT INTO transactions (id, title, category, amount, type, date, note)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.title,
          t.category,
          t.amount,
          t.type,
          t.date,
          t.note ?? "",
        ]
      );
    }
  });
  await AsyncStorage.removeItem(LEGACY_TX_KEY);
}

async function importLegacyGoalsIfNeeded(db: SQLite.SQLiteDatabase) {
  const countRow = await db.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) AS c FROM goals"
  );
  if ((countRow?.c ?? 0) > 0) {
    await AsyncStorage.removeItem(LEGACY_GOALS_KEY);
    return;
  }
  const raw = await AsyncStorage.getItem(LEGACY_GOALS_KEY);
  const slice = parsePersistedState<{ goals: Goal[] }>(raw);
  const goals = slice?.goals;
  if (!Array.isArray(goals) || goals.length === 0) {
    await AsyncStorage.removeItem(LEGACY_GOALS_KEY);
    return;
  }
  await db.withTransactionAsync(async () => {
    for (const g of goals) {
      await db.runAsync(`INSERT INTO goals (id, payload) VALUES (?, ?)`, [
        g.id,
        JSON.stringify(g),
      ]);
    }
  });
  await AsyncStorage.removeItem(LEGACY_GOALS_KEY);
}

/**
 * Opens the SQLite database, applies migrations, and one-time import from
 * legacy Zustand+AsyncStorage keys when tables are still empty.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await runMigrations(db);
      await importLegacyTransactionsIfNeeded(db);
      await importLegacyGoalsIfNeeded(db);
      return db;
    })();
  }
  return dbPromise;
}

export async function clearAllTables(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM transactions;
    DELETE FROM goals;
  `);
}
