import * as Haptics from "expo-haptics";
import { format, startOfDay } from "date-fns";
import { Pressable, Text, View } from "react-native";

import type { Transaction } from "../../store/useTransactionStore";
import type { StreakGoal } from "../../types/goal";
import {
  consecutiveDaysWithAnyTransaction,
  hasTransactionOnDate,
  lastNDatesOldestFirst,
} from "../../utils/goalsActivity";
import { Card } from "../ui/Card";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

type Props = {
  goal: StreakGoal;
  transactions: Transaction[];
  /** Manual streaks only — advances current day toward the target. */
  onAdvanceManualDay?: () => void;
};

export function StreakGoalCard({
  goal,
  transactions,
  onAdvanceManualDay,
}: Props) {
  const Colors = useAppColors();
  const isAuto = goal.streakKind === "daily_log";
  const today = new Date();
  const todayIso = format(startOfDay(today), "yyyy-MM-dd");

  const streakLen = isAuto
    ? consecutiveDaysWithAnyTransaction(transactions, today)
    : 0;

  const displayDays = Math.min(goal.targetDays, 7);

  const manualFinished = !isAuto && goal.currentDay > goal.targetDays;
  const autoFinished = isAuto && streakLen >= goal.targetDays;
  const finished = manualFinished || autoFinished;

  const headline = isAuto
    ? finished
      ? "Challenge complete"
      : `${streakLen} day streak`
    : finished
      ? "Challenge complete"
      : `Day ${Math.min(goal.currentDay, goal.targetDays)} of ${goal.targetDays}`;

  const subline = isAuto
    ? "Log any transaction each day to keep it going"
    : "Tap the button when you finish each day";

  if (isAuto) {
    const dates = lastNDatesOldestFirst(today, displayDays);

    return (
      <Card
        radialGlow
        radialGlowCorner="topLeft"
        style={{ padding: Spacing.xl, marginBottom: Spacing.lg }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: Radius.md,
              backgroundColor: Colors.expenseMuted,
              alignItems: "center",
              justifyContent: "center",
              marginRight: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 22 }}>{goal.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
              }}
            >
              {goal.title}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.sm,
                color: Colors.onSurface,
              }}
            >
              {headline}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
              }}
            >
              {subline}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: Spacing.xl,
            gap: 4,
          }}
        >
          {dates.map((d, i) => {
            const iso = format(startOfDay(d), "yyyy-MM-dd");
            const hasLog = hasTransactionOnDate(transactions, d);
            const isToday = iso === todayIso;
            const isPast = iso < todayIso;

            let bg: string = Colors.surfaceContainerLow;
            let fg: string = Colors.onSurfaceVariant;
            let borderW = 0;
            let borderC: string = "transparent";

            if (hasLog) {
              bg = Colors.primaryContainer;
              fg = Colors.onPrimary;
            } else if (isToday) {
              bg = Colors.primary;
              fg = Colors.onPrimary;
              borderW = 2;
              borderC = Colors.secondaryFixedDim;
            } else if (isPast) {
              bg = Colors.surfaceContainerLow;
              fg = Colors.onSurfaceVariant;
            }

            const label = format(d, "EEE").slice(0, 1);

            return (
              <View
                key={`${iso}-${i}`}
                style={{
                  flex: 1,
                  maxWidth: 40,
                  aspectRatio: 1,
                  borderRadius: 999,
                  backgroundColor: bg,
                  borderWidth: borderW,
                  borderColor: borderC,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {hasLog ? (
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily.bold,
                      color: fg,
                      fontSize: 14,
                    }}
                  >
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily.bold,
                      fontSize: Typography.size.sm,
                      color: fg,
                    }}
                  >
                    {isPast ? "·" : label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </Card>
    );
  }

  /* ——— manual streak (original UI) ——— */
  const labels = ["M", "T", "W", "T", "F", "S", "S"].slice(0, displayDays);

  return (
    <Card
      radialGlow
      radialGlowCorner="topLeft"
      style={{ padding: Spacing.xl, marginBottom: Spacing.lg }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: Radius.md,
            backgroundColor: Colors.expenseMuted,
            alignItems: "center",
            justifyContent: "center",
            marginRight: Spacing.md,
          }}
        >
          <Text style={{ fontSize: 22 }}>{goal.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.md,
              color: Colors.onSurface,
            }}
          >
            {goal.title}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.sm,
              color: Colors.onSurface,
            }}
          >
            {headline}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.xs,
              color: Colors.onSurfaceVariant,
            }}
          >
            {subline}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: Spacing.xl,
          gap: 4,
        }}
      >
        {labels.map((label, i) => {
          const dayNum = i + 1;
          const isPast = finished || dayNum < goal.currentDay;
          const isCurrent =
            !finished &&
            dayNum === goal.currentDay &&
            goal.currentDay <= goal.targetDays;
          const isFuture = !isPast && !isCurrent;

          let bg: string = Colors.surfaceContainerLow;
          let fg: string = Colors.onSurfaceVariant;
          let borderW = 0;
          let borderC = "transparent";

          if (isPast) {
            bg = Colors.primaryContainer;
            fg = Colors.onPrimary;
          } else if (isCurrent) {
            bg = Colors.primary;
            fg = Colors.onPrimary;
            borderW = 2;
            borderC = Colors.secondaryFixedDim;
          }

          return (
            <View
              key={`${label}-${i}`}
              style={{
                flex: 1,
                maxWidth: 40,
                aspectRatio: 1,
                borderRadius: 999,
                backgroundColor: bg,
                borderWidth: borderW,
                borderColor: borderC,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isPast ? (
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    color: fg,
                    fontSize: 14,
                  }}
                >
                  ✓
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.sm,
                    color: isFuture ? Colors.onSurfaceVariant : fg,
                  }}
                >
                  {isCurrent ? String(dayNum) : label}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {!finished && onAdvanceManualDay ? (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onAdvanceManualDay();
          }}
          style={{
            marginTop: Spacing.lg,
            paddingVertical: Spacing.md,
            borderRadius: Radius.pill,
            backgroundColor: Colors.primaryContainer,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.sm,
              color: Colors.onPrimary,
            }}
          >
            Completed today →
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
