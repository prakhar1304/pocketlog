import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark";

type AppState = {
  hasOnboarded: boolean;
  /** After intro carousel; next step is profile capture (once). */
  hasFinishedIntroSlides: boolean;
  displayName: string;
  email: string;
  /** Gross monthly income in whole rupees; null = not shared. */
  monthlyIncomeRupees: number | null;
  notificationsEnabled: boolean;
  theme: ThemePreference;
  setHasOnboarded: (value: boolean) => void;
  setHasFinishedIntroSlides: (value: boolean) => void;
  setDisplayName: (value: string) => void;
  setEmail: (value: string) => void;
  setMonthlyIncomeRupees: (value: number | null) => void;
  setNotificationsEnabled: (value: boolean) => void;
  setTheme: (value: ThemePreference) => void;
};

const defaults = {
  hasOnboarded: false,
  hasFinishedIntroSlides: false,
  displayName: "",
  email: "",
  monthlyIncomeRupees: null as number | null,
  notificationsEnabled: true,
  theme: "light" as ThemePreference,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaults,
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
      setHasFinishedIntroSlides: (value) =>
        set({ hasFinishedIntroSlides: value }),
      setDisplayName: (displayName) => set({ displayName }),
      setEmail: (email) => set({ email }),
      setMonthlyIncomeRupees: (monthlyIncomeRupees) =>
        set({ monthlyIncomeRupees }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "pocketlog-app",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        hasFinishedIntroSlides: s.hasFinishedIntroSlides,
        displayName: s.displayName,
        email: s.email,
        monthlyIncomeRupees: s.monthlyIncomeRupees,
        notificationsEnabled: s.notificationsEnabled,
        theme: s.theme,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined;
        return {
          ...current,
          hasOnboarded: p?.hasOnboarded ?? current.hasOnboarded,
          hasFinishedIntroSlides:
            p?.hasFinishedIntroSlides ?? current.hasFinishedIntroSlides,
          displayName: p?.displayName ?? current.displayName,
          email: p?.email ?? current.email,
          monthlyIncomeRupees:
            p?.monthlyIncomeRupees !== undefined
              ? p.monthlyIncomeRupees
              : current.monthlyIncomeRupees,
          notificationsEnabled:
            p?.notificationsEnabled ?? current.notificationsEnabled,
          theme: p?.theme ?? current.theme,
        };
      },
    }
  )
);

/** Fresh install / after wipe — in-memory defaults before rehydration. */
export const appStoreDefaults = defaults;
