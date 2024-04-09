import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { ShieldCheck } from "lucide-react-native";

export default function Page() {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <ShieldCheck size={48} color="#AAC7FF" />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Don't be afraid</Text>
                    <Text style={styles.smallText}>We ensure your data privacy. No one really wants their data to be leaked right?</Text>
                </View>
            </View>
            <View style={styles.navContainer}>
                <Link replace href="/home" style={styles.buttonLink}>
                    Welcome to WalletWiz!
                </Link>
            </View>
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
    navContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
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
    backLink: {
        color: "#AAC7FF",
        fontWeight: "600",
        textAlign: "center",
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    text: {
        color: "#AAC7FF",
        fontWeight: "800",
        fontSize: 30,
    },
    smallText: {
        color: "#AAC7FF",
        fontWeight: "400",
        fontSize: 12,
        textAlign: "center",
        paddingHorizontal: 30,
    },
});
