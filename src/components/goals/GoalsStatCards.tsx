import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Card } from "../ui/Card";
import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { formatCurrency } from "../../utils/formatCurrency";

type WeekDelta = {
  pct: number;
  thisWeek: number;
  prevWeek: number;
} | null;

type BudgetTrack = { onTrack: number; total: number };

type Props = {
  weekSpendDelta: WeekDelta;
  budgetsOnTrack: BudgetTrack;
};

export function GoalsStatCards({ weekSpendDelta, budgetsOnTrack }: Props) {
  const Colors = useAppColors();

  const weekPrimary =
    weekSpendDelta == null
      ? "—"
      : weekSpendDelta.prevWeek === 0 && weekSpendDelta.thisWeek > 0
        ? "New"
        : `${weekSpendDelta.pct > 0 ? "+" : ""}${weekSpendDelta.pct}%`;

  const weekSub =
    weekSpendDelta == null
      ? "Log expenses to compare weeks"
      : `${formatCurrency(weekSpendDelta.thisWeek)} vs ${formatCurrency(weekSpendDelta.prevWeek)}`;

  const budgetPrimary =
    budgetsOnTrack.total === 0
      ? "—"
      : `${budgetsOnTrack.onTrack}/${budgetsOnTrack.total}`;

  const budgetSub =
    budgetsOnTrack.total === 0
      ? "Add a budget goal to track"
      : "Under limit this month";

  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing.md,
        marginBottom: Spacing.xl,
      }}
    >
      <Card
        radialGlow
        radialGlowCompact
        radialGlowCorner="topLeft"
        style={{ flex: 1, padding: Spacing.lg }}
      >
        <Ionicons
          name="pulse-outline"
          size={22}
          color={Colors.primaryContainer}
        />
        <Text
          style={{
            marginTop: Spacing.sm,
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            letterSpacing: 0.8,
            color: Colors.onSurfaceVariant,
          }}
        >
          SPEND VS LAST WEEK
        </Text>
        <Text
          style={{
            marginTop: Spacing.xs,
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.xl,
            color: Colors.onSurface,
          }}
        >
          {weekPrimary}
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {weekSub}
        </Text>
      </Card>
      <Card
        radialGlow
        radialGlowCompact
        radialGlowCorner="topRight"
        style={{ flex: 1, padding: Spacing.lg }}
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={22}
          color={Colors.secondary}
        />
        <Text
          style={{
            marginTop: Spacing.sm,
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            letterSpacing: 0.8,
            color: Colors.onSurfaceVariant,
          }}
        >
          BUDGETS ON TRACK
        </Text>
        <Text
          style={{
            marginTop: Spacing.xs,
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.xl,
            color: Colors.onSurface,
          }}
        >
          {budgetPrimary}
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {budgetSub}
        </Text>
      </Card>
    </View>
  );
}
