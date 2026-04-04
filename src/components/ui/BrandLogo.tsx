import { Image } from "expo-image";
import type { ImageStyle, StyleProp } from "react-native";

const LOGO = require("../../../assets/images/logo.png");

type BrandLogoProps = {
  size?: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
};

/** App mark — `assets/images/logo.png`. */
export function BrandLogo({
  size = 40,
  borderRadius,
  style,
}: BrandLogoProps) {
  const r = borderRadius ?? Math.round(size * 0.22);
  return (
    <Image
      source={LOGO}
      style={[{ width: size, height: size, borderRadius: r }, style]}
      contentFit="contain"
      accessibilityLabel="Pocketlog"
    />
  );
}
