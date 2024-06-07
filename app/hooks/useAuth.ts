import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { ACTIONS, TOKEN_STATE } from "../types";

import { StateContext } from "../_layout";

export default function useAuth(isFocus: boolean) {
    const [tokenState, setTokenState] = useState(TOKEN_STATE.LOADING);
    const { state, dispatch } = useContext(StateContext);

    // biome-ignore lint/correctness/useExhaustiveDependencies: Needed for reloading
    useEffect(() => {
        // console.log("Alo")
        const readLocalStorage = async () => {
            const value = await AsyncStorage.getItem("token");

            if (!value) {
                setTokenState(TOKEN_STATE.NULL);
                return;
            }

            // console.log(value);

            // const res = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/auth/token/refresh", {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${value}`,
            //     },
            // });

            // const json = await res.json();
            // console.log(json);

            // if (!json.token) {
            //     await AsyncStorage.removeItem("token");
            //     setTokenState(TOKEN_STATE.NULL);
            //     return;
            // }

            // await AsyncStorage.setItem("token", json.token);

            const userRes = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${value}`,
                },
            });

            const userJson = await userRes.json();
            // console.log(userJson)
            dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: userJson,
            });

            setTokenState(TOKEN_STATE.AUTHORIZED);
        };

        readLocalStorage();
    }, [dispatch, state.token, isFocus]);

    return tokenState;
}
