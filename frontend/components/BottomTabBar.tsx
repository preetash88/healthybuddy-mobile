import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const tabs = [
  { path: "/", icon: "home", activeIcon: "home", activeColor: "#3B82F6" }, // blue
  {
    path: "/symptom-analyzer",
    icon: "heart-pulse",
    activeIcon: "heart-pulse",
    activeColor: "#10B981", // emerald
  },
  {
    path: "/symptom-checker",
    icon: "stethoscope",
    activeIcon: "stethoscope",
    activeColor: "#8B5CF6", // purple
  },
  {
    path: "/diseases",
    icon: "book-open-variant",
    activeIcon: "book-open-variant",
    activeColor: "#F59E0B", // orange
  },
  {
    path: "/prevention",
    icon: "shield-check",
    activeIcon: "shield-check",
    activeColor: "#14B8A6", // teal
  },
  {
    path: "/clinics",
    icon: "map-marker",
    activeIcon: "map-marker",
    activeColor: "#EC4899", // pink
  },
  {
    path: "/emergency",
    icon: "alert-circle-outline",
    activeIcon: "alert-circle",
    activeColor: "#EF4444", // red
  },
];


const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 6 }]}>
      <BlurView
        intensity={140}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.container,
          isDark ? styles.darkGlass : styles.lightGlass,
        ]}
      >
        {tabs.map((tab) => {
          const active =
            tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);

          return (
            <TouchableOpacity
              key={tab.path}
              onPress={() => router.push(tab.path)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {active && (
                <View
                  style={[
                    styles.activeBubble,
                    {
                      backgroundColor: isDark
                        ? tab.activeColor + "33"
                        : tab.activeColor + "22",
                    },
                  ]}
                />
              )}

              <MaterialCommunityIcons
                name={active ? tab.activeIcon : tab.icon}
                size={20}
                color={
                  active
                    ? tab.activeColor
                    : isDark
                      ? "rgba(255,255,255,0.7)"
                      : "#555"
                }
                style={{ zIndex: 2 }}
              />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

export default React.memo(BottomTabBar);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    height: 64,
    width: "97%",
    maxWidth: 600,
    borderRadius: 32,
    alignItems: "center",
    paddingHorizontal: 6, // 👈 IMPORTANT
    overflow: "hidden",
  },

  tabButton: {
    flex: 1,
    height: "100%", // fully responsive
    alignItems: "center",
    justifyContent: "center",
  },

  activeBubble: {
  position: "absolute",
  width: 45,
  height: 45,
  borderRadius: 22,
},
  activeDark: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  activeLight: {
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  darkGlass: {
    backgroundColor: "rgba(22,26,34,0.55)", // darker base
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
    shadowColor: "#ffffff93",
    shadowOpacity: 0.65,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },

  lightGlass: {
    backgroundColor: "rgba(255, 255, 255, 0.94)", // frosted white
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.09)",
    shadowColor: "#000",
    shadowOpacity: 0.27,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
});
