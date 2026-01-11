import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import emergencyData from "@/data/emergencies.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmergencyDetail() {
  const { slug } = useLocalSearchParams();
  const data = emergencyData?.[slug as string];

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back */}
        <Pressable
          onPress={() => router.replace("/emergency")}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={18} color="#374151" />
          <Text style={styles.backText}>Back to Emergency Guides</Text>
        </Pressable>

        {!data ? (
          <View style={styles.empty}>
            <Ionicons name="warning" size={36} color="#F97316" />
            <Text style={styles.emptyTitle}>Emergency Guide Coming Soon</Text>
            <Text style={styles.emptySub}>
              This emergency guide is not available yet.
            </Text>
          </View>
        ) : (
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.topBar} />

              <View style={styles.inner}>
                {/* Urgency */}
                <View
                  style={[
                    styles.urgency,
                    data.urgency === "critical"
                      ? styles.urgencyCritical
                      : styles.urgencyUrgent,
                  ]}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      data.urgency === "critical"
                        ? styles.urgencyTextCritical
                        : styles.urgencyTextUrgent,
                    ]}
                  >
                    {data.urgency.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.subtitle}>{data.subtitle}</Text>

                {/* Emergency Alert */}
                <View style={styles.alert}>
                  <Ionicons name="warning" size={18} color="#DC2626" />
                  <Text style={styles.alertText}>
                    <Text style={{ fontWeight: "800" }}>
                      Call Emergency Services First.
                    </Text>
                    {"\n"}Dial 108 or 112 immediately.
                  </Text>
                </View>

                {/* About */}
                <Text style={styles.sectionTitle}>About This Emergency</Text>
                <Text style={styles.sectionText}>{data.about}</Text>

                {/* Recognize */}
                <Text style={styles.sectionTitle}>How to Recognize</Text>

                {data.recognize.map((r, i) => (
                  <View key={i} style={styles.recognize}>
                    <Ionicons name="alert-circle" size={18} color="#DC2626" />
                    <Text style={styles.recognizeText}>{r}</Text>
                  </View>
                ))}

                {/* Steps */}
                <View style={styles.steps}>
                  <Text style={styles.stepsTitle}>
                    ⚡ Immediate Action Steps
                  </Text>

                  {data.steps.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={styles.stepIndex}>
                        <Text style={styles.stepIndexText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* DO */}
                <Checklist title="DO" items={data.dos} good />

                {/* DON'T */}
                <Checklist title="DON'T" items={data.donts} />

                {/* Helplines */}
                <View style={styles.helplineWrap}>
                  <Text style={styles.helplineTitle}>Emergency Helplines</Text>

                  <View style={styles.helplineGrid}>
                    {[
                      ["108", "Ambulance"],
                      ["104", "Health"],
                      ["102", "Medical"],
                      ["112", "National"],
                    ].map(([n, l]) => (
                      <Pressable
                        key={n}
                        style={styles.helplineBtn}
                        onPress={() => Linking.openURL(`tel:${n}`)}
                      >
                        <Ionicons name="call" size={22} color="white" />
                        <Text style={styles.helplineNum}>{n}</Text>
                        <Text style={styles.helplineLabel}>
                          CALL {l.toUpperCase()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky CTA */}
      <Pressable
        style={styles.sticky}
        onPress={() => Linking.openURL("tel:108")}
      >
        <Ionicons name="call" size={24} color="white" />
        <Text style={styles.stickyText}>CALL 108 AMBULANCE NOW</Text>
      </Pressable>
    </SafeAreaView>
  );
}

/* ---------- CHECKLIST ---------- */

function Checklist({ title, items, good = false }) {
  return (
    <View style={styles.checklist}>
      <Text style={[styles.checkTitle, good ? styles.good : styles.bad]}>
        {title}
      </Text>

      {items.map((i, idx) => (
        <View key={idx} style={styles.checkRow}>
          <Ionicons
            name={good ? "checkmark-circle" : "close-circle"}
            size={18}
            color={good ? "#16A34A" : "#DC2626"}
          />
          <Text style={styles.checkText}>{i}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  scroll: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 140,
  },

  back: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // button-sized, not full width
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // Android elevation
    elevation: 4,

    // subtle border (helps iOS contrast)
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  backText: {
    marginLeft: 8,
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },

  empty: { backgroundColor: "#fff", padding: 24, borderRadius: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginTop: 12 },
  emptySub: { color: "#6B7280", marginTop: 4 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",

    // iOS shadow (stronger + visible)
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },

    // Android elevation
    elevation: 10,

    // iOS border fallback (critical)
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  topBar: { height: 6, backgroundColor: "#F97316" },
  inner: { padding: 20 },

  urgency: {
    alignSelf: "flex-start", // 🔥 CRITICAL: prevents full-width
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 900,
    // marginBottom: 1,
  },

  urgencyCritical: { backgroundColor: "#FEE2E2" },
  urgencyUrgent: { backgroundColor: "#FFEDD5" },
  urgencyText: { fontSize: 11, fontWeight: "800" },
  urgencyTextCritical: { color: "#DC2626" },
  urgencyTextUrgent: { color: "#EA580C" },

  title: { fontSize: 22, fontWeight: "900", marginTop: 8 },
  subtitle: { color: "#6B7280", marginBottom: 16 },

  alert: {
    flexDirection: "row",
    backgroundColor: "#fddfdf",
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },
  alertText: { marginLeft: 10, color: "#7F1D1D", fontSize: 13 },

  sectionTitle: { fontSize: 16, fontWeight: "800", marginTop: 20 },
  sectionText: { color: "#374151", marginTop: 6 },

  recognize: {
    flexDirection: "row",
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  recognizeText: { marginLeft: 10, flex: 1 },

  steps: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
  },
  stepsTitle: { fontSize: 18, fontWeight: "900", marginBottom: 12 },
  stepRow: { flexDirection: "row", marginBottom: 12 },
  stepIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndexText: { color: "white", fontSize: 12, fontWeight: "800" },
  stepText: { marginLeft: 10, flex: 1 },

  checklist: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
  },
  checkTitle: { fontWeight: "800", marginBottom: 10 },
  good: { color: "#15803D" },
  bad: { color: "#B91C1C" },
  checkRow: { flexDirection: "row", marginBottom: 8 },
  checkText: { marginLeft: 8, flex: 1 },

  helplineWrap: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
  },
  helplineTitle: { fontWeight: "800", color: "#B91C1C", marginBottom: 12 },
  helplineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  helplineBtn: {
    backgroundColor: "#DC2626",
    borderRadius: 18,
    padding: 16,
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
  },
  helplineNum: { color: "white", fontSize: 22, fontWeight: "900" },
  helplineLabel: { color: "white", fontSize: 11, fontWeight: "700" },

  sticky: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stickyText: { color: "white", fontWeight: "900", marginLeft: 10 },
  cardWrapper: {
    paddingHorizontal: 2, // fixes iOS edge visibility
  }
});
