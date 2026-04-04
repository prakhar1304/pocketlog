import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

import { BrandLogo } from "../src/components/ui/BrandLogo";
import { Card } from "../src/components/ui/Card";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import {
  getWebCardShadow,
  Radius,
  Spacing,
  Typography,
} from "../src/constants/theme";
import { useAppColors, useAppTheme } from "../src/hooks/useAppColors";
import { useAppStore } from "../src/store/useAppStore";

const padL = Spacing.screenAsymmetric.left;
const padR = Spacing.screenAsymmetric.right;

function isValidEmail(s: string) {
  const t = s.trim();
  if (!t) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function parseIncomeRupees(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

type FieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
};

function EditorialField({
  label,
  hint,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  focused,
  onFocus,
  onBlur,
}: FieldProps) {
  const Colors = useAppColors();
  const focusGlow = !focused
    ? {}
    : Platform.OS === "web"
      ? { boxShadow: `0 0 0 4px ${Colors.primaryContainer}29` }
      : {
          shadowColor: Colors.primaryContainer,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 2,
        };
  return (
    <View style={{ marginBottom: Spacing.lg }}>
      <Text
        style={{
          fontFamily: Typography.fontFamily.semibold,
          fontSize: Typography.size.sm,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.sm,
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.outlineVariant}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        autoCorrect={keyboardType !== "email-address"}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.md,
          color: Colors.onSurface,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: Radius.xl,
          backgroundColor: focused
            ? Colors.surfaceLowest
            : Colors.surfaceContainerLow,
          borderWidth: focused ? 1 : 0,
          borderColor: "rgba(98, 0, 238, 0.35)",
          ...focusGlow,
        }}
      />
      {hint ? (
        <Text
          style={{
            marginTop: Spacing.xs,
            fontFamily: Typography.fontFamily.regular,
            fontSize: Typography.size.xs,
            color: Colors.onSurfaceVariant,
            lineHeight: Typography.size.xs * 1.5,
          }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export default function OnboardingProfileScreen() {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const hasFinishedIntroSlides = useAppStore((s) => s.hasFinishedIntroSlides);
  const setDisplayName = useAppStore((s) => s.setDisplayName);
  const setEmail = useAppStore((s) => s.setEmail);
  const setMonthlyIncomeRupees = useAppStore((s) => s.setMonthlyIncomeRupees);
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);

  const [name, setName] = useState("");
  const [email, setEmailLocal] = useState("");
  const [income, setIncome] = useState("");
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (hasOnboarded) {
      router.replace("/(tabs)" as Href);
    }
  }, [hasOnboarded, router]);

  useEffect(() => {
    if (!hasFinishedIntroSlides) {
      router.replace("/onboarding" as Href);
    }
  }, [hasFinishedIntroSlides, router]);

  const nameOk = name.trim().length >= 2;
  const emailOk = isValidEmail(email);
  const canSubmit = nameOk && emailOk;

  const completeOnboarding = useCallback(() => {
    setDisplayName(name.trim());
    setEmail(email.trim());
    setMonthlyIncomeRupees(parseIncomeRupees(income));
    setHasOnboarded(true);
    router.replace("/(tabs)" as Href);
  }, [
    email,
    income,
    name,
    router,
    setDisplayName,
    setEmail,
    setHasOnboarded,
    setMonthlyIncomeRupees,
  ]);

  const onContinue = () => {
    setAttemptedSubmit(true);
    if (!canSubmit) return;
    completeOnboarding();
  };

  const onSkip = () => {
    setHasOnboarded(true);
    router.replace("/(tabs)" as Href);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingLeft: padL,
          paddingRight: padR,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            maxWidth: 560,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={{ marginBottom: Spacing.xl }}>
            <BrandLogo
              size={80}
              borderRadius={Radius.lg}
              style={{ marginBottom: Spacing.lg }}
            />
            <Text
              style={{
                fontFamily: Typography.fontFamily.extrabold,
                fontSize: Typography.size.xxl,
                letterSpacing: -0.02 * Typography.size.xxl,
                color: Colors.onSurface,
                marginBottom: Spacing.sm,
              }}
            >
              Set up your companion
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.regular,
                fontSize: Typography.size.base,
                lineHeight: Typography.size.base * 1.6,
                color: Colors.onSurfaceVariant,
                maxWidth: 340,
              }}
            >
              Not a bank — a lightweight app for habits, goals, and insights.
              {"\n"}
              A few details personalize your space; they stay on this device.
            </Text>
          </View>

          <Card
            radialGlow
            radialGlowCorner="topLeft"
            style={[
              {
                padding: Spacing.xl,
                marginBottom: Spacing.lg,
              },
              Platform.OS === "web"
                ? ({ boxShadow: getWebCardShadow(theme) } as const)
                : {},
            ]}
          >
            <EditorialField
              label="Your name"
              hint="Shown on Home and Profile."
              value={name}
              onChangeText={setName}
              placeholder="e.g. Riya Kumar"
              focused={focusKey === "name"}
              onFocus={() => setFocusKey("name")}
              onBlur={() => setFocusKey(null)}
            />
            <EditorialField
              label="Email"
              hint="For your profile. Not included in CSV exports."
              value={email}
              onChangeText={setEmailLocal}
              placeholder="you@example.com"
              keyboardType="email-address"
              focused={focusKey === "email"}
              onFocus={() => setFocusKey("email")}
              onBlur={() => setFocusKey(null)}
            />
            <EditorialField
              label="Monthly income"
              hint="Optional. Whole rupees; helps future insights stay grounded."
              value={income}
              onChangeText={setIncome}
              placeholder="e.g. 85000"
              keyboardType="number-pad"
              focused={focusKey === "income"}
              onFocus={() => setFocusKey("income")}
              onBlur={() => setFocusKey(null)}
            />

            {attemptedSubmit && !nameOk ? (
              <Text
                style={{
                  fontFamily: Typography.fontFamily.medium,
                  fontSize: Typography.size.sm,
                  color: Colors.expense,
                  marginBottom: Spacing.md,
                }}
              >
                Please enter at least two characters for your name.
              </Text>
            ) : null}
            {attemptedSubmit && !emailOk ? (
              <Text
                style={{
                  fontFamily: Typography.fontFamily.medium,
                  fontSize: Typography.size.sm,
                  color: Colors.expense,
                  marginBottom: Spacing.md,
                }}
              >
                Add a valid email address.
              </Text>
            ) : null}
          </Card>

          <PrimaryButton
            label="Enter Pocketlog"
            onPress={onContinue}
            disabled={!canSubmit}
          />

          <Pressable
            onPress={onSkip}
            hitSlop={12}
            style={{ alignItems: "center", marginTop: Spacing.lg }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.md,
                color: Colors.onSurfaceVariant,
              }}
            >
              Skip for now
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
