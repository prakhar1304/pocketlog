import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { View } from "react-native";

import { useAppColors, useAppTheme } from "../../hooks/useAppColors";

type CardRadialGlowProps = {
  /** Must be unique per SVG on screen (e.g. from useId). */
  gradientId: string;
  variant?: "soft" | "hero";
  corner?: "topLeft" | "topRight";
  /** Smaller, subtler glow for dense stat tiles. */
  compact?: boolean;
};

/**
 * Dark mode only — amethyst radial corner wash (matches balance hero language).
 */
export function CardRadialGlow({
  gradientId,
  variant = "soft",
  corner = "topLeft",
  compact = false,
}: CardRadialGlowProps) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  if (theme !== "dark") return null;

  const size =
    compact ? 150 : variant === "hero" ? 220 : 200;

  const stops =
    variant === "hero"
      ? [
          { off: "0%", op: 0.38 },
          { off: "45%", op: 0.1 },
          { off: "100%", op: 0 },
        ]
      : compact
        ? [
            { off: "0%", op: 0.2 },
            { off: "55%", op: 0.05 },
            { off: "100%", op: 0 },
          ]
        : [
            { off: "0%", op: 0.26 },
            { off: "50%", op: 0.07 },
            { off: "100%", op: 0 },
          ];

  const positionStyle =
    corner === "topLeft"
      ? {
          position: "absolute" as const,
          left: -size * 0.24,
          top: -size * 0.2,
          width: size,
          height: size,
        }
      : {
          position: "absolute" as const,
          right: -size * 0.24,
          top: -size * 0.2,
          width: size,
          height: size,
        };

  // Hotspot must sit in the same corner as the anchor; topLeft used 18%/18% — mirror for topRight
  // or the glow peaks away from the card corner and the inner edge reads as a flat vertical cut.
  const cx = corner === "topLeft" ? "18%" : "82%";
  const cy = "18%";
  const fx = corner === "topLeft" ? "18%" : "82%";
  const fy = "18%";

  return (
    <View pointerEvents="none" style={positionStyle}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient
            id={gradientId}
            cx={cx}
            cy={cy}
            r="78%"
            fx={fx}
            fy={fy}
            gradientUnits="objectBoundingBox"
          >
            {stops.map((s) => (
              <Stop
                key={s.off}
                offset={s.off}
                stopColor={Colors.primaryContainer}
                stopOpacity={s.op}
              />
            ))}
          </RadialGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </View>
  );
}
