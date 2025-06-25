import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { H4 } from "@/components/ui/typography";
import api from "@/constants/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, CircleXIcon } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Contact() {
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const disabled = phoneNumber.trim() === ''

    const mutation = useMutation({
        mutationFn: async () => {
            if (phoneNumber.trim() === '') throw new Error();

            await api.post('/me/contacts', {
                nickname: name.trim() !== '' ? name : undefined,
                phoneNumber
            })

            queryClient.invalidateQueries({ queryKey: ['contacts'] })
        },
        onSuccess: () => router.back(),
        onError: () => setError(true),
        onMutate: () => setError(false)
    })

    return <View style={{ flex: 1 }} className="bg-white w-full flex-col gap-8">
        {error && (
            <Alert variant="destructive" icon={CircleXIcon}>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                    Une erreur est survenue lors de l'ajout du contact. Veuillez réessayer.
                </AlertDescription>
            </Alert>
        )}
        <View className="flex flex-row items-center">
            <TouchableOpacity className="p-2 pr-8" onPress={() => router.back()}>
                <ArrowLeftIcon size={24} />
            </TouchableOpacity>
            <H4 className="text-black">Ajouter un contact</H4>
        </View>
        <View className="flex flex-col gap-4">
            <Label className='text-2xl'>Nom du contact (optionnel)</Label>
            <Input onChangeText={setName} placeholder="Mimi" />
        </View>
        <View className="flex flex-col gap-4">
            <Label className='text-2xl'>Numéro de téléphone</Label>
            <Input onChangeText={setPhoneNumber} placeholder="+33 6 12 34 56 78" />
        </View>
        <LoadingButton disabled={disabled} loading={mutation.isPending} onPress={() => mutation.mutate()}>
            <Text>Ajouter le contact</Text>
        </LoadingButton>
    </View>
}