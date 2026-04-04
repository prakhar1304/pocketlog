import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Pressable, Text, View } from "react-native";

import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import type { Transaction } from "../../store/useTransactionStore";
import { categoryEmoji } from "../../utils/categoryDisplay";
import { formatSignedCurrency } from "../../utils/formatCurrency";

type Props = {
  transaction: Transaction;
  onPress: () => void;
  /** Long-press still opens delete confirm (discoverability). */
  onLongPress?: () => void;
  onDelete: () => void;
};

export function TransactionListRow({
  transaction: t,
  onPress,
  onLongPress,
  onDelete,
}: Props) {
  const Colors = useAppColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={380}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          opacity: pressed ? 0.88 : 1,
        })}
      >
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
            numberOfLines={1}
            style={{
              marginTop: 2,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.sm,
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
            color: t.type === "income" ? Colors.income : Colors.expense,
            marginRight: Spacing.xs,
          }}
        >
          {formatSignedCurrency(t.amount, t.type)}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.outlineVariant}
        />
      </Pressable>
    </View>
  );
}

{
  /* <Pressable
onPress={onDelete}
hitSlop={12}
accessibilityRole="button"
accessibilityLabel="Delete transaction"
style={({ pressed }) => ({
  marginLeft: Spacing.sm,
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: pressed
    ? Colors.expenseMuted
    : Colors.surfaceContainerLow,
})}
>
<Ionicons name="trash-outline" size={20} color={Colors.expense} />
</Pressable> */
}
