import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { SavingsGoal } from "../../types/goal";
import { formatCurrency } from "../../utils/formatCurrency";
import { Card } from "../ui/Card";
import { PrimaryButton } from "../ui/PrimaryButton";
import { ProgressBar } from "../ui/ProgressBar";
import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";

type Props = {
  goal: SavingsGoal;
  onAddSaved: (amount: number) => void;
};

export function SavingsGoalCard({ goal, onAddSaved }: Props) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [amountStr, setAmountStr] = useState("");

  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.saved);

  const applyAdd = () => {
    const n = parseInt(amountStr.replace(/\D/g, ""), 10);
    if (!n || n <= 0) return;
    const add = Math.min(n, remaining);
    if (add <= 0) return;
    onAddSaved(add);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmountStr("");
    setOpen(false);
  };

  return (
    <>
      <Card
        radialGlow
        radialGlowCorner="topRight"
        style={{
          padding: Spacing.xl,
          paddingBottom: Spacing.xxl + 8,
          marginBottom: Spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: Spacing.md,
          }}
        >
          <View style={{ flex: 1, paddingRight: Spacing.md }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
              }}
            >
              {goal.title}
            </Text>
            {goal.subtitle ? (
              <Text
                style={{
                  marginTop: 4,
                  fontFamily: Typography.fontFamily.medium,
                  fontSize: Typography.size.sm,
                  color: Colors.onSurfaceVariant,
                }}
              >
                {goal.subtitle}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              borderRadius: Radius.full,
              backgroundColor: Colors.incomeMuted,
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.xs,
                color: Colors.income,
              }}
            >
              {pct}%
            </Text>
          </View>
        </View>

        <ProgressBar value={pct} />

        <Text
          style={{
            marginTop: Spacing.md,
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.sm,
            color: Colors.onSurface,
          }}
        >
          {formatCurrency(goal.saved)}{" "}
          <Text style={{ color: Colors.onSurfaceVariant }}>of </Text>
          {formatCurrency(goal.target)}
          <Text style={{ color: Colors.onSurfaceVariant }}> saved</Text>
        </Text>

        {remaining > 0 ? (
          <Pressable
            onPress={() => setOpen(true)}
            style={{
              marginTop: Spacing.lg,
              paddingVertical: Spacing.md,
              borderRadius: Radius.pill,
              borderWidth: 1.5,
              borderColor: Colors.primaryContainer,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.sm,
                color: Colors.primaryContainer,
              }}
            >
              + Add to savings
            </Text>
          </Pressable>
        ) : (
          <Text
            style={{
              marginTop: Spacing.lg,
              fontFamily: Typography.fontFamily.semibold,
              fontSize: Typography.size.sm,
              color: Colors.success,
              textAlign: "center",
            }}
          >
            Target reached
          </Text>
        )}

        <View
          style={{
            position: "absolute",
            bottom: Spacing.lg,
            right: Spacing.lg,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Colors.incomeMuted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>{goal.emoji}</Text>
        </View>
      </Card>

      <Modal visible={open} animationType="fade" transparent>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: Spacing.xl,
            backgroundColor:
              theme === "dark"
                ? "rgba(0, 0, 0, 0.62)"
                : "rgba(25, 28, 31, 0.45)",
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: Colors.surfaceLowest,
              borderRadius: Radius.xl,
              padding: Spacing.xl,
              paddingBottom: Spacing.lg + insets.bottom,
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.lg,
                color: Colors.onSurface,
                marginBottom: Spacing.xs,
              }}
            >
              Add to savings
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.sm,
                color: Colors.onSurfaceVariant,
                marginBottom: Spacing.lg,
              }}
            >
              Up to {formatCurrency(remaining)} left to reach your target.
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
                marginBottom: Spacing.xs,
              }}
            >
              Amount (₹)
            </Text>
            <TextInput
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="number-pad"
              placeholder="500"
              placeholderTextColor={Colors.onSurfaceVariant}
              style={{
                backgroundColor: Colors.surfaceContainerLow,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
                marginBottom: Spacing.lg,
              }}
            />
            <PrimaryButton
              label="Apply"
              onPress={applyAdd}
              disabled={
                parseInt(amountStr.replace(/\D/g, ""), 10) <= 0 || remaining <= 0
              }
            />
            <Pressable
              onPress={() => setOpen(false)}
              style={{ marginTop: Spacing.md, alignItems: "center" }}
            >
              <Text
                style={{
                  fontFamily: Typography.fontFamily.semibold,
                  fontSize: Typography.size.sm,
                  color: Colors.primaryContainer,
                }}
              >
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
