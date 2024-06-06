import React, { useMemo, useReducer, createContext, useEffect } from "react";
import { Stack } from "expo-router/stack";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", enGB);

import { ACTIONS, type State } from "./types";

export const unstable_settings = {
    initialRouteName: "",
};

type Context = {
    state: State;
    dispatch: (action: {
        type: ACTIONS,
        payload: unknown
    }) => void;
};

export const StateContext = createContext<Context>({
    state: {
        pending: []
    },
    dispatch: () => {}
});

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.ADD_SPENDING: {
            return { ...state, pending: [...state.pending, action.payload] };
        }
        case ACTIONS.EDIT_SPENDING: {
            state.pending[action.payload.idx] = action.payload.data;
            return { ...state };
        }
        default:
            return { ...state };
    }
};

export default function Layout() {
    const [state, dispatch] = useReducer(reducer, {
        pending: [],
    });

    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });

    const paperTheme = useMemo(
        () => (colorScheme === "dark" ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }),
        [colorScheme, theme]
    );

    return (
        <StateContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            <PaperProvider theme={paperTheme}>
                <Stack
                    initialRouteName=""
                    screenOptions={{
                        headerShown: false,
                        animation: "ios",
                    }}
                />
            </PaperProvider>
        </StateContext.Provider>
    );
}
