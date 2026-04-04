import AsyncStorage from "@react-native-async-storage/async-storage";

import { appStoreDefaults, useAppStore } from "../store/useAppStore";
import { useGoalStore } from "../store/useGoalStore";
import { useTransactionStore } from "../store/useTransactionStore";

const PERSIST_KEYS = [
  "pocketlog-app",
  "pocketlog-transactions",
  "pocketlog-goals",
] as const;

/** Clears persisted slices and resets in-memory stores (returns user to onboarding). */
export async function clearAllUserData() {
  await Promise.all(PERSIST_KEYS.map((k) => AsyncStorage.removeItem(k)));
  useTransactionStore.setState({ transactions: [] });
  useGoalStore.setState({ goals: [] });
  useAppStore.setState({
    ...appStoreDefaults,
    hasOnboarded: false,
  });
}
