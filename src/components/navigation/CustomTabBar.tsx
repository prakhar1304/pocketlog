import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getAmbientShadow,
  getWebCardShadow,
  Layout,
  Radius,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useAppColors, useAppTheme } from "../../hooks/useAppColors";

const TAB_ICONS = [
  "home-outline",
  "receipt-outline",
  "flag-outline",
  "stats-chart-outline",
  "person-outline",
] as const;

const TAB_ICONS_ACTIVE = [
  "home",
  "receipt",
  "flag",
  "stats-chart",
  "person",
] as const;

const LABELS = [
  "Home",
  "Transactions",
  "Goals",
  "Insights",
  "Profile",
] as const;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const Colors = useAppColors();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottomPad = Math.max(insets.bottom, Spacing.sm);
  const barMax = Math.min(width - Spacing.lg * 2, Layout.maxContentWidth + 48);
  const floatShadow =
    Platform.OS === "web"
      ? ({ boxShadow: getWebCardShadow(theme) } as const)
      : getAmbientShadow(theme);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        paddingBottom: bottomPad,
        paddingTop: Spacing.sm,
      }}
      pointerEvents="box-none"
    >
      <View style={{ width: barMax, maxWidth: "100%" }}>
        <View
          style={[
            {
              borderRadius: Radius.pill,
              backgroundColor: Colors.surface,
            },
            floatShadow,
          ]}
        >
          <View
            style={{
              borderRadius: Radius.pill,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.sm,
              }}
            >
              {state.routes.map((route, index) => {
                const focused = state.index === index;
                const { options } = descriptors[route.key];
                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <Pressable
                    key={route.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: focused }}
                    accessibilityLabel={options.title ?? LABELS[index]}
                    onPress={onPress}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      paddingVertical: Spacing.xs,
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: focused ? Spacing.md : Spacing.sm,
                        paddingVertical: Spacing.xs,
                        borderRadius: Radius.full,
                        // backgroundColor: focused
                        //   ? Colors.secondaryFixedDim
                        //   : "transparent",
                        // minWidth: 44,
                        alignItems: "center",
                        backgroundColor: focused
                          ? Colors.primary + "20" // light overlay
                          : "transparent",
                        // borderWidth: focused ? 1 : 0,
                        borderColor: focused ? Colors.primary : "transparent",
                      }}
                    >
                      <Ionicons
                        name={
                          focused ? TAB_ICONS_ACTIVE[index] : TAB_ICONS[index]
                        }
                        size={22}
                        color={
                          focused
                            ? Colors.primaryContainer
                            : Colors.onSurfaceVariant
                        }
                      />
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        style={{
                          marginTop: 2,
                          fontFamily: focused
                            ? Typography.fontFamily.semibold
                            : Typography.fontFamily.medium,
                          fontSize: Typography.size.xs,
                          color: focused
                            ? Colors.primaryContainer
                            : Colors.onSurfaceVariant,
                        }}
                      >
                        {LABELS[index].split(" ")[0]}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
