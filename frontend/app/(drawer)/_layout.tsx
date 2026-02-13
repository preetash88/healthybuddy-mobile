import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet } from 'react-native';
import Navbar from "../../components/navigation/Navbar";

import { Pressable, Animated } from 'react-native';
import { useRef } from 'react';
import { useDrawerStatus } from '@react-navigation/drawer';

function DrawerItemCard({
                            label,
                            icon,
                            focused,
                            onPress,
                        }: {
    label: string;
    icon: (color: string, size: number) => JSX.Element;
    focused: boolean;
    onPress: () => void;
}) {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[
                    drawerStyles.card,
                    focused && drawerStyles.cardActive,
                ]}
            >
                {icon(focused ? '#2563EB' : '#374151', 22)}
                <Text
                    style={[
                        drawerStyles.label,
                        focused && drawerStyles.labelActive,
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

function HeaderLogo() {
    return (
        <View style={styles.logoContainer}>
            {/* OPTION A: Icon */}
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name="heart" size={24} color="white" />
            </View>

            {/* OPTION B: Image (use instead of icon if you add logo.png) */}
            {/*
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: 22, height: 22 }}
      />
      */}

            <View>
                <Text style={styles.title}>HealthBuddy</Text>
                <Text style={styles.subtitle}>Your Health Companion</Text>
            </View>
        </View>
    );
}


export default function DrawerLayout() {
    return (
        <View style={{ flex: 1 }}>
            {/* Your Custom Navbar */}
            <Navbar />

            {/* Drawer Navigator */}
            <Drawer
                screenOptions={{
                    headerShown: false, // 🚀 Disable default header
                    drawerType: "front",
                    overlayColor: "rgba(0,0,0,0.2)",
                    drawerStyle: {
                        backgroundColor: "#F8FAFC",
                        width: 280,
                    },
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        title: "Home",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="symptom-analyzer"
                    options={{
                        title: "Symptom Analyzer",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="symptom-checker"
                    options={{
                        title: "Symptom Checker",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="diseases"
                    options={{
                        title: "Diseases",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="prevention"
                    options={{
                        title: "Prevention",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="shield-check" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="clinics"
                    options={{
                        title: "Find Clinics",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="map-marker-radius" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="emergency"
                    options={{
                        title: "Emergency",
                        drawerIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="alert-circle" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2563EB',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8
    },
});

