import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import useTheme from "./hooks/useTheme";

export default function Page() {
    const theme = useTheme();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
                onPress={() => console.log("Pressed")}
            >
                Sign Up
            </Button>
            <Button
                mode="outlined"
                style={{ width: "100%" }}
                rippleColor={theme.primary}
                icon="chevron-left"
                labelStyle={{ fontWeight: "bold" }}
                onPress={() => console.log("Pressed")}
            >
                Back to Login
            </Button>
        </SafeAreaView>
    );
}
