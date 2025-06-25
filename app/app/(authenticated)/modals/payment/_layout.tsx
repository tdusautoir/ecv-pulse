import { H3 } from "@/components/ui/typography";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
    return <View style={{ flex: 1 }} className="px-6 py-8 bg-white">
        <H3 className="mb-8">Envoyer de l'argent</H3>
        <Stack screenOptions={{ headerShown: false }} />
    </View>
}