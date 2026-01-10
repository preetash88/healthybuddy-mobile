import { useState, useMemo, useCallback, useRef } from 'react';
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

import diseasesHub from '@/data/diseases1.json';

const categories = [
    'All Diseases',
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

if (!Array.isArray(diseasesHub)) {
    throw new Error('diseases1.json must export an array');
}

export default function Diseases() {
    const [activeCategory, setActiveCategory] = useState('All Diseases');
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    /* ---------- CATEGORY COUNTS ---------- */
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        diseasesHub.forEach((d: any) => {
            counts[d.category] = (counts[d.category] || 0) + 1;
        });
        return counts;
    }, []);

    /* ---------- RESET ON TAB SWITCH ---------- */
    const resetPage = () => {
        setActiveCategory('All Diseases');
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

    /* ---------- FILTERING ---------- */
    const filteredDiseases = diseasesHub.filter((d: any) => {
        const matchesCategory =
            activeCategory === 'All Diseases' || d.category === activeCategory;

        const matchesSearch = d.name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <ScrollView
            ref={scrollRef}
            contentInsetAdjustmentBehavior="never"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#7C3AED"
                />
            }
        >
            <View style={styles.inner}>
                {/* Icon */}
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                        name="book-open-variant"
                        size={30}
                        color="white"
                    />
                </View>

                {/* Heading */}
                <Text style={styles.title}>Disease Information Hub</Text>
                <Text style={styles.subtitle}>
                    Learn about common diseases, their symptoms, causes, and prevention
                </Text>

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
                        {categories.map((cat) => {
                            const count =
                                cat === 'All Diseases'
                                    ? diseasesHub.length
                                    : categoryCounts[cat] || 0;

                            const active = activeCategory === cat;

                            return (
                                <Pressable
                                    key={cat}
                                    onPress={() => setActiveCategory(cat)}
                                    style={[
                                        styles.categoryChip,
                                        active && styles.categoryChipActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            active && styles.categoryTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>

                                    <View
                                        style={[
                                            styles.countBadge,
                                            active && styles.countBadgeActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.countText,
                                                active && styles.countTextActive,
                                            ]}
                                        >
                                            {count}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
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

                {/* Disease Cards */}
                <View style={{ marginTop: 24 }}>
                    {filteredDiseases.map((d: any, i: number) => (
                        <Pressable
                            key={i}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: "/diseases-details",
                                    params: { name: d.name },
                                })
                            }
                        >
                            <View>
                                {/* Category */}
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{d.category}</Text>
                                </View>

                                {/* Title */}
                                <Text style={styles.cardTitle}>{d.name}</Text>

                                {/* Description */}
                                <Text
                                    style={styles.cardDesc}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {d.description || 'Description coming soon.'}
                                </Text>

                                {/* Symptoms */}
                                {d.symptoms?.length > 0 && (
                                    <>
                                        <Text style={styles.symptomLabel}>
                                            Common Symptoms:
                                        </Text>

                                        <View style={styles.symptomWrap}>
                                            {d.symptoms.slice(0, 3).map((s: string, idx: number) => (
                                                <View key={idx} style={styles.symptomChip}>
                                                    <Text style={styles.symptomText}>{s}</Text>
                                                </View>
                                            ))}

                                            {d.symptoms.length > 3 && (
                                                <View style={styles.symptomChipAlt}>
                                                    <Text style={styles.symptomText}>
                                                        +{d.symptoms.length - 3} more
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* CTA */}
                            <View style={styles.cardButton}>
                                <Text style={styles.cardButtonText}>Learn More →</Text>
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
        backgroundColor: '#7C3AED',
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        marginRight: 8,
    },
    categoryChipActive: {
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
    countBadge: {
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    countBadgeActive: {
        backgroundColor: '#FFFFFF33',
    },
    countText: {
        fontSize: 11,
        color: '#374151',
        fontWeight: '700',
    },
    countTextActive: {
        color: '#FFFFFF',
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
    symptomLabel: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
    },
    symptomWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 6,
    },
    symptomChip: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    symptomChipAlt: {
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    symptomText: {
        fontSize: 11,
        color: '#374151',
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
        marginTop: 20,
    },

    categoryScroll: {
        paddingRight: 36,
    },

    scrollHint: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(248,250,252,0.9)',
    },

    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
        minHeight: 36, // keeps all cards symmetric
    },
});
