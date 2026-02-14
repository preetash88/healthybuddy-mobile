import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title?: string;
};

const TelegramNavbar: React.FC<Props> = ({ title = "Rurivia.AI" }) => {
  const [isDark, setIsDark] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setIsDark(!isDark);
    setMenuVisible(false);
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../assets/images/app_logo.png")} // adjust path if needed
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.title }]}>{title}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: colors.menuBackground },
            ]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <MaterialCommunityIcons
                name={isDark ? "weather-sunny" : "weather-night"}
                size={20}
                color={colors.menuText}
                style={{ marginRight: 14 }}
              />
              <Text style={[styles.menuText, { color: colors.menuText }]}>
                {isDark ? "Day Mode" : "Night Mode"}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: 1,
                backgroundColor: colors.divider,
                marginVertical: 4,
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default TelegramNavbar;

/* ---------------- COLORS ---------------- */

const darkColors = {
  background: "#0F1419", // exact Telegram dark header
  title: "#FFFFFF",
  icon: "#FFFFFF",
  menuBackground: "#2A2E32", // exact Telegram dropdown
  menuText: "#FFFFFF",
  divider: "rgba(255,255,255,0.06)",
};

const lightColors = {
  background: "#FFFFFF",
  title: "#229ED9", // Telegram blue
  icon: "#222222",
  menuBackground: "#FFFFFF",
  menuText: "#222222",
  divider: "rgba(0,0,0,0.06)",
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "600" : "700",
    letterSpacing: 0.3,
  },
  menuButton: {
    padding: 6,
  },

  /* Dropdown */

  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "transparent", // lighter like Telegram
  },
  menuContainer: {
    marginTop: 10, // exactly header height
    marginRight: 12,
    width: 150, // Telegram width
    borderRadius: 12, // Telegram rounded
    paddingVertical: 4,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "300",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
});
