import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import "./global.css"
import { View } from "react-native";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold text-blue-500">
                Welcome to Nativewind!
            </Text>
            <Button size={'sm'} variant='default'><Text>Test RNR</Text></Button>
        </View>
    );
}