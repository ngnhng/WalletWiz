import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Text, FAB } from "react-native-paper";
import { router } from 'expo-router';

import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useOnboarded from "./hooks/useOnboarded";
import { ONBOARD_TYPE } from "./types";

import Item from "./components/item";
import useTheme from "./hooks/useTheme";

export default function Page() {
    const theme = useTheme();
    const isOnboarded = useOnboarded();

    useEffect(() => {
        const setOnboarded = async (value: ONBOARD_TYPE) => {
            await AsyncStorage.setItem("isOnboarded", JSON.stringify(isOnboarded));
        };

        if (isOnboarded === ONBOARD_TYPE.BLANK) {
            setOnboarded(ONBOARD_TYPE.SKIPPED);
        }
    }, [isOnboarded]);

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
            }}
        >
            <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: "flex-start", alignItems: "center", gap: 20, flexGrow: 1 }}>
                <View style={styles.user}>
                    <View style={styles.userText}>
                        <Text style={{ ...styles.text, fontSize: 11 }}>Welcome back!</Text>
                        <Text style={{ ...styles.text, fontSize: 14, fontWeight: "bold" }}>First Name Last Name</Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: "white",
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        }}
                    ></View>
                </View>
                <AnimatedCircularProgress size={220} width={15} fill={80} rotation={0} tintColor="#afc5fd" backgroundColor="#3d5875" lineCap="round">
                    {(fill) => (
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.currentSpending}>{Math.round((fill / 100) * 5000000)}</Text>
                            <Text style={styles.maximumSpending}>/ 5000000</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>
                <View
                    style={{
                        width: "100%",
                        flex: 1,
                        gap: 10,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "800",
                            }}
                            variant="labelLarge"
                        >
                            Recents
                        </Text>
                        <Link href="/spendings">
                            <Text
                                style={{
                                    fontWeight: "800",
                                    color: theme.tertiary,
                                }}
                                variant="labelLarge"
                            >
                                More
                            </Text>
                        </Link>
                    </View>
                    <View style={{ width: "100%" }}>
                        <Item
                            data={{
                                name: "Lays Classic",
                                date: "Mar 24, 2024",
                                price: "28,000",
                            }}
                        />
                    </View>
                    <View style={{ width: "100%" }}>
                        <Item
                            data={{
                                name: "Lays Classic",
                                date: "Mar 24, 2024",
                                price: "28,000",
                            }}
                        />
                    </View>
                    <View style={{ width: "100%" }}>
                        <Item
                            data={{
                                name: "Lays Classic",
                                date: "Mar 24, 2024",
                                price: "28,000",
                            }}
                        />
                    </View>
                </View>
                <FAB
                    icon="pencil-plus"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        borderRadius: 10,
                        overflow: "hidden",
                    }}
                    label="Add Spending"
                    variant="secondary"
                    onPress={() => {
                        router.navigate("/new")
                    }}
                />
                <StatusBar backgroundColor={theme.background} style="light" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    text: {},
    user: {
        width: "100%",
        // flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 10,
    },
    userText: {
        flex: 1,
        alignItems: "flex-end",
    },
    currentSpending: {
        fontSize: 20,
        fontWeight: "800",
    },
    maximumSpending: {
        fontSize: 11,
    },
});
