import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { TextInput, Portal, ActivityIndicator } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateContext } from "../_layout";

import Title from "../components/title";
import useTheme from "../hooks/useTheme";
import { ACTIONS } from "../types";

export default function Page() {
    const theme = useTheme();
    const { id } = useLocalSearchParams();

    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());

    const [isLoading, setIsLoading] = useState(true);
    const { dispatch } = useContext(StateContext);

    useEffect(() => {
        const getExpense = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text);
                }

                const json = await res.json();
                // console.log(json);

                setName(json.name);
                setPrice(Number.parseFloat(json.amount));
                setDate(new Date(json.upload_date));
            } catch (error) {
                console.error(error);
                ToastAndroid.show("Cannot get expense details", ToastAndroid.LONG);
            } finally {
                setIsLoading(false);
            }
        };

        getExpense();
    }, [id]);

    const updateExpense = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id,
                    name,
                    category_id: "0",
                    amount: price,
                    upload_date: date?.toLocaleDateString("en-US"),
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            dispatch({
                type: ACTIONS.REQUEST_UPDATE,
                payload: "",
            });
            router.back();
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot update expense", ToastAndroid.LONG);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteExpense = async () => {
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
            }}
        >
            {!isLoading ? (
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
                    <Title name={"Edit Spending"} />
                    <View
                        style={{
                            gap: 10,
                            width: "100%",
                        }}
                    >
                        <TextInput
                            mode="outlined"
                            label="Spending Name"
                            defaultValue={name}
                            onEndEditing={(event) => setName(event.nativeEvent.text)}
                            style={{
                                width: "100%",
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Spending Price"
                            defaultValue={(Number.isNaN(price) ? 0 : price).toString()}
                            onEndEditing={(event) => setPrice(Number.parseFloat(event.nativeEvent.text) ?? 0)}
                            style={{
                                width: "100%",
                            }}
                            keyboardType="number-pad"
                        />
                        <DatePickerInput
                            locale="en"
                            label="Date"
                            value={date}
                            onChange={(d) => {
                                setDate(d ?? new Date());
                                // console.log(d);
                            }}
                            inputMode="start"
                            mode="outlined"
                        />
                    </View>
                    <Button
                        mode="contained"
                        style={{ width: "100%" }}
                        rippleColor={theme.primary}
                        icon={"bookmark"}
                        labelStyle={{ fontWeight: "bold" }}
                        onPress={() => updateExpense()}
                    >
                        Save
                    </Button>
                    <Button
                        mode="contained"
                        style={{ width: "100%", backgroundColor: "#F43C73" }}
                        textColor="#610606"
                        rippleColor={"#F43C73"}
                        icon={"trash-can-outline"}
                        labelStyle={{ fontWeight: "bold" }}
                        onPress={() => deleteExpense()}
                    >
                        Delete Spending
                    </Button>
                </ScrollView>
            ) : (
                <ActivityIndicator
                    color={theme.primary}
                    animating={true}
                    size="large"
                    style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
                />
            )}
        </SafeAreaView>
    );
}
