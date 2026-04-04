import type { CategoryKey } from "../constants/theme";

const LABELS: Record<CategoryKey, string> = {
  food: "Food & dining",
  transport: "Transport",
  housing: "Housing",
  health: "Health",
  shopping: "Shopping",
  entertainment: "Entertainment",
  salary: "Income",
  other: "Other",
};

const EMOJI: Record<CategoryKey, string> = {
  food: "🍕",
  transport: "🚗",
  housing: "🏠",
  health: "💊",
  shopping: "🛍️",
  entertainment: "🎬",
  salary: "💼",
  other: "📌",
};

export function categoryLabel(c: CategoryKey) {
  return LABELS[c];
}

export function categoryEmoji(c: CategoryKey) {
  return EMOJI[c];
}

/** Short label for filter chips (avoids duplicate “Income” vs type filter). */
export function categoryChipLabel(c: CategoryKey) {
  if (c === "salary") return "Salary";
  return LABELS[c].split("&")[0].trim();
}

export const ALL_CATEGORY_KEYS = Object.keys(LABELS) as CategoryKey[];
