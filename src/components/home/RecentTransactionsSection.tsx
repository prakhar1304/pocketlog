import { format, parseISO } from "date-fns";
import { Pressable, Text, View } from "react-native";

import type { Transaction } from "../../store/useTransactionStore";
import { categoryEmoji, categoryLabel } from "../../utils/categoryDisplay";
import { formatSignedCurrency } from "../../utils/formatCurrency";
import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type RecentTransactionsSectionProps = {
  transactions: Transaction[];
  onSeeAll: () => void;
  onPressRow?: (id: string) => void;
};

export function RecentTransactionsSection({
  transactions,
  onSeeAll,
  onPressRow,
}: RecentTransactionsSectionProps) {
  const Colors = useAppColors();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.lg,
        }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.lg,
            color: Colors.onSurface,
          }}
        >
          Recent transactions
        </Text>
        <Pressable onPress={onSeeAll} hitSlop={12}>
          <Text
            style={{
              fontFamily: Typography.fontFamily.semibold,
              fontSize: Typography.size.sm,
              color: Colors.primaryContainer,
            }}
          >
            See all
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: Spacing.lg }}>
        {transactions.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => onPressRow?.(t.id)}
            disabled={!onPressRow}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${Colors.categories[t.category]}22`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Text style={{ fontSize: 20 }}>
                  {categoryEmoji(t.category)}
                </Text>
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
                  numberOfLines={1}
                  style={{
                    marginTop: 2,
                    fontFamily: Typography.fontFamily.medium,
                    fontSize: Typography.size.sm,
                    color: Colors.onSurfaceVariant,
                  }}
                >
                  {categoryLabel(t.category)}
                  {t.note ? ` · ${t.note.slice(0, 24)}` : ""}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", marginLeft: Spacing.sm }}>
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.md,
                    color:
                      t.type === "income" ? Colors.income : Colors.expense,
                  }}
                >
                  {formatSignedCurrency(t.amount, t.type)}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontFamily: Typography.fontFamily.medium,
                    fontSize: Typography.size.xs,
                    color: Colors.onSurfaceVariant,
                  }}
                >
                  {format(parseISO(t.date), "MMM d")}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
