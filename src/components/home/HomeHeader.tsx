import { format } from "date-fns";
import { Text, View } from "react-native";

import { Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { useAppStore } from "../../store/useAppStore";
import { TabScreenHeader } from "../navigation/TabScreenHeader";

function greetingLabel(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type HomeHeaderProps = {
  /** Overrides profile name when passed */
  displayName?: string;
};

export function HomeHeader({ displayName: displayNameProp }: HomeHeaderProps) {
  const Colors = useAppColors();
  const storeName = useAppStore((s) => s.displayName);
  const displayName =
    (displayNameProp?.trim() ? displayNameProp : storeName.trim()) || "there";
  const now = new Date();
  const hour = now.getHours();

  return (
    <View style={{ marginBottom: 20 }}>
      <TabScreenHeader marginBottom={18} logoSize={50} />

      <Text
        style={{
          fontFamily: Typography.fontFamily.bold,
          fontSize: Typography.size.xl,
          letterSpacing: -0.02 * Typography.size.xl,
          color: Colors.onSurface,
        }}
      >
        {greetingLabel(hour)}, {displayName} 👋
      </Text>
      <Text
        style={{
          marginTop: 6,
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.sm,
          color: Colors.onSurfaceVariant,
        }}
      >
        {format(now, "EEEE, d MMMM yyyy")}
      </Text>
    </View>
  );
}
