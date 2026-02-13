import React, { memo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
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
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import SkeletonCard from "./skeletons/SkeletonCard";

const { width } = Dimensions.get("window");

/* ---------------- Icon Mapping ---------------- */

const ICON_MAP: Record<string, string> = {
    symptomAnalyzer: "analytics",
    symptomChecker: "medical-services",
    diseaseLibrary: "menu-book",
    preventionTips: "shield",
    findClinics: "location-on",
    emergencyGuide: "warning",
};

/* ---------------- Gradient Mapping ---------------- */

const GRADIENT_MAP: Record<string, string[]> = {
    symptomAnalyzer: ["#c084fc", "#7c3aed"],
    symptomChecker: ["#3b82f6", "#06b6d4"],
    diseaseLibrary: ["#8b5cf6", "#ec4899"],
    preventionTips: ["#22c55e", "#10b981"],
    findClinics: ["#f97316", "#ef4444"],
    emergencyGuide: ["#ef4444", "#f43f5e"],
};

function Features() {
    const router = useRouter();
    const { t, ready } = useTranslation();
    const scheme = useColorScheme();

    const features = t("Features.items", { returnObjects: true });

    // if (!ready) {
    //     return (
    //         <View style={styles.container}>
    //             {Array.from({ length: 6 }).map((_, i) => (
    //                 <SkeletonCard key={i} />
    //             ))}
    //         </View>
    //     );
    // }
    if (!ready) return null

    return (
        <View
            style={[
                styles.container,
                scheme === "dark" && styles.darkContainer,
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text
                    style={[
                        styles.title,
                        scheme === "dark" && styles.darkText,
                    ]}
                >
                    {t("Features.sectionTitle")}
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        scheme === "dark" && styles.darkSubText,
                    ]}
                >
                    {t("Features.sectionDescription")}
                </Text>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {features.map((feature: any, index: number) => {
                    const progress = useSharedValue(0);
                    const pressScale = useSharedValue(1);

                    useEffect(() => {
                        progress.value = withTiming(1, {
                            duration: 500,
                            delay: index * 120,
                        });
                    }, []);

                    const animatedStyle = useAnimatedStyle(() => ({
                        opacity: progress.value,
                        transform: [
                            {
                                translateY: interpolate(
                                    progress.value,
                                    [0, 1],
                                    [40, 0]
                                ),
                            },
                        ],
                    }));

                    const pressStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: pressScale.value }],
                    }));

                    const handlePress = () => {
                        router.push(feature.path);
                    };

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.card, animatedStyle]}
                        >
                            <Pressable
                                onPressIn={() =>
                                    (pressScale.value = withSpring(0.96))
                                }
                                onPressOut={() =>
                                    (pressScale.value = withSpring(1))
                                }
                                onPress={handlePress}
                            >
                                <Animated.View style={pressStyle}>
                                    {/* Top Gradient Bar */}
                                    <LinearGradient
                                        colors={GRADIENT_MAP[feature.id]}
                                        style={styles.topBar}
                                    />

                                    <View style={styles.cardContent}>
                                        {/* Icon */}
                                        <LinearGradient
                                            colors={GRADIENT_MAP[feature.id]}
                                            style={styles.iconCircle}
                                        >
                                            <MaterialIcons
                                                name={ICON_MAP[feature.id]}
                                                size={26}
                                                color="#fff"
                                            />
                                        </LinearGradient>

                                        {/* Title */}
                                        <Text
                                            style={[
                                                styles.cardTitle,
                                                scheme === "dark" &&
                                                styles.darkText,
                                            ]}
                                        >
                                            {feature.title}
                                        </Text>

                                        {/* Description */}
                                        <Text
                                            style={[
                                                styles.cardDescription,
                                                scheme === "dark" &&
                                                styles.darkSubText,
                                            ]}
                                        >
                                            {feature.description}
                                        </Text>

                                        {/* Action Button */}
                                        <View style={styles.buttonWrapper}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>
                                                    {feature.action}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Animated.View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
}

export default memo(Features);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        paddingVertical: 60,
        paddingHorizontal: 16,
        backgroundColor: "#f8fafc",
    },
    darkContainer: {
        backgroundColor: "#0f172a",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: 8,
        textAlign: "center",
        color: "#6b7280",
    },
    darkText: {
        color: "#f1f5f9",
    },
    darkSubText: {
        color: "#94a3b8",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: width > 700 ? "48%" : "100%",
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        elevation: 8,
        overflow: "hidden",
    },
    topBar: {
        height: 6,
        width: "100%",
    },
    cardContent: {
        padding: 20,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    cardDescription: {
        marginTop: 8,
        fontSize: 14,
        color: "#6b7280",
    },
    buttonWrapper: {
        marginTop: 16,
    },
    button: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#2563eb",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
