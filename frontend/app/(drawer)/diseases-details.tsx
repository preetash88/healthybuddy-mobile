import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import diseasesHub from "@/data/diseases1.json";

export default function DiseasesDetails() {
  const { name } = useLocalSearchParams();
  const decodedName = decodeURIComponent(name as string);

  const disease = diseasesHub.find((d) => d.name === decodedName);

  if (!disease) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Disease not found</Text>
          <Pressable
            onPress={() => router.replace("/diseases")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text style={styles.backText}>Back to Diseases</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back */}
        <Pressable
          onPress={() => router.replace("/diseases")}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={18} color="#374151" />
          <Text style={styles.backText}>Back to Diseases</Text>
        </Pressable>

        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            {/* Image */}
            {disease.image_url && (
              <Image
                source={{ uri: disease.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <View style={styles.inner}>
              {/* Category */}
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{disease.category}</Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>{disease.name}</Text>

              {/* Description */}
              <Text style={styles.description}>{disease.description}</Text>

              {/* CTAs */}
              <View style={styles.ctaRow}>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/symptom-checker",
                      params: { disease: disease.name },
                    })
                  }
                >
                  <Text style={styles.primaryBtnText}>Take Assessment</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => router.push("/clinics")}
                >
                  <Text style={styles.secondaryBtnText}>Find Clinics</Text>
                </Pressable>
              </View>

              {/* Sections */}
              <InfoSection title="Common Symptoms">
                {disease.symptoms.map((s, i) => (
                  <Bullet key={i} text={s} />
                ))}
              </InfoSection>

              {disease.causes && (
                <InfoSection title="Causes">
                  <Text style={styles.sectionText}>{disease.causes}</Text>
                </InfoSection>
              )}

              {disease.risk_factors?.length > 0 && (
                <InfoSection title="Risk Factors">
                  {disease.risk_factors.map((r, i) => (
                    <Bullet key={i} text={r} danger />
                  ))}
                </InfoSection>
              )}

              {disease.prevention_tips?.length > 0 && (
                <View style={[styles.sectionCard, styles.greenCard]}>
                  <Text style={styles.greenTitle}>Prevention Tips</Text>
                  {disease.prevention_tips.map((p, i) => (
                    <Bullet key={i} text={p} success />
                  ))}
                </View>
              )}

              {disease.when_to_seek_help && (
                <View style={[styles.sectionCard, styles.redCard]}>
                  <Text style={styles.redTitle}>When to Seek Medical Help</Text>
                  <Text style={styles.redText}>
                    {disease.when_to_seek_help}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function InfoSection({ title, children }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text, success = false, danger = false }) {
  const color = success ? "#16A34A" : danger ? "#DC2626" : "#2563EB";

  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },

  scroll: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 140,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  backText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#374151",
  },

  cardWrapper: { paddingHorizontal: 2 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,

    // iOS shadow (same feel as Diseases list cards)
    shadowColor: "#101",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },

    // Android elevation
    elevation: 10,
  },

  image: {
    width: "100%",
    height: 220,
  },

  inner: { padding: 20 },

  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 900,
    marginBottom: 10,
  },

  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  description: {
    color: "#6B7280",
    marginBottom: 20,
  },

  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "white",
    fontWeight: "700",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryBtnText: {
    fontWeight: "600",
    color: "#111827",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontWeight: "800",
    marginBottom: 10,
  },

  sectionText: {
    color: "#374151",
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  bulletText: {
    marginLeft: 10,
    color: "#374151",
    flex: 1,
  },

  greenCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  greenTitle: {
    color: "#15803D",
    fontWeight: "800",
    marginBottom: 10,
  },

  redCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  redTitle: {
    color: "#B91C1C",
    fontWeight: "800",
    marginBottom: 6,
  },

  redText: {
    color: "#7F1D1D",
  },

  empty: {
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
});
