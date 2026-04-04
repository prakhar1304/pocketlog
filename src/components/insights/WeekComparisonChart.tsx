import { Platform, Text, View } from "react-native";

import { Card } from "../ui/Card";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  thisWeek: number[];
  lastWeek: number[];
  labels: readonly string[];
};

const CHART_H = 112;
const BAR_W = Platform.OS === "web" ? 12 : 10;
const BAR_GAP = 6;

export function WeekComparisonChart({ thisWeek, lastWeek, labels }: Props) {
  const Colors = useAppColors();
  const max = Math.max(1, ...thisWeek, ...lastWeek);

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
        THIS WEEK VS LAST WEEK
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          minHeight: CHART_H + 28,
          paddingHorizontal: Spacing.xs,
        }}
      >
        {labels.map((label, i) => {
          const hThis = Math.max(
            8,
            Math.round(((thisWeek[i] ?? 0) / max) * CHART_H)
          );
          const hLast = Math.max(
            8,
            Math.round(((lastWeek[i] ?? 0) / max) * CHART_H)
          );
          return (
            <View
              key={`${label}-${i}`}
              style={{
                flex: 1,
                minWidth: BAR_W * 2 + BAR_GAP + 4,
                maxWidth: 48,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: BAR_GAP,
                  height: CHART_H,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: BAR_W,
                    height: hThis,
                    borderRadius: Radius.sm,
                    backgroundColor: Colors.primaryContainer,
                  }}
                />
                <View
                  style={{
                    width: BAR_W,
                    height: hLast,
                    borderRadius: Radius.sm,
                    backgroundColor: Colors.secondaryFixedDim,
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 8,
                  fontFamily: Typography.fontFamily.medium,
                  fontSize: 10,
                  color: Colors.onSurfaceVariant,
                }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: Spacing.xl,
          marginTop: Spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              backgroundColor: Colors.primaryContainer,
            }}
          />
          <Text
            style={{
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.xs,
              color: Colors.onSurfaceVariant,
            }}
          >
            This week
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              backgroundColor: Colors.secondaryFixedDim,
            }}
          />
          <Text
            style={{
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.xs,
              color: Colors.onSurfaceVariant,
            }}
          >
            Last week
          </Text>
        </View>
      </View>
    </Card>
  );
}
