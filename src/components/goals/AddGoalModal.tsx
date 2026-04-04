import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CategoryKey } from "../../constants/theme";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";
import type { GoalInput } from "../../types/goal";
import { ALL_CATEGORY_KEYS, categoryChipLabel } from "../../utils/categoryDisplay";
import { PrimaryButton } from "../ui/PrimaryButton";

type GoalKind = "savings" | "streak" | "budget";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (g: GoalInput) => void;
};

export function AddGoalModal({ visible, onClose, onAdd }: Props) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<GoalKind>("savings");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetStr, setTargetStr] = useState("");
  const [savedStr, setSavedStr] = useState("0");
  const [targetDaysStr, setTargetDaysStr] = useState("7");
  const [currentDayStr, setCurrentDayStr] = useState("1");
  const [streakAutoFromLogs, setStreakAutoFromLogs] = useState(false);
  const [limitStr, setLimitStr] = useState("");
  const [category, setCategory] = useState<CategoryKey>("food");
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertAtStr, setAlertAtStr] = useState("80");

  const reset = () => {
    setKind("savings");
    setTitle("");
    setSubtitle("");
    setTargetStr("");
    setSavedStr("0");
    setTargetDaysStr("7");
    setCurrentDayStr("1");
    setStreakAutoFromLogs(false);
    setLimitStr("");
    setCategory("food");
    setAlertEnabled(true);
    setAlertAtStr("80");
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible]);

  const submit = () => {
    const t = title.trim();
    if (!t) return;

    if (kind === "savings") {
      const target = parseInt(targetStr.replace(/\D/g, ""), 10);
      const saved = parseInt((savedStr || "0").replace(/\D/g, ""), 10);
      if (!target || target <= 0) return;
      onAdd({
        type: "savings",
        title: t,
        subtitle: subtitle.trim() || undefined,
        target,
        saved: Math.min(Math.max(0, saved), target),
        emoji: "🎯",
      });
      onClose();
      return;
    }

    if (kind === "streak") {
      const targetDays = Math.min(30, Math.max(1, parseInt(targetDaysStr, 10) || 7));
      const currentDay = streakAutoFromLogs
        ? 1
        : Math.min(
            targetDays,
            Math.max(1, parseInt(currentDayStr, 10) || 1)
          );
      onAdd({
        type: "streak",
        title: t,
        targetDays,
        currentDay,
        emoji: "🔥",
        ...(streakAutoFromLogs ? { streakKind: "daily_log" as const } : {}),
      });
      onClose();
      return;
    }

    const limit = parseInt(limitStr.replace(/\D/g, ""), 10);
    const alertAt = Math.min(100, Math.max(1, parseInt(alertAtStr, 10) || 80));
    if (!limit || limit <= 0) return;
    onAdd({
      type: "budget",
      title: t,
      limit,
      category,
      alertEnabled,
      alertAtPercent: alertAt,
      emoji: "🔔",
    });
    onClose();
  };

  const labelStyle = {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.xs,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  } as const;

  const inputStyle = {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: Colors.onSurface,
    marginBottom: Spacing.lg,
  } as const;

  const canSubmit =
    title.trim().length > 0 &&
    (kind === "savings"
      ? parseInt(targetStr.replace(/\D/g, ""), 10) > 0
      : kind === "streak"
        ? parseInt(targetDaysStr, 10) > 0 &&
          (streakAutoFromLogs || parseInt(currentDayStr, 10) > 0)
        : parseInt(limitStr.replace(/\D/g, ""), 10) > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor:
            theme === "dark"
              ? "rgba(0, 0, 0, 0.62)"
              : "rgba(25, 28, 31, 0.45)",
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            backgroundColor: Colors.surfaceLowest,
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            maxHeight: "92%",
            paddingBottom: insets.bottom + Spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.xl,
              paddingTop: Spacing.lg,
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
              New goal
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text
                style={{
                  fontFamily: Typography.fontFamily.semibold,
                  fontSize: Typography.size.md,
                  color: Colors.primaryContainer,
                }}
              >
                Close
              </Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: Spacing.xl,
              paddingBottom: Spacing.xl,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                gap: Spacing.sm,
                marginBottom: Spacing.lg,
              }}
            >
              {(
                [
                  ["savings", "Savings"],
                  ["streak", "Streak"],
                  ["budget", "Budget"],
                ] as const
              ).map(([k, label]) => {
                const on = kind === k;
                return (
                  <Pressable
                    key={k}
                    onPress={() => setKind(k)}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.sm,
                      borderRadius: Radius.full,
                      backgroundColor: on
                        ? Colors.primaryContainer
                        : Colors.surfaceContainerLow,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Typography.fontFamily.semibold,
                        fontSize: Typography.size.xs,
                        color: on ? Colors.onPrimary : Colors.onSurfaceVariant,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={labelStyle}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Name this goal"
              placeholderTextColor={Colors.onSurfaceVariant}
              style={inputStyle}
            />

            {kind === "savings" ? (
              <>
                <Text style={labelStyle}>Subtitle (optional)</Text>
                <TextInput
                  value={subtitle}
                  onChangeText={setSubtitle}
                  placeholder="e.g. Emergency fund"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
                <Text style={labelStyle}>Target (₹)</Text>
                <TextInput
                  value={targetStr}
                  onChangeText={setTargetStr}
                  keyboardType="number-pad"
                  placeholder="10000"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
                <Text style={labelStyle}>Already saved (₹)</Text>
                <TextInput
                  value={savedStr}
                  onChangeText={setSavedStr}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
              </>
            ) : null}

            {kind === "streak" ? (
              <>
                <Text style={labelStyle}>Challenge length (days)</Text>
                <TextInput
                  value={targetDaysStr}
                  onChangeText={setTargetDaysStr}
                  keyboardType="number-pad"
                  placeholder="7"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: Spacing.lg,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: Spacing.md }}>
                    <Text
                      style={{
                        fontFamily: Typography.fontFamily.medium,
                        fontSize: Typography.size.sm,
                        color: Colors.onSurface,
                      }}
                    >
                      Auto-track from logs
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        fontFamily: Typography.fontFamily.medium,
                        fontSize: Typography.size.xs,
                        color: Colors.onSurfaceVariant,
                      }}
                    >
                      ✓ when you log any transaction that day
                    </Text>
                  </View>
                  <Switch
                    value={streakAutoFromLogs}
                    onValueChange={setStreakAutoFromLogs}
                    trackColor={{
                      false: Colors.surfaceVariant,
                      true: Colors.secondaryFixedDim,
                    }}
                    thumbColor={
                      streakAutoFromLogs
                        ? Colors.primaryContainer
                        : Colors.surfaceLowest
                    }
                  />
                </View>
                {!streakAutoFromLogs ? (
                  <>
                    <Text style={labelStyle}>Starting day (1 = day one)</Text>
                    <TextInput
                      value={currentDayStr}
                      onChangeText={setCurrentDayStr}
                      keyboardType="number-pad"
                      placeholder="1"
                      placeholderTextColor={Colors.onSurfaceVariant}
                      style={inputStyle}
                    />
                  </>
                ) : null}
              </>
            ) : null}

            {kind === "budget" ? (
              <>
                <Text style={labelStyle}>Monthly limit (₹)</Text>
                <TextInput
                  value={limitStr}
                  onChangeText={setLimitStr}
                  keyboardType="number-pad"
                  placeholder="8000"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
                <Text style={labelStyle}>Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: Spacing.sm,
                    marginBottom: Spacing.lg,
                  }}
                >
                  {ALL_CATEGORY_KEYS.map((c) => {
                    const on = category === c;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => setCategory(c)}
                        style={{
                          paddingHorizontal: Spacing.md,
                          paddingVertical: Spacing.sm,
                          borderRadius: Radius.full,
                          backgroundColor: on
                            ? Colors.primaryContainer
                            : Colors.surfaceContainerLow,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Typography.fontFamily.medium,
                            fontSize: Typography.size.sm,
                            color: on ? Colors.onPrimary : Colors.onSurfaceVariant,
                          }}
                        >
                          {categoryChipLabel(c)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: Spacing.md,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily.medium,
                      fontSize: Typography.size.sm,
                      color: Colors.onSurface,
                    }}
                  >
                    Alerts enabled
                  </Text>
                  <Switch
                    value={alertEnabled}
                    onValueChange={setAlertEnabled}
                    trackColor={{
                      false: Colors.surfaceVariant,
                      true: Colors.secondaryFixedDim,
                    }}
                    thumbColor={
                      alertEnabled ? Colors.primaryContainer : Colors.surfaceLowest
                    }
                  />
                </View>
                <Text style={labelStyle}>Alert at (% of budget)</Text>
                <TextInput
                  value={alertAtStr}
                  onChangeText={setAlertAtStr}
                  keyboardType="number-pad"
                  placeholder="80"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  style={inputStyle}
                />
              </>
            ) : null}

            <View style={{ height: Spacing.lg }} />
            <PrimaryButton
              label="Add goal"
              onPress={submit}
              disabled={!canSubmit}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
