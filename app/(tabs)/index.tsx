import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { BalanceHeroCard } from "../../src/components/home/BalanceHeroCard";
import { HomeHeader } from "../../src/components/home/HomeHeader";
import { RecentTransactionsSection } from "../../src/components/home/RecentTransactionsSection";
import { WeeklySpendingChart } from "../../src/components/home/WeeklySpendingChart";
import { Screen } from "../../src/components/ui/Screen";
import { Layout, Spacing, Typography } from "../../src/constants/theme";
import { useAppColors } from "../../src/hooks/useAppColors";
import { useTransactionStore } from "../../src/store/useTransactionStore";
import {
  getLast7DaysExpenseByDay,
  recentTransactions,
  selectTotals,
} from "../../src/utils/transactionStats";

export default function HomeScreen() {
  const Colors = useAppColors();
  const router = useRouter();
  const transactions = useTransactionStore((s) => s.transactions);

  const { balance, income, expense } = useMemo(
    () => selectTotals(transactions),
    [transactions]
  );
  const weekDays = useMemo(
    () => getLast7DaysExpenseByDay(transactions),
    [transactions]
  );
  const recent = useMemo(
    () => recentTransactions(transactions, 5),
    [transactions]
  );

  const goTransactions = () => {
    router.push("/transactions" as Href);
  };

  return (
    <Screen scroll bottomInset={Layout.tabBarInset}>
      <HomeHeader />

      <BalanceHeroCard balance={balance} income={income} expense={expense} />

      <WeeklySpendingChart days={weekDays} />

      {recent.length === 0 ? (
        <View style={{ paddingVertical: Spacing.xxl }}>
          <Text
            style={{
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.md,
              color: Colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            No transactions yet. Add one from the Transactions tab.
          </Text>
        </View>
      ) : (
        <RecentTransactionsSection
          transactions={recent}
          onSeeAll={goTransactions}
          onPressRow={(tid) =>
            router.push(
              `/add-transaction?id=${encodeURIComponent(tid)}` as Href
            )
          }
        />
      )}

      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
