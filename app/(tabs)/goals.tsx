import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AddGoalModal } from "../../src/components/goals/AddGoalModal";
import { TabScreenHeader } from "../../src/components/navigation/TabScreenHeader";
import { BudgetAlertCard } from "../../src/components/goals/BudgetAlertCard";
import { GoalsStatCards } from "../../src/components/goals/GoalsStatCards";
import { SavingsGoalCard } from "../../src/components/goals/SavingsGoalCard";
import { StreakGoalCard } from "../../src/components/goals/StreakGoalCard";
import { Screen } from "../../src/components/ui/Screen";
import { Layout, Radius, Spacing, Typography } from "../../src/constants/theme";
import { useAppColors } from "../../src/hooks/useAppColors";
import { useDialog } from "../../src/context/DialogContext";
import { useGoalStore } from "../../src/store/useGoalStore";
import { useTransactionStore } from "../../src/store/useTransactionStore";
import type { BudgetGoal, Goal, GoalInput, SavingsGoal } from "../../src/types/goal";
import {
  budgetsOnTrackCounts,
  weekOverWeekExpenseChange,
} from "../../src/utils/goalsActivity";
import { spendInMonthForCategory } from "../../src/utils/goalBudgetSpend";

export default function GoalsScreen() {
  const Colors = useAppColors();
  const { showDialog } = useDialog();
  const transactions = useTransactionStore((s) => s.transactions);
  const goals = useGoalStore((s) => s.goals);
  const removeGoal = useGoalStore((s) => s.removeGoal);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const addGoal = useGoalStore((s) => s.addGoal);

  const [addOpen, setAddOpen] = useState(false);

  const budgetSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of goals) {
      if (g.type === "budget") {
        map.set(g.id, spendInMonthForCategory(transactions, g.category));
      }
    }
    return map;
  }, [goals, transactions]);

  const weekSpendDelta = useMemo(
    () => weekOverWeekExpenseChange(transactions),
    [transactions]
  );

  const budgetsOnTrack = useMemo(
    () => budgetsOnTrackCounts(goals, budgetSpend),
    [goals, budgetSpend]
  );

  const confirmRemove = (id: string) => {
    showDialog({
      title: "Remove goal?",
      message: "This goal will disappear from your list.",
      actions: [
        { label: "Cancel", variant: "ghost", onPress: () => {} },
        {
          label: "Remove",
          variant: "danger",
          onPress: () => {
            removeGoal(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ],
    });
  };

  const onBudgetToggle = (g: BudgetGoal, enabled: boolean) => {
    if (!enabled) {
      showDialog({
        title: "Turn off budget alerts?",
        message:
          "You will not be warned when you approach this budget limit for the month.",
        actions: [
          { label: "Keep on", variant: "ghost", onPress: () => {} },
          {
            label: "Turn off",
            variant: "danger",
            onPress: () => updateGoal(g.id, { alertEnabled: false }),
          },
        ],
      });
    } else {
      updateGoal(g.id, { alertEnabled: true });
      Haptics.selectionAsync();
    }
  };

  const renderGoal = (g: Goal) => {
    const wrap = (node: ReactNode) => (
      <Pressable
        key={g.id}
        onLongPress={() => confirmRemove(g.id)}
        delayLongPress={420}
      >
        {node}
      </Pressable>
    );

    switch (g.type) {
      case "savings":
        return wrap(
          <SavingsGoalCard
            goal={g}
            onAddSaved={(add) => {
              const row = g as SavingsGoal;
              updateGoal(g.id, {
                saved: Math.min(row.target, row.saved + add),
              });
            }}
          />
        );
      case "streak":
        return wrap(
          <StreakGoalCard
            goal={g}
            transactions={transactions}
            onAdvanceManualDay={
              g.streakKind === "daily_log"
                ? undefined
                : () =>
                    updateGoal(g.id, {
                      currentDay: Math.min(
                        g.targetDays,
                        g.currentDay + 1
                      ),
                    })
            }
          />
        );
      case "budget":
        return wrap(
          <BudgetAlertCard
            goal={g}
            spent={budgetSpend.get(g.id) ?? 0}
            onToggleAlert={(v) => onBudgetToggle(g, v)}
          />
        );
      default:
        return null;
    }
  };

  const onAdd = (input: GoalInput) => {
    addGoal(input);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <>
      <Screen scroll bottomInset={Layout.tabBarInset + 72}>
        <TabScreenHeader />

        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.xxl,
            letterSpacing: -0.02 * Typography.size.xxl,
            color: Colors.onSurface,
            marginBottom: 6,
          }}
        >
          Goals & challenges
        </Text>
        <Text
          style={{
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.md,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.lg,
          }}
        >
          Savings, streaks, and budgets tied to your real activity
        </Text>

        <GoalsStatCards
          weekSpendDelta={weekSpendDelta}
          budgetsOnTrack={budgetsOnTrack}
        />

        {goals.length === 0 ? (
          <View
            style={{
              paddingVertical: Spacing.xl,
              paddingHorizontal: Spacing.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.md,
                color: Colors.onSurfaceVariant,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Add a savings target, a daily logging streak, or a category budget.
              Your stats above update as you record transactions.
            </Text>
          </View>
        ) : (
          <>{goals.map((g) => renderGoal(g))}</>
        )}

        <Pressable
          onPress={() => setAddOpen(true)}
          style={{
            paddingVertical: Spacing.lg,
            borderRadius: Radius.pill,
            borderWidth: 2,
            borderColor: Colors.primaryContainer,
            alignItems: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.md,
              color: Colors.primaryContainer,
            }}
          >
            + Add new goal
          </Text>
        </Pressable>

        <Text
          style={{
            textAlign: "center",
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.md,
          }}
        >
          Long-press a card to remove it
        </Text>
      </Screen>

      <AddGoalModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
}
