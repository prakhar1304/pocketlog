import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Radius, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/** Primary CTA — primary → primary_container gradient (DESIGN.md). */
export function PrimaryButton({
  label,
  onPress,
  style,
  disabled,
}: PrimaryButtonProps) {
  const Colors = useAppColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: Radius.pill,
          overflow: "hidden",
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[Colors.primaryContainer, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.md,
            color: Colors.onPrimary,
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
