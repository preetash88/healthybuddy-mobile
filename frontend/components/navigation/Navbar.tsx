import React, {useState, useMemo, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Linking,
    Dimensions,
    useColorScheme,
    Image
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    runOnJS,
} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

const {width} = Dimensions.get("window");

const emergencyNumbers = [
    {label: "Ambulance Service", number: "108"},
    {label: "Health Helpline", number: "104"},
    {label: "Medical Emergency", number: "102"},
    {label: "National Emergency Number", number: "112"},
];

const languages = [
    {code: "en", label: "English"},
    {code: "hi", label: "हिन्दी"},
    {code: "or", label: "ଓଡ଼ିଆ"},
];

export default function Navbar() {
    const {i18n} = useTranslation();
    const router = useRouter();
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const insets = useSafeAreaInsets();

    const [langVisible, setLangVisible] = useState(false);
    const [emergencyVisible, setEmergencyVisible] = useState(false);

    const langAnim = useSharedValue(0);
    const emergencyAnim = useSharedValue(0);
    const themeAnim = useSharedValue(isDark ? 1 : 0);

    const memoLanguages = useMemo(() => languages, []);
    const memoEmergencyNumbers = useMemo(() => emergencyNumbers, []);

    /* Sync theme animation when system theme changes */
    useEffect(() => {
        themeAnim.value = withTiming(isDark ? 1 : 0, {duration: 300});
    }, [isDark]);

    /* ------------------ Dropdown Toggle Logic ------------------ */
    const openLang = () => {
        setLangVisible(true);
        langAnim.value = withSpring(1);
    };
    const closeLang = () => {
        langAnim.value = withTiming(0, {duration: 200}, () => {
            runOnJS(setLangVisible)(false);
        });
    };
    const openEmergency = () => {
        setEmergencyVisible(true);
        emergencyAnim.value = withSpring(1);
    };
    const closeEmergency = () => {
        emergencyAnim.value = withTiming(0, {duration: 200}, () => {
            runOnJS(setEmergencyVisible)(false);
        });
    };

    /* ------------------ Animations ------------------ */
    const langStyle = useAnimatedStyle(() => ({
        opacity: langAnim.value,
        transform: [
            {scale: interpolate(langAnim.value, [0, 1], [0.95, 1])},
            {translateY: interpolate(langAnim.value, [0, 1], [-10, 0])},
        ],
    }));

    const emergencyStyle = useAnimatedStyle(() => ({
        opacity: emergencyAnim.value,
        transform: [
            {scale: interpolate(emergencyAnim.value, [0, 1], [0.95, 1])},
            {translateY: interpolate(emergencyAnim.value, [0, 1], [-10, 0])},
        ],
    }));

    const chevronStyle = useAnimatedStyle(() => ({
        transform: [
            {rotate: `${interpolate(langAnim.value, [0, 1], [0, 180])}deg`},
        ],
    }));

    const themeStyle = useAnimatedStyle(() => ({
        transform: [
            {rotate: `${interpolate(themeAnim.value, [0, 1], [0, 180])}deg`},
        ],
    }));

    const changeLanguage = (code: string) => {
        // Check if i18n is initialized to prevent crashes
        if (i18n && i18n.changeLanguage) {
            i18n.changeLanguage(code);
        }
        closeLang();
    };
    const callNumber = (number) => {
        Linking.openURL(`tel:${number}`);
        closeEmergency();
    };

    // Safe check for language to avoid crashes
    const currentLang = i18n.language ? i18n.language.toUpperCase() : "EN";

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top },
                isDark && styles.darkContainer,
            ]}
        >
            <StatusBar style={isDark ? "light" : "dark"}/>

            {/* Logo */}
            <TouchableOpacity onPress={() => router.push("/")}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require("../../assets/images/app_logo.png")}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={[styles.logoText, isDark && styles.darkText]}>
                        Rurivia.AI
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.rightSection}>
                {/* Language */}
                <TouchableOpacity
                    style={styles.langButton}
                    onPress={langVisible ? closeLang : openLang}
                >
                    <Text style={[styles.langText, isDark && styles.darkText]}>
                        {currentLang}
                    </Text>
                    <Animated.View style={chevronStyle}>
                        <MaterialIcons
                            name="expand-more"
                            size={22}
                            color={isDark ? "#fff" : "#000"}
                        />
                    </Animated.View>
                </TouchableOpacity>

                {/* Theme Icon (system-based) */}
                <Animated.View style={themeStyle}>
                    <MaterialIcons
                        name={isDark ? "dark-mode" : "light-mode"}
                        size={24}
                        color={isDark ? "#fff" : "#000"}
                    />
                </Animated.View>

                {/* Emergency */}
                <TouchableOpacity
                    onPress={emergencyVisible ? closeEmergency : openEmergency}
                >
                    <MaterialIcons name="phone" size={24} color="#ff3b30"/>
                </TouchableOpacity>
            </View>

            {/* Backdrop - Using Ternary (? :) to prevent false rendering */}
            {(langVisible || emergencyVisible) ? (
                <Pressable
                    style={styles.backdrop}
                    onPress={() => {
                        closeLang();
                        closeEmergency();
                    }}
                />
            ) : null}

            {/* Language Dropdown */}
            {langVisible ? (
                <Animated.View
                    style={[styles.langDropdown, langStyle, isDark && styles.darkDropdown,]}
                >
                    {memoLanguages.map((lang) => {
                        const isSelected = lang.code === i18n.language;
                        return (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.dropdownItem,
                                    isSelected && {
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.10)"
                                            : "#f1f5f9"
                                    },
                                ]}
                                onPress={() => changeLanguage(lang.code)}
                            >
                                <View style={styles.dropdownRow}>
                                    <Text style={isDark ? styles.darkText : styles.lightText}>
                                        {lang.label}
                                    </Text>
                                    {isSelected ? (
                                        <MaterialIcons
                                            name="check"
                                            size={18}
                                            color={isDark ? "#4ade80" : "#16a34a"}
                                        />
                                    ):null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            ):null}

            {/* Emergency Dropdown */}
            {emergencyVisible ? (
                <Animated.View style={[
                    styles.emerDropdown,
                    emergencyStyle,
                    isDark && styles.darkDropdown,
                ]}
                >
                    {memoEmergencyNumbers.map((item) => (
                        <TouchableOpacity
                            key={item.number}
                            style={styles.dropdownItem}
                            onPress={() => callNumber(item.number)}
                        >
                            <Text style={isDark ? styles.darkText : styles.lightText}>
                                {item.label} ({item.number})
                            </Text>
                        </TouchableOpacity>))}
                </Animated.View>):null}
        </View>);
}

