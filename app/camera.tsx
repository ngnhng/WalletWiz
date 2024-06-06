import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, useRef } from "react";
import { ScrollView, StyleSheet, View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { FAB } from "react-native-paper";
import { SegmentedButtons, Text } from "react-native-paper";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera } from "react-native-vision-camera";
import { router } from "expo-router";

import useTheme from "./hooks/useTheme";
import Item from "./components/item";

export default function Page() {
    const theme = useTheme();
    const camera = useRef<Camera>(null);

    const device = useCameraDevice("back");
    const { hasPermission } = useCameraPermission();
    const format = useCameraFormat(device, [{ videoResolution: "max" }, { photoResolution: "max" }]);

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
        if (!camera.current) return;

        const file = await camera.current.takePhoto();
        const result = await fetch(`file://${file.path}`);
        const data = await result.blob();

        const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });

        const base64 = await convertBlobToBase64(data);
        console.log((base64 as string).slice(0, 100));

        const res = await fetch("https://asia-southeast1-savvy-theory-398708.cloudfunctions.net/ocr?lang=vie&format=googleai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image: base64
            })
        })

        if (!res.ok) {
            const json = await res.text();
            console.log(json)

            ToastAndroid.show("An error occured", ToastAndroid.LONG);
            return;
        }

        const json = await res.json();
        console.log(json)

        // router.navigate("/new");
    };

    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                backgroundColor: theme.background,
                padding: 40,
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <Camera style={StyleSheet.absoluteFill} ref={camera} device={device} isActive={true} photo={true} format={format} />
            <FAB
                style={{
                    aspectRatio: "1 / 1",
                    width: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                }}
                icon="camera"
                variant="secondary"
                onPress={() => takePhoto()}
            />
        </SafeAreaView>
    );
}
