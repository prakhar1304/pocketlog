import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingWaveBackground } from "../src/components/onboarding/OnboardingWaveBackground";
import { BrandLogo } from "../src/components/ui/BrandLogo";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import { Radius, Spacing, Typography } from "../src/constants/theme";
import { useAppColors } from "../src/hooks/useAppColors";
import { useAppStore } from "../src/store/useAppStore";
import { useTransactionStore } from "../src/store/useTransactionStore";

const PAGE_IMAGES = [
  require("../assets/images/page1.png"),
  require("../assets/images/page2.png"),
  require("../assets/images/page3.png"),
] as const;

const SLIDES = [
  {
    key: "1",
    title: "Track spending with clarity",
    body:
      "Log income and expenses in one simple place — no bank login required.\nSee daily habits take shape in a format made for your phone.",
    image: PAGE_IMAGES[0],
  },
  {
    key: "2",
    title: "Insights you can use",
    body:
      "Charts and summaries highlight patterns without the noise.\nUnderstand your money in quick, mobile-friendly glances.",
    image: PAGE_IMAGES[1],
  },
  {
    key: "3",
    title: "Goals beside real life",
    body:
      "Light targets, streaks, and budgets sit next to real activity.\nPersonal and structured for regular, everyday check-ins.",
    image: PAGE_IMAGES[2],
  },
] as const;

export default function OnboardingScreen() {
  const Colors = useAppColors();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const setHasFinishedIntroSlides = useAppStore(
    (s) => s.setHasFinishedIntroSlides,
  );
  const seedIfEmpty = useTransactionStore((s) => s.seedIfEmpty);
  const padL = Spacing.screenAsymmetric.left;
  const padR = Spacing.screenAsymmetric.right;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== page && i >= 0 && i < SLIDES.length) setPage(i);
  };

  const goToProfileStep = () => {
    seedIfEmpty();
    setHasFinishedIntroSlides(true);
    router.replace("/onboarding-profile" as Href);
  };

  const goNext = () => {
    if (page < SLIDES.length - 1) {
      listRef.current?.scrollToOffset({
        offset: (page + 1) * width,
        animated: true,
      });
    } else {
      goToProfileStep();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface }}>
      <OnboardingWaveBackground width={width} height={height} />
      <View
        style={{
          paddingTop: insets.top + Spacing.md,
          paddingLeft: padL,
          paddingRight: padR,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: Spacing.md,
          }}
        >
          <Pressable onPress={goToProfileStep} hitSlop={12}>
            <Text
              style={{
                fontFamily: Typography.fontFamily.semibold,
                fontSize: Typography.size.md,
                color: Colors.primaryContainer,
              }}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", marginBottom: Spacing.lg }}>
          <BrandLogo
            size={80}
            borderRadius={Radius.lg}
            style={{ marginBottom: Spacing.md }}
          />
          <Text
            style={{
              fontFamily: Typography.fontFamily.extrabold,
              fontSize: Typography.size.xxl,
              letterSpacing: -0.02 * Typography.size.xxl,
              color: Colors.onSurface,
            }}
          >
            Pocketlog
          </Text>
          <Text
            style={{
              marginTop: Spacing.xs,
              fontFamily: Typography.fontFamily.medium,
              fontSize: Typography.size.md,
              color: Colors.primary,
            }}
          >
            Your everyday money companion.
          </Text>
        </View>
      </View>

      <FlatList
        style={{ flex: 1, backgroundColor: "transparent" }}
        ref={listRef}
        data={[...SLIDES]}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width, paddingLeft: padL, paddingRight: padR }}>
            <View
              style={{
                // backgroundColor: Colors.surfaceLowest,
                // borderRadius: Radius.xl,
                padding: Spacing.xl,
                // shadowColor: Colors.onSecondaryFixedVariant,
                // shadowOffset: { width: 0, height: 12 },
                // shadowOpacity: 0.06,
                // shadowRadius: 32,
                // elevation: 8,
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: Radius.lg,
                  marginBottom: Spacing.lg,
                }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontFamily: Typography.fontFamily.bold,
                  fontSize: Typography.size.xl,
                  letterSpacing: -0.02 * Typography.size.xl,
                  color: Colors.onSurface,
                  marginBottom: Spacing.sm,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: Typography.fontFamily.regular,
                  fontSize: Typography.size.base,
                  lineHeight: Typography.size.base * 1.6,
                  color: Colors.onSurfaceVariant,
                }}
              >
                {item.body}
              </Text>
            </View>
          </View>
        )}
      />

      <View
        style={{
          paddingLeft: padL,
          paddingRight: padR,
          paddingBottom: insets.bottom + Spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: Spacing.sm,
            marginTop: Spacing.lg,
            marginBottom: Spacing.lg,
          }}
        >
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={{
                height: 6,
                borderRadius: 3,
                width: i === page ? 28 : 6,
                backgroundColor:
                  i === page ? Colors.primaryContainer : Colors.surfaceVariant,
              }}
            />
          ))}
        </View>

        <PrimaryButton
          label={page < SLIDES.length - 1 ? "Continue" : "Get Started"}
          onPress={goNext}
        />
      </View>
    </View>
  );
}
