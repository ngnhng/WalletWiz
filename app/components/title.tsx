import React from "react";
import { Text } from "react-native";
import useTheme from "../hooks/useTheme";

export default function Title({ name }) {
    const theme = useTheme();
    
    return <Text style={{
        fontSize: 36,
        fontWeight: "800",
        width: "100%",
        color: theme.primary
    }}>{name}</Text>
}