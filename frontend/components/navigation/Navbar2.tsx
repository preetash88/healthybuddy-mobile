import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Linking,
  Dimensions,
  useColorScheme,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
    runOnJS,
  Extrapolate
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur"; // IMPORT THIS

const { width } = Dimensions.get("window");

const emergencyNumbers = [
  { label: "Ambulance Service", number: "108" },
  { label: "Health Helpline", number: "104" },
  { label: "Medical Emergency", number: "102" },
  { label: "National Emergency Number", number: "112" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

export default function Navbar({ scrollY }: { scrollY: Animated.SharedValue<number> }) {
  const { i18n } = useTranslation();
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

  useEffect(() => {
    themeAnim.value = withTiming(isDark ? 1 : 0, { duration: 300 });
  }, [isDark]);

  /* ------------------ Dropdown Toggle Logic ------------------ */
  const openLang = () => {
    setLangVisible(true);
    langAnim.value = withSpring(1);
  };
  const closeLang = () => {
    langAnim.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setLangVisible)(false);
    });
  };

  const openEmergency = () => {
    setEmergencyVisible(true);
    emergencyAnim.value = withSpring(1);
  };
  const closeEmergency = () => {
    emergencyAnim.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setEmergencyVisible)(false);
    });
  };

    const changeLanguage = (code) => {
      if (i18n && i18n.changeLanguage) {
        i18n.changeLanguage(code);
      }
      closeLang();
    };

    const callNumber = (number) => {
      Linking.openURL(`tel:${number}`);
      closeEmergency();
    };

  /* ------------------ Animations ------------------ */
  const langStyle = useAnimatedStyle(() => ({
    opacity: langAnim.value,
    transform: [
      { scale: interpolate(langAnim.value, [0, 1], [0.95, 1]) },
      { translateY: interpolate(langAnim.value, [0, 1], [-10, 0]) },
    ],
  }));

  const emergencyStyle = useAnimatedStyle(() => ({
    opacity: emergencyAnim.value,
    transform: [
      { scale: interpolate(emergencyAnim.value, [0, 1], [0.95, 1]) },
      { translateY: interpolate(emergencyAnim.value, [0, 1], [-10, 0]) },
    ],
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(langAnim.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const themeStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(themeAnim.value, [0, 1], [0, 180])}deg` },
    ],
  }));

    const glassBackgroundStyle = useAnimatedStyle(() => {
      // If scrollY is undefined (e.g. initial render), default to 0
      const safeScroll = scrollY ? scrollY.value : 0;

      const opacity = interpolate(
        safeScroll,
        [0, 50], // Start fading in at 0px, full fade at 50px
        [0.15, 1],
        Extrapolate.CLAMP,
      );

      return {
        opacity: opacity,
      };
    });
  const HEADER_HEIGHT = insets.top + 64;


  const currentLang = i18n.language ? i18n.language.toUpperCase() : "EN";

  return (
    <View style={[styles.headerWrapper, { height: HEADER_HEIGHT }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* LAYER 1: The Glass Background
         This is absolutely positioned and fills the entire header area.
         Its opacity is controlled by scrollY.
      */}
      <Animated.View style={[styles.glassLayer, glassBackgroundStyle]}>
        <BlurView
          intensity={80} // High blur for glass effect
          tint={isDark ? "dark" : "default"}
          style={StyleSheet.absoluteFill}
        />
        {/* Optional: Add a semi-transparent color overlay for better contrast */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.4)"
                : "rgba(255,255,255,0.6)",
            },
          ]}
        />
      </Animated.View>

      {/* LAYER 2: The Content
         This sits on top of the glass layer.
         PaddingTop ensures it clears the status bar.
      */}
      <View
        style={[
          styles.contentContainer,
          {
            paddingTop: insets.top,
            height: HEADER_HEIGHT,
          },
        ]}
      >
        {/* Logo Section */}
        <TouchableOpacity onPress={() => router.push("/")}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/app_logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Rurivia.AI</Text>
          </View>
        </TouchableOpacity>

        {/* Right Buttons Section */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.langButton}
            onPress={langVisible ? closeLang : openLang}
          >
            <Text style={styles.langText}>{currentLang}</Text>
            <Animated.View style={chevronStyle}>
              <MaterialIcons name="expand-more" size={22} color="#fff" />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={themeStyle}>
            <MaterialIcons
              name={isDark ? "dark-mode" : "light-mode"}
              size={24}
              color="#fff"
            />
          </Animated.View>

          <TouchableOpacity
            onPress={emergencyVisible ? closeEmergency : openEmergency}
          >
            <MaterialIcons name="phone" size={24} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdowns & Backdrop (Same as before) */}
      {(langVisible || emergencyVisible) && (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            closeLang();
            closeEmergency();
          }}
        />
      )}

      {langVisible && (
        <Animated.View
          style={[
            styles.langDropdown,
            langStyle,
            isDark && styles.darkDropdown,
          ]}
        >
          {memoLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.dropdownItem}
              onPress={() => changeLanguage(lang.code)}
            >
              <View style={styles.dropdownRow}>
                <Text style={isDark ? styles.darkText : styles.lightText}>
                  {lang.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {emergencyVisible && (
        <Animated.View
          style={[
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
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Highest priority
    overflow: "hidden", // Important: prevents weird separation edge
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject, // Fills the headerWrapper completely
    // No background color here, handled by BlurView
    // Opacity is animated via style prop
    bottom: 0, // Ensure it stretches to the bottom of the content
  },
  // The inner container handles the actual layout of buttons
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12, // Space below text/icons
    minHeight: 56,
  },
  //   darkContainer: {
  //     // If you need a fallback color for non-blur devices (Android < 12 sometimes)
  //     backgroundColor: "rgba(18, 20, 24, 0.8)",
  //   },
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
    // OPTIONAL: Force white text if the image is always dark
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Adds readability over images
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginRight: 4,
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langText: {
    fontWeight: "600",
    // OPTIONAL: Force white text
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  langDropdown: {
    position: "absolute",
    top: 50,
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
    top: 100,
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
    top: 0, // Cover entire screen
    left: 0,
    right: 0,
    bottom: -1000, // Extend to bottom
    zIndex: 50,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
});
