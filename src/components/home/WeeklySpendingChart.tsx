import { useState } from "react";
import { LayoutChangeEvent, Platform, Text, View } from "react-native";

import type { DaySpend } from "../../utils/transactionStats";
import {
  averageDailySpend,
  weeklyExpenseTotal,
} from "../../utils/transactionStats";
import { formatCurrency } from "../../utils/formatCurrency";
import { Card } from "../ui/Card";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

const MAX_BAR = 112;

/** Zero-day pill — readable on surfaceContainerLow (web + native). */
const ZERO_BAR_COLOR = "rgba(73, 68, 86, 0.35)";

type WeeklySpendingChartProps = {
  days: DaySpend[];
};

export function WeeklySpendingChart({ days }: WeeklySpendingChartProps) {
  const Colors = useAppColors();
  const [rowWidth, setRowWidth] = useState(0);
  const total = weeklyExpenseTotal(days);
  const avg = averageDailySpend(days);
  const maxAmount = Math.max(...days.map((d) => d.amount), 1);

  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - rowWidth) > 1) setRowWidth(w);
  };

  const slotW = rowWidth > 0 ? rowWidth / Math.max(days.length, 1) : 0;
  const barW = Math.max(
    Platform.OS === "web" ? 10 : 8,
    Math.min(28, slotW > 0 ? slotW * 0.62 : 14)
  );

  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: Spacing.md,
        }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.lg,
            color: Colors.onSurface,
          }}
        >
          Weekly spending
        </Text>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.lg,
              color: Colors.onSurface,
            }}
          >
            {formatCurrency(total)}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.xs,
              color: Colors.primaryContainer,
            }}
          >
            Avg. daily {formatCurrency(avg)}
          </Text>
        </View>
      </View>

      <Card radialGlow radialGlowCorner="topRight" style={{ padding: Spacing.xl }}>
        <View
          style={{
            backgroundColor: Colors.surfaceContainerLow,
            borderRadius: Radius.lg,
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.sm,
          }}
        >
          <View
            onLayout={onRowLayout}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: MAX_BAR + 28,
              minHeight: MAX_BAR + 28,
            }}
          >
            {days.map((d) => {
              const ratio = d.amount / maxAmount;
              const h =
                d.amount <= 0 ? 8 : Math.max(14, Math.round(MAX_BAR * ratio));
              const isPeak =
                d.amount > 0 && d.amount === maxAmount && maxAmount > 0;
              let fill: string = Colors.secondaryFixedDim;
              if (d.amount <= 0) fill = ZERO_BAR_COLOR;
              else if (d.isToday) fill = Colors.primaryContainer;
              else if (isPeak) fill = Colors.secondaryAccent;

              return (
                <View
                  key={d.iso}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: MAX_BAR,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        width: barW,
                        height: h,
                        maxHeight: MAX_BAR,
                        borderRadius: Radius.pill,
                        backgroundColor: fill,
                        opacity: d.amount <= 0 ? 1 : 1,
                        ...(Platform.OS === "web" && d.amount <= 0
                          ? {
                              borderWidth: 1,
                              borderColor: "rgba(73, 68, 86, 0.2)",
                            }
                          : null),
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
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    </View>
  );
}
