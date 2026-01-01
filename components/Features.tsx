import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Feature = {
    title: string;
    description: string;
    icon: string;
    gradient: readonly [string, string];
    action: string;
    path: Href;
};

const features: Feature[] = [
    {
        title: 'Symptom Checker',
        description: 'Assess your health with our AI-powered symptom analysis',
        icon: 'heart-pulse',
        gradient: ['#3B82F6', '#06B6D4'],
        action: 'Start Assessment',
        path: '/symptom-checker',
    },
    {
        title: 'Disease Library',
        description: 'Learn about diseases, symptoms, and prevention',
        icon: 'book-open-variant',
        gradient: ['#8B5CF6', '#EC4899'],
        action: 'Explore',
        path: '/diseases',
    },
    {
        title: 'Prevention Tips',
        description: 'Get personalized health and wellness guidance',
        icon: 'shield-check',
        gradient: ['#22C55E', '#10B981'],
        action: 'View Tips',
        path: '/prevention',
    },
    {
        title: 'Find Clinics',
        description: 'Locate nearby healthcare facilities instantly',
        icon: 'map-marker-radius',
        gradient: ['#F97316', '#EF4444'],
        action: 'Find Now',
        path: '/clinics',
    },
    {
        title: 'Emergency Guide',
        description: 'Critical first-aid procedures and helplines',
        icon: 'alert-circle',
        gradient: ['#EF4444', '#FB7185'],
        action: 'View Guide',
        path: '/emergency',
    },
];

export default function Features() {
    const router = useRouter();

    return (
        <View style={styles.section}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Complete Healthcare Suite</Text>
                <Text style={styles.subtitle}>
                    Everything you need for better health management in one place
                </Text>
            </View>

            {/* Cards */}
            <View style={styles.grid}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.card}>
                        {/* TOP ACCENT BAR — HERE */}
                        <LinearGradient
                            colors={feature.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                height: 10,
                                borderTopLeftRadius: 18,
                                borderTopRightRadius: 18,
                            }}
                        />

                        <View style={styles.cardContent}>
                            {/* Icon */}
                            <LinearGradient
                                colors={feature.gradient}
                                style={styles.iconContainer}
                            >
                                <MaterialCommunityIcons
                                    name={feature.icon as any}
                                    size={26}
                                    color="#fff"
                                />
                            </LinearGradient>

                            {/* Content */}
                            <Text style={styles.cardTitle}>{feature.title}</Text>
                            <Text style={styles.cardDescription} numberOfLines={2}>
                                {feature.description}
                            </Text>

                            {/* CTA */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed && { transform: [{ scale: 0.97 }] },
                                ]}
                                onPress={() => router.push(feature.path)}
                            >
                                <Text style={styles.buttonText}>{feature.action}</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 48,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 320,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#F8FAFC', // 👈 NOT white
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        marginBottom: 20,
        // overflow: 'hidden',

        shadowColor: '#101',
            shadowOpacity: 0.20,
        shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    topBar: {
        height: 10,
        width: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 16,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    ctaContainer: {
        paddingTop: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    cardDescription: {
        marginTop: 6,
        fontSize: 13,
        color: '#6B7280',
        maxHeight: 40,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#2563EB',
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
