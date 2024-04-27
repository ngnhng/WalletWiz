import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Page() {
    return (
        <View style={styles.container}>
            <Text
                style={{
                    color: "white",
                }}
            >
                This is HOME
            </Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111318",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
    },
});
