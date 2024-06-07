import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateContext } from "./_layout";

import Item from "./components/item";
import Title from "./components/title";

import { router } from "expo-router";
import useTheme from "./hooks/useTheme";
import useExpenses from "./hooks/useExpenses";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();
    const expenses = useExpenses(false);

    const [isLoading, setIsLoading] = useState(expenses ? false : true);
    const { dispatch } = useContext(StateContext);

    const deleteExpense = async (id) => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            dispatch({
                type: ACTIONS.REQUEST_UPDATE,
                payload: "",
            });
            router.navigate("/home");
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot delete expense", ToastAndroid.LONG);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
                padding: 20,
                gap: 20,
            }}
        >
            <StatusBar backgroundColor={theme.background} style="light" />
            <View style={{ alignSelf: "flex-start" }}>
                <Pressable
                    style={{
                        borderRadius: 15,
                    }}
                    android_ripple={{
                        color: "rgba(255 255 255 / .5)",
                        borderless: true,
                    }}
                    onPress={() => router.back()}
                >
                    <Icon3 name="arrow-back" size={24} color={theme.primary} />
                </Pressable>
            </View>
            <Title name={"Spending Log"} />
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexGrow: 1,
                }}
            >
                <View style={{ gap: 10 }}>
                    {expenses || !isLoading ? (
                        expenses?.map((expense) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    width: "100%",
                                    alignItems: "center",
                                }}
                                key={expense.id}
                            >
                                <Item
                                    data={{
                                        id: expense.id,
                                        name: expense.name,
                                        date: new Date(expense.upload_date),
                                        price: expense.amount,
                                    }}
                                />
                                <Pressable
                                    android_ripple={{
                                        color: "#F07C7C88",
                                        borderless: true,
                                    }}
                                    onPress={() => deleteExpense(expense.id)}
                                >
                                    <Icon2 name="trash-can-outline" size={30} color="#F07C7C" />
                                </Pressable>
                            </View>
                        ))
                    ) : (
                        <ActivityIndicator color={theme.primary} animating={true} size="large" />
                    )}
                </View>
            </ScrollView>
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
        </SafeAreaView>
    );
}