const styles = StyleSheet.create({
    container: {
        minHeight: 100,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 10,
        overflow: "visible",
        zIndex: 100,
    },
    darkContainer: {
        backgroundColor: "#121418",
    },
    logoWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoImage: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    logoText: {
        fontSize: 22,
        fontWeight: "700",
    },
    rightSection: {
        flexDirection: "row", alignItems: "center", gap: 16, marginRight: 4,
    },
    langButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    langText: {
        fontWeight: "600",
    },
    // dropdown: {
    //     position: "absolute",
    //     top: 101,
    //     right: 16,
    //     minWidth: 100,
    //     maxWidth: 240,
    //     borderRadius: 10,
    //     paddingVertical: 4,
    //     elevation: 20,
    //     backgroundColor: "#fff",
    //     zIndex: 9999,
    // },
    langDropdown: {
        position: "absolute",
        top: 101,
        right: 46,
        minWidth: 100,
        maxWidth: 160,
        borderRadius: 10,
        paddingVertical: 4,
        elevation: 20,
        backgroundColor: "#fff",
        zIndex: 9999,
    },
    emerDropdown: {
        position: "absolute",
        top: 101,
        right: 16,
        minWidth: 100,
        maxWidth: 300,
        borderRadius: 10,
        paddingVertical: 4,
        elevation: 20,
        backgroundColor: "#fff",
        zIndex: 9999,
    },
    darkDropdown: {
        backgroundColor: "#1a1f27",
    },
    dropdownRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 4,
    },
    backdrop: {
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
    },
    darkText: {
        color: "#fff",
    },
    lightText: {
        color: "#000",
    },
});
