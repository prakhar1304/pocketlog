import type { CategoryKey } from "../constants/theme";

export type SavingsGoal = {
  id: string;
  type: "savings";
  title: string;
  subtitle?: string;
  target: number;
  saved: number;
  emoji: string;
};

export type StreakTrackingKind = "manual" | "daily_log";

export type StreakGoal = {
  id: string;
  type: "streak";
  title: string;
  targetDays: number;
  /** 1-based: today is day N of the challenge (manual mode only). */
  currentDay: number;
  emoji: string;
  /**
   * `daily_log`: progress from consecutive days with any logged transaction.
   * `manual` (default): you set the current day when creating / editing.
   */
  streakKind?: StreakTrackingKind;
};

export type BudgetGoal = {
  id: string;
  type: "budget";
  title: string;
  limit: number;
  category: CategoryKey;
  alertEnabled: boolean;
  alertAtPercent: number;
  emoji: string;
};

export type Goal = SavingsGoal | StreakGoal | BudgetGoal;

export type GoalInput =
  | Omit<SavingsGoal, "id">
  | Omit<StreakGoal, "id">
  | Omit<BudgetGoal, "id">;
