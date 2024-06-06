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
    dispatch: (action: { type: ACTIONS; payload: unknown }) => void;
};

export const StateContext = createContext<Context>({
    state: {
        userInfo: {
            id: "",
            firstname: "",
            lastname: "",
            email: "",
            token_version: "",
            budget_limit: 0,
            budget_reset_day: 1,
            currency: "VND"
        },
        pending: [],
        token: "",
    },
    dispatch: () => {},
});

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.ADD_SPENDING: {
            return { ...state, pending: [...state.pending, action.payload] };
        }
        case ACTIONS.ADD_MULTIPLE_SPENDINGS: {
            return { ...state, pending: [...state.pending, ...action.payload] };
        }
        case ACTIONS.EDIT_SPENDING: {
            state.pending[action.payload.idx] = action.payload.data;
            return { ...state };
        }
        case ACTIONS.REMOVE_SPENDING: {
            return { ...state, pending: [...state.pending.slice(0, action.payload), ...state.pending.slice(action.payload + 1)] };
        }
        case ACTIONS.CLEAR_SPENDING: {
            return { ...state, pending: [] };
        }
        case ACTIONS.SET_USER_INFO: {
            return { ...state, userInfo: { ...action.payload, budget_limit: Number.parseFloat(action.payload.budget_limit) }};
        }
        case ACTIONS.SET_TOKEN: {
            return { ...state, token: action.payload };
        }
        default:
            return { ...state };
    }
};

export default function Layout() {
    const [state, dispatch] = useReducer(reducer, {
        userInfo: {
            id: "",
            firstname: "",
            lastname: "",
            email: "",
            token_version: "",
        },
        pending: [],
        token: "",
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
