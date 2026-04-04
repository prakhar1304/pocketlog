import type { ReactNode } from "react";
import { useId } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { getAmbientShadow, Radius } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";
import { CardRadialGlow } from "./CardRadialGlow";

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** Dark mode: soft corner radial (amethyst). */
  radialGlow?: boolean;
  /** Dark mode: stronger glow (home balance hero). */
  radialGlowHero?: boolean;
  radialGlowCorner?: "topLeft" | "topRight";
  /** Dark mode: smaller glow for tight tiles. */
  radialGlowCompact?: boolean;
};

/** surfaceLowest on tonal base — depth without heavy borders (DESIGN.md). */
export function Card({
  children,
  style,
  onPress,
  radialGlow,
  radialGlowHero,
  radialGlowCorner = "topLeft",
  radialGlowCompact,
}: CardProps) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const rawId = useId();
  const glowId = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const showGlow =
    theme === "dark" && (radialGlow || radialGlowHero) && !onPress;

  const base = {
    backgroundColor: Colors.surfaceLowest,
    borderRadius: Radius.xl,
    ...getAmbientShadow(theme),
    ...(showGlow ? { overflow: "hidden" as const } : {}),
  };

  const glowEl =
    showGlow ? (
      <CardRadialGlow
        gradientId={glowId}
        variant={radialGlowHero ? "hero" : "soft"}
        corner={radialGlowCorner}
        compact={radialGlowCompact}
      />
    ) : null;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { opacity: 0.96 }, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[base, style]}>
      {glowEl}
      {children}
    </View>
  );
}
