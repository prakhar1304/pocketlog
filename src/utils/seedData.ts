import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
} from "date-fns";

import type { CategoryKey } from "../constants/theme";

export type SeedTransaction = {
  id: string;
  title: string;
  category: CategoryKey;
  amount: number;
  type: "income" | "expense";
  date: string;
  note: string;
};

export const DUMMY_TRANSACTIONS: SeedTransaction[] = [
  {
    id: "t1",
    title: "Joe's Pizza Parlor",
    category: "food",
    amount: 2450,
    type: "expense",
    date: "2025-10-24",
    note: "Lunch with team",
  },
  {
    id: "t2",
    title: "Uber Trip",
    category: "transport",
    amount: 1000,
    type: "expense",
    date: "2025-10-24",
    note: "",
  },
  {
    id: "t3",
    title: "Monthly Salary",
    category: "salary",
    amount: 84290,
    type: "income",
    date: "2025-10-23",
    note: "October salary",
  },
  {
    id: "t4",
    title: "Whole Foods Market",
    category: "food",
    amount: 1812,
    type: "expense",
    date: "2025-10-23",
    note: "Groceries",
  },
  {
    id: "t5",
    title: "Netflix",
    category: "entertainment",
    amount: 1199,
    type: "expense",
    date: "2025-10-22",
    note: "",
  },
  {
    id: "t6",
    title: "Apple Store",
    category: "shopping",
    amount: 33900,
    type: "expense",
    date: "2025-10-20",
    note: "AirPods Pro",
  },
  {
    id: "t7",
    title: "Monthly Rent",
    category: "housing",
    amount: 18000,
    type: "expense",
    date: "2025-10-01",
    note: "",
  },
  {
    id: "t8",
    title: "Freelance Payment",
    category: "salary",
    amount: 25000,
    type: "income",
    date: "2025-10-15",
    note: "Design project",
  },
];

/** Shift dummy dates so the newest transaction is today (weekly chart + recents stay meaningful). */
export function anchorDummyTransactionsToToday(
  list: SeedTransaction[]
): SeedTransaction[] {
  if (list.length === 0) return list;
  const newest = list.reduce(
    (max, t) => (t.date > max ? t.date : max),
    list[0].date
  );
  const ref = startOfDay(parseISO(newest));
  const today = startOfDay(new Date());
  return list.map((t) => {
    const d = startOfDay(parseISO(t.date));
    const delta = differenceInCalendarDays(d, ref);
    return { ...t, date: format(addDays(today, delta), "yyyy-MM-dd") };
  });
}
