import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import WalletWizIcon from "../../assets/WalletWizIcon.svg";

export default function Page() {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <WalletWizIcon width={200} height={200} />
                <Text style={styles.text}>WalletWiz</Text>
            </View>
            <Link replace href="/onboarding/easy" style={styles.buttonLink}>
                Let's go!
            </Link>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111318",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        padding: 20,
    },
    innerContainer: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        height: "auto",
    },
    buttonLink: {
        width: "100%",
        padding: 10,
        backgroundColor: "#AAC7FF",
        color: "#111318",
        textAlign: "center",
        fontWeight: "bold",
        borderRadius: 30,
    },
    text: {
        color: "#AAC7FF",
        fontWeight: "800",
        fontSize: 30,
    },
});
