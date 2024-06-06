import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, useRef } from "react";
import { ScrollView, StyleSheet, View, Pressable, ToastAndroid, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { FAB, Portal } from "react-native-paper";
import { SegmentedButtons, Text, ActivityIndicator } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera } from "react-native-vision-camera";
import { router } from "expo-router";

import useTheme from "./hooks/useTheme";

import { StateContext } from "./_layout";
import { ACTIONS } from "./types";

export default function Page() {
    const theme = useTheme();
    const camera = useRef<Camera>(null);
    const { dispatch } = useContext(StateContext);

    const [isLoading, setIsLoading] = useState(false);
    const [path, setPath] = useState("");

    const device = useCameraDevice("back");
    const { hasPermission } = useCameraPermission();
    const format = useCameraFormat(device, [{ photoResolution: { width: 720, height: 1280 } }]);

    if (!hasPermission) {
        Camera.requestCameraPermission();
        return (
            <SafeAreaView
                style={{
                    flexGrow: 1,
                    backgroundColor: theme.background,
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>Please allow Camera permission</Text>
            </SafeAreaView>
        );
    }

    if (!device)
        return (
            <SafeAreaView
                style={{
                    flexGrow: 1,
                    backgroundColor: theme.background,
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>No device</Text>
            </SafeAreaView>
        );

    const takePhoto = async () => {
        setIsLoading(true);
        try {
            if (!camera.current) return;

            const file = await camera.current.takePhoto();
            const result = await fetch(`file://${file.path}`);
            const data = await result.blob();
            // console.log(file.path);
            setPath(file.path);

            // const discordRes = await fetch("https://fukutotojido.s-ul.eu/8l5Pb3Tz");
            // const data = await discordRes.blob();

            const convertBlobToBase64 = (blob: Blob) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onerror = reject;
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(blob);
                });

            const base64 = await convertBlobToBase64(data);
            console.log((base64 as string).slice(0, 500));

            const res = await fetch("http://localhost:8080/ocr?lang=vie&format=googleai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: (base64 as string).replace("data:application/octet-stream;", "data:image/jpeg;"),
                }),
            });

            if (!res.ok) {
                const json = await res.text();
                console.log(json);

                ToastAndroid.show("An error occured", ToastAndroid.LONG);
                return;
            }

            const json = await res.json();
            console.log(json);

            dispatch({
                type: ACTIONS.ADD_MULTIPLE_SPENDINGS,
                payload: json.result.map((expense: {
                    item: string,
                    price: string | null
                }) => {
                    return {
                        name: expense.item,
                        price: Number.parseFloat((expense.price ?? "0").replace(/,/g, "")),
                        date: new Date()
                    }
                })
            })

            router.navigate("/new");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
            }}
        >
            <View
                style={{
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: 40,
                }}
            >
                <Camera style={StyleSheet.absoluteFill} ref={camera} device={device} isActive={true} photo={true} format={format} orientation="portrait"/>
                <FAB
                    style={{
                        aspectRatio: "1 / 1",
                        width: 80,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 50,
                        // position: "absolute"
                    }}
                    icon="camera"
                    variant="secondary"
                    onPress={() => takePhoto()}
                />
                {isLoading && path !== "" ? (
                    <>
                        <Image
                            source={{ uri: `file://${path}` }}
                            style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, resizeMode: "cover" }}
                        />
                        <ActivityIndicator
                            color={theme.primary}
                            animating={true}
                            size="large"
                            style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "rgba(0, 0, 0, .5)" }}
                        />
                    </>
                ) : (
                    ""
                )}
            </View>
        </SafeAreaView>
    );
}
