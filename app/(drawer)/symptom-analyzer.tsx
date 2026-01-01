import { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import rules from '@/data/symptomRules.json';
import suggestedConditions from '@/data/suggestedConditions.json';

export default function SymptomAnalyzer() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [symptoms, setSymptoms] = useState('');

    const handleChange = (text: string) => {
        setSymptoms(text);
    };

    const symptomsCharCount = symptoms.length;


    const scrollRef = useRef<ScrollView>(null);

    const MIN_CHARS = 30;
    const charCount = symptoms.trim().length;

    /* ---------- RESET LOGIC ---------- */
    const resetPage = () => {
        setSymptoms('');
        setResult(null);
        setLoading(false);
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

            // ✅ Modern, non-deprecated scroll reset
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollRef.current?.scrollTo({
                        y: 0,
                        animated: false,
                    });
                });
            });
        }, 600);
    };


    /* ---------- VALIDATION ---------- */
    const isMeaningfulInput = (input: string) => {
        const words = input.trim().split(/\s+/);
        if (words.length < 4) return false;

        const hasMedicalKeyword = Object.keys(rules.symptomScores).some((k) =>
            input.includes(k)
        );

        const onlyLetters = /^[a-z\s]+$/i.test(input);
        const hasVowels = /[aeiou]/i.test(input);

        return hasMedicalKeyword && hasVowels && onlyLetters;
    };

    const analyzeSymptoms = () => {
        if (charCount < MIN_CHARS || loading) return;

        if (!isMeaningfulInput(symptoms.toLowerCase())) {
            setResult({
                isInvalidInput: true,
                description: 'We couldn’t understand your symptoms clearly.',
                conditions: [],
            });
            return;
        }

        setLoading(true);
        setResult(null);

        setTimeout(() => {
            let score = 0;
            const input = symptoms.toLowerCase();

            Object.entries(rules.symptomScores).forEach(([k, v]: any) => {
                if (input.includes(k)) score += v;
            });

            const urgency =
                score >= rules.urgencyLevels.high.minScore
                    ? 'high'
                    : score >= rules.urgencyLevels.moderate.minScore
                        ? 'moderate'
                        : 'low';

            setResult({
                ...rules.urgencyLevels[urgency],
                isInvalidInput: false,
                conditions: suggestedConditions[urgency],
            });

            setLoading(false);
        }, 1200);
    };

    return (
        <View style={styles.inner}>
        <ScrollView
            ref={scrollRef}
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#7C3AED"
                    enabled={!loading}
                />
            }
        >
            {/* Header */}
            <View style={styles.headerIcon}>
                <MaterialCommunityIcons
                    name="message-text-outline"
                    size={32}
                    color="white"
                />
            </View>

            <Text style={styles.title}>Symptom Analyzer</Text>
            <Text style={styles.subtitle}>
                Describe how you're feeling and we'll suggest what to check
            </Text>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={20} color="#2563EB" />
                <Text style={styles.infoText}>
                    Describe symptoms in your own words. This is not a diagnosis.
                </Text>

                {/* CLEAR BUTTON INSIDE INFOBOX */}
                {charCount >= MIN_CHARS && (
                    <Pressable
                        onPress={resetPage}
                        style={styles.infoClearButton}
                        hitSlop={10}
                        accessibilityLabel="Clear input"
                        accessibilityRole="button"
                    >
                        <MaterialCommunityIcons name="close" size={14} color="#1E40AF" />
                    </Pressable>
                )}
            </View>

            {/* INPUT CARD */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Describe Your Symptoms</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        value={symptoms}
                        onChangeText={handleChange}
                        placeholder="Example: Headache and fever since 2 days"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        style={styles.input}
                    />

                    {symptomsCharCount >= MIN_CHARS && (
                        <Pressable
                            onPress={resetPage}
                            style={styles.inputClearButton}
                            hitSlop={10}
                            accessibilityLabel="Clear input"
                            accessibilityRole="button"
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={22}
                                color="#2563EB"
                            />
                        </Pressable>
                    )}
                </View>


                <Text
                    style={[
                        styles.charCount,
                        { color: charCount < MIN_CHARS ? '#DC2626' : '#16A34A' },
                    ]}
                >
                    {charCount}/{MIN_CHARS} characters minimum
                </Text>

                <Pressable
                    onPress={analyzeSymptoms}
                    disabled={charCount < MIN_CHARS || loading}
                    style={[
                        styles.button,
                        (charCount < MIN_CHARS || loading) && styles.buttonDisabled,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.buttonText}>Analyze Symptoms</Text>
                            <MaterialCommunityIcons name="magnify" size={18} color="white" />
                        </>
                    )}
                </Pressable>
            </View>

            {/* RESULTS */}
            {result && (
                <>
                    {result.isInvalidInput ? (
                        <View style={[styles.alertBox, styles.alertWarning]}>
                            <MaterialCommunityIcons
                                name="alert-circle"
                                size={20}
                                color="#92400E"
                            />
                            <Text style={styles.alertText}>{result.description}</Text>
                        </View>
                    ) : (
                        <>
                            <View style={[styles.alertBox, styles.alertUrgency]}>
                                <MaterialCommunityIcons name="alert" size={20} color="#991B1B" />
                                <Text style={styles.alertText}>
                                    Urgency: {result.label}
                                </Text>
                            </View>

                            <Text style={styles.sectionTitle}>Suggested Conditions</Text>

                            {result.conditions.map((c: any, i: number) => (
                                <View key={i} style={styles.conditionCard}>
                                    <Text style={styles.conditionTitle}>{c.name}</Text>
                                    <Text style={styles.conditionDesc}>{c.description}</Text>

                                    <Pressable
                                        onPress={() => router.push('/symptom-checker')}
                                        style={styles.smallButton}
                                    >
                                        <Text style={styles.smallButtonText}>Check</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </>
                    )}
                </>
            )}
        </ScrollView>
        </View>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
        },

    headerIcon: {
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
        marginBottom: 20,
    },
    infoBox: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#DBEAFE',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        position: 'relative',
        shadowRadius: 20
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
    },
    infoClearButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: '#BFDBFE',
        alignItems: 'center',
        justifyContent: 'center',
    },
        card: {
            backgroundColor: 'transparent', // 👈 remove white container
            padding: 0,                     // 👈 let children define spacing
        },

    cardTitle: {
        fontWeight: '700',
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,                 // 👈 thicker border
        borderColor: '#2563EB',         // 👈 stronger blue
        borderRadius: 14,
        padding: 14,
        paddingBottom: 42,              // 👈 space for clear button
        minHeight: 140,
        textAlignVertical: 'top',
        backgroundColor: '#FFFFFF',

        // iOS shadow
        shadowColor: '#2563EB',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },

        // Android shadow
        elevation: 4,
    },
    inputClearButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    charCount: {
        fontSize: 12,
        marginTop: 6,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#7C3AED',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    buttonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
    alertBox: {
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        gap: 8,
    },
    alertWarning: {
        backgroundColor: '#FEF3C7',
    },
    alertUrgency: {
        backgroundColor: '#FEE2E2',
    },
    alertText: {
        fontSize: 13,
        flex: 1,
    },
    sectionTitle: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: '800',
    },
    conditionCard: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 14,
        marginTop: 10,
        elevation: 2,
    },
    conditionTitle: {
        fontWeight: '700',
    },
    conditionDesc: {
        fontSize: 13,
        color: '#6B7280',
        marginVertical: 6,
    },
    smallButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    smallButtonText: {
        color: 'white',
        fontSize: 12,
    },
    inner: {
        padding: 20,
        paddingBottom: 120,
    },
    inputWrapper: {
        position: 'relative',
    },

});
