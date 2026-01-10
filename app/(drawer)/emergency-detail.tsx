import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import emergencyData from "@/data/emergencies.json";

/* ---------- Alert Icon ---------- */
function AlertIcon() {
    return (
        <Ionicons name="alert-circle" size={18} color="#DC2626" />
    );
}

export default function EmergencyDetail() {
    const { slug } = useLocalSearchParams();
    const data = emergencyData?.[slug as string];

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView className="px-4 pt-16 pb-40">
                {/* Back */}
                <Pressable
                    onPress={() => router.replace("/emergency")}
                    className="flex-row items-center mb-6"
                >
                    <Ionicons name="arrow-back" size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-600 font-semibold">
                        Back to Emergency Guides
                    </Text>
                </Pressable>

                {!data ? (
                    <View className="bg-white rounded-2xl p-8 items-center shadow-lg">
                        <Ionicons name="warning" size={36} color="#F97316" />
                        <Text className="text-xl font-bold mt-4">
                            Emergency Guide Coming Soon
                        </Text>
                        <Text className="text-gray-600 text-center mt-2">
                            This emergency guide is not available yet.
                        </Text>
                    </View>
                ) : (
                    <View className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <View className="h-2 bg-orange-500" />

                        <View className="p-5">
                            {/* Urgency */}
                            <View
                                className={`self-start px-3 py-1 rounded-full mb-2 ${
                                    data.urgency === "critical"
                                        ? "bg-red-100"
                                        : "bg-orange-100"
                                }`}
                            >
                                <Text
                                    className={`text-xs font-bold ${
                                        data.urgency === "critical"
                                            ? "text-red-600"
                                            : "text-orange-600"
                                    }`}
                                >
                                    {data.urgency.toUpperCase()}
                                </Text>
                            </View>

                            <Text className="text-2xl font-bold">{data.title}</Text>
                            <Text className="text-gray-500 mb-4">{data.subtitle}</Text>

                            {/* Emergency Callout */}
                            <View className="flex-row bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                                <Ionicons name="warning" size={18} color="#DC2626" />
                                <Text className="ml-3 text-red-800 text-sm">
                                    <Text className="font-bold">Call Emergency Services First.</Text>
                                    {"\n"}Dial 108 or 112 immediately.
                                </Text>
                            </View>

                            {/* About */}
                            <Section title="About This Emergency">{data.about}</Section>

                            {/* Recognize */}
                            <Text className="text-lg font-semibold mt-8 mb-3 flex-row">
                                How to Recognize
                            </Text>

                            {data.recognize.map((item, i) => (
                                <View
                                    key={i}
                                    className="flex-row bg-orange-50 border border-orange-100 p-3 rounded-xl mb-2"
                                >
                                    <AlertIcon />
                                    <Text className="ml-3 text-sm">{item}</Text>
                                </View>
                            ))}

                            {/* Steps */}
                            <View className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl mt-8">
                                <Text className="text-xl font-bold text-blue-900 mb-4">
                                    ⚡ Immediate Action Steps
                                </Text>

                                {data.steps.map((step, i) => (
                                    <View key={i} className="flex-row mb-3">
                                        <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
                                            <Text className="text-white text-xs font-bold">
                                                {i + 1}
                                            </Text>
                                        </View>
                                        <Text className="ml-3 text-sm flex-1">{step}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* DO / DON'T */}
                            <View className="flex-row gap-4 mt-8">
                                <Checklist title="DO" items={data.dos} type="do" />
                                <Checklist title="DON'T" items={data.donts} type="dont" />
                            </View>

                            {/* Helplines */}
                            <View className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
                                <Text className="text-red-700 font-semibold mb-4">
                                    Emergency Helplines
                                </Text>

                                <View className="flex-row flex-wrap gap-3">
                                    {[
                                        { n: "108", l: "Ambulance" },
                                        { n: "104", l: "Health" },
                                        { n: "102", l: "Medical" },
                                        { n: "112", l: "National" },
                                    ].map((h) => (
                                        <Pressable
                                            key={h.n}
                                            onPress={() => Linking.openURL(`tel:${h.n}`)}
                                            className="bg-red-600 rounded-2xl p-4 w-[48%] items-center"
                                        >
                                            <Ionicons name="call" size={22} color="white" />
                                            <Text className="text-white text-xl font-bold mt-1">
                                                {h.n}
                                            </Text>
                                            <Text className="text-white text-xs font-semibold">
                                                CALL {h.l.toUpperCase()}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Sticky Call Bar */}
            <Pressable
                onPress={() => Linking.openURL("tel:108")}
                className="absolute bottom-0 left-0 right-0 bg-red-600 py-4 flex-row justify-center items-center"
            >
                <Ionicons name="call" size={24} color="white" />
                <Text className="ml-3 text-white text-lg font-extrabold">
                    CALL 108 AMBULANCE NOW
                </Text>
            </Pressable>
        </View>
    );
}

/* ---------- Components ---------- */

function Section({ title, children }) {
    return (
        <View className="mt-6">
            <Text className="font-semibold mb-2">{title}</Text>
            <Text className="text-gray-700 text-sm">{children}</Text>
        </View>
    );
}

function Checklist({ title, items, type }) {
    const color = type === "do" ? "green" : "red";
    const icon = type === "do" ? "checkmark-circle" : "close-circle";

    return (
        <View className="bg-gray-50 border rounded-xl p-4 flex-1">
            <Text className={`text-${color}-700 font-semibold mb-3`}>
                {title}
            </Text>

            {items.map((item, i) => (
                <View key={i} className="flex-row mb-2">
                    <Ionicons name={icon} size={18} color={color === "green" ? "#16A34A" : "#DC2626"} />
                    <Text className="ml-2 text-sm flex-1">{item}</Text>
                </View>
            ))}
        </View>
    );
}
