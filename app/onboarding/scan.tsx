import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { ScanEye } from "lucide-react-native";

export default function Page() {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <ScanEye size={48} color="#AAC7FF" />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Scan directly</Text>
                    <Text style={styles.smallText}>
                        Lazy to input the data yourself?
                        {"\n"}
                        No worries! Just give the app a scan.
                    </Text>
                </View>
            </View>
            <View style={styles.navContainer}>
                <Link
                    replace
                    href="/onboarding/secure"
                    style={styles.buttonLink}
                >
                    Next
                </Link>
                <Link replace href="/home" style={styles.backLink}>
                    Take me to the app! NOW!
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
