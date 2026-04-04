import { Ionicons } from "@expo/vector-icons";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { InsightsStatRow } from "../../src/components/insights/InsightsStatRow";
import { TabScreenHeader } from "../../src/components/navigation/TabScreenHeader";
import { InsightsTopTransactions } from "../../src/components/insights/InsightsTopTransactions";
import { SpendDonutChart } from "../../src/components/insights/SpendDonutChart";
import { WeekComparisonChart } from "../../src/components/insights/WeekComparisonChart";
import { Screen } from "../../src/components/ui/Screen";
import { Layout, Spacing, Typography } from "../../src/constants/theme";
import { useAppColors } from "../../src/hooks/useAppColors";
import { useTransactionStore } from "../../src/store/useTransactionStore";
import { categoryLabel } from "../../src/utils/categoryDisplay";
import {
  avgDailyExpense,
  biggestCategory,
  canGoToNextMonth,
  expensesByCategory,
  filterByCalendarMonth,
  sumExpenses,
  sumIncome,
  thisAndLastWeekDaily,
  toDonutSegments,
  topExpenseTransactions,
} from "../../src/utils/insightsCompute";

export default function InsightsScreen() {
  const Colors = useAppColors();
  const transactions = useTransactionStore((s) => s.transactions);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const inMonth = useMemo(
    () => filterByCalendarMonth(transactions, month),
    [transactions, month]
  );

  const expenseTotal = useMemo(() => sumExpenses(inMonth), [inMonth]);
  const incomeTotal = useMemo(() => sumIncome(inMonth), [inMonth]);
  const byCat = useMemo(() => expensesByCategory(inMonth), [inMonth]);
  const donutSegs = useMemo(
    () => toDonutSegments(byCat, categoryLabel, Colors.categories),
    [byCat, Colors.categories]
  );
  const biggest = useMemo(() => biggestCategory(byCat), [byCat]);
  const avgDaily = useMemo(
    () => avgDailyExpense(expenseTotal, month),
    [expenseTotal, month]
  );
  const netSaved = useMemo(
    () => incomeTotal - expenseTotal,
    [incomeTotal, expenseTotal]
  );
  const topThree = useMemo(
    () => topExpenseTransactions(inMonth, 3),
    [inMonth]
  );

  const { thisWeek, lastWeek, dayLabels } = useMemo(
    () => thisAndLastWeekDaily(transactions),
    [transactions]
  );

  const nextOk = canGoToNextMonth(month);

  return (
    <Screen scroll bottomInset={Layout.tabBarInset}>
      <TabScreenHeader />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: Spacing.xl,
        }}
      >
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.xxl,
            letterSpacing: -0.02 * Typography.size.xxl,
            color: Colors.onSurface,
          }}
        >
          Insights
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Pressable
            onPress={() => setMonth((m) => startOfMonth(subMonths(m, 1)))}
            hitSlop={10}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.surfaceContainerLow,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.primaryContainer}
            />
          </Pressable>
          <Text
            style={{
              minWidth: 140,
              textAlign: "center",
              fontFamily: Typography.fontFamily.semibold,
              fontSize: Typography.size.md,
              color: Colors.onSurface,
            }}
          >
            {format(month, "MMMM yyyy")}
          </Text>
          <Pressable
            disabled={!nextOk}
            onPress={() => setMonth((m) => startOfMonth(addMonths(m, 1)))}
            hitSlop={10}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: nextOk
                ? Colors.surfaceContainerLow
                : Colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              opacity: nextOk ? 1 : 0.45,
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={Colors.primaryContainer}
            />
          </Pressable>
        </View>
      </View>

      <InsightsStatRow
        biggest={biggest}
        avgDaily={avgDaily}
        saved={netSaved}
      />

      <SpendDonutChart segments={donutSegs} totalExpense={expenseTotal} />

      <WeekComparisonChart
        thisWeek={thisWeek}
        lastWeek={lastWeek}
        labels={dayLabels}
      />

      <InsightsTopTransactions transactions={topThree} />

      <View style={{ height: Spacing.md }} />
    </Screen>
  );
}
