import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import apiClient from "@/constants/api-client";
import { TOKEN_KEY } from "@/constants/auth";

type User = {
    id: number;
    fullName: string | null;
    email: string;
    phoneNumber: string;
    balance: number;
    level: number;
    xp: number;
    avatarUrl: string;
}

type RegisterPayload = {
    email: string;
    password: string;
    phoneNumber: string;
    fullName: string;
}

type AuthProps = {
    user: User | null;
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        try {
            const response = await apiClient.get('/me');
            setUser(response.data);
        } catch (error) {
            await logout()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/login', {
                email,
                password,
            });

            const { value } = response.data;
            await SecureStore.setItemAsync(TOKEN_KEY, value);
            await loadUser();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: AuthProps['register']['arguments']) => {
        try {
            await apiClient.post('/register', userData);
            await login(userData.email, userData.password);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY)
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value: AuthProps = {
        user,
        isLoading,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}