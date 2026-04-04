import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DialogProvider } from "../src/context/DialogContext";
import { getAppColors } from "../src/constants/theme";
import { useAppStore } from "../src/store/useAppStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useAppStore((s) => s.theme);
  const surface = getAppColors(theme).surface;
  const surfaceLowest = getAppColors(theme).surfaceLowest;

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  const [hydrated, setHydrated] = useState(() =>
    useAppStore.persist.hasHydrated()
  );

  const onHydrated = useCallback(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(onHydrated);
    return unsub;
  }, [onHydrated]);

  useEffect(() => {
    if (fontsLoaded && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(surface);
  }, [surface]);

  if (!fontsLoaded || !hydrated) {
    return (
      <View
        style={{ flex: 1, backgroundColor: surface }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: surface }}>
      <DialogProvider>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: surface },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="onboarding-profile" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-transaction"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              contentStyle: { backgroundColor: surfaceLowest },
            }}
          />
        </Stack>
      </DialogProvider>
    </GestureHandlerRootView>
  );
}
