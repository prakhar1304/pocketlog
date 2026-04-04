import { Pressable, ScrollView, Text } from "react-native";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import type { TransactionChipFilter } from "../../utils/transactionFilters";
import {
  ALL_CATEGORY_KEYS,
  categoryChipLabel,
} from "../../utils/categoryDisplay";

const BASE_CHIPS: { id: TransactionChipFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
];

const CATEGORY_CHIPS: { id: TransactionChipFilter; label: string }[] =
  ALL_CATEGORY_KEYS.map((id) => ({
    id,
    label: categoryChipLabel(id),
  }));

const CHIPS = [...BASE_CHIPS, ...CATEGORY_CHIPS];

type Props = {
  active: TransactionChipFilter;
  onChange: (chip: TransactionChipFilter) => void;
};

export function FilterChips({ active, onChange }: Props) {
  const Colors = useAppColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: Spacing.sm,
        paddingBottom: Spacing.md,
      }}
    >
      {CHIPS.map((c) => {
        const selected = active === c.id;
        return (
          <Pressable
            key={String(c.id)}
            onPress={() => onChange(c.id)}
            style={{
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.sm,
              borderRadius: Radius.full,
              backgroundColor: selected
                ? Colors.primaryContainer
                : Colors.surfaceContainerLow,
            }}
          >
            <Text
              style={{
                fontFamily: selected
                  ? Typography.fontFamily.semibold
                  : Typography.fontFamily.medium,
                fontSize: Typography.size.sm,
                color: selected ? Colors.onPrimary : Colors.onSurfaceVariant,
              }}
            >
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
