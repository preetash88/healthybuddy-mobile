import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import assessments from '@/data/assessments.json';

export default function AssessmentScreen() {
    const { disease } = useLocalSearchParams<{ disease: string }>();
    const decodedDisease = decodeURIComponent(disease || '');

    const assessment = (assessments as any)[decodedDisease];

    if (!assessment) {
        router.replace('/symptom-checker');
        return null;
    }

    const QUESTIONS = assessment.questions;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<any[]>(
        Array(QUESTIONS.length).fill(null)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOption = answers[currentQuestion];
    const totalQuestions = QUESTIONS.length;
    const isLastQuestion = currentQuestion === totalQuestions - 1;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleOptionSelect = (option: any) => {
        const updated = [...answers];
        updated[currentQuestion] = option;
        setAnswers(updated);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setIsSubmitting(true);

            const totalScore = answers.reduce(
                (sum, a) => sum + (a?.score || 0),
                0
            );

            setTimeout(() => {
                router.replace({
                    pathname: '/assessment-result',
                    params: {
                        disease: decodedDisease,
                        score: totalScore.toString(),
                    },
                });
            }, 1200);
        } else {
            setCurrentQuestion((q) => q + 1);
        }
    };

    useFocusEffect(
        useCallback(() => {
            // Screen focused → do nothing
            return () => {
                // Screen unfocused → RESET EVERYTHING
                setCurrentQuestion(0);
                setAnswers(Array(QUESTIONS.length).fill(null));
                setIsSubmitting(false);
            };
        }, [])
    );


    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((q) => q - 1);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back */}
            <Pressable
                onPress={() =>
                    !isSubmitting && router.replace('/symptom-checker')
                }
                style={styles.backRow}
            >
            <MaterialCommunityIcons
                    name="arrow-left"
                    size={30}
                    color="#6B7280"
                />
                <Text style={styles.backText}>Back to Symptom Checker</Text>
            </Pressable>

            {/* Title */}
            <Text style={styles.title}>{decodedDisease}</Text>

            {/* Progress */}
            <View style={styles.progressWrap}>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of {totalQuestions}
                </Text>
                <View style={styles.progressBarBg}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${progress}%` },
                        ]}
                    />
                </View>
            </View>

            {/* Question Card */}
            <View style={styles.card}>
                <Text style={styles.question}>
                    {QUESTIONS[currentQuestion].question}
                </Text>

                {QUESTIONS[currentQuestion].options.map((opt: any, idx: number) => {
                    const selected = selectedOption?.text === opt.text;

                    return (
                        <Pressable
                            key={idx}
                            onPress={() => handleOptionSelect(opt)}
                            style={[
                                styles.option,
                                selected && styles.optionActive,
                            ]}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    selected && styles.radioActive,
                                ]}
                            >
                                {selected && <View style={styles.radioDot} />}
                            </View>

                            <Text style={styles.optionText}>{opt.text}</Text>
                        </Pressable>
                    );
                })}

                {/* Buttons */}
                <View style={styles.actions}>
                    <Pressable
                        disabled={currentQuestion === 0 || isSubmitting}
                        onPress={handlePrevious}
                        style={[
                            styles.secondaryBtn,
                            currentQuestion === 0 && styles.disabled,
                        ]}
                    >
                        <Text style={styles.secondaryText}>Previous</Text>
                    </Pressable>

                    <Pressable
                        disabled={!selectedOption || isSubmitting}
                        onPress={handleNext}
                        style={[
                            styles.primaryBtn,
                            (!selectedOption || isSubmitting) &&
                            styles.primaryDisabled,
                        ]}
                    >
                        {isSubmitting ? (
                            <>
                                <ActivityIndicator color="#FFF" />
                                <Text style={styles.primaryText}>
                                    Calculating...
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.primaryText}>
                                {isLastQuestion ? 'Complete' : 'Next'}
                            </Text>
                        )}
                    </Pressable>
                </View>

                {/* Cancel */}
                {!isSubmitting && (
                    <Pressable
                        onPress={() => router.replace('/symptom-checker')}
                        style={styles.cancel}
                    >
                        <Text style={styles.cancelText}>
                            Cancel Assessment
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8FAFC',
    },
    backRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    backText: {
        color: '#6B7280',
        fontWeight: '700',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 16,
        marginTop:20
    },
    progressWrap: {
        marginBottom: 20,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
        textAlign: 'right',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#111827',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
    },
    question: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
    },
    optionActive: {
        borderColor: '#111827',
        backgroundColor: '#F9FAFB',
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioActive: {
        borderColor: '#111827',
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#111827',
    },
    optionText: {
        fontSize: 14,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    secondaryBtn: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        color: '#6B7280',
        fontWeight: '800',
        marginTop:16,
        padding: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
    },
    secondaryText: {
        fontWeight: '800',
        color: '#374151',
        fontSize:13
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: '#111827',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        color: '#6B7280',
        fontWeight: '800',
        marginTop:16,
        borderRadius:10,
        padding: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
    },
    primaryDisabled: {
        backgroundColor: '#9CA3AF',
    },
    primaryText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13
    },
    disabled: {
        opacity: 0.4,
    },
    cancel: {
        marginTop: 14,
        alignItems: 'center',
    },
    cancelText: {
        width: '100%',          // 👈 FULL WIDTH
        alignItems: 'center',
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '800',
        marginTop:16,
        borderRadius:10,
        backgroundColor: '#FFFFFF',
        padding: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
        textAlign:"center"
    },
});
