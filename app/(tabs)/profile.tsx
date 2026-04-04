import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { type Href, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Linking, Text, View } from "react-native";

import { SettingsSection } from "../../src/components/profile/SettingsSection";
import { SettingsRow } from "../../src/components/profile/SettingsRow";
import { TabScreenHeader } from "../../src/components/navigation/TabScreenHeader";
import { Screen } from "../../src/components/ui/Screen";
import { Layout, Spacing, Typography } from "../../src/constants/theme";
import { useAppColors } from "../../src/hooks/useAppColors";
import { useDialog } from "../../src/context/DialogContext";
import { useAppStore } from "../../src/store/useAppStore";
import { useTransactionStore } from "../../src/store/useTransactionStore";
import { clearAllUserData } from "../../src/utils/clearAllUserData";
import { formatCurrency } from "../../src/utils/formatCurrency";
import { profileInitials } from "../../src/utils/profileDisplay";
import { shareOrDownloadCsv } from "../../src/utils/shareCsv";
import { transactionsToCsv } from "../../src/utils/transactionsCsv";

const PRIVACY_URL = "https://pocketlog.app/privacy";
const RATE_URL = "https://expo.dev";

export default function ProfileScreen() {
  const Colors = useAppColors();
  const { showDialog } = useDialog();
  const displayName = useAppStore((s) => s.displayName);
  const email = useAppStore((s) => s.email);
  const monthlyIncomeRupees = useAppStore((s) => s.monthlyIncomeRupees);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const theme = useAppStore((s) => s.theme);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
  const setTheme = useAppStore((s) => s.setTheme);
  const transactions = useTransactionStore((s) => s.transactions);

  const version = Constants.expoConfig?.version ?? "1.0.0";
  const nameForDisplay = displayName.trim() || "Your profile";
  const emailForDisplay = email.trim() || "No email on file";
  const initials = profileInitials(displayName);
  const themeLabel = theme === "dark" ? "Dark" : "Light";

  const exportCsv = async () => {
    try {
      const csv = transactionsToCsv(transactions);
      await shareOrDownloadCsv(csv);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showDialog({
        title: "Export ready",
        message:
          transactions.length === 0
            ? "The file only contains headers (no transactions yet)."
            : "Your CSV has been shared or downloaded.",
        actions: [{ label: "OK", variant: "primary", onPress: () => {} }],
      });
    } catch (e) {
      showDialog({
        title: "Could not export",
        message:
          e instanceof Error ? e.message : "Please try again in a moment.",
        actions: [{ label: "OK", variant: "ghost", onPress: () => {} }],
      });
    }
  };

  const confirmClear = () => {
    showDialog({
      title: "Clear all data?",
      message:
        "This permanently deletes transactions and goals on this device and signs you out of the main app flow.",
      actions: [
        { label: "Cancel", variant: "ghost", onPress: () => {} },
        {
          label: "Clear",
          variant: "danger",
          onPress: () => {
            void (async () => {
              await clearAllUserData();
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              router.replace("/onboarding" as Href);
            })();
          },
        },
      ],
    });
  };

  const openTheme = () => {
    showDialog({
      title: "Theme",
      message:
        theme === "dark"
          ? "Dark theme is on. Surfaces and text use the Pocketlog night palette."
          : "Light theme is on. Switch to Dark for the amethyst-tinted night palette.",
      actions: [
        {
          label: "Light",
          variant: theme === "light" ? "primary" : "ghost",
          onPress: () => setTheme("light"),
        },
        {
          label: "Dark",
          variant: theme === "dark" ? "primary" : "ghost",
          onPress: () => setTheme("dark"),
        },
      ],
    });
  };

  const openCurrency = () => {
    showDialog({
      title: "Currency",
      message: "This build uses Indian rupees (₹ INR) only.",
      actions: [{ label: "OK", variant: "primary", onPress: () => {} }],
    });
  };

  const openAbout = () => {
    showDialog({
      title: "Pocketlog",
      message: `Pocket money and spending clarity.\n\nVersion ${version}`,
      actions: [{ label: "OK", variant: "primary", onPress: () => {} }],
    });
  };

  return (
    <Screen scroll bottomInset={Layout.tabBarInset}>
      <TabScreenHeader marginBottom={Spacing.xl} />

      <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: Colors.incomeMuted,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: Spacing.md,
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: 32,
              color: Colors.income,
            }}
          >
            {initials}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.xl,
            color: Colors.onSurface,
          }}
        >
          {nameForDisplay}
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.sm,
            color: Colors.onSurfaceVariant,
          }}
        >
          {emailForDisplay}
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontFamily: Typography.fontFamily.medium,
            fontSize: Typography.size.sm,
            color: Colors.onSurfaceVariant,
          }}
        >
          {monthlyIncomeRupees != null
            ? `Monthly income · ${formatCurrency(monthlyIncomeRupees)}`
            : "Monthly income · not shared"}
        </Text>
      </View>

      <SettingsSection title="PREFERENCES">
        <SettingsRow
          icon="cash-outline"
          label="Currency"
          value="₹ INR"
          onPress={openCurrency}
        />
        <SettingsRow
          icon="moon-outline"
          label="Theme"
          value={themeLabel}
          onPress={openTheme}
        />
        <SettingsRow
          icon="notifications-outline"
          label="Notifications"
          switchValue={notificationsEnabled}
          onSwitchChange={(v) => {
            setNotificationsEnabled(v);
            Haptics.selectionAsync();
          }}
        />
      </SettingsSection>

      <SettingsSection title="DATA">
        <SettingsRow
          icon="download-outline"
          label="Export transactions"
          onPress={exportCsv}
        />
        <SettingsRow
          icon="trash-outline"
          label="Clear all data"
          danger
          onPress={confirmClear}
        />
      </SettingsSection>

      <SettingsSection title="APP">
        <SettingsRow
          icon="star-outline"
          label="Rate us"
          onPress={() => Linking.openURL(RATE_URL)}
        />
        <SettingsRow
          icon="shield-checkmark-outline"
          label="Privacy policy"
          onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
        />
        <SettingsRow
          icon="information-circle-outline"
          label="About"
          onPress={openAbout}
        />
      </SettingsSection>

      <Text
        style={{
          textAlign: "center",
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.xs,
          color: Colors.onSurfaceVariant,
          marginBottom: Spacing.lg,
        }}
      >
        V{version}
      </Text>
    </Screen>
  );
}
