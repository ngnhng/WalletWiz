import { useEffect, useState } from "react";
import { ONBOARD_TYPE } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useOnboarded() {
    const [isOnboarded, setOnboarded] = useState<ONBOARD_TYPE>(ONBOARD_TYPE.WAITING);

    useEffect(() => {
        const readLocalStorage = async () => {
            const value = await AsyncStorage.getItem('isOnboarded');
            if (!value) {
                setOnboarded(ONBOARD_TYPE.BLANK);
                return;
            }

            setOnboarded(ONBOARD_TYPE.SKIPPED);
        };

        readLocalStorage();
    }, []);

    return isOnboarded;
}