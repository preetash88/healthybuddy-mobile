import { useState, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    Animated,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import diseasesData from '@/data/diseases.json';

export default function Prevention() {
    const [activeTab, setActiveTab] = useState<'general' | 'disease'>('general');
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const screenWidth = Dimensions.get('window').width;
    const tabTranslateX = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(1)).current;
    const [renderedTab, setRenderedTab] =
        useState<'general' | 'disease'>('general');


    const switchTab = (tab: 'general' | 'disease') => {
        if (tab === activeTab) return;

        Animated.timing(contentOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            // 🔑 Switch content AFTER fade-out
            setRenderedTab(tab);
            setActiveTab(tab);

            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }).start();
        });

        Animated.timing(tabTranslateX, {
            toValue: tab === 'general' ? 0 : screenWidth / 2 - 20,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };


    /* ---------- RESET ---------- */
    const resetPage = () => {
        setActiveTab('general');
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

    /* ---------- GROUP DISEASES ---------- */
    const groupedDiseases = useMemo(() => {
        const map: Record<string, any[]> = {};
        diseasesData.forEach((d: any) => {
            map[d.category] = map[d.category] || [];
            map[d.category].push(d);
        });
        return map;
    }, []);

    return (
        <ScrollView
            ref={scrollRef}
            contentInsetAdjustmentBehavior="never"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#16A34A"
                />
            }
        >
            <View style={styles.inner}>
                {/* Icon */}
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="shield" size={32} color="white" />
                </View>

                {/* Heading */}
                <Text style={styles.title}>Prevention & Wellness</Text>
                <Text style={styles.subtitle}>
                    Simple steps for a healthier life and disease prevention
                </Text>

                {/* Tabs */}
                <View style={styles.tabs}>
                    {/* SLIDING INDICATOR */}
                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            {
                                transform: [{ translateX: tabTranslateX }],
                            },
                        ]}
                    />

                    <Pressable
                        onPress={() => switchTab('general')}
                        style={styles.tab}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'general' && styles.tabTextActive,
                            ]}
                        >
                            General Health Tips
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => switchTab('disease')}
                        style={styles.tab}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'disease' && styles.tabTextActive,
                            ]}
                        >
                            Disease-Specific Prevention
                        </Text>
                    </Pressable>
                </View>


                {/* CONTENT */}
                <Animated.View
                    style={{
                        marginTop: 24,
                        opacity: contentOpacity,
                    }}
                >
                {renderedTab === 'general' && (
                    <View style={{ marginTop: 24 }}>
                        <GeneralCard
                            icon="food-apple"
                            color="#22C55E"
                            title="Nutrition"
                            tips={[
                                'Eat a balanced diet rich in fruits and vegetables',
                                'Limit processed foods and added sugars',
                                'Stay hydrated — drink 8–10 glasses of water daily',
                                'Include whole grains and lean proteins',
                                'Reduce salt intake to prevent hypertension',
                            ]}
                        />

                        <GeneralCard
                            icon="run"
                            color="#3B82F6"
                            title="Physical Activity"
                            tips={[
                                'Exercise at least 30 minutes daily',
                                'Take breaks from sitting every hour',
                                'Include strength training weekly',
                                'Walk or cycle when possible',
                            ]}
                        />

                        <GeneralCard
                            icon="heart"
                            color="#EC4899"
                            title="Mental Health"
                            tips={[
                                'Practice stress management',
                                'Get 7–9 hours of sleep',
                                'Maintain social connections',
                                'Seek help when overwhelmed',
                            ]}
                        />

                        <GeneralCard
                            icon="water"
                            color="#06B6D4"
                            title="Hygiene"
                            tips={[
                                'Wash hands frequently',
                                'Cover mouth while coughing',
                                'Keep surroundings clean',
                                'Avoid touching your face',
                            ]}
                        />
                    </View>
                )}

                {renderedTab === 'disease' && (
                    <View style={{ marginTop: 24 }}>
                        {Object.entries(groupedDiseases).map(
                            ([category, diseases]) => (
                                <View key={category} style={{ marginBottom: 32 }}>
                                    <Text style={styles.categoryTitle}>{category}</Text>

                                    {diseases.map((d: any, i: number) => (
                                        <View key={i} style={styles.diseaseCard}>
                                            <Text style={styles.diseaseTitle}>{d.name}</Text>
                                            <Text style={styles.diseaseDesc}>
                                                {d.description}
                                            </Text>

                                            {d.prevention_tips?.length > 0 && (
                                                <>
                                                    <Text style={styles.tipHeader}>
                                                        Prevention Tips
                                                    </Text>

                                                    {d.prevention_tips
                                                        .slice(0, 5)
                                                        .map((tip: string, idx: number) => (
                                                            <View
                                                                key={idx}
                                                                style={styles.tipRow}
                                                            >
                                                                <MaterialCommunityIcons
                                                                    name="check-circle"
                                                                    size={16}
                                                                    color="#22C55E"
                                                                />
                                                                <Text style={styles.tipText}>
                                                                    {tip}
                                                                </Text>
                                                            </View>
                                                        ))}

                                                    {d.prevention_tips.length > 5 && (
                                                        <Text style={styles.moreText}>
                                                            +
                                                            {d.prevention_tips.length -
                                                                5}{' '}
                                                            more tips
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )
                        )}
                    </View>
                )}
                </Animated.View>
            </View>
        </ScrollView>
    );
}

/* ---------- GENERAL CARD ---------- */

function GeneralCard({
                         icon,
                         title,
                         tips,
                         color,
                     }: {
    icon: string;
    title: string;
    tips: string[];
    color: string;
}) {
    return (
        <View style={styles.generalCard}>
            <View
                style={[
                    styles.generalIcon,
                    { backgroundColor: color },
                ]}
            >
                <MaterialCommunityIcons
                    name={icon as any}
                    size={20}
                    color="white"
                />
            </View>

            <Text style={styles.generalTitle}>{title}</Text>

            {tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#22C55E"
                    />
                    <Text style={styles.tipText}>{tip}</Text>
                </View>
            ))}
        </View>
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
        backgroundColor: '#22C55E',
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
    tabs: {
        marginTop: 24,
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 14,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#111827',
    },
    generalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginBottom: 18,

        // iOS shadow (same feel as HeroStats)
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },

        // Android elevation
        elevation: 10,
    },
    generalIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    generalTitle: {
        fontWeight: '800',
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },
    diseaseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginBottom: 18,

        // iOS shadow (same feel as HeroStats)
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },

        // Android elevation
        elevation: 10,
    },
    diseaseTitle: {
        fontWeight: '800',
        marginBottom: 4,
    },
    diseaseDesc: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    tipHeader: {
        fontWeight: '700',
        marginTop: 8,
        marginBottom: 6,
    },
    tipRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    tipText: {
        fontSize: 13,
        color: '#374151',
        flex: 1,
    },
    moreText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontStyle: 'italic',
    },
    tabIndicator: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: '49%',
        height: '98%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,

        // subtle shadow
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },

        elevation: 6,
    },
});
