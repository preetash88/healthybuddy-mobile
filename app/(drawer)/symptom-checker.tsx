import { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import diseasesData from '@/data/diseases.json';

const categories = [
    'All',
    'Cardiovascular',
    'Respiratory',
    'Metabolic',
    'Musculoskeletal',
    'Neurological',
    'Infectious',
    'Mental Health',
    'Digestive',
    'Skin',
    'Eye',
    'Other',
];

export default function SymptomChecker() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [diseases, setDiseases] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    /* ---------- LOAD DATA ---------- */
    useEffect(() => {
        if (Array.isArray(diseasesData)) {
            setDiseases(diseasesData);
        } else {
            console.error('diseases.json must be an array');
        }
    }, []);

    /* ---------- RESET ON TAB SWITCH ---------- */
    const resetPage = () => {
        setActiveCategory('All');
        setSearch('');
        scrollRef.current?.scrollTo({ y: 0, animated: false });
    };

    useFocusEffect(
        useCallback(() => {
            resetPage();
        }, [])
    );

    /* ---------- PULL TO REFRESH ---------- */
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

    /* ---------- FILTER ---------- */
    const filteredDiseases = diseases.filter(
        (d) =>
            (activeCategory === 'All' || d.category === activeCategory) &&
            d.name.toLowerCase().includes(search.toLowerCase())
    );

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
                    <MaterialCommunityIcons name="pulse" size={30} color="white" />
                </View>

                {/* Heading */}
                <Text style={styles.title}>Symptom Checker</Text>
                <Text style={styles.subtitle}>
                    Select a condition to start your health assessment
                </Text>

                {/* Notice */}
                <View style={styles.notice}>
                    <MaterialCommunityIcons
                        name="information"
                        size={18}
                        color="#2563EB"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.noticeTitle}>Important Notice</Text>
                        <Text style={styles.noticeText}>
                            This tool provides general guidance only and is not a substitute for
                            professional medical advice.
                        </Text>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchWrap}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={18}
                        color="#9CA3AF"
                    />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search diseases..."
                        style={styles.searchInput}
                    />
                </View>

                {/* Categories */}
                <View style={styles.categoryWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {categories.map((cat) => (
                        <Pressable
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.categoryChip,
                                activeCategory === cat && styles.categoryActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory === cat && styles.categoryTextActive,
                                ]}
                            >
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
                    {/* RIGHT FADE + CHEVRON */}
                    <View style={styles.scrollHint}>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Cards */}
                <View style={{ marginTop: 24 }}>
                    {filteredDiseases.map((d, i) => (
                        <Pressable
                            key={i}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: '/assessment/[disease]',
                                    params: {
                                        disease: d.name,
                                    },
                                })
                            }
                        >
                            <View>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{d.category}</Text>
                                </View>

                                <Text style={styles.cardTitle}>{d.name}</Text>
                                <Text
                                    style={styles.cardDesc}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {d.description || 'Description coming soon.'}
                                </Text>

                            </View>

                            <View style={styles.cardButton}>
                                <Text style={styles.cardButtonText}>
                                    Start Assessment →
                                </Text>
                            </View>
                        </Pressable>
                    ))}
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
        backgroundColor: '#2563EB',
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
        marginBottom: 16,
    },
    notice: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#DBEAFE',
        padding: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    noticeTitle: {
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 2,
    },
    noticeText: {
        fontSize: 13,
        color: '#1E40AF',
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    categoryActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    categoryText: {
        fontSize: 13,
        color: '#374151',
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    card: {
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

    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
    cardButton: {
        marginTop: 14,
        backgroundColor: '#111827',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    cardButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    categoryWrapper: {
        position: 'relative',
        marginTop: 16,
    },

    categoryScroll: {
        paddingRight: 36, // 👈 space for hint
    },

    scrollHint: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',

        // subtle fade
        backgroundColor: 'rgba(248,250,252,0.9)',
    },
});
