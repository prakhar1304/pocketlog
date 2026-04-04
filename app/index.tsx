import { type Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAppColors } from "../src/hooks/useAppColors";
import { useAppStore } from "../src/store/useAppStore";

export default function Index() {
  const Colors = useAppColors();
  const router = useRouter();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const hasFinishedIntroSlides = useAppStore((s) => s.hasFinishedIntroSlides);
  const [hydrated, setHydrated] = useState(() =>
    useAppStore.persist.hasHydrated()
  );

  useEffect(() => {
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (hasOnboarded) {
      router.replace("/(tabs)");
    } else if (!hasFinishedIntroSlides) {
      router.replace("/onboarding" as Href);
    } else {
      router.replace("/onboarding-profile" as Href);
    }
  }, [hydrated, hasFinishedIntroSlides, hasOnboarded, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.surface,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primaryContainer} />
    </View>
  );
}
