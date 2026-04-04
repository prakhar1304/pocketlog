import { format, parseISO } from "date-fns";
import { Text, View } from "react-native";

import type { Transaction } from "../../store/useTransactionStore";
import { categoryEmoji } from "../../utils/categoryDisplay";
import { formatSignedCurrency } from "../../utils/formatCurrency";
import { Card } from "../ui/Card";
import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  transactions: Transaction[];
};

export function InsightsTopTransactions({ transactions }: Props) {
  const Colors = useAppColors();
  return (
    <Card
      radialGlow
      radialGlowCorner="topLeft"
      style={{ padding: Spacing.xl, marginBottom: Spacing.lg }}
    >
      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.xs,
          letterSpacing: 1.2,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.lg,
        }}
      >
        TOP TRANSACTIONS
      </Text>

      {transactions.length === 0 ? (
        <Text
          style={{
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.sm,
            color: Colors.onSurfaceVariant,
          }}
        >
          No expenses this month.
        </Text>
      ) : (
        <View style={{ gap: Spacing.lg }}>
          {transactions.map((t) => (
            <View
              key={t.id}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${Colors.categories[t.category]}22`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Text style={{ fontSize: 20 }}>{categoryEmoji(t.category)}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.md,
                    color: Colors.onSurface,
                  }}
                >
                  {t.title}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    fontFamily: Typography.fontFamily.medium,
                    fontSize: Typography.size.xs,
                    color: Colors.onSurfaceVariant,
                  }}
                >
                  {format(parseISO(t.date), "MMM d, yyyy")}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Typography.fontFamily.bold,
                  fontSize: Typography.size.md,
                  color: Colors.expense,
                }}
              >
                {formatSignedCurrency(t.amount, "expense")}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
