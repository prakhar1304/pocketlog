import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import type { CategoryKey } from "../../constants/theme";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";
import {
  ALL_CATEGORY_KEYS,
  categoryEmoji,
  categoryLabel,
} from "../../utils/categoryDisplay";

type Props = {
  visible: boolean;
  value: CategoryKey;
  transactionType: "income" | "expense";
  onSelect: (c: CategoryKey) => void;
  onClose: () => void;
};

const INCOME_KEYS: CategoryKey[] = ["salary", "other"];
const EXPENSE_KEYS: CategoryKey[] = ALL_CATEGORY_KEYS.filter(
  (k) => k !== "salary"
);

export function CategoryPickerModal({
  visible,
  value,
  transactionType,
  onSelect,
  onClose,
}: Props) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const keys = transactionType === "income" ? INCOME_KEYS : EXPENSE_KEYS;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{
          flex: 1,
          backgroundColor:
            theme === "dark"
              ? "rgba(0, 0, 0, 0.62)"
              : "rgba(25, 28, 31, 0.45)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: Colors.surfaceLowest,
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            padding: Spacing.xl,
            maxHeight: "70%",
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.lg,
              color: Colors.onSurface,
              marginBottom: Spacing.lg,
            }}
          >
            Category
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: Spacing.md,
              }}
            >
              {keys.map((k) => {
                const selected = value === k;
                return (
                  <Pressable
                    key={k}
                    onPress={() => {
                      onSelect(k);
                      onClose();
                    }}
                    style={{
                      width: "30%",
                      minWidth: 100,
                      paddingVertical: Spacing.md,
                      paddingHorizontal: Spacing.sm,
                      borderRadius: Radius.lg,
                      backgroundColor: selected
                        ? Colors.secondaryFixedDim
                        : Colors.surfaceContainerLow,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>{categoryEmoji(k)}</Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        marginTop: Spacing.xs,
                        textAlign: "center",
                        fontFamily: Typography.fontFamily.semibold,
                        fontSize: Typography.size.xs,
                        color: Colors.onSurface,
                      }}
                    >
                      {categoryLabel(k)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
