import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useAppColors } from "../../hooks/useAppColors";

/**
 * Wavy stroke along a diagonal: base axis at `angleRad`, sine ripple perpendicular.
 * Index-based angles/anchors — feels random, stable across renders.
 */
function diagonalWavePath(
  centerX: number,
  centerY: number,
  length: number,
  angleRad: number,
  amplitude: number,
  phase: number,
  cycles: number,
  pointCount: number,
): string {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  const px = -s;
  const py = c;
  let d = "";
  for (let k = 0; k <= pointCount; k++) {
    const t = k / pointCount;
    const baseX = centerX + (t - 0.5) * length * c;
    const baseY = centerY + (t - 0.5) * length * s;
    const wobble = amplitude * Math.sin(t * Math.PI * 2 * cycles + phase);
    const x = baseX + px * wobble;
    const y = baseY + py * wobble;
    d += k === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

type OnboardingWaveBackgroundProps = {
  width: number;
  height: number;
};

export function OnboardingWaveBackground({
  width,
  height,
}: OnboardingWaveBackgroundProps) {
  const Colors = useAppColors();
  const lines = useMemo(() => {
    const waveStrokes = [
      { color: Colors.primary, opacity: 0.22 },
      { color: Colors.primaryContainer, opacity: 0.28 },
      { color: Colors.onSecondaryFixedVariant, opacity: 0.2 },
      { color: Colors.secondary, opacity: 0.18 },
      { color: Colors.secondaryAccent, opacity: 0.16 },
      { color: Colors.secondaryFixedDim, opacity: 0.24 },
      { color: Colors.primary, opacity: 0.12 },
      { color: Colors.primaryContainer, opacity: 0.14 },
    ] as const;
    const count = 3;
    const diag = Math.hypot(width, height);
    return Array.from({ length: count }, (_, i) => {
      const stroke = waveStrokes[i % waveStrokes.length];
      // Pseudo-random angle: wide spread (steep / shallow diagonals, not all parallel)
      const angleDeg = ((i * 47 + ((i * i) % 31)) % 152) - 76;
      const angleRad = (angleDeg * Math.PI) / 180;
      // Anchor point scattered so lines don’t share one pivot
      const cx = width * (0.12 + ((i * 53) % 76) / 100);
      const cy = height * (0.1 + ((i * 67) % 80) / 100);
      const length = diag * (0.95 + ((i * 19) % 25) / 100);
      // Stronger perpendicular swing + more crests along the stroke
      const amplitude =
        11 + (i % 6) * 4.5 + (i % 2) * 3 + Math.min(14, diag * 0.018);
      const phase = i * 2.17 + (i % 7) * 0.73;
      const cycles = 2.1 + (i % 7) * 0.42 + (i % 3) * 0.2;
      const points = Math.min(96, 40 + Math.round(cycles * 16) + (i % 3) * 8);
      const d = diagonalWavePath(
        cx,
        cy,
        length,
        angleRad,
        i % 4 === 0 ? amplitude * 0.82 : amplitude,
        phase,
        cycles,
        points,
      );
      const strokeWidth = 1 + (i % 5 === 0 ? 0.45 : 0);
      const opacity = Math.min(0.42, stroke.opacity + ((i * 11) % 9) / 100);
      return { d, color: stroke.color, opacity, strokeWidth, key: `w-${i}` };
    });
  }, [width, height, Colors]);

  if (width <= 0 || height <= 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {lines.map((line) => (
          <Path
            key={line.key}
            d={line.d}
            fill="none"
            stroke={line.color}
            strokeWidth={line.strokeWidth}
            strokeOpacity={line.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}
