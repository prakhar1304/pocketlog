import { Pressable, Text, View } from "react-native";

import { Radius, Spacing, Typography } from "../../constants/theme";
import { useAppColors } from "../../hooks/useAppColors";

const ROWS: string[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["empty", "0", "⌫"],
];

type Props = {
  value: string;
  onChange: (digits: string) => void;
  /** Optional "Done" to collapse the pad (e.g. add-transaction). */
  onDone?: () => void;
};

export function AmountNumpad({ value, onChange, onDone }: Props) {
  const Colors = useAppColors();
  const tap = (key: string) => {
    if (key === "empty") return;
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= 10) return;
    if (value === "" && key === "0") return;
    onChange(value + key);
  };

  return (
    <View style={{ gap: Spacing.sm }}>
      {ROWS.map((row, ri) => (
        <View
          key={ri}
          style={{
            flexDirection: "row",
            gap: Spacing.sm,
            justifyContent: "center",
          }}
        >
          {row.map((key) => {
            if (key === "empty") {
              return (
                <View
                  key={key + ri}
                  style={{ flex: 1, maxWidth: 96, aspectRatio: 1.4 }}
                />
              );
            }
            return (
              <Pressable
                key={key + ri}
                onPress={() => tap(key)}
                style={({ pressed }) => ({
                  flex: 1,
                  maxWidth: 96,
                  aspectRatio: 1.4,
                  borderRadius: Radius.lg,
                  backgroundColor: Colors.surfaceContainerLow,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text
                  style={{
                    fontFamily: Typography.fontFamily.bold,
                    fontSize: key === "⌫" ? Typography.size.lg : Typography.size.xl,
                    color: Colors.onSurface,
                  }}
                >
                  {key === "⌫" ? "⌫" : key}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
      {onDone ? (
        <Pressable
          onPress={onDone}
          style={({ pressed }) => ({
            marginTop: Spacing.md,
            alignSelf: "stretch",
            paddingVertical: Spacing.md,
            borderRadius: Radius.lg,
            backgroundColor: Colors.secondaryFixedDim,
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamily.bold,
              fontSize: Typography.size.md,
              color: Colors.onSecondaryFixed,
            }}
          >
            Done
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
