import type { ReactNode } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Layout, Spacing } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra bottom inset for tab bar */
  bottomInset?: number;
};

/**
 * Responsive column: full-bleed on narrow screens, capped width centered on wide.
 */
export function Screen({
  children,
  scroll = false,
  contentStyle,
  bottomInset = 0,
}: ScreenProps) {
  const Colors = useAppColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const padL = Spacing.screenAsymmetric.left;
  const padR = Spacing.screenAsymmetric.right;
  const maxW = Layout.maxContentWidth;
  const contentWidth = Math.min(width - padL - padR, maxW);

  const inner = (
    <View
      style={[
        {
          width: contentWidth,
          maxWidth: maxW,
          alignSelf: "center",
          flexGrow: scroll ? 0 : 1,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const padding = {
    paddingTop: insets.top + Spacing.md,
    paddingBottom: insets.bottom + Spacing.lg + bottomInset,
    paddingLeft: padL,
    paddingRight: padR,
  };

  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface }}
        contentContainerStyle={[
          padding,
          { flexGrow: 1, alignItems: "stretch" },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {inner}
      </ScrollView>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.surface }, padding]}>
      {inner}
    </View>
  );
}
