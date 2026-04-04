import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Goal, GoalInput } from "../types/goal";

type GoalState = {
  goals: Goal[];
  /** @deprecated No-op — goals are user-created only. Kept for older call sites. */
  seedIfEmpty: () => void;
  addGoal: (goal: GoalInput) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
};

function generateId() {
  return `goal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      seedIfEmpty: () => {},
      addGoal: (g) => {
        const id = generateId();
        const row = { ...g, id } as Goal;
        set((s) => ({ goals: [...s.goals, row] }));
      },
      updateGoal: (id, patch) => {
        set((s) => ({
          goals: s.goals.map((row) =>
            row.id === id ? ({ ...row, ...patch } as Goal) : row
          ),
        }));
      },
      removeGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
      },
    }),
    {
      name: "pocketlog-goals",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export type { BudgetGoal, Goal, GoalInput, SavingsGoal, StreakGoal } from "../types/goal";
