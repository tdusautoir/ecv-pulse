import { useAuth } from "@/context/auth-context";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function LoggedInLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Redirect href='/sign-in' />
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-background">
            <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
    );
}