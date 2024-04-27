import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user-slice";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "user_state",
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        users: persistedReducer,
    },
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { users: UsersState}
export type AppDispatch = typeof store.dispatch;
