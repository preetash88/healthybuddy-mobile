import React, { memo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    interpolate,
    Extrapolate,
    runOnJS,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

/* ---------------- Icon Mapping ---------------- */

const ICON_MAP: Record<string, string> = {
    diseases: "menu-book",
    healthTips: "shield",
    languages: "groups",
    emergency: "warning",
};

/* ---------------- Animated Counter ---------------- */

const AnimatedCounter = memo(
    ({ value, trigger }: { value: string; trigger: Animated.SharedValue<number> }) => {
        const count = useSharedValue(0);
        const [display, setDisplay] = React.useState("0");

        useEffect(() => {
            if (trigger.value === 1 && value) {
                const match = value.match(/^(\d+)(.*)$/);
                if (!match) return;

                const target = parseInt(match[1], 10);
                const suffix = match[2] || "";

                count.value = withTiming(target, { duration: 2000 }, () => {
                    runOnJS(setDisplay)(target + suffix);
                });

                const interval = setInterval(() => {
                    const current = Math.floor(count.value);
                    setDisplay(current + suffix);
                }, 16);

                return () => clearInterval(interval);
            }
        }, [trigger.value, value]);

        return <Text style={styles.value}>{display}</Text>;
    }
);

/* ---------------- Main Component ---------------- */

interface Props {
    scrollY: Animated.SharedValue<number>;
}

function HeroStats({ scrollY }: Props) {
    const { t } = useTranslation();
    const stats = t("HeroStats.items", { returnObjects: true });

    const trigger = useSharedValue(0);

    /* Trigger when section enters viewport */
    useEffect(() => {
        const check = () => {
            if (scrollY.value > 250) {
                trigger.value = 1;
            }
        };
        check();
    }, []);

    if (!Array.isArray(stats)) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {stats.map((stat: any, index: number) => {
                    const progress = useSharedValue(0);

                    useEffect(() => {
                        progress.value = withTiming(trigger.value, {
                            duration: 500,
                            delay: index * 100,
                        });
                    }, []);

                    const animatedStyle = useAnimatedStyle(() => ({
                        opacity: progress.value,
                        transform: [
                            {
                                translateY: interpolate(
                                    progress.value,
                                    [0, 1],
                                    [20, 0],
                                    Extrapolate.CLAMP
                                ),
                            },
                        ],
                    }));

                    const pressScale = useSharedValue(1);

                    const pressStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: pressScale.value }],
                    }));

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.card, animatedStyle]}
                        >
                            <Pressable
                                onPressIn={() => (pressScale.value = withSpring(0.96))}
                                onPressOut={() => (pressScale.value = withSpring(1))}
                            >
                                <Animated.View style={pressStyle}>
                                    {/* Icon */}
                                    <View style={styles.iconCircle}>
                                        <MaterialIcons
                                            name={ICON_MAP[stat.id]}
                                            size={24}
                                            color="#2563eb"
                                        />
                                    </View>

                                    {/* Value */}
                                    <AnimatedCounter
                                        value={stat.value}
                                        trigger={trigger}
                                    />

                                    {/* Label */}
                                    <Text style={styles.label}>{stat.label}</Text>
                                </Animated.View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
}

export default memo(HeroStats);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 60,
        marginTop: 40,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: width / 2 - 20,
        marginBottom: 16,
        paddingVertical: 20,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        alignItems: "center",
        elevation: 6,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#eff6ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    value: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        color: "#6b7280",
    },
});
