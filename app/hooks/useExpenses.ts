import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

import { StateContext } from "../_layout";
import type { Expense } from "../types";

export default function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const { state } = useContext(StateContext);

    useEffect(() => {
        const fetchExpenses = async () => {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses/user/${state.userInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                ToastAndroid.show("Cannot retrieve user expenses!", ToastAndroid.LONG);
                return;
            }

            const json = await res.json();
            setExpenses(json);
        };
    }, [state.userInfo.id]);

    return expenses;
}
