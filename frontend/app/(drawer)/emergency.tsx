import { useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

/* ---------- Helpers ---------- */

const toSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-');

/* ---------- Data ---------- */

const helplines = [
    { number: '108', label: 'Ambulance' },
    { number: '104', label: 'Health Helpline' },
    { number: '102', label: 'Medical Emergency' },
    { number: '112', label: 'National Emergency' },
];

const emergencies = [
    {
        title: 'Diabetic Emergency',
        subtitle: 'Hypoglycemia / Hyperglycemia',
        description:
            'Low or high blood sugar can cause serious complications. Quick recognition and action is important.',
        urgency: 'urgent',
        icon: 'water',
    },
    {
        title: 'Burn Emergency',
        subtitle: 'Thermal Burns',
        description:
            'Serious burns require immediate cooling and medical attention to prevent complications.',
        urgency: 'urgent',
        icon: 'fire',
    },
    {
        title: 'Severe Bleeding Control',
        subtitle: 'Hemorrhage',
        description:
            'Severe bleeding can be life-threatening. Quick action to stop bleeding is crucial.',
        urgency: 'urgent',
        icon: 'water-alert',
    },
    {
        title: 'Seizure Emergency',
        subtitle: 'Epileptic Seizure',
        description:
            'During a seizure, the person may shake, lose consciousness, or become confused.',
        urgency: 'urgent',
        icon: 'brain',
    },
    {
        title: 'Heart Attack Emergency',
        subtitle: 'Myocardial Infarction',
        description:
            'A heart attack occurs when blood flow to the heart is blocked. Every second counts.',
        urgency: 'critical',
        icon: 'heart-pulse',
    },
    {
        title: 'Stroke Emergency (FAST)',
        subtitle: 'Cerebrovascular Accident',
        description:
            'A stroke occurs when blood supply to the brain is interrupted. Time lost is brain lost.',
        urgency: 'critical',
        icon: 'brain',
    },
    {
        title: 'CPR (Cardiopulmonary Resuscitation)',
        subtitle: 'Cardiac Arrest',
        description:
            'Immediate CPR can double or triple chances of survival.',
        urgency: 'critical',
        icon: 'heart-pulse',
    },
    {
        title: 'Choking Emergency',
        subtitle: 'Airway Obstruction',
        description:
            'Quick action with Heimlich maneuver can save a life.',
        urgency: 'critical',
        icon: 'weather-windy',
    },
    {
        title: 'Severe Allergic Reaction (Anaphylaxis)',
        subtitle: 'Anaphylactic Shock',
        description:
            'Requires immediate epinephrine injection and emergency care.',
        urgency: 'critical',
        icon: 'flash',
    },
];

/* ---------- Component ---------- */

export default function Emergency() {
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

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
                    tintColor="#DC2626"
                />
            }
        >
            <View style={styles.inner}>
                {/* Icon */}
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                        name="alert-circle"
                        size={32}
                        color="white"
                    />
                </View>

                {/* Heading */}
                <Text style={styles.title}>Emergency Response Guide</Text>
                <Text style={styles.subtitle}>
                    Critical first-aid procedures and immediate response steps
                </Text>

                {/* Helplines */}
                <View style={styles.helplineBox}>
                    <View style={styles.helplineHeader}>
                        <MaterialCommunityIcons
                            name="phone"
                            size={16}
                            color="#7F1D1D"
                        />
                        <Text style={styles.helplineTitle}>
                            Emergency Helplines — Save These Numbers
                        </Text>
                    </View>

                    <View style={styles.helplineGrid}>
                        {helplines.map((h) => (
                            <Pressable
                                key={h.number}
                                style={styles.helplineCard}
                                onPress={() => Linking.openURL(`tel:${h.number}`)}
                            >
                                <Text style={styles.helplineNumber}>{h.number}</Text>
                                <Text style={styles.helplineLabel}>{h.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Emergency Cards */}
                <View style={{ marginTop: 28 }}>
                    {emergencies.map((e) => {
                        const slug = toSlug(e.title);

                        return (
                            <Pressable
                                key={slug}
                                style={styles.card}
                                onPress={() =>
                                    router.push({
                                        pathname: "/emergency-detail",
                                        params: { slug },
                                    })
                                }
                            >
                                <View style={styles.cardTopBar} />

                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardTitleWrap}>
                                            <MaterialCommunityIcons
                                                name={e.icon as any}
                                                size={18}
                                                color="#DC2626"
                                            />
                                            <Text style={styles.cardTitle}>{e.title}</Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.urgencyBadge,
                                                e.urgency === 'critical'
                                                    ? styles.critical
                                                    : styles.urgent,
                                            ]}
                                        >
                                            <Text style={styles.urgencyText}>
                                                {e.urgency}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.cardSubtitle}>{e.subtitle}</Text>
                                    <Text
                                        style={styles.cardDesc}
                                        numberOfLines={2}
                                    >
                                        {e.description}
                                    </Text>

                                    <Pressable
                                        style={styles.cardButton}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/emergency-detail",
                                                params: { slug },
                                            })
                                        }
                                    >
                                        <Text style={styles.cardButtonText}>
                                            View Emergency Guide →
                                        </Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
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
        backgroundColor: '#DC2626',
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
        marginTop: 4,
    },
    helplineBox: {
        marginTop: 24,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    helplineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    helplineTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#7F1D1D',
    },
    helplineGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    helplineCard: {
        width: '47%',
        backgroundColor: '#DC2626',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    helplineNumber: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
    },
    helplineLabel: {
        color: 'white',
        fontSize: 12,
        opacity: 0.9,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        marginBottom: 20,
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    cardTopBar: {
        height: 4,
        backgroundColor: '#DC2626',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    cardTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexShrink: 1,
    },
    cardTitle: {
        fontWeight: '800',
        flexShrink: 1,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 12,
    },
    urgencyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    urgent: {
        backgroundColor: '#FFEDD5',
    },
    critical: {
        backgroundColor: '#FEE2E2',
    },
    urgencyText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#7F1D1D',
    },
    cardButton: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    cardButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#DC2626',
    },
});
