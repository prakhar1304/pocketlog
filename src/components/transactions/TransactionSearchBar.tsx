import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
};

export function TransactionSearchBar({ value, onChangeText }: Props) {
  const Colors = useAppColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.surfaceContainerLow,
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.lg,
        paddingVertical: 12,
        marginBottom: Spacing.md,
      }}
    >
      <Ionicons name="search" size={20} color={Colors.onSurfaceVariant} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions…"
        placeholderTextColor={Colors.onSurfaceVariant}
        style={{
          flex: 1,
          marginLeft: Spacing.sm,
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.md,
          color: Colors.onSurface,
          paddingVertical: 0,
        }}
        autoCorrect={false}
        autoCapitalize="sentences"
      />
    </View>
  );
}
