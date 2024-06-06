import React, { useState } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import useTheme from "./hooks/useTheme";
import { router } from "expo-router";

export default function Page() {
    const theme = useTheme();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const postSignUp = async () => {
        if (username === "") {
            ToastAndroid.show("Username cannot be empty!", ToastAndroid.LONG);
            return;
        }

        if (email === "") {
            ToastAndroid.show("Email cannot be empty!", ToastAndroid.LONG);
            return;
        }

        if (password === "") {
            ToastAndroid.show("Password cannot be empty!", ToastAndroid.LONG);
            return;
        }

        if (password !== confirmPassword) {
            ToastAndroid.show("Password and Confirm Password mismatch!", ToastAndroid.LONG);
            return;
        }

        const res = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/auth/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: username,
                lastname: "temp",
                email: email,
                password: password,
            }),
        });

        if (!res.ok) {
            ToastAndroid.show("An error occurred while trying to sign up!", ToastAndroid.LONG);
            return;
        }

        const json = await res.json();
        await AsyncStorage.setItem("token", json.token);

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
                label="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={{
                    width: "100%",
                }}
            />
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
            <TextInput
                mode="outlined"
                label="Confirm Password"
                value={confirmPassword}
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
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => postSignUp()}
            >
                Sign Up
            </Button>
            <Button
                mode="outlined"
                style={{ width: "100%" }}
                rippleColor={theme.primary}
                icon="chevron-left"
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => router.back()}
            >
                Back to Login
            </Button>
        </SafeAreaView>
    );
}
