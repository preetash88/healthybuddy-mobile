import React, { memo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Extrapolate,
    withRepeat,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SkeletonCTASection from "./skeletons/SkeletonCTASection";

const { width } = Dimensions.get("window");

interface Props {
    scrollY: Animated.SharedValue<number>;
}

function CTASection({ scrollY }: Props) {
    const router = useRouter();
    const { t, ready } = useTranslation();
    const scheme = useColorScheme();

    if (!ready) return null;

    /* ---------------- Entrance Animation ---------------- */

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 800 });
    }, []);

    const containerStyle = useAnimatedStyle(() => {
        const p = interpolate(
            scrollY.value,
            [1700, 2000],
            [0, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity: p,
            transform: [
                {
                    translateX: interpolate(p, [0, 1], [120, 0]),
                },
            ],
        };
    });

    /* ---------------- Animated Gradient Shift ---------------- */

    const gradientShift = useSharedValue(0);

    useEffect(() => {
        gradientShift.value = withRepeat(
            withTiming(1, { duration: 8000 }),
            -1,
            true
        );
    }, []);

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    gradientShift.value,
                    [0, 1],
                    [0, -30]
                ),
            },
        ],
    }));

    /* ---------------- CTA Button Interaction ---------------- */

    const pressScale = useSharedValue(1);

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressScale.value }],
    }));

    const handlePress = () => {
        router.push("/symptom-checker");
    };

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            {/* Animated Gradient Background */}
            <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
                <LinearGradient
                    colors={
                        scheme === "dark"
                            ? ["#0c4a6e", "#134e4a", "#064e3b"]
                            : ["#2563eb", "#0d9488", "#16a34a"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <View style={styles.content}>
                {/* Icon */}
                <MaterialIcons
                    name="favorite"
                    size={60}
                    color="#ffffff"
                    style={{ marginBottom: 20 }}
                />

                {/* Title */}
                <Text style={styles.title}>
                    {t("CTASection.title")}
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    {t("CTASection.subtitle")}
                </Text>

                {/* CTA Button */}
                <Pressable
                    onPressIn={() =>
                        (pressScale.value = withSpring(0.95))
                    }
                    onPressOut={() =>
                        (pressScale.value = withSpring(1))
                    }
                    onPress={handlePress}
                >
                    <Animated.View style={[styles.button, pressStyle]}>
                        <MaterialIcons
                            name="monitor-heart"
                            size={20}
                            color="#2563eb"
                        />
                        <Text style={styles.buttonText}>
                            {t("CTASection.cta")}
                        </Text>
                    </Animated.View>
                </Pressable>
            </View>
        </Animated.View>
    );
}

export default memo(CTASection);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        minHeight: 380,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    content: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#ffffff",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 16,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
    },
    button: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "#ffffff",
        elevation: 8,
    },
    buttonText: {
        fontWeight: "700",
        color: "#2563eb",
    },
});
