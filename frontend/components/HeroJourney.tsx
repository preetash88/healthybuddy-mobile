import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withRepeat,
    withSpring,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height, width } = Dimensions.get("window");

interface Props {
    scrollY: Animated.SharedValue<number>;
}

export default function HeroJourney({ scrollY }: Props) {
    const router = useRouter();
    const { t } = useTranslation();
    const reduceMotion = useReducedMotion();

    /* ---------------- Parallax Transform ---------------- */

    const parallaxStyle = useAnimatedStyle(() => {
        const y = interpolate(
            scrollY.value,
            [0, 500],
            [0, -180],
            Extrapolate.CLAMP
        );

        const scale = interpolate(
            scrollY.value,
            [0, 500],
            [1, 1.18],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateY: reduceMotion ? 0 : y },
                { scale: reduceMotion ? 1 : scale },
            ],
        };
    });

    /* ---------------- Rotating Gradients ---------------- */

    const rotate1 = useSharedValue(0);
    const rotate2 = useSharedValue(0);

    React.useEffect(() => {
        if (!reduceMotion) {
            rotate1.value = withRepeat(
                withTiming(360, { duration: 120000 }),
                -1
            );
            rotate2.value = withRepeat(
                withTiming(-360, { duration: 160000 }),
                -1
            );
        }
    }, []);

    const gradient1Style = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate1.value}deg` }],
    }));

    const gradient2Style = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate2.value}deg` }],
    }));

    /* ---------------- Entry Animations ---------------- */

    const badge = useSharedValue(0);
    const heading = useSharedValue(0);
    const description = useSharedValue(0);
    const cta = useSharedValue(0);

    React.useEffect(() => {
        badge.value = withTiming(1, { duration: 800 });
        setTimeout(() => {
            heading.value = withTiming(1, { duration: 1000 });
        }, 200);
        setTimeout(() => {
            description.value = withTiming(1, { duration: 800 });
        }, 500);
        setTimeout(() => {
            cta.value = withSpring(1, { damping: 12 });
        }, 900);
    }, []);

    const badgeStyle = useAnimatedStyle(() => ({
        opacity: badge.value,
        transform: [
            { translateY: interpolate(badge.value, [0, 1], [30, 0]) },
            { scale: interpolate(badge.value, [0, 1], [0.8, 1]) },
        ],
    }));

    const headingStyle = useAnimatedStyle(() => ({
        opacity: heading.value,
        transform: [
            { translateY: interpolate(heading.value, [0, 1], [60, 0]) },
            { scale: interpolate(heading.value, [0, 1], [0.9, 1]) },
        ],
    }));

    const descriptionStyle = useAnimatedStyle(() => ({
        opacity: description.value,
        transform: [
            { translateY: interpolate(description.value, [0, 1], [40, 0]) },
        ],
    }));

    const ctaStyle = useAnimatedStyle(() => ({
        opacity: cta.value,
        transform: [{ scale: cta.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Visual Layer */}
            <Animated.View style={[styles.visualLayer, parallaxStyle]}>
                <Animated.View style={[styles.gradient1, gradient1Style]} />
                <Animated.View style={[styles.gradient2, gradient2Style]} />

                <Image
                    source={require("../assets/images/heroJourney6.avif")}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.badge, badgeStyle]}>
                    <Text style={styles.badgeText}>
                        ✨ {t("HeroJourney.badge")}
                    </Text>
                </Animated.View>

                <Animated.Text style={[styles.heading, headingStyle]}>
                    {t("HeroJourney.headingLine1")}
                    {"\n"}
                    <Text style={styles.highlight}>
                        {t("HeroJourney.headingLine2")}
                    </Text>
                </Animated.Text>

                <Animated.Text style={[styles.description, descriptionStyle]}>
                    {t("HeroJourney.description")}
                </Animated.Text>

                <Animated.View style={[styles.ctaContainer, ctaStyle]}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => router.push("/symptom-checker")}
                    >
                        <MaterialIcons name="monitor-heart" size={22} />
                        <Text style={styles.ctaText}>
                            {t("HeroJourney.cta")}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Bottom Fade */}
            <View style={styles.bottomFade} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    justifyContent: "flex-start",
    overflow: "hidden",
    backgroundColor: "#121418",
  },
  visualLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient1: {
    position: "absolute",
    width: 800,
    height: 800,
    borderRadius: 400,
    backgroundColor: "rgba(0,200,255,0.15)",
    top: -300,
    left: -200,
  },
  gradient2: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "rgba(255,0,200,0.1)",
    bottom: -200,
    right: -100,
  },
  heroImage: {
    // CHANGED: Make width 150% of screen width to allow shifting
    width: width * 1.8,
    height: height,
    position: "absolute",
    opacity: 0.9,
    top: 0,

    // ADDED: Shift the image to the left.
    // A negative translateX pulls the right side of the image into view.
    // Adjust "-150" to whatever number centers your device perfectly.
    right: -10,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 30,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
  },
  heading: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    lineHeight: 44,
  },
  highlight: {
    color: "#34D399",
  },
  description: {
    marginTop: 16,
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    maxWidth: 300,
  },
  ctaContainer: {
    marginTop: 24,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  ctaText: {
    fontWeight: "700",
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
