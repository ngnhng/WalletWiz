import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { router } from "expo-router";

import Title from "./components/title";
import useTheme from "./hooks/useTheme";

export default function Page() {
    const theme = useTheme();

    const [name, setName] = useState<string>();
    const [price, setPrice] = useState<number>(0);
    const [date, setDate] = useState<Date>();

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
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
                        onPress={() => router.back()}
                    >
                        <Icon3 name="arrow-back" size={24} color={theme.primary} />
                    </Pressable>
                </View>
                <Title name={"Edit Spending"} />
                <View
                    style={{
                        gap: 10,
                        width: "100%",
                    }}
                >
                    <TextInput
                        mode="outlined"
                        label="Spending Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Spending Price"
                        value={(Number.isNaN(price) ? "" : price).toString()}
                        onChangeText={(text) => setPrice(Number.parseFloat(text) ?? 0)}
                        style={{
                            width: "100%",
                        }}
                        keyboardType="number-pad"
                    />
                    <DatePickerInput
                        locale="en"
                        label="Date"
                        value={date}
                        onChange={(d) => {
                            setDate(d);
                            console.log(d);
                        }}
                        inputMode="start"
                        mode="outlined"
                    />
                </View>
                <Button
                    mode="contained"
                    style={{ width: "100%" }}
                    rippleColor={theme.primary}
                    icon={"bookmark"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => console.log("Pressed")}
                >
                    Save
                </Button>
                <Button
                    mode="contained"
                    style={{ width: "100%", backgroundColor: "#F43C73" }}
                    textColor="#610606"
                    rippleColor={"#F43C73"}
                    icon={"trash-can-outline"}
                    labelStyle={{ fontWeight: "bold" }}
                    onPress={() => console.log("Pressed")}
                >
                    Delete Spending
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}
