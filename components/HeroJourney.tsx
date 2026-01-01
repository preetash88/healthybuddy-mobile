import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HeroJourney() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Background image + gradient feel */}
            <ImageBackground
                source={{
                    uri: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600',
                }}
                style={styles.background}
                imageStyle={{ opacity: 0.2 }}
            >
                <View style={styles.overlay} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            ✨ AI-Powered Healthcare Companion
                        </Text>
                    </View>

                    {/* Heading */}
                    <Text style={styles.heading}>
                        Your Health Journey
                        {'\n'}
                        <Text style={styles.highlight}>Starts Here</Text>
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Empowering rural and underserved communities with accessible
                        healthcare through AI-driven risk assessment, health education,
                        and instant clinic connectivity.
                    </Text>

                    {/* CTA */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.ctaButton,
                            pressed && { transform: [{ scale: 0.96 }] },
                        ]}
                        onPress={() => router.push('/symptom-checker')}
                    >
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={20}
                            color="#2563EB"
                        />
                        <Text style={styles.ctaText}>Start Health Check</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    background: {
        width: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2563EB',
        opacity: 0.85,
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 70,
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 24,
    },
    badgeText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
    },
    heading: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        lineHeight: 44,
    },
    highlight: {
        color: '#A3E635',
    },
    description: {
        marginTop: 20,
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        maxWidth: 320,
    },
    ctaButton: {
        marginTop: 36,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        elevation: 6,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2563EB',
    },
});
