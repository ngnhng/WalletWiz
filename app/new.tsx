import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button, Portal, Dialog, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

import useTheme from "./hooks/useTheme";
import Item from "./components/item";

import { StateContext } from "./_layout";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();
    const { state, dispatch } = useContext(StateContext);

    const [showDialog, setShowDialog] = useState(false);
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const [isNewSpending, setNewSpending] = useState(false);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        return () => {
            dispatch({
                type: ACTIONS.CLEAR_SPENDING,
                payload: {}
            });
        };
    }, [dispatch]);

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
                        <View style={{ width: "100%" }} key={`${spending.name}-${idx}`}>
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
                    onPress={() => console.log("Pressed")}
                >
                    Confirm
                </Button>
            </ScrollView>
            <Portal>
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
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={{
                                width: "100%",
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Spending Price"
                            value={(Number.isNaN(price) ? "" : price).toString()}
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
