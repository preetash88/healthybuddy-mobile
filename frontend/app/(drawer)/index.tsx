import React, { useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
    withTiming,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import HeroJourney from "../../components/HeroJourney";
import HeroStats from "../../components/HeroStats";
import Features from "../../components/Features";
import WhyChoose from "../../components/WhyChoose";
import CTASection from "../../components/CTASection";

const { height } = Dimensions.get("window");

export default function Home() {
    const scrollY = useSharedValue(0);
    const scrollRef = useRef<any>(null);

    const showTop = useSharedValue(0);
    const showBottom = useSharedValue(0);

    /* ---------------- Scroll Handler ---------------- */

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;

            const maxScroll =
                event.contentSize.height - event.layoutMeasurement.height;

            const scrolledEnough = scrollY.value > 800;
            const nearBottom = scrollY.value > maxScroll - 120;

            showTop.value = withTiming(scrolledEnough ? 1 : 0, { duration: 200 });
            showBottom.value = withTiming(
                scrolledEnough && !nearBottom ? 1 : 0,
                { duration: 200 }
            );
        },
    });

    /* ---------------- Animations ---------------- */

    const fadeUp = (start: number) =>
        useAnimatedStyle(() => {
            const progress = interpolate(
                scrollY.value,
                [start - 200, start],
                [0, 1],
                Extrapolate.CLAMP
            );

            return {
                opacity: progress,
                transform: [
                    { translateY: interpolate(progress, [0, 1], [60, 0]) },
                    { scale: interpolate(progress, [0, 1], [0.96, 1]) },
                ],
            };
        });

    const slideLeft = (start: number) =>
        useAnimatedStyle(() => {
            const progress = interpolate(
                scrollY.value,
                [start - 200, start],
                [0, 1],
                Extrapolate.CLAMP
            );

            return {
                opacity: progress,
                transform: [
                    { translateX: interpolate(progress, [0, 1], [-120, 0]) },
                ],
            };
        });

    const slideRight = (start: number) =>
        useAnimatedStyle(() => {
            const progress = interpolate(
                scrollY.value,
                [start - 200, start],
                [0, 1],
                Extrapolate.CLAMP
            );

            return {
                opacity: progress,
                transform: [
                    { translateX: interpolate(progress, [0, 1], [120, 0]) },
                ],
            };
        });

    const topButtonStyle = useAnimatedStyle(() => ({
        opacity: showTop.value,
        transform: [{ scale: showTop.value }],
    }));

    const bottomButtonStyle = useAnimatedStyle(() => ({
        opacity: showBottom.value,
        transform: [{ scale: showBottom.value }],
    }));

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <HeroJourney scrollY={scrollY} />

                <Animated.View style={fadeUp(400)}>
                    <HeroStats scrollY={scrollY} />
                </Animated.View>

                <Animated.View style={fadeUp(900)}>
                    <Features />
                </Animated.View>

                <Animated.View style={slideLeft(1400)}>
                    <WhyChoose scrollY={scrollY} />
                </Animated.View>

                <Animated.View style={slideRight(1900)}>
                    <CTASection scrollY={scrollY} />
                </Animated.View>
            </Animated.ScrollView>

            {/* Scroll To Top */}
            <Animated.View style={[styles.floatingTop, topButtonStyle]}>
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() =>
                        scrollRef.current?.scrollTo({ y: 0, animated: true })
                    }
                >
                    <MaterialIcons name="keyboard-arrow-up" size={24} />
                </TouchableOpacity>
            </Animated.View>

            {/* Scroll To Bottom */}
            <Animated.View style={[styles.floatingBottom, bottomButtonStyle]}>
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    <MaterialIcons name="keyboard-arrow-down" size={24} />
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingTop: {
        position: "absolute",
        top: 90,
        alignSelf: "center",
    },
    floatingBottom: {
        position: "absolute",
        bottom: 90,
        alignSelf: "center",
    },
    floatingButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
        elevation: 12,
    },
});
