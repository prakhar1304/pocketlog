import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";
import { AmountNumpad } from "./AmountNumpad";

type Props = {
  visible: boolean;
  value: string;
  onChange: (digits: string) => void;
  onClose: () => void;
};

export function AmountNumpadSheet({
  visible,
  value,
  onChange,
  onClose,
}: Props) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const parsedAmount = parseInt(value || "0", 10);
  const amountDisplay =
    value === ""
      ? "0"
      : new Intl.NumberFormat("en-IN").format(parsedAmount);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{
          flex: 1,
          backgroundColor:
            theme === "dark"
              ? "rgba(0, 0, 0, 0.65)"
              : "rgba(25, 28, 31, 0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: Colors.surfaceLowest,
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            paddingTop: Spacing.sm,
            paddingHorizontal: Spacing.screenAsymmetric.left,
            paddingRight: Spacing.screenAsymmetric.right,
            paddingBottom: insets.bottom + Spacing.lg,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: Colors.surfaceVariant,
              alignSelf: "center",
              marginBottom: Spacing.lg,
            }}
          />

          <Text
            style={{
              textAlign: "center",
              fontFamily: Typography.fontFamily.semibold,
              fontSize: Typography.size.xs,
              letterSpacing: 1,
              color: Colors.onSurfaceVariant,
              marginBottom: Spacing.md,
            }}
          >
            ENTER AMOUNT
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
              marginBottom: Spacing.xl,
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamily.bold,
                fontSize: Typography.size.xxl,
                color: Colors.primaryContainer,
                marginRight: 4,
              }}
            >
              ₹
            </Text>
            <Text
              style={{
                fontFamily: Typography.fontFamily.extrabold,
                fontSize: Typography.size.xxl,
                letterSpacing: -0.02 * Typography.size.xxl,
                color: Colors.onSurface,
              }}
            >
              {amountDisplay}
            </Text>
            <View
              style={{
                width: 2,
                height: 22,
                backgroundColor: Colors.primaryContainer,
                marginLeft: 6,
                opacity: 0.85,
              }}
            />
          </View>

          <AmountNumpad value={value} onChange={onChange} onDone={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
