import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Linking,
    RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const QUICK_SEARCHES = [
    { emoji: '🏥', label: 'Hospitals Near Me', query: 'Hospital' },
    { emoji: '🩺', label: 'Clinics Near Me', query: 'Clinic' },
    { emoji: '🏛️', label: 'Government Hospitals', query: 'Government hospital' },
    { emoji: '🏫', label: 'Primary Health Centers', query: 'Primary health center' },
    { emoji: '🚑', label: '24/7 Emergency', query: 'Emergency hospital' },
    { emoji: '💊', label: 'Pharmacies', query: 'Pharmacy' },
    { emoji: '🔬', label: 'Diagnostic Labs', query: 'Diagnostic laboratory' },
    { emoji: '👁️', label: 'Eye Clinics', query: 'Eye clinic' },
    { emoji: '🦷', label: 'Dental Clinics', query: 'Dental clinic' },
    { emoji: '👶', label: 'Maternity Hospitals', query: 'Maternity hospital' },
];

export default function FindClinics() {
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const openMaps = (query: string) => {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(
            `${query} near me`
        )}`;
        Linking.openURL(url);
    };

    const resetPage = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
    };

    useFocusEffect(
        useCallback(() => {
            resetPage();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            resetPage();
            setRefreshing(false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: false });
                });
            });
        }, 600);
    };

    return (
        <ScrollView
            ref={scrollRef}
            contentInsetAdjustmentBehavior="never"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#2563EB"
                />
            }
        >
            <View style={styles.inner}>
                {/* Icon */}
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="map-marker" size={32} color="white" />
                </View>

                {/* Heading */}
                <Text style={styles.title}>Find Nearby Clinics</Text>
                <Text style={styles.subtitle}>
                    Search for healthcare facilities near your location using Google Maps
                </Text>

                {/* Location Found */}
                <View style={styles.locationBox}>
                    <Text style={styles.locationTitle}>📍 Location Found</Text>
                    <Text style={styles.locationText}>
                        Your location has been detected. Tap any option below to find nearby
                        facilities.
                    </Text>
                </View>

                {/* Primary CTA */}
                <Pressable
                    style={styles.primaryButton}
                    onPress={() => openMaps('Healthcare facilities')}
                >
                    <MaterialCommunityIcons name="magnify" size={18} color="white" />
                    <Text style={styles.primaryButtonText}>
                        Search All Healthcare Facilities Near Me
                    </Text>
                    <MaterialCommunityIcons
                        name="open-in-new"
                        size={16}
                        color="white"
                    />
                </Pressable>

                {/* Quick Search */}
                <Text style={styles.sectionTitle}>Quick Search</Text>

                <View style={styles.quickGrid}>
                    {QUICK_SEARCHES.map((item) => (
                        <Pressable
                            key={item.label}
                            style={styles.quickCard}
                            onPress={() => openMaps(item.query)}
                        >
                            <Text style={styles.quickEmoji}>{item.emoji}</Text>
                            <Text style={styles.quickLabel}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Emergency */}
                <View style={styles.emergencyBox}>
                    <Text style={styles.emergencyTitle}>🚨 Emergency Services</Text>

                    <Text style={styles.emergencyText}>
                        In case of emergency, call these helplines immediately:
                    </Text>

                    <View style={styles.emergencyGrid}>
                        <EmergencyBadge label="108 – Ambulance" phone="108" />
                        <EmergencyBadge label="104 – Health Helpline" phone="104" />
                        <EmergencyBadge label="102 – Emergency" phone="102" />
                    </View>

                    <Pressable
                        style={styles.emergencyButton}
                        onPress={() => openMaps('Emergency hospital')}
                    >
                        <MaterialCommunityIcons name="map-marker" size={16} color="white" />
                        <Text style={styles.emergencyButtonText}>
                            Find Emergency Hospital Near Me
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

/* ---------- Small Components ---------- */

function EmergencyBadge({
                            label,
                            phone,
                        }: {
    label: string;
    phone: string;
}) {
    return (
        <Pressable
            style={styles.emergencyBadge}
            onPress={() => Linking.openURL(`tel:${phone}`)}
        >
            <Text style={styles.emergencyBadgeText}>📞 {label}</Text>
        </Pressable>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    inner: {
        padding: 20,
        paddingBottom: 120,
        backgroundColor: '#F8FAFC',
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#F97316',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#6B7280',
        marginTop: 6,
    },
    locationBox: {
        marginTop: 20,
        backgroundColor: '#ECFDF5',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    locationTitle: {
        fontWeight: '700',
        color: '#065F46',
    },
    locationText: {
        fontSize: 13,
        color: '#047857',
        marginTop: 4,
    },
    primaryButton: {
        marginTop: 20,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        flexShrink: 1,
    },
    sectionTitle: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: '800',
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        gap: 12,
    },
    quickCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginBottom: 2,

        // iOS shadow (same feel as HeroStats)
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },

        // Android elevation
        elevation: 10,
        alignItems: "center"
    },
    quickEmoji: {
        fontSize: 32,
    },
    quickLabel: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
    },
    emergencyBox: {
        marginTop: 32,
        backgroundColor: '#FEF2F2',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    emergencyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#7F1D1D',
        marginBottom: 8,
    },
    emergencyText: {
        fontSize: 13,
        color: '#7F1D1D',
        marginBottom: 12,
    },
    emergencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14,
    },
    emergencyBadge: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    emergencyBadgeText: {
        fontWeight: '700',
        color: '#991B1B',
        fontSize: 13,
    },
    emergencyButton: {
        backgroundColor: '#DC2626',
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    emergencyButtonText: {
        color: 'white',
        fontWeight: '800',
    },
});
