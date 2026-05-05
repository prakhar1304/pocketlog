import { create } from "zustand";

import {
  deleteGoalRow,
  insertGoalRow,
  updateGoalRow,
} from "../db/goalsRepo";
import type { Goal, GoalInput } from "../types/goal";

type GoalState = {
  goals: Goal[];
  addGoal: (goal: GoalInput) => Promise<void>;
  updateGoal: (id: string, patch: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
};

function generateId() {
  return `goal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useGoalStore = create<GoalState>()((set, get) => ({
  goals: [],
  addGoal: async (g) => {
    const id = generateId();
    const row = { ...g, id } as Goal;
    await insertGoalRow(row);
    set((s) => ({ goals: [...s.goals, row] }));
  },
  updateGoal: async (id, patch) => {
    const prev = get().goals.find((g) => g.id === id);
    if (!prev) return;
    const merged = { ...prev, ...patch } as Goal;
    await updateGoalRow(merged);
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? merged : g)),
    }));
  },
  removeGoal: async (id) => {
    await deleteGoalRow(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },
}));

export type { BudgetGoal, Goal, GoalInput, SavingsGoal, StreakGoal } from "../types/goal";
