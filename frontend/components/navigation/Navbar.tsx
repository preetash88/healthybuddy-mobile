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
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  title?: string;
};

const LANGUAGES = [
  { name: "English", code: "EN" },
  { name: "हिंदी", code: "HI" },
  { name: "Odia", code: "OD" },
];

const EMERGENCY_NUMBERS = [
  { label: "Ambulance", number: "102" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "National Emergency", number: "112" },
];

const AppNavbar: React.FC<Props> = ({ title = "Rurivia.AI" }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [languageVisible, setLanguageVisible] = useState(false);
  const [emergencyVisible, setEmergencyVisible] = useState(false);

  const defaultLanguage =
    LANGUAGES.find((lang) => lang.code === "EN") || LANGUAGES[0];

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const colors = isDark ? darkColors : lightColors;

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

        <View style={styles.rightSection}>
          {/* Emergency Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.emergencyButton}
            onPress={() => setEmergencyVisible(true)}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#f20f0f" />
          </TouchableOpacity>

          {/* Three Dots */}
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
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleTheme();
                setMenuVisible(false);
              }}
            >
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setLanguageVisible(true);
              }}
            >
              <MaterialCommunityIcons
                name="translate"
                size={20}
                color={colors.menuText}
                style={{ marginRight: 14 }}
              />
              <Text
                style={[styles.menuText, { color: colors.menuText, flex: 1 }]}
              >
                Lang ({selectedLanguage.code})
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.menuText}
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Language Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={languageVisible}
        onRequestClose={() => setLanguageVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setLanguageVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: colors.menuBackground, maxHeight: 400 },
            ]}
          >
            <ScrollView>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.menuItem}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setLanguageVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.menuText,
                      {
                        color: colors.menuText,
                        flex: 1,
                        fontWeight:
                          selectedLanguage.code === lang.code ? "600" : "400",
                      },
                    ]}
                  >
                    {lang.name}
                  </Text>

                  {selectedLanguage.code === lang.code && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#4CAF50"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Emergency Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={emergencyVisible}
        onRequestClose={() => setEmergencyVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setEmergencyVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: colors.menuBackground, maxWidth: 300 },
            ]}
          >
            {EMERGENCY_NUMBERS.map((item) => (
              <TouchableOpacity
                key={item.number}
                style={styles.menuItem}
                onPress={() => {
                  setEmergencyVisible(false);
                  Linking.openURL(`tel:${item.number}`);
                }}
              >
                <Text
                  style={[
                    styles.menuText,
                    {
                      color: colors.menuText,
                      marginRight: 16,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.menuText,
                    { color: "#E53935", fontWeight: "600" },
                  ]}
                >
                  {item.number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AppNavbar;

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
    minWidth: 160, // minimum size
    maxWidth: 400, // prevents over-expansion
    borderRadius: 12,
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
    justifyContent: "space-between",
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  emergencyButton: {
    // backgroundColor: "#E53935",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
