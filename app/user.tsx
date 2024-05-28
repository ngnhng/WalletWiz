import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { TextInput, Text } from "react-native-paper";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";

import Title from "./components/title";
import useTheme from "./hooks/useTheme";

export default function Page() {
    const theme = useTheme();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [currency, setCurrency] = useState("");
    const [resetDay, setResetDay] = useState(1);
    const [limit, setLimit] = useState<number>();

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
                <Title name={"Settings"} />
                <View
                    style={{
                        gap: 10,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.primary, fontWeight: "800", alignSelf: "flex-start" }}>Users</Text>
                    <Pressable>
                        <View style={{ width: 90, height: 90, backgroundColor: theme.primary, borderRadius: 45 }} />
                    </Pressable>
                    <TextInput
                        mode="outlined"
                        label="Username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={{
                            width: "100%",
                        }}
                        secureTextEntry={true}
                    />
                    <TextInput
                        mode="outlined"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        style={{
                            width: "100%",
                        }}
                        secureTextEntry={true}
                    />
                    <Button
                        mode="contained"
                        style={{ width: "100%" }}
                        rippleColor={theme.primary}
                        icon={"bookmark"}
                        labelStyle={{ fontWeight: "bold" }}
                        onPress={() => console.log("Pressed")}
                    >
                        Save Changes
                    </Button>
                </View>
                <View
                    style={{
                        gap: 10,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: theme.primary, fontWeight: "800", alignSelf: "flex-start" }}>Spending</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Text variant="bodyLarge">Currency</Text>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputAndroid: {
                                    color: theme.primary,
                                    fontWeight: "700",
                                    borderWidth: 1,
                                    borderColor: theme.primary,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                                placeholder: {
                                    color: theme.outline,
                                    borderWidth: 1,
                                    borderColor: theme.outline,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                            }}
                            onValueChange={(value) => setCurrency(value)}
                            items={[
                                { label: "Football", value: "football" },
                                { label: "Baseball", value: "baseball" },
                                { label: "Hockey", value: "hockey" },
                            ]}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Text variant="bodyLarge">Day of reset</Text>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputAndroid: {
                                    color: theme.primary,
                                    fontWeight: "700",
                                    borderWidth: 1,
                                    borderColor: theme.primary,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                                placeholder: {
                                    color: theme.outline,
                                    borderWidth: 1,
                                    borderColor: theme.outline,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                },
                            }}
                            onValueChange={(value) => setResetDay(value)}
                            items={[
                                { label: "Football", value: "football" },
                                { label: "Baseball", value: "baseball" },
                                { label: "Hockey", value: "hockey" },
                            ]}
                        />
                    </View>
                    <TextInput
                        mode="outlined"
                        label="Spending Limit"
                        value={limit?.toString()}
                        onChangeText={(text) => setLimit(Number.parseFloat(text))}
                        style={{
                            width: "100%",
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
