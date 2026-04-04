import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AmountNumpadSheet } from "../src/components/transactions/AmountNumpadSheet";
import { CategoryPickerModal } from "../src/components/transactions/CategoryPickerModal";
import { DatePickerModal } from "../src/components/transactions/DatePickerModal";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import type { CategoryKey } from "../src/constants/theme";
import { Radius, Spacing, Typography } from "../src/constants/theme";
import { useAppColors } from "../src/hooks/useAppColors";
import { useTransactionStore } from "../src/store/useTransactionStore";
import { categoryLabel } from "../src/utils/categoryDisplay";

export default function AddTransactionScreen() {
  const Colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const transactions = useTransactionStore((s) => s.transactions);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);

  const existing = useMemo(
    () => (id ? transactions.find((t) => t.id === id) : undefined),
    [id, transactions]
  );

  const [type, setType] = useState<"expense" | "income">("expense");
  const [amountDigits, setAmountDigits] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryKey>("food");
  const [dateIso, setDateIso] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showAmountPad, setShowAmountPad] = useState(false);

  const resetForCreate = useCallback(() => {
    setType("expense");
    setAmountDigits("");
    setTitle("");
    setCategory("food");
    setDateIso(format(new Date(), "yyyy-MM-dd"));
    setNote("");
  }, []);

  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setAmountDigits(String(existing.amount));
      setTitle(existing.title);
      setCategory(existing.category);
      setDateIso(existing.date);
      setNote(existing.note);
    } else if (!id) {
      resetForCreate();
    }
  }, [existing, id, resetForCreate]);

  useEffect(() => {
    if (id && !existing) {
      router.back();
    }
  }, [id, existing]);

  const parsedAmount = parseInt(amountDigits || "0", 10);
  const amountDisplay =
    amountDigits === ""
      ? "0"
      : new Intl.NumberFormat("en-IN").format(parsedAmount);
  const canSave = title.trim().length > 0 && parsedAmount > 0;

  const onToggleType = (next: "expense" | "income") => {
    setType(next);
    setCategory(next === "income" ? "salary" : "food");
    Haptics.selectionAsync();
  };

  const save = () => {
    if (!canSave) return;
    const payload = {
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date: dateIso,
      note: note.trim(),
    };
    if (id) {
      updateTransaction(id, payload);
    } else {
      addTransaction(payload);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const displayDateLabel = useMemo(() => {
    try {
      const d = parseISO(dateIso);
      const today = format(new Date(), "yyyy-MM-dd");
      if (dateIso === today) return `Today, ${format(d, "d MMM yyyy")}`;
      return format(d, "EEEE, d MMM yyyy");
    } catch {
      return dateIso;
    }
  }, [dateIso]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.surfaceLowest }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          paddingTop: insets.top + Spacing.sm,
          paddingHorizontal: Spacing.screenAsymmetric.left,
          paddingRight: Spacing.screenAsymmetric.right,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Spacing.lg,
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.xl,
              color: Colors.onSurface,
            }}
          >
            {id ? "Edit transaction" : "New transaction"}
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.surfaceContainerLow,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={22} color={Colors.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.screenAsymmetric.left,
          paddingRight: Spacing.screenAsymmetric.right,
          paddingBottom: insets.bottom + Spacing.xxl,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderRadius: Radius.pill,
            overflow: "hidden",
            backgroundColor: Colors.surfaceContainerLow,
            marginBottom: Spacing.xl,
          }}
        >
          <Pressable
            onPress={() => onToggleType("expense")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Spacing.sm,
              paddingVertical: Spacing.md,
              backgroundColor:
                type === "expense" ? Colors.expenseMuted : "transparent",
            }}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={type === "expense" ? Colors.expense : Colors.onSurfaceVariant}
            />
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.sm,
                color:
                  type === "expense" ? Colors.expense : Colors.onSurfaceVariant,
              }}
            >
              Expense
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onToggleType("income")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Spacing.sm,
              paddingVertical: Spacing.md,
              backgroundColor:
                type === "income" ? Colors.incomeMuted : "transparent",
            }}
          >
            <Ionicons
              name="arrow-down"
              size={18}
              color={type === "income" ? Colors.income : Colors.onSurfaceVariant}
            />
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.sm,
                color:
                  type === "income" ? Colors.income : Colors.onSurfaceVariant,
              }}
            >
              Income
            </Text>
          </Pressable>
        </View>

        <Text
          style={{
            textAlign: "center",
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            letterSpacing: 1,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.sm,
          }}
        >
          ENTER AMOUNT
        </Text>
        <Pressable
          onPress={() => setShowAmountPad(true)}
          style={({ pressed }) => ({
            marginBottom: Spacing.xl,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.lg,
              borderRadius: Radius.lg,
              backgroundColor: `${Colors.secondaryFixedDim}55`,
              borderWidth: 1,
              borderColor: `${Colors.primaryContainer}33`,
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.hero,
                color: Colors.primaryContainer,
                marginRight: 4,
              }}
            >
              ₹
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.extrabold,
                fontSize: Typography.size.hero,
                letterSpacing: -0.02 * Typography.size.hero,
                color: Colors.onSurface,
              }}
            >
              {amountDisplay}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: Spacing.sm,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.sm,
              color: Colors.primaryContainer,
            }}
          >
            Tap to open amount keypad
          </Text>
        </Pressable>

        <Text
          style={{
            fontFamily: Typography.fontFamily.semibold,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            marginBottom: Spacing.xs,
          }}
        >
          Description
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Joe's Pizza"
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

        <Pressable
          onPress={() => setShowCategory(true)}
          style={{
            backgroundColor: Colors.surfaceContainerLow,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.md,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, marginRight: Spacing.md }}>🏷️</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
              }}
            >
              CATEGORY
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
                marginTop: 4,
              }}
            >
              {categoryLabel(category)}
            </Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={20}
            color={Colors.onSurfaceVariant}
          />
        </Pressable>

        <Pressable
          onPress={() => setShowDate(true)}
          style={{
            backgroundColor: Colors.surfaceContainerLow,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.md,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, marginRight: Spacing.md }}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.xs,
                color: Colors.onSurfaceVariant,
              }}
            >
              DATE
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.md,
                color: Colors.onSurface,
                marginTop: 4,
              }}
            >
              {displayDateLabel}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.onSurfaceVariant}
          />
        </Pressable>

        <View
          style={{
            backgroundColor: Colors.surfaceContainerLow,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.xl,
            minHeight: 100,
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.semibold,
              fontSize: Typography.size.xs,
              color: Colors.onSurfaceVariant,
              marginBottom: Spacing.sm,
            }}
          >
            NOTES
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note…"
            placeholderTextColor={Colors.onSurfaceVariant}
            multiline
            style={{
              fontFamily: Typography.fontFamily.regular,
              fontSize: Typography.size.md,
              color: Colors.onSurface,
              minHeight: 72,
              textAlignVertical: "top",
            }}
          />
        </View>

        <PrimaryButton
          label={id ? "Save changes" : "Save transaction"}
          onPress={save}
          disabled={!canSave}
        />
      </ScrollView>

      <CategoryPickerModal
        visible={showCategory}
        value={category}
        transactionType={type}
        onSelect={setCategory}
        onClose={() => setShowCategory(false)}
      />
      <DatePickerModal
        visible={showDate}
        valueIso={dateIso}
        onSelect={setDateIso}
        onClose={() => setShowDate(false)}
      />
      <AmountNumpadSheet
        visible={showAmountPad}
        value={amountDigits}
        onChange={setAmountDigits}
        onClose={() => setShowAmountPad(false)}
      />
    </KeyboardAvoidingView>
  );
}
