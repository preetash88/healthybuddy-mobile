import React, { memo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SkeletonWhyChoose from "./skeletons/SkeletonWhyChoose";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

interface Props {
    scrollY: Animated.SharedValue<number>;
}

function WhyChoose({ scrollY }: Props) {
    const { t, ready } = useTranslation();
    const scheme = useColorScheme();

    const points = t("WhyChoose.points", { returnObjects: true });

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 700 });
    }, []);

    /* Scroll-based reveal */
    const containerStyle = useAnimatedStyle(() => {
        const p = interpolate(
            scrollY.value,
            [1100, 1400],
            [0, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity: p,
            transform: [
                {
                    translateX: interpolate(p, [0, 1], [-120, 0]),
                },
            ],
        };
    });

    // if (!ready) return <SkeletonWhyChoose />;
    if (!ready) return null;

    return (
        <View
            style={[
                styles.container,
                scheme === "dark" && styles.darkContainer,
            ]}
        >
            <Animated.View
                style={[
                    styles.inner,
                    containerStyle,
                ]}
            >
                {/* LEFT CONTENT */}
                <View style={styles.left}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {t("WhyChoose.badge")}
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.title,
                            scheme === "dark" && styles.darkText,
                        ]}
                    >
                        {t("WhyChoose.title")}
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            scheme === "dark" && styles.darkSubText,
                        ]}
                    >
                        {t("WhyChoose.description")}
                    </Text>

                    <View style={styles.pointsGrid}>
                        {points.map((point: string, index: number) => {
                            const itemProgress = useSharedValue(0);

                            useEffect(() => {
                                itemProgress.value = withTiming(1, {
                                    duration: 400,
                                    delay: index * 120,
                                });
                            }, []);

                            const itemStyle = useAnimatedStyle(() => ({
                                opacity: itemProgress.value,
                                transform: [
                                    {
                                        translateY: interpolate(
                                            itemProgress.value,
                                            [0, 1],
                                            [20, 0]
                                        ),
                                    },
                                ],
                            }));

                            return (
                                <Animated.View
                                    key={index}
                                    style={[styles.pointRow, itemStyle]}
                                >
                                    <MaterialIcons
                                        name="check-circle"
                                        size={18}
                                        color={
                                            scheme === "dark"
                                                ? "#4ade80"
                                                : "#16a34a"
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.pointText,
                                            scheme === "dark" &&
                                            styles.darkSubText,
                                        ]}
                                    >
                                        {point}
                                    </Text>
                                </Animated.View>
                            );
                        })}
                    </View>
                </View>

                {/* RIGHT IMAGE */}
                <Animated.View style={styles.right}>
                    <Image
                        source={require("../assets/images/whychoose.jpeg")}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );
}

export default memo(WhyChoose);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        paddingVertical: 60,
        paddingHorizontal: 16,
        backgroundColor: "#ffffff",
    },
    darkContainer: {
        backgroundColor: "#0f172a",
    },
    inner: {
        flexDirection:
            width > 900 ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 30,
    },
    left: {
        flex: 1,
    },
    right: {
        flex: 1,
        marginTop: width > 900 ? 0 : 30,
    },
    badge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#e0f2fe",
        marginBottom: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0369a1",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
    },
    description: {
        marginTop: 16,
        fontSize: 15,
        color: "#6b7280",
    },
    darkText: {
        color: "#f1f5f9",
    },
    darkSubText: {
        color: "#94a3b8",
    },
    pointsGrid: {
        marginTop: 20,
    },
    pointRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
        gap: 8,
    },
    pointText: {
        fontSize: 14,
        flex: 1,
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 24,
    },
});
