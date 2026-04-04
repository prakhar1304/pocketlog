import { Switch, Text, View } from "react-native";

import type { BudgetGoal } from "../../types/goal";
import { categoryLabel } from "../../utils/categoryDisplay";
import { formatCurrency } from "../../utils/formatCurrency";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  goal: BudgetGoal;
  spent: number;
  onToggleAlert: (enabled: boolean) => void;
};

export function BudgetAlertCard({ goal, spent, onToggleAlert }: Props) {
  const Colors = useAppColors();
  const ratio = goal.limit > 0 ? spent / goal.limit : 0;
  const pct = Math.min(100, Math.round(ratio * 100));
  const warn =
    goal.alertEnabled && ratio >= goal.alertAtPercent / 100;
  const fillColor = warn ? Colors.expense : Colors.primaryContainer;

  return (
    <Card
      radialGlow
      radialGlowCorner="topRight"
      style={{ padding: Spacing.xl, marginBottom: Spacing.lg }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: Spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1, paddingRight: Spacing.md }}>
          <Text style={{ fontSize: 24, marginRight: Spacing.md }}>{goal.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
              }}
            >
              {goal.title}
            </Text>
          </View>
        </View>
        <Switch
          value={goal.alertEnabled}
          onValueChange={onToggleAlert}
          trackColor={{ false: Colors.surfaceVariant, true: Colors.secondaryFixedDim }}
          thumbColor={goal.alertEnabled ? Colors.primaryContainer : Colors.surfaceLowest}
        />
      </View>

      <Text
        style={{
          fontFamily: Typography.fontFamily.regular,
          fontSize: Typography.size.sm,
          lineHeight: Typography.size.sm * 1.55,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.md,
        }}
      >
        Alert me when I exceed{" "}
        <Text style={{ fontFamily: Typography.fontFamily.bold, color: Colors.onSurface }}>
          {goal.alertAtPercent}% of my {categoryLabel(goal.category).toLowerCase()} budget
        </Text>{" "}
        for the current month.
      </Text>

      <ProgressBar value={pct} fillColor={fillColor} />

      <Text
        style={{
          marginTop: Spacing.sm,
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.xs,
          color: Colors.onSurfaceVariant,
        }}
      >
        {pct}% used · {formatCurrency(spent)} / {formatCurrency(goal.limit)}
      </Text>
    </Card>
  );
}
