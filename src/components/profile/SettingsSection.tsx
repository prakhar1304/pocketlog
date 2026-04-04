import { Children, type ReactNode } from "react";
import { Text, View } from "react-native";

import { Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { Card } from "../ui/Card";

type Props = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  const Colors = useAppColors();
  const n = Children.count(children);
  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.xs,
          letterSpacing: 1.2,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.sm,
          marginLeft: Spacing.xs,
        }}
      >
        {title}
      </Text>
      <Card style={{ paddingVertical: Spacing.xs }}>
        {Children.map(children, (child, i) => (
          <View
            key={i}
            style={{ marginBottom: i < n - 1 ? Spacing.lg : 0 }}
          >
            {child}
          </View>
        ))}
      </Card>
    </View>
  );
}
