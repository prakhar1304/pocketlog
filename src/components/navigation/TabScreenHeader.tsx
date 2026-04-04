import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { BrandLogo } from "../ui/BrandLogo";

type TabScreenHeaderProps = {
  /** Space below the bar (matches Home top row rhythm by default). */
  marginBottom?: number;
  logoSize?: number;
  /** Right-side bell; set false to leave a fixed-width spacer for alignment. */
  showNotification?: boolean;
  onNotificationPress?: () => void;
  notificationIconColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Extra content in the same row before the logo (rare). */
  leading?: ReactNode;
};

/**
 * Shared app bar for tab roots: logo + wordmark + notification affordance (Home pattern).
 */
export function TabScreenHeader({
  marginBottom = Spacing.lg,
  logoSize = 50,
  showNotification = true,
  onNotificationPress,
  notificationIconColor,
  style,
  leading,
}: TabScreenHeaderProps) {
  const Colors = useAppColors();
  const bellColor = notificationIconColor ?? Colors.onSurfaceVariant;
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom,
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {leading}
        <BrandLogo size={logoSize} />
        <Text
          style={{
            fontFamily: Typography.fontFamily.extrabold,
            fontSize: Typography.size.lg,
            letterSpacing: -0.02 * Typography.size.lg,
            color: Colors.primary,
          }}
        >
          Pocketlog
        </Text>
      </View>
      {showNotification ? (
        <Pressable
          onPress={onNotificationPress}
          hitSlop={10}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: Colors.surfaceContainerLow,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={bellColor}
          />
        </Pressable>
      ) : (
        <View style={{ width: 44, height: 44 }} />
      )}
    </View>
  );
}
