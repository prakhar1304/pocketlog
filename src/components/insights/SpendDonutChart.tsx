import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import type { CategoryKey } from "../../constants/theme";
import type { DonutSeg } from "../../utils/insightsCompute";
import { formatCurrency } from "../../utils/formatCurrency";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";
import { Card } from "../ui/Card";

type Props = {
  segments: DonutSeg[];
  totalExpense: number;
};

function CenterTotals({
  active,
  totalExpense,
  compact,
}: {
  active: DonutSeg | null;
  totalExpense: number;
  /** When true, no extra vertical padding (donut center overlay). */
  compact?: boolean;
}) {
  const Colors = useAppColors();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: compact ? 0 : Spacing.md,
      }}
      pointerEvents="none"
    >
      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.xs,
          color: Colors.onSurfaceVariant,
        }}
      >
        {active ? active.label.toUpperCase() : "TOTAL"}
      </Text>
      <Text
        style={{
          fontFamily: Typography.fontFamily.extrabold,
          fontSize: Typography.size.xl,
          letterSpacing: -0.02 * Typography.size.xl,
          color: Colors.onSurface,
          marginTop: 4,
        }}
      >
        {active ? formatCurrency(active.value) : formatCurrency(totalExpense)}
      </Text>
      {active ? (
        <Text
          style={{
            marginTop: 4,
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.xs,
            color: Colors.primaryContainer,
          }}
        >
          {active.percent}%
        </Text>
      ) : null}
    </View>
  );
}

export function SpendDonutChart({ segments, totalExpense }: Props) {
  const Colors = useAppColors();
  const { width: winW } = useWindowDimensions();
  const [selected, setSelected] = useState<CategoryKey | null>(null);
  const size = Math.min(240, winW - Spacing.screenAsymmetric.left * 2 - 48);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;
  const strokeW = size * 0.11;
  const C = 2 * Math.PI * r;

  const active = useMemo(() => {
    if (!selected) return null;
    return segments.find((s) => s.key === selected) ?? null;
  }, [segments, selected]);

  if (segments.length === 0 || totalExpense <= 0) {
    return (
      <Card
        radialGlow
        radialGlowCorner="topLeft"
        style={{ padding: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            letterSpacing: 1.2,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.lg,
          }}
        >
          SPENDING BY CATEGORY
        </Text>
        <Text
          style={{
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.md,
            color: Colors.onSurfaceVariant,
            textAlign: "center",
            paddingVertical: Spacing.xxl,
          }}
        >
          No spending recorded for this month.
        </Text>
      </Card>
    );
  }

  const barH = Math.max(36, Math.round(strokeW * 2.8));

  return (
    <Card
      radialGlow
      radialGlowCorner="topRight"
      style={{ padding: Spacing.xl, marginBottom: Spacing.xl }}
    >
      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.xs,
          letterSpacing: 1.2,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.lg,
        }}
      >
        SPENDING BY CATEGORY
      </Text>

      <View style={{ alignItems: "center" }}>
        {Platform.OS === "web" ? (
          <View style={{ width: size, maxWidth: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                height: barH,
                borderRadius: Radius.pill,
                overflow: "hidden",
                backgroundColor: Colors.surfaceContainerLow,
              }}
            >
              {segments.map((seg) => {
                const on = selected === seg.key;
                const dim = selected && selected !== seg.key;
                return (
                  <Pressable
                    key={seg.key}
                    onPress={() =>
                      setSelected((s) => (s === seg.key ? null : seg.key))
                    }
                    style={{
                      flexGrow: Math.max(1, seg.value),
                      flexShrink: 1,
                      flexBasis: 0,
                      minWidth: 6,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: seg.color,
                        opacity: dim ? 0.35 : 1,
                        borderWidth: on ? 2 : 0,
                        borderColor: Colors.onSurface,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
            <CenterTotals active={active} totalExpense={totalExpense} />
          </View>
        ) : (
          <View style={{ width: size, height: size }}>
            <Svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <G transform={`rotate(-90 ${cx} ${cy})`}>
                {(() => {
                  let dashOffset = 0;
                  return segments.map((seg) => {
                    const len = (seg.value / totalExpense) * C;
                    const el = (
                      <Circle
                        key={seg.key}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeW}
                        strokeLinecap="butt"
                        strokeDasharray={`${len} ${C}`}
                        strokeDashoffset={-dashOffset}
                        opacity={selected && selected !== seg.key ? 0.35 : 1}
                      />
                    );
                    dashOffset += len;
                    return el;
                  });
                })()}
              </G>
            </Svg>
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              pointerEvents="none"
            >
              <CenterTotals
                active={active}
                totalExpense={totalExpense}
                compact
              />
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: Spacing.lg,
          gap: Spacing.md,
        }}
      >
        {segments.map((seg) => {
          const on = selected === seg.key;
          return (
            <Pressable
              key={seg.key}
              onPress={() =>
                setSelected((s) => (s === seg.key ? null : seg.key))
              }
              style={{
                width: "47%",
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.sm,
                paddingVertical: Spacing.xs,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: seg.color,
                  opacity: on ? 1 : 0.85,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Typography.fontFamily.medium,
                    fontSize: Typography.size.sm,
                    color: Colors.onSurface,
                  }}
                >
                  {seg.label}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Typography.fontFamily.semibold,
                  fontSize: Typography.size.sm,
                  color: Colors.onSurfaceVariant,
                }}
              >
                {seg.percent}%
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
