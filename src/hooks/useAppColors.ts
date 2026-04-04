import { getAppColors, type AppThemeMode } from "../constants/theme";
import { useAppStore } from "../store/useAppStore";

export function useAppColors() {
  const theme = useAppStore((s) => s.theme) as AppThemeMode;
  return getAppColors(theme);
}

export function useAppTheme(): AppThemeMode {
  return useAppStore((s) => s.theme) as AppThemeMode;
}
