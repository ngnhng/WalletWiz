import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import useTheme from "../hooks/useTheme";
import { router } from "expo-router";

export default function Item({ data, onPress }: { data: { name: string; date: Date; price: number, id?: string }; onPress?: () => void }) {
    const theme = useTheme();
    const { name, date, price } = data;
    return (
        <View
            style={{
                borderRadius: 4,
                overflow: "hidden",
                flex: 1,
            }}
        >
            <Pressable
                style={{ ...styles.item, backgroundColor: theme.onSecondary }}
                android_ripple={{
                    color: "rgba(255 255 255 / .5)",
                }}
                onPress={onPress ?? (() => router.navigate(`/edit/${data.id}`))}
            >
                <View style={styles.info}>
                    <Text style={{ fontWeight: "700" }} variant="labelLarge">
                        {name}
                    </Text>
                    <Text variant="labelMedium">{date.toDateString()}</Text>
                </View>
                <Text style={{ fontWeight: "700", color: theme.secondary }} variant="titleMedium">
                    {price.toLocaleString()}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    info: {
        flex: 1,
    },
});
