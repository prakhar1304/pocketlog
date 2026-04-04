import { Text, View } from "react-native";

import { formatCurrency } from "../../utils/formatCurrency";
import { categoryLabel } from "../../utils/categoryDisplay";
import { Card } from "../ui/Card";
import type { CategoryKey } from "../../constants/theme";
import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  biggest: { key: CategoryKey; amount: number } | null;
  avgDaily: number;
  saved: number;
};

export function InsightsStatRow({ biggest, avgDaily, saved }: Props) {
  const Colors = useAppColors();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
      }}
    >
      <Card
        radialGlow
        radialGlowCompact
        radialGlowCorner="topLeft"
        style={{ flex: 1, padding: Spacing.md }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.sm,
            minHeight: 32,
          }}
        >
          Biggest spend
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.md,
            color: Colors.onSurface,
          }}
        >
          {biggest ? categoryLabel(biggest.key) : "—"}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.sm,
            color: Colors.primaryContainer,
          }}
        >
          {biggest ? formatCurrency(biggest.amount) : "—"}
        </Text>
      </Card>
      <Card
        radialGlow
        radialGlowCompact
        radialGlowCorner="topRight"
        style={{ flex: 1, padding: Spacing.md }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.sm,
          }}
        >
          Avg daily
        </Text>
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.lg,
            color: Colors.onSurface,
          }}
        >
          {formatCurrency(avgDaily)}
        </Text>
      </Card>
      <Card
        radialGlow
        radialGlowCompact
        radialGlowCorner="topLeft"
        style={{ flex: 1, padding: Spacing.md }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.sm,
          }}
        >
          Net saved
        </Text>
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.lg,
            color: saved >= 0 ? Colors.success : Colors.expense,
          }}
        >
          {saved >= 0 ? "" : "−"}
          {formatCurrency(Math.abs(saved))}
        </Text>
      </Card>
    </View>
  );
}
