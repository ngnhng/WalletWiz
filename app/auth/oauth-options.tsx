import { StyleSheet, View, Text, Pressable } from "react-native";
import { useAppSelector } from "../../hooks/hooks";
import React from "react";
import { useGitHubOAuth } from "./github";

export default function Page() {
    const user = useAppSelector((state) => state.users);

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>Sign In</Text>
            </View>
            <View style={styles.navContainer}>{GithubOauthButton()}</View>
        </View>
    );
}

const GithubOauthButton = () => {
    const { request, promptAsync } = useGitHubOAuth();
    return (
        <Pressable
            disabled={!request}
            style={styles.githubBtn}
            onPress={() => {
                promptAsync();
            }}
        >
            <Text style={styles.text}>Sign in with Github</Text>
        </Pressable>
    );
};

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
    githubBtn: {
        backgroundColor: "#000000",
        color: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        maxHeight: 50,
    },
});
