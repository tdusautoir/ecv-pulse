import { LoadingButton } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { H1, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleXIcon } from "lucide-react-native";
import { useAuth } from "@/context/auth-context";
import { Link, useRouter } from "expo-router";

export default function Login() {
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setisSuccess] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useAuth();
    const router = useRouter();

    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            await login(email, password)
            router.replace('/(authenticated)')
        },
        onError: () => setIsError(true),
        onMutate: () => setIsError(false),
        onSuccess: () => setisSuccess(true)
    });

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-background">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <View className="flex flex-col gap-8 items-center p-8">
                        <Logo width={131} height={39} />
                        <View className="flex-col gap-4 items-center">
                            <H1>Bienvenue 👋</H1>
                            <P className="text-xl text-center px-5">Connecte-toi avec tes identifiants CIC pour accéder à ton espace Pulse</P>
                        </View>
                        <Card className="w-full flex-col gap-8">
                            {isError && (
                                <Alert icon={CircleXIcon} variant='destructive'>
                                    <AlertTitle>Connexion impossible</AlertTitle>
                                    <AlertDescription>
                                        Les informations saisies sont incorrectes. Veuillez vérifier votre email et votre mot de passe puis réessayer.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <View>
                                <Label className="mb-4 font-bold">Téléphone ou email</Label>
                                <Input onChangeText={setEmail} placeholder="ton.email@example.com" className="bg-white px-6 native:h-16 " />
                            </View>
                            <View>
                                <Label className="mb-4 font-bold">Password</Label>
                                <Input onChangeText={setPassword} secureTextEntry={true} placeholder="••••••••••" className="bg-white px-6 native:h-16" />
                            </View>
                            {isSuccess && (<Alert icon={CircleXIcon} variant='success'>
                                <AlertDescription>Connexion réussie</AlertDescription>
                            </Alert>)}
                            <LoadingButton size='lg' loading={isPending} onPress={() => mutate()} >
                                <Text className="font-bold">Se connecter</Text>
                            </LoadingButton>
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}