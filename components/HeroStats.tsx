import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const stats = [
    {
        icon: 'book-open-variant',
        value: '50+',
        label: 'Diseases Covered',
    },
    {
        icon: 'shield-check',
        value: '200+',
        label: 'Health Tips',
    },
    {
        icon: 'account-group',
        value: '10+',
        label: 'Languages',
    },
    {
        icon: 'alert-circle',
        value: '10+',
        label: 'Emergency Guides',
    },
];

export default function HeroStats() {
    return (
        <View style={styles.wrapper}>
            <View style={styles.grid}>
                {stats.map((stat, index) => (
                    <View key={index} style={styles.card}>
                        <MaterialCommunityIcons
                            name={stat.icon as any}
                            size={26}
                            color="#2563EB"
                            style={styles.icon}
                        />
                        <Text style={styles.value}>{stat.value}</Text>
                        <Text style={styles.label}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: -40,
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 10,
        marginBottom: 18,
        alignItems: "center",

        // iOS shadow (same feel as HeroStats)
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },

        // Android elevation
        elevation: 10,
    },
    icon: {
        marginBottom: 8,
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    label: {
        marginTop: 6,
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
    },
});
