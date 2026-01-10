import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import diseasesHub from "@/data/diseases1.json";

export default function DiseasesDetails() {
    const { name } = useLocalSearchParams();
    const decodedName = decodeURIComponent(name as string);

    const disease = diseasesHub.find((d) => d.name === decodedName);

    if (!disease) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold">Disease not found</Text>
                <Pressable onPress={() => router.replace("/diseases")}>
                    <Text className="text-blue-600 mt-4">Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-50 px-4 pt-16">
            {/* Back */}
            <Pressable
                onPress={() => router.replace("/diseases")}
                className="flex-row items-center mb-6"
            >
                <Ionicons name="arrow-back" size={22} color="#6b7280" />
                <Text className="ml-2 text-gray-500 font-semibold">
                    Back to Diseases
                </Text>
            </Pressable>

            {/* Image */}
            {disease.image_url && (
                <Image
                    source={{ uri: disease.image_url }}
                    className="w-full h-56 rounded-2xl mb-6"
                    resizeMode="cover"
                />
            )}

            {/* Category */}
            <View className="self-start bg-gray-900 px-4 py-1.5 rounded-full mb-3">
                <Text className="text-white text-xs font-semibold">
                    {disease.category}
                </Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-gray-900 mb-2">
                {disease.name}
            </Text>

            {/* Description */}
            <Text className="text-gray-600 mb-6">
                {disease.description}
            </Text>

            {/* CTAs */}
            <View className="flex-row gap-4 mb-8">
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/symptom-checker",
                            params: { disease: disease.name },
                        })
                    }
                    className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
                >
                    <Text className="text-white font-semibold">
                        Take Assessment
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/clinics")}
                    className="flex-1 border border-gray-300 py-3 rounded-xl items-center bg-white"
                >
                    <Text className="font-medium text-gray-800">
                        Find Clinics
                    </Text>
                </Pressable>
            </View>

            {/* Symptoms */}
            <Section title="Common Symptoms">
                {disease.symptoms.map((s, i) => (
                    <Bullet key={i} text={s} />
                ))}
            </Section>

            {/* Causes */}
            {disease.causes && (
                <Section title="Causes">
                    <Text className="text-gray-700 text-sm">
                        {disease.causes}
                    </Text>
                </Section>
            )}

            {/* Risk Factors */}
            {disease.risk_factors?.length > 0 && (
                <Section title="Risk Factors">
                    {disease.risk_factors.map((r, i) => (
                        <Bullet key={i} text={r} />
                    ))}
                </Section>
            )}

            {/* Prevention */}
            {disease.prevention_tips?.length > 0 && (
                <View className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-6">
                    <Text className="text-green-700 font-semibold mb-3">
                        Prevention Tips
                    </Text>
                    {disease.prevention_tips.map((p, i) => (
                        <Bullet key={i} text={p} green />
                    ))}
                </View>
            )}

            {/* When to seek help */}
            {disease.when_to_seek_help && (
                <View className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-6 mb-16">
                    <Text className="text-red-700 font-semibold mb-2">
                        When to Seek Medical Help
                    </Text>
                    <Text className="text-red-700 text-sm">
                        {disease.when_to_seek_help}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

/* ---------- UI Components ---------- */

function Section({ title, children }) {
    return (
        <View className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
            <Text className="font-semibold text-gray-900 mb-3">{title}</Text>
            {children}
        </View>
    );
}

function Bullet({ text, green = false }) {
    return (
        <View className="flex-row items-center mb-2">
            <View
                className={`w-2 h-2 rounded-full ${
                    green ? "bg-green-600" : "bg-blue-600"
                }`}
            />
            <Text className="ml-3 text-gray-700 text-sm">{text}</Text>
        </View>
    );
}
