import { View } from "react-native";

import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
};

/** 0–100; tonal track + fill (DESIGN.md — no harsh borders). */
export function ProgressBar({
  value,
  height = 10,
  trackColor,
  fillColor,
}: Props) {
  const Colors = useAppColors();
  const track = trackColor ?? Colors.surfaceContainerLow;
  const fill = fillColor ?? Colors.primaryContainer;
  const pct = Math.min(100, Math.max(0, value));

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: track,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: height / 2,
          backgroundColor: fill,
        }}
      />
    </View>
  );
}
