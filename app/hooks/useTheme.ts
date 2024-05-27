import { useColorScheme } from "react-native";
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';

export default function useTheme() {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme({ fallbackSourceColor: '#3E8260' });

    return theme[colorScheme];
}