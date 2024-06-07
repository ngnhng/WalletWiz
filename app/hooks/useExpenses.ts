import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

import { StateContext } from "../_layout";
import type { Expense } from "../types";

export default function useExpenses(isFocus: boolean) {
    const [expenses, setExpenses] = useState<Expense[]>();
    const { state } = useContext(StateContext);

    // biome-ignore lint/correctness/useExhaustiveDependencies: Needed for reloading
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;

                const res = await fetch("https://walletwiz-api-fsummwvcba-uc.a.run.app/v1/expenses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text);
                }
    
                const json = await res.json();
                // console.log(json);
                setExpenses(json.map((expense) => {
                    return {
                        ...expense,
                        amount: Number.parseFloat(expense.amount)
                    }
                }));
            } catch (error) {
                console.error(error);
                ToastAndroid.show("Cannot retrieve user expenses!", ToastAndroid.LONG);
            }

        };

        fetchExpenses();
    }, [state.update, state.token]);

    return expenses;
}
