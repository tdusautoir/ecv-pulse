import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/typography";
import colors from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { Redirect, Stack, Tabs } from "expo-router";
import { HouseIcon, SendIcon } from "lucide-react-native";
import { StatusBar } from "react-native";
import TabBar from "../../components/tab-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoggedInLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Redirect href='/sign-in' />
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Accueil',
                    }}
                />
                <Tabs.Screen
                    name="payment"
                    options={{
                        title: 'Payer',
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}