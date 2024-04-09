import React from "react";
import { StyleSheet } from "react-native";
import { Redirect } from "expo-router";

export default function Page() {
    return <Redirect href="/onboarding/welcome" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111318",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 20,
    },
});
