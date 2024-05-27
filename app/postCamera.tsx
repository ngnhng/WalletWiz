import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button } from "react-native-paper";
import { SegmentedButtons } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";

import useTheme from "./hooks/useTheme";
import Item from "./components/item";

export default function Page() {
    const theme = useTheme();

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: theme.background,
                    padding: 20,
                }}
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 20,
                    flexGrow: 1,
                }}
            >
                <StatusBar backgroundColor={theme.background} style="light" />
                <View style={{ alignSelf: "flex-start" }}>
                    <Pressable
                        style={{
                            borderRadius: 15,
                        }}
                        android_ripple={{
                            color: "rgba(255 255 255 / .5)",
                            borderless: true,
                        }}
                    >
                        <Icon3 name="arrow-back" size={24} color={theme.primary} />
                    </Pressable>
                </View>
                <View
                    style={{
                        flex: 1,
                        width: "100%",
                    }}
                >
                    <View style={{ width: "100%" }}>
                        <Item
                            data={{
                                name: "Lays Classic",
                                date: "Mar 24, 2024",
                                price: "28,000",
                            }}
                        />
                    </View>
                </View>
                <Button
                    mode="outlined"
                    style={{ width: "100%" }}
                    rippleColor={theme.primary}
                    icon={"plus"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => console.log("Pressed")}
                >
                    Add
                </Button>
                <Button
                    mode="contained"
                    style={{ width: "100%" }}
                    textColor="#610606"
                    rippleColor={theme.primary}
                    icon={"check-all"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => console.log("Pressed")}
                >
                    Confirm
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}
