import { useLocalSearchParams, router } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ViewShot, { ViewShot as ViewShotType } from 'react-native-view-shot';
import { useRef } from 'react';


export default function AssessmentResultScreen() {
    const { disease, score } = useLocalSearchParams<{
        disease?: string;
        score?: string;
    }>();

    const viewShotRef = useRef<ViewShotType | null>(null);



    if (!disease || !score) {
        router.replace('/symptom-checker');
        return null;
    }

    const downloadPDF = async () => {
        const ref = viewShotRef.current;
        if (!ref) return;

        // 1. Capture screenshot
        const imageUri = await ref.capture();

        // 2. Create PDF from image
        const html = `
      <html>
        <body style="margin:0;padding:0;">
          <img src="${imageUri}" style="width:100%;" />
        </body>
      </html>
    `;

        const { uri } = await Print.printToFileAsync({ html });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Download Assessment Report',
        });
    };


    const numericScore = Number(score);

    /* ---------------- Risk Logic ---------------- */
    let riskLevel = 'LOW RISK';
    let theme = 'green';

    if (numericScore >= 30) {
        riskLevel = 'HIGH RISK';
        theme = 'red';
    } else if (numericScore >= 15) {
        riskLevel = 'MODERATE RISK';
        theme = 'yellow';
    }

    const themes = {
        green: {
            bg: '#DCFCE7',
            border: '#86EFAC',
            text: '#166534',
            badge: '#BBF7D0',
            icon: '#16A34A',
        },
        yellow: {
            bg: '#FEF9C3',
            border: '#FDE047',
            text: '#854D0E',
            badge: '#FEF08A',
            icon: '#CA8A04',
        },
        red: {
            bg: '#FEE2E2',
            border: '#FCA5A5',
            text: '#991B1B',
            badge: '#FECACA',
            icon: '#DC2626',
        },
    };

    const t = themes[theme];

    return (
        <ScrollView style={styles.screen}>
            {/* HOME BUTTON */}
            <Pressable
                onPress={() => router.replace('/')}
                style={styles.homeBtn}
                accessibilityRole="button"
                accessibilityLabel="Go to Home"
            >
                <MaterialCommunityIcons
                    name="home"
                    size={18}
                    color="#2563EB"
                />
                <Text style={styles.homeText}>Home</Text>
            </Pressable>



            <View style={styles.card}>
                <ViewShot
                    ref={viewShotRef}
                    options={{
                        format: 'png',
                        quality: 1,
                        result: 'tmpfile',
                    }}
                >
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        { backgroundColor: t.bg, borderColor: t.border },
                    ]}
                >
                    <View>
                        <Text style={styles.title}>{disease} Assessment</Text>
                        <Text style={styles.sub}>
                            Completed on {new Date().toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={[styles.checkBadge, { backgroundColor: t.icon }]}>
                        <MaterialCommunityIcons
                            name="check"
                            size={22}
                            color="#FFFFFF"
                        />
                    </View>
                </View>

                {/* Risk Card */}
                <View
                    style={[
                        styles.riskCard,
                        { backgroundColor: t.bg, borderColor: t.border },
                    ]}
                >
                    <View>
                        <Text style={styles.sectionTitle}>Risk Assessment</Text>
                        <Text style={[styles.score, { color: t.text }]}>
                            Score: {numericScore} points
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: t.badge, borderColor: t.border },
                        ]}
                    >
                        <Text style={[styles.badgeText, { color: t.text }]}>
                            {riskLevel}
                        </Text>
                    </View>
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons
                            name="heart"
                            size={18}
                            color="#2563EB"
                        />
                        <Text style={styles.sectionTitle}>Recommendations</Text>
                    </View>

                    <Text style={styles.bullet}>
                        • Follow prevention tips for this condition
                    </Text>

                    {riskLevel !== 'LOW RISK' && (
                        <Text style={styles.bullet}>
                            • Consider consulting a healthcare professional
                        </Text>
                    )}

                    <Text style={styles.bullet}>
                        • Maintain a healthy lifestyle with diet & exercise
                    </Text>
                </View>

                {/* Prevention Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prevention Tips</Text>
                    <Text style={styles.bullet}>• Maintain healthy vitals</Text>
                    <Text style={styles.bullet}>• Quit smoking</Text>
                    <Text style={styles.bullet}>• Exercise regularly</Text>
                    <Text style={styles.bullet}>• Eat a balanced diet</Text>
                </View>

                {/* Next Steps */}
                <View style={styles.infoBox}>
                    <MaterialCommunityIcons
                        name="information"
                        size={20}
                        color="#2563EB"
                    />
                    <Text style={styles.infoText}>
                        {riskLevel === 'HIGH RISK'
                            ? 'We strongly recommend consulting a doctor immediately.'
                            : 'Continue monitoring your health and maintain good habits.'}
                    </Text>
                </View>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Disclaimer: This assessment is for informational purposes only and
                    does not constitute medical advice.
                </Text>

                </ViewShot>

                {/* Actions */}
                <View style={styles.actions}>
                    {/* Row 1: Secondary buttons */}
                    <View style={styles.actionRow}>
                        <Pressable
                            onPress={() => router.replace('/symptom-checker')}
                            style={styles.secondaryBtn}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={14} />
                            <Text style={styles.secondaryText}>New Assessment</Text>
                        </Pressable>

                        <Pressable
                            onPress={downloadPDF}
                            style={styles.secondaryBtn}
                        >
                            <MaterialCommunityIcons name="download" size={14} />
                            <Text style={styles.secondaryText}>Download PDF</Text>
                        </Pressable>
                    </View>

                    {/* Row 2: Primary button */}
                    <Pressable
                        onPress={() => router.push('/clinics')}
                        style={styles.primaryBtnFull}
                    >
                        <Text style={styles.primaryText}>Find Nearby Clinics</Text>
                        <MaterialCommunityIcons
                            name="arrow-right"
                            size={16}
                            color="#FFF"
                        />
                    </Pressable>
                </View>
            </View>

        </ScrollView>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingBottom: 24,
        elevation: 10,
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    sub: {
        fontSize: 14,
        color: '#374151',
        marginTop: 4,
    },
    riskCard: {
        margin: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    score: {
        marginTop: 4,
        fontSize: 15,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 2,
        alignSelf: 'center',
    },
    badgeText: {
        fontWeight: '900',
        fontSize: 13,
    },
    bullet: {
        marginTop: 6,
        fontSize: 14,
        color: '#374151',
        fontWeight:'500'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoBox: {
        margin: 16,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        flexDirection: 'row',
        gap: 10,
        fontWeight: '900'
    },
    infoText: {
        fontSize: 13,
        color: '#1E40AF',
        flex: 1,
    },
    disclaimer: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
    },
    actions: {
        marginTop: 24,
        paddingHorizontal: 16,
    },

    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },

    secondaryBtn: {
        flex: 1,
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 14,

        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },

    primaryBtnFull: {
        width: '100%',              // 👈 full width
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#111827',
        borderRadius: 18,
        paddingVertical: 16,

        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
    },
    secondaryText: {
        fontWeight: '800',
        color: '#374151',
    },
    primaryBtn: {
        flex:1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
        elevation: 10,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 18,

        // iOS shadow (same feel as HeroStats)
        shadowColor: '#101',
        shadowOpacity: 0.20,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
    },
    primaryText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    checkWrapper: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',

        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',

        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    homeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
    },

});
