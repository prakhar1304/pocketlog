import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Switch, Text, View } from "react-native";

import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
  /** When set, row shows a switch instead of chevron. */
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  danger?: boolean;
};

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  switchValue,
  onSwitchChange,
  danger,
}: Props) {
  const Colors = useAppColors();
  const iconBg = danger ? Colors.expenseMuted : Colors.surfaceContainerLow;
  const iconColor = danger ? Colors.expense : Colors.primaryContainer;

  const body = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: Spacing.md,
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.md,
            color: danger ? Colors.expense : Colors.onSurface,
          }}
        >
          {label}
        </Text>
        {value ? (
          <Text
            style={{
              marginTop: 2,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.sm,
              color: Colors.onSurfaceVariant,
            }}
          >
            {value}
          </Text>
        ) : null}
      </View>
      {typeof switchValue === "boolean" && onSwitchChange ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: Colors.surfaceVariant,
            true: Colors.secondaryFixedDim,
          }}
          thumbColor={
            switchValue ? Colors.primaryContainer : Colors.surfaceLowest
          }
        />
      ) : danger ? (
        <Ionicons
          name="alert-circle-outline"
          size={22}
          color={Colors.expense}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.outlineVariant}
        />
      )}
    </View>
  );

  if (typeof switchValue === "boolean" && onSwitchChange) {
    return <View>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
    >
      {body}
    </Pressable>
  );
}
