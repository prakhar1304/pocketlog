import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { formatCurrency } from "../../utils/formatCurrency";
import { Card } from "../ui/Card";

type BalanceHeroCardProps = {
  balance: number;
  income: number;
  expense: number;
};

export function BalanceHeroCard({
  balance,
  income,
  expense,
}: BalanceHeroCardProps) {
  const Colors = useAppColors();
  const animated = useAnimatedNumber(balance, 1000);

  return (
    <Card
      radialGlowHero
      style={{
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: 10,
          top: "12%",
          opacity: 0.14,
        }}
      >
        <FontAwesome name="rupee" size={180} color={Colors.primaryContainer} />
      </View>

      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.xs,
          letterSpacing: 1.2,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.sm,
        }}
      >
        TOTAL BALANCE
      </Text>
      <Text
        style={{
          fontFamily: Typography.fontFamily.extrabold,
          fontSize: Typography.size.hero,
          letterSpacing: -0.02 * Typography.size.hero,
          color: Colors.onSurface,
          marginBottom: Spacing.xl,
        }}
      >
        {formatCurrency(animated)}
      </Text>

      <View style={{ flexDirection: "row", gap: Spacing.md }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.incomeMuted,
            borderRadius: Radius.pill,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <Ionicons name="arrow-down" size={18} color={Colors.income} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
              }}
            >
              Income
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.sm,
                color: Colors.income,
              }}
            >
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.expenseMuted,
            borderRadius: Radius.pill,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <Ionicons name="arrow-up" size={18} color={Colors.expense} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
              }}
            >
              Expenses
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.sm,
                color: Colors.expense,
              }}
            >
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
