import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types";

const initialData: User = {
    isLoggedIn: false,
    isOnboarded: false,
    email: undefined,
    username: undefined,
    avatar: undefined,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialData,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.isOnboarded = action.payload.isOnboarded;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.avatar = action.payload.avatar;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.isOnboarded = false;
            state.email = undefined;
            state.username = undefined;
            state.avatar = undefined;
        },
        completeOnboarding: (state) => {
            state.isOnboarded = true;
        },
    },
});

export const { login, logout, completeOnboarding } = userSlice.actions;

export default userSlice.reducer;
