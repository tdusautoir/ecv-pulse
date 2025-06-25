import { AuthProvider } from '@/context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import './global.css'
import { StatusBar } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Slot />
                <StatusBar barStyle='default' />
            </AuthProvider>
        </QueryClientProvider>
    );
}