import { AuthProvider } from '@/context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import './global.css'
import { SafeAreaView, StatusBar } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SafeAreaView style={{ flex: 1 }} className="bg-background">
                    <Slot />
                    <StatusBar barStyle='dark-content' />
                </SafeAreaView>
            </AuthProvider>
        </QueryClientProvider>
    );
}