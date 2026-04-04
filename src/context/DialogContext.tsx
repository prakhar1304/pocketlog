import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Radius, Spacing, Typography } from "../constants/theme";
import { useAppColors, useAppTheme } from "../hooks/useAppColors";

export type DialogActionVariant = "primary" | "danger" | "ghost";

export type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: DialogActionVariant;
};

export type DialogConfig = {
  title: string;
  message?: string;
  actions: DialogAction[];
};

type DialogContextValue = {
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const { width } = useWindowDimensions();
  const maxW = Math.min(width - 48, 400);

  const hideDialog = useCallback(() => setConfig(null), []);

  const showDialog = useCallback((next: DialogConfig) => {
    setConfig(next);
  }, []);

  const value = useMemo(
    () => ({ showDialog, hideDialog }),
    [showDialog, hideDialog]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal
        visible={!!config}
        transparent
        animationType="fade"
        onRequestClose={hideDialog}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor:
              theme === "dark"
                ? "rgba(0, 0, 0, 0.62)"
                : "rgba(25, 28, 31, 0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: Spacing.lg,
          }}
          onPress={hideDialog}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: maxW,
              backgroundColor: Colors.surfaceLowest,
              borderRadius: Radius.xl,
              padding: Spacing.xl,
            }}
          >
            {config ? (
              <>
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: Typography.size.lg,
                    color: Colors.onSurface,
                    marginBottom: config.message ? Spacing.sm : Spacing.lg,
                  }}
                >
                  {config.title}
                </Text>
                {config.message ? (
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily.regular,
                      fontSize: Typography.size.base,
                      lineHeight: Typography.size.base * 1.55,
                      color: Colors.onSurfaceVariant,
                      marginBottom: Spacing.xl,
                    }}
                  >
                    {config.message}
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    gap: Spacing.md,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  {config.actions.map((a) => {
                    const v = a.variant ?? "primary";
                    const bg =
                      v === "ghost"
                        ? "transparent"
                        : v === "danger"
                          ? Colors.expenseMuted
                          : Colors.primaryContainer;
                    const fg =
                      v === "ghost"
                        ? Colors.onSurfaceVariant
                        : v === "danger"
                          ? Colors.expense
                          : Colors.onPrimary;
                    return (
                      <Pressable
                        key={a.label}
                        onPress={() => {
                          a.onPress();
                          hideDialog();
                        }}
                        style={({ pressed }) => ({
                          paddingVertical: Spacing.md,
                          paddingHorizontal: Spacing.lg,
                          borderRadius: Radius.pill,
                          backgroundColor: bg,
                          opacity: pressed ? 0.88 : 1,
                          minWidth: v === "ghost" ? undefined : 108,
                          alignItems: "center",
                        })}
                      >
                        <Text
                          style={{
                            fontFamily: Typography.fontFamily.semibold,
                            fontSize: Typography.size.sm,
                            color: fg,
                          }}
                        >
                          {a.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return ctx;
}
