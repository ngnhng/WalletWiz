import React from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";
import useOnboarded from "./hooks/useOnboarded";
import { ONBOARD_TYPE } from "./types";

export default function Page({ navigation }) {
    const isOnboarded = useOnboarded();

    const getReturn = () => {
        if (isOnboarded === ONBOARD_TYPE.SKIPPED) return <Redirect href={"/home"} />;
        if (isOnboarded === ONBOARD_TYPE.BLANK) return <Redirect href={"/onboarding/welcome"} />;
        return <View></View>;
    };

    return getReturn();
}
