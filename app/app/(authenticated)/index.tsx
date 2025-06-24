import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, P } from "@/components/ui/typography";
import { useAuth } from "@/context/auth-context";
import { ScrollView, View } from "react-native";

export default function Dashboard() {
    const { logout } = useAuth()

    return (<ScrollView style={{ flex: 1 }} className="bg-background">
        <View className="flex flex-col gap-8 items-center p-8">
            <Logo />
            <View className="flex-col gap-4 items-center">
                <H1>Connecté</H1>
            </View>
            <Button onPress={() => logout()}>
                <Text className="">Deconnexion</Text>
            </Button>
        </View>
    </ScrollView>
    )
}