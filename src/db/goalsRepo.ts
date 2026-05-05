import type { Goal } from "../types/goal";
import { getDatabase } from "./database";

export async function fetchAllGoals(): Promise<Goal[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ id: string; payload: string }>(
    `SELECT id, payload FROM goals ORDER BY rowid ASC`
  );
  return rows.map((r) => JSON.parse(r.payload) as Goal);
}

export async function insertGoalRow(goal: Goal): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`INSERT INTO goals (id, payload) VALUES (?, ?)`, [
    goal.id,
    JSON.stringify(goal),
  ]);
}

export async function updateGoalRow(goal: Goal): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE goals SET payload = ? WHERE id = ?`, [
    JSON.stringify(goal),
    goal.id,
  ]);
}

export async function deleteGoalRow(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id]);
}
