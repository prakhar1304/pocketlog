/**
 * Royal Amethyst Editorial — single source of truth (DESIGN.md).
 * No 1px borders for sections; depth via tonal surfaces + ambient shadows.
 */

export type AppThemeMode = "light" | "dark";

/** Light (default) palette */
export const LightColors = {
  primary: "#4800B2",
  primaryContainer: "#6200EE",
  onPrimary: "#FFFFFF",
  secondary: "#7743B5",
  secondaryContainer: "#E8D5FF",
  secondaryAccent: "#BB86FC",
  secondaryFixedDim: "#DAB9FF",
  onSecondaryFixed: "#2D0A4D",
  onSecondaryFixedVariant: "#5E289B",

  surface: "#F8F9FE",
  surfaceContainerLow: "#F2F3F8",
  surfaceLowest: "#FFFFFF",
  surfaceVariant: "#E1E2E7",
  surfaceBright: "#FFFFFF",

  onSurface: "#191C1F",
  onSurfaceVariant: "#494456",

  income: "#5E35B1",
  incomeMuted: "#EDE7F6",
  expense: "#B3261E",
  expenseMuted: "#F9E8E7",
  success: "#386A20",
  successMuted: "#E4F3D9",

  outlineVariant: "#C4C6CF",

  categories: {
    food: "#C084FC",
    transport: "#818CF8",
    housing: "#7C3AED",
    health: "#34D399",
    shopping: "#F59E0B",
    entertainment: "#F472B6",
    salary: "#6200EE",
    other: "#94A3B8",
  } as const,

  chart: ["#6200EE", "#BB86FC", "#7743B5", "#C084FC", "#818CF8", "#F472B6"],
} as const;

/** Dark — amethyst-tinted surfaces, readable contrast */
export const DarkColors = {
  primary: "#CFBCFF",
  primaryContainer: "#7F67BE",
  onPrimary: "#FFFFFF",
  secondary: "#CCC2DC",
  secondaryContainer: "#4A4458",
  secondaryAccent: "#E8B4FF",
  secondaryFixedDim: "#5D4A7A",
  onSecondaryFixed: "#E8DEF8",
  onSecondaryFixedVariant: "#CCC2DC",

  surface: "#121018",
  surfaceContainerLow: "#1C1A22",
  surfaceLowest: "#0F0D14",
  surfaceVariant: "#49454F",
  surfaceBright: "#2B2832",

  onSurface: "#E6E1E5",
  onSurfaceVariant: "#CAC4D0",

  income: "#D0BCFF",
  incomeMuted: "#2D2640",
  expense: "#FFB4AB",
  expenseMuted: "#3B2525",
  success: "#B8F397",
  successMuted: "#273821",

  outlineVariant: "#948F99",

  categories: {
    food: "#E9B8FF",
    transport: "#A5B4FC",
    housing: "#B794F6",
    health: "#6EE7B7",
    shopping: "#FCD34D",
    entertainment: "#F9A8D4",
    salary: "#C4B5FD",
    other: "#B8C4CE",
  } as const,

  chart: ["#BB86FC", "#CFBCFF", "#9A82DB", "#D0BCFF", "#B39DDB", "#F472B6"],
} as const;

export type AppColors = typeof LightColors;

export function getAppColors(theme: AppThemeMode): AppColors {
  return (theme === "dark" ? DarkColors : LightColors) as AppColors;
}

/** @deprecated use getAppColors / useAppColors */
export const Colors = LightColors;

export type CategoryKey = keyof typeof LightColors.categories;

export const Typography = {
  fontFamily: {
    regular: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semibold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
    extrabold: "Manrope_800ExtraBold",
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero: 38,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 20,
  /** Asymmetry hint from DESIGN.md */
  screenAsymmetric: { left: 24, right: 32 },
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  /** 1.5rem ≈ 24 @ default scale */
  pill: 24,
  full: 9999,
} as const;

/** Ambient shadow — purple tint at low opacity (DESIGN.md §4) */
export const Shadow = {
  ambient: {
    shadowColor: "#5E289B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
  ambientStrong: {
    shadowColor: "#5E289B",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 48,
    elevation: 12,
  },
} as const;

const ShadowDarkAmbient = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.45,
  shadowRadius: 24,
  elevation: 12,
} as const;

const ShadowDarkStrong = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.5,
  shadowRadius: 32,
  elevation: 16,
} as const;

export function getAmbientShadow(theme: AppThemeMode) {
  return theme === "dark" ? ShadowDarkAmbient : Shadow.ambient;
}

export function getAmbientStrongShadow(theme: AppThemeMode) {
  return theme === "dark" ? ShadowDarkStrong : Shadow.ambientStrong;
}

/** Web tab bar / cards */
export function getWebCardShadow(theme: AppThemeMode) {
  return theme === "dark"
    ? "0px 12px 32px -4px rgba(0, 0, 0, 0.55)"
    : "0px 12px 32px -4px rgba(94, 40, 155, 0.06)";
}

/** Max readable width on tablets / large phones */
export const Layout = {
  maxContentWidth: 560,
  /** Space for floating glass tab bar + safe area */
  tabBarInset: 88,
} as const;
