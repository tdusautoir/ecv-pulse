import { useAuth } from "@/context/auth-context";
import { Redirect, Tabs } from "expo-router";
import TabBar from "../../../components/tab-bar";
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
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']} className="bg-background">
            <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Accueil',
                    }}
                />
                <Tabs.Screen
                    name="budget"
                    options={{
                        title: 'Budget',
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}