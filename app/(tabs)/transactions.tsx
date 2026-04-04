import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { type Href, router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SectionList,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabScreenHeader } from "../../src/components/navigation/TabScreenHeader";
import { FilterChips } from "../../src/components/transactions/FilterChips";
import { TransactionListRow } from "../../src/components/transactions/TransactionListRow";
import { TransactionSearchBar } from "../../src/components/transactions/TransactionSearchBar";
import {
  getAmbientStrongShadow,
  Layout,
  Spacing,
  Typography,
} from "../../src/constants/theme";
import { useAppColors, useAppTheme } from "../../src/hooks/useAppColors";
import { useDialog } from "../../src/context/DialogContext";
import { useTransactionStore } from "../../src/store/useTransactionStore";
import { groupTransactionsByDate } from "../../src/utils/groupTransactionsByDate";
import {
  type TransactionChipFilter,
  filterTransactions,
} from "../../src/utils/transactionFilters";

export default function TransactionsScreen() {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { showDialog } = useDialog();
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<TransactionChipFilter>("all");

  const filtered = useMemo(
    () => filterTransactions(transactions, query, chip),
    [transactions, query, chip]
  );

  const sections = useMemo(
    () => groupTransactionsByDate(filtered),
    [filtered]
  );

  const padL = Spacing.screenAsymmetric.left;
  const padR = Spacing.screenAsymmetric.right;
  const isEmpty = transactions.length === 0;
  const noResults = !isEmpty && filtered.length === 0;

  const openAdd = () => {
    router.push("/add-transaction" as Href);
  };

  const openEdit = (tid: string) => {
    router.push(
      `/add-transaction?id=${encodeURIComponent(tid)}` as Href
    );
  };

  const confirmDelete = (tid: string) => {
    showDialog({
      title: "Delete transaction?",
      message: "This cannot be undone.",
      actions: [
        { label: "Cancel", variant: "ghost", onPress: () => {} },
        {
          label: "Delete",
          variant: "danger",
          onPress: () => {
            deleteTransaction(tid);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ],
    });
  };

  const listHeader = (
    <View style={{ paddingBottom: Spacing.sm }}>
      <TabScreenHeader />

      <Text
        style={{
          fontFamily: Typography.fontFamily.bold,
          fontSize: Typography.size.xxl,
          letterSpacing: -0.02 * Typography.size.xxl,
          color: Colors.onSurface,
          marginBottom: Spacing.lg,
        }}
      >
        Transactions
      </Text>

      <TransactionSearchBar value={query} onChangeText={setQuery} />
      <FilterChips active={chip} onChange={setChip} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface }}>
      {isEmpty ? (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + Spacing.md,
            paddingHorizontal: padL,
            paddingRight: padR,
            paddingBottom: Layout.tabBarInset + 80,
          }}
        >
          {listHeader}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: Spacing.xl,
            }}
          >
            <Ionicons
              name="receipt-outline"
              size={56}
              color={Colors.surfaceVariant}
            />
            <Text
              style={{
                marginTop: Spacing.lg,
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.md,
                color: Colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              No transactions yet
            </Text>
            <Pressable
              onPress={openAdd}
              style={{
                marginTop: Spacing.xl,
                paddingVertical: Spacing.md,
                paddingHorizontal: Spacing.xl,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: `${Colors.outlineVariant}55`,
              }}
            >
              <Text
                style={{
                  fontFamily: Typography.fontFamily.semibold,
                  fontSize: Typography.size.sm,
                  color: Colors.primaryContainer,
                }}
              >
                + Add one
              </Text>
            </Pressable>
          </View>
        </View>
      ) : noResults ? (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + Spacing.md,
            paddingHorizontal: padL,
            paddingRight: padR,
          }}
        >
          {listHeader}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: Layout.tabBarInset + 80,
            }}
          >
            <Ionicons
              name="search-outline"
              size={48}
              color={Colors.surfaceVariant}
            />
            <Text
              style={{
                marginTop: Spacing.md,
                fontFamily: Typography.fontFamily.medium,
                fontSize: Typography.size.md,
                color: Colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              Nothing matches your search or filters.
            </Text>
            <Pressable
              onPress={() => {
                setQuery("");
                setChip("all");
              }}
              style={{ marginTop: Spacing.lg }}
            >
              <Text
                style={{
                  fontFamily: Typography.fontFamily.semibold,
                  fontSize: Typography.size.sm,
                  color: Colors.primaryContainer,
                }}
              >
                Clear filters
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionListRow
              transaction={item}
              onPress={() => openEdit(item.id)}
              onLongPress={() => confirmDelete(item.id)}
              onDelete={() => confirmDelete(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                letterSpacing: 1.2,
                color: Colors.onSurfaceVariant,
                marginTop: Spacing.lg,
                marginBottom: Spacing.md,
              }}
            >
              {title}
            </Text>
          )}
          ListHeaderComponent={
            <View style={{ paddingTop: insets.top + Spacing.md }}>
              {listHeader}
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: padL,
            paddingRight: padR,
            paddingBottom: Layout.tabBarInset + 88,
          }}
          stickySectionHeadersEnabled={false}
          SectionSeparatorComponent={() => (
            <View style={{ height: Spacing.xs }} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: Spacing.lg }} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!isEmpty ? (
        <Pressable
          onPress={openAdd}
          style={{
            position: "absolute",
            right: padR,
            bottom: Layout.tabBarInset + 10,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: Colors.secondaryAccent,
            alignItems: "center",
            justifyContent: "center",
            ...getAmbientStrongShadow(theme),
          }}
        >
          <Ionicons name="add" size={32} color={Colors.onPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}
