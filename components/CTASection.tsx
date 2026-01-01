import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CTASection() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#2563EB', '#0D9488', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Icon */}
            <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                    name="heart"
                    size={56}
                    color="#FFFFFF"
                />
            </View>

            {/* Heading */}
            <Text style={styles.title}>
                Take Control of Your Health Today
            </Text>

            {/* Subheading */}
            <Text style={styles.subtitle}>
                Start your health assessment in just 2 minutes
            </Text>

            {/* CTA Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && { transform: [{ scale: 0.96 }] },
                ]}
                onPress={() => router.push('/symptom-checker')}
            >
                <MaterialCommunityIcons
                    name="heart-pulse"
                    size={20}
                    color="#2563EB"
                />
                <Text style={styles.buttonText}>Begin Assessment</Text>
            </Pressable>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 56,
        marginBottom: 40,
        paddingVertical: 64,
        paddingHorizontal: 24,
        borderRadius: 28,
        alignItems: 'center',
    },

    iconWrapper: {
        marginBottom: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },

    subtitle: {
        marginTop: 14,
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },

    button: {
        marginTop: 36,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 16,
        elevation: 6,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2563EB',
    },
});
