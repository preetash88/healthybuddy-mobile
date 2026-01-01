import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const points = [
    'Early disease risk detection',
    'Expert-verified information',
    'Privacy-focused design',
    'Multi-language support',
    'Free and accessible to all',
    'Emergency response guidance',
];

export default function WhyChoose() {
    return (
        <View style={styles.section}>
            {/* Badge */}
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Trusted Healthcare</Text>
            </View>

            {/* Heading */}
            <Text style={styles.title}>Why Choose HealthBuddy?</Text>

            {/* Description */}
            <Text style={styles.description}>
                We’re on a mission to make quality healthcare accessible to everyone,
                especially in rural and underserved regions.
            </Text>

            {/* Points */}
            <View style={styles.pointsGrid}>
                {points.map((point, index) => (
                    <View key={index} style={styles.pointRow}>
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={18}
                            color="#22C55E"
                            style={styles.pointIcon}
                        />
                        <Text style={styles.pointText}>{point}</Text>
                    </View>
                ))}
            </View>

            {/* Image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={require('../assets/images/whychoose.jpeg')}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: 56,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },

    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 16,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2563EB',
    },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
    },

    description: {
        marginTop: 16,
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        maxWidth: 360,
    },

    pointsGrid: {
        marginTop: 28,
        gap: 12,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pointIcon: {
        marginTop: 2,
        marginRight: 8,
    },
    pointText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },

    imageWrapper: {
        marginTop: 36,
        borderRadius: 24,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 220,
    },
});
