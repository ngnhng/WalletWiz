import { StatusBar } from "expo-status-bar";
import React, { useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Text, FAB, ActivityIndicator } from "react-native-paper";
import { router, useNavigation } from "expo-router";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useOnboarded from "./hooks/useOnboarded";
import { ONBOARD_TYPE, TOKEN_STATE } from "./types";
import { StateContext } from "./_layout";

import Item from "./components/item";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import useExpenses from "./hooks/useExpenses";

export default function Page() {
    const navigation = useNavigation();
    const isFocused = navigation.isFocused();

    const theme = useTheme();
    const isOnboarded = useOnboarded();
    const auth = useAuth(isFocused);
    const expenses = useExpenses(isFocused);
    const { state } = useContext(StateContext);

    const expensesTotal = Math.round(
        expenses.reduce<number>((accm, curr) => {
            return accm + curr.amount;
        }, 0)
    );

    useEffect(() => {
        const setOnboarded = async (value: ONBOARD_TYPE) => {
            await AsyncStorage.setItem("isOnboarded", JSON.stringify(isOnboarded));
        };

        if (isOnboarded === ONBOARD_TYPE.BLANK) {
            setOnboarded(ONBOARD_TYPE.SKIPPED);
        }
    }, [isOnboarded]);

    useEffect(() => {
        if (auth === TOKEN_STATE.NULL) router.navigate("/login");
    }, [auth]);

    if (auth === TOKEN_STATE.LOADING || auth === TOKEN_STATE.NULL) {
        return (
            <SafeAreaView
                style={{
                    flexGrow: 1,
                    backgroundColor: theme.background,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator animating={true} color={theme.primary} size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
            }}
        >
            <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: "flex-start", alignItems: "center", gap: 20, flexGrow: 1 }}>
                <View style={styles.user}>
                    <Pressable onPress={() => router.navigate("/user")} style={styles.userText}>
                        <Text style={{ ...styles.text, fontSize: 11 }}>Welcome back!</Text>
                        <Text style={{ ...styles.text, fontSize: 14, fontWeight: "bold" }}>First Name Last Name</Text>
                    </Pressable>
                </View>
                <AnimatedCircularProgress
                    size={300}
                    width={15}
                    fill={(expensesTotal / state.userInfo.budget_limit) * 100}
                    rotation={0}
                    tintColor="#afc5fd"
                    backgroundColor="#3d5875"
                    lineCap="round"
                >
                    {(fill) => (
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.currentSpending}>{expensesTotal.toLocaleString()}</Text>
                            <Text style={styles.maximumSpending}>/ {state.userInfo.budget_limit.toLocaleString()}</Text>
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
                    {expenses.map((expense) => (
                        <View style={{ width: "100%" }} key={expense.id}>
                            <Item
                                data={{
                                    id: expense.id,
                                    name: expense.name,
                                    date: new Date(),
                                    price: expense.amount,
                                }}
                            />
                        </View>
                    ))}
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
                        router.navigate("/new");
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
        fontSize: 32,
        fontWeight: "800",
    },
    maximumSpending: {
        fontSize: 20,
    },
});
