import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H3, H4, P } from "@/components/ui/typography";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { TouchableOpacity, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/constants/api-client";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useRouter } from "expo-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleXIcon } from "lucide-react-native";
import { useAuth } from "@/context/auth-context";

export default function PaymentScreen() {
    const [amount, setAmount] = useState<string>('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const disabled = amount.trim() === '' || selectedContact === null;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { refetchUser } = useAuth();

    const contactsQuery = useQuery<{ data: Contact[] }>({
        queryKey: ['contacts'],
        queryFn: () => api.get('/me/contacts')
    })

    const handleAmountChange = (text: string) => {
        if (text.trim() === '') setAmount('')

        let cleanedValue = text.replace(/[^0-9.,]/g, '');

        // Replace comma with dot for standard float parsing
        cleanedValue = cleanedValue.replace(',', '.');

        // Only allow one dot
        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            cleanedValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (cleanedValue.trim() === '') {
            setAmount('');
            return;
        }

        const parsedValue = parseFloat(cleanedValue);
        if (!isNaN(parsedValue)) {
            setAmount(cleanedValue);
        }
    }

    const mutation = useMutation({
        mutationFn: async () => {
            if (!selectedContact || amount.trim() === '') throw new Error();

            await api.post('/me/transactions', {
                amount,
                message: message.trim() !== '' ? message : undefined,
                receiverId: selectedContact.id
            })
        },
        onSuccess: async () => {
            refetchUser();
            await new Promise(resolve => setTimeout(resolve, 600));
            await queryClient.refetchQueries({ queryKey: ['profile'] })
            router.back()
        },
        onError: () => setError(true),
        onMutate: () => setError(false)
    })

    return (
        <View style={{ flex: 1 }} className="bg-white flex flex-col gap-8">
            {error && (
                <Alert variant="destructive" icon={CircleXIcon}>
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Une erreur est survenue lors de l'envoi du paiement. Veuillez réessayer.
                    </AlertDescription>
                </Alert>
            )}
            <View className="mx-auto flex flex-col gap-4 items-center p-10">
                <Input
                    keyboardType="numeric"
                    onChangeText={handleAmountChange}
                    returnKeyType='done'
                    value={amount}
                    style={{ fontSize: 64, height: 64 }}
                    className="bg-transparent border-0 placeholder:text-gray-400 font-light"
                    placeholderClassName="text-gray-400 font-light"
                    placeholder="20" />
                <P className="text-5xl text-gray-400 font-light">€</P>
            </View>
            <View className="flex flex-row gap-4">
                <Button onPress={() => setAmount('5')} variant='outline' className="rounded-full bg-white flex-1"><Text>5€</Text></Button>
                <Button onPress={() => setAmount('10')} variant='outline' className="rounded-full bg-white flex-1"><Text>10€</Text></Button>
                <Button onPress={() => setAmount('20')} variant='outline' className="rounded-full bg-white flex-1"><Text>20€</Text></Button>
                <Button onPress={() => setAmount('50')} variant='outline' className="rounded-full bg-white flex-1"><Text>50€</Text></Button>
            </View>
            <View className="flex flex-col gap-4">
                <Label className="text-2xl">Contact récents</Label>
                {contactsQuery.data && (
                    <View className="flex flex-row gap-4 flex-wrap">
                        {contactsQuery.data.data.slice(0, 4).map((contact) => <Button
                            key={contact.id}
                            variant='outline'
                            onPress={() => {
                                setSelectedContact((old) => {
                                    if (old && old.id === contact.id) return null
                                    return contact
                                })
                            }}
                            className={cn("bg-muted text-muted-foreground border-0", contact.id === selectedContact?.id && 'bg-primary')}>
                            <Text className={cn(contact.id === selectedContact?.id && 'text-white')}>{contact.nickname ?? contact.fullName?.split(' ')[0] ?? contact.phoneNumber}</Text></Button>
                        )}
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => router.push('/(authenticated)/modals/payment/contacts')}
                    className="w-full border-dashed border border-gray-400 p-3 text-center rounded-xl"
                ><Text className="text-center">Ajouter un contact</Text></TouchableOpacity>
            </View>
            <View className="flex flex-col gap-4">
                <Label className='text-2xl'>Message (optionel)</Label>
                <Input onChangeText={setMessage} placeholder="Merci pour le café" />
            </View>
            <LoadingButton disabled={disabled} onPress={() => mutation.mutate()} loading={mutation.isPending}>
                {disabled ? <Text>Envoyer</Text> : <Text>Envoyer {amount} € à {selectedContact.nickname ?? selectedContact.fullName?.split(' ')[0] ?? selectedContact.phoneNumber}</Text>}
            </LoadingButton>
        </View>
    )
}