import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { ActivityIndicator, Button, Portal } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { TextInput, Text } from "react-native-paper";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Title from "./components/title";
import useTheme from "./hooks/useTheme";
import { StateContext } from "./_layout";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();
    const { state, dispatch } = useContext(StateContext);

    const [isLoading, setIsLoading] = useState(false);

    const [username, setUsername] = useState(state.userInfo.firstname);
    const [email, setEmail] = useState(state.userInfo.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [currency, setCurrency] = useState(state.userInfo.currency ?? "VND");
    const [resetDay, setResetDay] = useState(state.userInfo.budget_reset_day ?? 1);
    const [limit, setLimit] = useState<number>(state.userInfo.budget_limit ?? 0);

    const checkSubmitChange = async () => {
        if ((username !== "" || email !== "") && password === "") {
            ToastAndroid.show("Please input your password to change information", ToastAndroid.LONG);
            return;
        }

        if (username === "" && email === "" && password !== "" && confirmPassword === "") {
            ToastAndroid.show("Please input your confirm password", ToastAndroid.LONG);
            return;
        }

        if ((username !== "" || email !== "") && password !== "" && confirmPassword !== "") {
            ToastAndroid.show("Change your password first!", ToastAndroid.LONG);
            return;
        }
    };

    const updateLimit = async (value: number) => {
        const preValue = limit;

        try {
            const token = await AsyncStorage.getItem("token");
            console.log(value, token, state.userInfo.id);

            setLimit(value);
            setIsLoading(true);


            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/${state.userInfo.id}/budgets`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    limit: value.toString(),
                    reset_day: resetDay,
                    currency,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const userRes = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userJson = await userRes.json();
            dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: userJson,
            });
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot update budget limit", ToastAndroid.LONG);
            setLimit(preValue);
        } finally {
            setIsLoading(false);
        }
    };

    const updateReset = async (value: number) => {
        const preValue = resetDay;

        try {
            const token = await AsyncStorage.getItem("token");

            setResetDay(value);
            setIsLoading(true);

            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/${state.userInfo.id}/budgets`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    limit,
                    reset_day: value,
                    currency,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const userRes = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userJson = await userRes.json();
            dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: userJson,
            });
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot update budget reset day", ToastAndroid.LONG);
            setResetDay(preValue);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCurrency = async (value: string) => {
        const preValue = currency;

        try {
            const token = await AsyncStorage.getItem("token");

            setCurrency(value);
            setIsLoading(true);

            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/${state.userInfo.id}/currency`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    limit,
                    reset_day: resetDay,
                    currency: value,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const userRes = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userJson = await userRes.json();
            dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: userJson,
            });
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Cannot update currency", ToastAndroid.LONG);
            setCurrency(preValue);
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
                <Title name={"Settings"} />
                <View
                    style={{
                        gap: 10,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.primary, fontWeight: "800", alignSelf: "flex-start" }}>Users</Text>
                    <TextInput
                        mode="outlined"
                        label="Username"
                        defaultValue={username}
                        onChangeText={(text) => setUsername(text)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Email"
                        defaultValue={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Password"
                        defaultValue={password}
                        onChangeText={(text) => setPassword(text)}
                        style={{
                            width: "100%",
                        }}
                        secureTextEntry={true}
                    />
                    <TextInput
                        mode="outlined"
                        label="Confirm Password"
                        defaultValue={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        style={{
                            width: "100%",
                        }}
                        secureTextEntry={true}
                    />
                    <Button
                        mode="contained"
                        style={{ width: "100%" }}
                        rippleColor={theme.primary}
                        icon={"bookmark"}
                        labelStyle={{ fontWeight: "bold" }}
                        onPress={() => console.log("Pressed")}
                    >
                        Save Changes
                    </Button>
                </View>
                <View
                    style={{
                        gap: 10,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.primary, fontWeight: "800", alignSelf: "flex-start" }}>Spending</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Text variant="bodyLarge">Currency</Text>
                        <RNPickerSelect
                            value={currency}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputAndroid: {
                                    color: theme.primary,
                                    fontWeight: "700",
                                    borderWidth: 1,
                                    borderColor: theme.primary,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                                placeholder: {
                                    color: theme.outline,
                                    borderWidth: 1,
                                    borderColor: theme.outline,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                            }}
                            onValueChange={(value) => updateCurrency(value)}
                            items={[
                                { label: "VND", value: "VND" },
                                { label: "USD", value: "USD" },
                                { label: "JPY", value: "JPY" },
                            ]}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Text variant="bodyLarge">Day of reset</Text>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            value={resetDay}
                            style={{
                                inputAndroid: {
                                    color: theme.primary,
                                    fontWeight: "700",
                                    borderWidth: 1,
                                    borderColor: theme.primary,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                                placeholder: {
                                    color: theme.outline,
                                    borderWidth: 1,
                                    borderColor: theme.outline,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                            }}
                            onValueChange={(value) => updateReset(value)}
                            items={[
                                ...Array(30)
                                    .fill(true)
                                    .map((_, idx) => {
                                        return {
                                            label: `${idx + 1}`,
                                            value: idx + 1,
                                        };
                                    }),
                            ]}
                        />
                    </View>
                    <TextInput
                        mode="outlined"
                        label="Spending Limit"
                        defaultValue={limit?.toString()}
                        onEndEditing={(event) => updateLimit(Number.parseFloat(event.nativeEvent.text))}
                        style={{
                            width: "100%",
                        }}
                    />
                </View>
                <Button
                    mode="contained"
                    style={{ width: "100%", backgroundColor: "#F43C73" }}
                    textColor="#610606"
                    rippleColor={"#F43C73"}
                    icon={"logout-variant"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={async () => {
                        await AsyncStorage.removeItem("token");
                        dispatch({
                            type: ACTIONS.SET_TOKEN,
                            payload: "",
                        });
                        router.navigate("/home");
                    }}
                >
                    Logout
                </Button>
                <Portal>
                    {isLoading ? (
                        <ActivityIndicator
                            color={theme.primary}
                            animating={true}
                            size="large"
                            style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "rgba(0, 0, 0, .5)" }}
                        />
                    ) : (
                        ""
                    )}
                </Portal>
            </ScrollView>
        </SafeAreaView>
    );
}
