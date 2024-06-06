import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import { ToastAndroid } from "react-native";
import useTheme from "./hooks/useTheme";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateContext } from "./_layout";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();

    const { dispatch } = useContext(StateContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postLogin = async () => {
        if (email === "") {
            ToastAndroid.show("Email cannot be empty!", ToastAndroid.LONG);
            return;
        }

        if (password === "") {
            ToastAndroid.show("Password cannot be empty!", ToastAndroid.LONG);
            return;
        }

        const res = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/auth/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.trim(),
                password: password.trim(),
            }),
        });

        if (!res.ok) {
            ToastAndroid.show("An error occurred while trying to login!", ToastAndroid.LONG);
            return;
        }

        const json = await res.json();
        console.log(json);
        await AsyncStorage.setItem("token", json.access_token);
        dispatch({
            type: ACTIONS.SET_TOKEN,
            payload: json.access_token
        })

        return router.navigate("/home");
    };

    return (
        <SafeAreaView
            style={{ flexGrow: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center", gap: 10, padding: 20 }}
        >
            <Text variant="displayLarge" style={{ fontWeight: "800" }}>
                WalletWiz
            </Text>
            <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                    width: "100%",
                }}
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{
                    width: "100%",
                }}
                secureTextEntry={true}
            />
            <Button
                mode="contained"
                style={{ width: "100%" }}
                rippleColor={theme.primary}
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => postLogin()}
            >
                Login
            </Button>
            <Button
                mode="outlined"
                style={{ width: "100%" }}
                rippleColor={theme.primary}
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => router.navigate("/signup")}
            >
                Sign Up
            </Button>
        </SafeAreaView>
    );
}
