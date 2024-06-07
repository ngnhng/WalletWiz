import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Portal, Dialog, Text, TextInput, ActivityIndicator } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

import useTheme from "./hooks/useTheme";
import Item from "./components/item";

import { StateContext } from "./_layout";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();
    const { state, dispatch } = useContext(StateContext);

    const [showDialog, setShowDialog] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const [isNewSpending, setNewSpending] = useState(false);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        return () => {
            dispatch({
                type: ACTIONS.CLEAR_SPENDING,
                payload: {},
            });
        };
    }, [dispatch]);

    const postSpending = async () => {
        try {
            setShowLoading(true);

            const token = await AsyncStorage.getItem("token");
            const res = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    expenses: state.pending.map((expense) => {
                        return {
                            name: expense.name,
                            category_id: "0",
                            amount: expense.price,
                            upload_date: expense.date.toLocaleDateString("en-US"),
                        };
                    }),
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            ToastAndroid.show("Update spendings completed!", ToastAndroid.LONG);
            dispatch({
                type: ACTIONS.CLEAR_SPENDING,
                payload: {},
            });
            dispatch({
                type: ACTIONS.REQUEST_UPDATE,
                payload: ""
            })
            router.navigate("/home");
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot update spendings!", ToastAndroid.LONG);
        } finally {
            setShowLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    padding: 20,
                }}
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 20,
                    flexGrow: 1,
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
                <Button
                    mode="outlined"
                    style={{ width: "100%" }}
                    rippleColor={theme.primary}
                    icon={"camera-plus"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => router.navigate("/camera")}
                >
                    Import from Camera
                </Button>
                <View
                    style={{
                        flex: 1,
                        width: "100%",
                        gap: 10,
                    }}
                >
                    {state.pending.map((spending, idx) => (
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                                width: "100%",
                                alignItems: "center",
                            }}
                            key={`${spending.name}-${idx}`}
                        >
                            <Item
                                data={{
                                    name: spending.name,
                                    date: spending.date,
                                    price: spending.price,
                                }}
                                onPress={() => {
                                    setName(spending.name);
                                    setPrice(spending.price);
                                    setNewSpending(false);
                                    setShowDialog(true);
                                    setIdx(idx);
                                }}
                            />
                            <Pressable
                                android_ripple={{
                                    color: "#F07C7C88",
                                    borderless: true,
                                }}
                                onPress={() => {
                                    dispatch({
                                        type: ACTIONS.REMOVE_SPENDING,
                                        payload: idx
                                    })
                                }}
                            >
                                <Icon2 name="trash-can-outline" size={30} color="#F07C7C" />
                            </Pressable>
                        </View>
                    ))}
                </View>
                <Button
                    mode="outlined"
                    style={{ width: "100%" }}
                    rippleColor={theme.primary}
                    icon={"plus"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => {
                        setName("");
                        setPrice(0);
                        setNewSpending(true);
                        setShowDialog(true);
                    }}
                >
                    Add
                </Button>
                <Button
                    mode="contained"
                    style={{ width: "100%" }}
                    textColor="#610606"
                    rippleColor={theme.primary}
                    icon={"check-all"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => postSpending()}
                    disabled={state.pending.length === 0}
                >
                    Confirm
                </Button>
            </ScrollView>
            <Portal>
                {showLoading ? (
                    <ActivityIndicator
                        color={theme.primary}
                        animating={true}
                        size="large"
                        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "rgba(0, 0, 0, .5)" }}
                    />
                ) : (
                    ""
                )}
                <Dialog
                    visible={showDialog}
                    dismissable={true}
                    onDismiss={() => {
                        setName("");
                        setPrice(0);
                        setNewSpending(false);
                        setShowDialog(false);
                    }}
                >
                    <Dialog.Title>Add spending</Dialog.Title>
                    <Dialog.Content style={{ gap: 10 }}>
                        <TextInput
                            mode="outlined"
                            label="Spending Name"
                            defaultValue={name}
                            onChangeText={(text) => setName(text)}
                            style={{
                                width: "100%",
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Spending Price"
                            defaultValue={(Number.isNaN(price) ? "" : price).toString()}
                            onChangeText={(text) => setPrice(Number.parseFloat(text) ?? 0)}
                            style={{
                                width: "100%",
                            }}
                            keyboardType="number-pad"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                if (isNewSpending) {
                                    dispatch({
                                        type: ACTIONS.ADD_SPENDING,
                                        payload: {
                                            name,
                                            price,
                                            date: new Date(),
                                        },
                                    });
                                } else {
                                    dispatch({
                                        type: ACTIONS.EDIT_SPENDING,
                                        payload: {
                                            idx,
                                            data: {
                                                name,
                                                price,
                                                date: state.pending[idx].date,
                                            },
                                        },
                                    });
                                }

                                setName("");
                                setPrice(0);

                                setNewSpending(false);
                                setShowDialog(false);
                            }}
                        >
                            Done
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
}
