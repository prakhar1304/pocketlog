import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";

type Props = {
  visible: boolean;
  valueIso: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
};

const WEEK_STARTS_ON = 1 as const;
const MAX_RANGE_DAYS = 800;

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toIso(d: Date) {
  return format(startOfDay(d), "yyyy-MM-dd");
}

export function DatePickerModal({
  visible,
  valueIso,
  onSelect,
  onClose,
}: Props) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();

  const today = startOfDay(new Date());
  const minDate = subDays(today, MAX_RANGE_DAYS);

  const selected = useMemo(() => {
    try {
      return startOfDay(parseISO(valueIso));
    } catch {
      return startOfDay(new Date());
    }
  }, [valueIso]);

  const [cursorMonth, setCursorMonth] = useState(() =>
    startOfMonth(selected)
  );

  useEffect(() => {
    if (visible) {
      setCursorMonth(startOfMonth(selected));
    }
  }, [visible, selected]);

  const monthStart = startOfMonth(cursorMonth);
  const monthEnd = endOfMonth(cursorMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks: Date[][] = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < gridDays.length; i += 7) {
      rows.push(gridDays.slice(i, i + 7));
    }
    return rows;
  }, [gridDays]);

  const cellSize = Math.min(48, Math.floor((winW - Spacing.xl * 2 - 48) / 7));

  const pick = (d: Date) => {
    const iso = toIso(d);
    onSelect(iso);
    Haptics.selectionAsync();
    onClose();
  };

  const quickPick = (d: Date) => {
    if (isBefore(d, minDate) || isAfter(d, today)) return;
    pick(d);
  };

  const yesterday = subDays(today, 1);

  const canPrevMonth = isAfter(
    startOfMonth(cursorMonth),
    startOfMonth(minDate)
  );
  const canNextMonth = isBefore(
    startOfMonth(cursorMonth),
    startOfMonth(today)
  );

  const dayCell = (d: Date) => {
    const inMonth = isSameMonth(d, cursorMonth);
    const isSel = isSameDay(d, selected);
    const isTo = isSameDay(d, today);
    const disabled = isBefore(d, minDate) || isAfter(d, today);

    return (
      <Pressable
        key={toIso(d)}
        disabled={disabled}
        onPress={() => !disabled && pick(d)}
        style={{
          width: cellSize,
          height: cellSize,
          borderRadius: cellSize / 2,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 2,
          backgroundColor: isSel ? Colors.primaryContainer : "transparent",
          opacity: disabled ? 0.28 : inMonth ? 1 : 0.38,
        }}
      >
        <Text
          style={{
            fontFamily: isSel
              ? Typography.fontFamily.bold
              : Typography.fontFamily.semibold,
            fontSize: Typography.size.sm,
            color: isSel ? Colors.onPrimary : Colors.onSurface,
          }}
        >
          {format(d, "d")}
        </Text>
        {isTo && !isSel ? (
          <View
            style={{
              position: "absolute",
              bottom: 6,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: Colors.primaryContainer,
            }}
          />
        ) : null}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{
          flex: 1,
          backgroundColor:
            theme === "dark"
              ? "rgba(0, 0, 0, 0.65)"
              : "rgba(25, 28, 31, 0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: Colors.surfaceLowest,
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            paddingBottom: insets.bottom + Spacing.lg,
            maxHeight: "88%",
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: Colors.surfaceVariant,
              alignSelf: "center",
              marginTop: Spacing.sm,
              marginBottom: Spacing.md,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: Spacing.lg,
              marginBottom: Spacing.md,
            }}
          >
            <Pressable
              onPress={() => {
                if (!canPrevMonth) return;
                setCursorMonth((m) => addMonths(m, -1));
                Haptics.selectionAsync();
              }}
              disabled={!canPrevMonth}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.surfaceContainerLow,
                alignItems: "center",
                justifyContent: "center",
                opacity: canPrevMonth ? 1 : 0.35,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={Colors.onSurface}
              />
            </Pressable>
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.lg,
                color: Colors.onSurface,
              }}
            >
              {format(cursorMonth, "MMMM yyyy")}
            </Text>
            <Pressable
              onPress={() => {
                if (!canNextMonth) return;
                setCursorMonth((m) => addMonths(m, 1));
                Haptics.selectionAsync();
              }}
              disabled={!canNextMonth}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.surfaceContainerLow,
                alignItems: "center",
                justifyContent: "center",
                opacity: canNextMonth ? 1 : 0.35,
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={Colors.onSurface}
              />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: Spacing.sm,
                marginBottom: Spacing.lg,
              }}
            >
              <Pressable
                onPress={() => quickPick(today)}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: Spacing.md,
                  borderRadius: Radius.lg,
                  backgroundColor: Colors.secondaryFixedDim,
                  alignItems: "center",
                  opacity: pressed ? 0.92 : 1,
                })}
              >
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.xs,
                    letterSpacing: 0.8,
                    color: Colors.onSecondaryFixed,
                  }}
                >
                  TODAY
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontFamily: Typography.fontFamily.semibold,
                    fontSize: Typography.size.sm,
                    color: Colors.onSecondaryFixed,
                  }}
                >
                  {format(today, "d MMM")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => quickPick(yesterday)}
                disabled={isBefore(yesterday, minDate)}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: Spacing.md,
                  borderRadius: Radius.lg,
                  backgroundColor: Colors.surfaceContainerLow,
                  alignItems: "center",
                  opacity: isBefore(yesterday, minDate)
                    ? 0.35
                    : pressed
                      ? 0.92
                      : 1,
                })}
              >
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.xs,
                    letterSpacing: 0.8,
                    color: Colors.onSurfaceVariant,
                  }}
                >
                  YESTERDAY
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontFamily: Typography.fontFamily.semibold,
                    fontSize: Typography.size.sm,
                    color: Colors.onSurface,
                  }}
                >
                  {format(yesterday, "d MMM")}
                </Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: Spacing.sm,
                paddingHorizontal: 2,
              }}
            >
              {WEEKDAY_LABELS.map((label, i) => (
                <View
                  key={`${label}-${i}`}
                  style={{ width: cellSize, alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily.semibold,
                      fontSize: 9,
                      color: Colors.onSurfaceVariant,
                    }}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {weeks.map((week, wi) => (
              <View
                key={wi}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {week.map((d) => dayCell(d))}
              </View>
            ))}

            <Text
              style={{
                marginTop: Spacing.lg,
                marginBottom: Spacing.md,
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              Up to {MAX_RANGE_DAYS} days in the past · future dates disabled
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
