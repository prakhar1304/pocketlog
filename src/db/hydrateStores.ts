import { useGoalStore } from "../store/useGoalStore";
import { useTransactionStore } from "../store/useTransactionStore";
import { getDatabase } from "./database";
import { fetchAllGoals } from "./goalsRepo";
import { fetchAllTransactions } from "./transactionsRepo";

/** Ensures DB is open and loads transactions + goals into Zustand. */
export async function hydrateDataStores(): Promise<void> {
  await getDatabase();
  const [transactions, goals] = await Promise.all([
    fetchAllTransactions(),
    fetchAllGoals(),
  ]);
  useTransactionStore.setState({ transactions });
  useGoalStore.setState({ goals });
}
