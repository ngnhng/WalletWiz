import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Redirect } from "expo-router";
import { store, persistor } from "../store/store";
import { useAppSelector } from "../hooks/hooks";

export default function Page() {
    return <RedirectOnboarding />;
}

const RedirectOnboarding = () => {
    const isOnboarded = useAppSelector((state) => state.users.isOnboarded);

    return isOnboarded ? (
        <Redirect href="/home" />
    ) : (
        <Redirect href="/onboarding/welcome" />
    );
};

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
