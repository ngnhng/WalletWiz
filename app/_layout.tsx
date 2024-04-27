import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { Provider } from "react-redux";
import { Slot } from "expo-router";
import React from "react";

export default function BaseLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Slot />
            </PersistGate>
        </Provider>
    );
}
