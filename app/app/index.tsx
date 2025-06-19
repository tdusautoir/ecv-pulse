import { View, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function Index() {
    return (
        <View>
            <Text style={{ color: 'white' }}>Pulse !</Text>
            <StatusBar style="auto" />
        </View>
    );
}   