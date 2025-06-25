import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1, H2, H3, H4, P } from "@/components/ui/typography";
import { useState, useRef } from "react";
import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/constants/api-client";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleXIcon, ArrowLeftIcon } from "lucide-react-native";
import { useAuth } from "@/context/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import colors from "@/constants/colors";
import { getObjectiveEmoji } from "@/lib/savings-utils";
import { Card } from "@/components/ui/card";

export default function SaveMoneyScreen() {
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const disabled = amount.trim() === '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const objectiveId = Number(params.id);

  const { data: objective, isPending } = useQuery<SavingsObjective>({
    queryKey: ['savings-objectives', objectiveId],
    queryFn: async () => {
      const response = await api.get(`/me/savings-objectives/${objectiveId}`);
      return response.data;
    },
    enabled: !!objectiveId,
  });

  const handleAmountChange = (text: string) => {
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
      if (amount.trim() === '' || !objective) throw new Error();

      const amountValue = parseFloat(amount);
      await api.post(`/me/savings-objectives/${objective.id}/add`, {
        amount: amountValue,
        message: message.trim() !== '' ? message : undefined,
      })

      queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.refetchQueries({ queryKey: ['savings-objectives'] })
    },
    onSuccess: () => router.back(),
    onError: () => setError(true),
    onMutate: () => setError(false)
  })

  const amountValue = parseFloat(amount) || 0;
  const hasInsufficientFunds = user && amountValue > user.balance;

  if (isPending) {
    return (
      <View style={{ flex: 1 }} className="bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!objective) {
    return (
      <View style={{ flex: 1 }} className="bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text>Objectif non trouvé</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-gray-50">
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        className="bg-gray-50"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-col">
          <View className="relative rounded-b-3xl overflow-hidden">
            <LinearGradient
              colors={[colors.primary, colors.tertiary]}
              end={{ x: 0.75, y: 0.75 }}
              style={{ width: '100%', paddingTop: insets.top }}
            >
              <View className="p-6 pb-10">
                <View className="flex flex-row items-center gap-4 mb-4">
                  <Button
                    onPress={() => router.back()}
                    className="p-2 bg-white/20 rounded-full"
                    style={{ width: 40, height: 40 }}
                  >
                    <ArrowLeftIcon size={24} color="white" />
                  </Button>
                  <View>
                    <H1 className="text-white text-2xl font-bold">Épargner</H1>
                    <P className="text-white/80">Ajouter de l'argent à ton objectif</P>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View className="p-6 space-y-6 pb-20">
            {error && (
              <Alert variant="destructive" icon={CircleXIcon} className="mb-6">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>Une erreur est survenue lors de l’ajout à l’objectif. Veuillez réessayer.</AlertDescription>
              </Alert>
            )}
            <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <View className="flex flex-row items-center gap-4 mb-4">
                <Text className="text-4xl">{getObjectiveEmoji(objective.name)}</Text>
                <H3 className="text-xl font-bold text-gray-900">{objective.name}</H3>
              </View>
              <View className="space-y-3">
                <View className="flex flex-row items-center justify-between">
                  <P className="text-gray-600">Montant actuel</P>
                  <H4 className="font-semibold text-[#007C82]">{objective.currentAmount}€</H4>
                </View>
                <View className="flex flex-row items-center justify-between">
                  <P className="text-gray-600">Objectif</P>
                  <H4 className="font-semibold">{objective.targetAmount}€</H4>
                </View>
                <View className="flex flex-row items-end justify-between mt-4">
                  <P className="text-gray-600">Votre solde</P>
                  <H3 className="font-semibold text-foreground">{user?.balance || 0}€</H3>
                </View>
              </View>
            </Card>

            <View className="mx-auto flex flex-col gap-4 items-center p-10">
              <Input
                keyboardType="numeric"
                onChangeText={handleAmountChange}
                returnKeyType='done'
                value={amount}
                style={{ fontSize: 64, height: 64 }}
                className="bg-transparent border-0 placeholder:text-gray-400 font-light text-center"
                placeholderClassName="text-gray-400 font-light"
                placeholder="20" />
              <P className="text-5xl text-gray-400 font-light">€</P>
            </View>
            {hasInsufficientFunds && (
              <Alert variant="destructive" icon={CircleXIcon} className="mb-6">
                <AlertTitle>Fonds insuffisants</AlertTitle>
                <AlertDescription>
                  Votre solde ({user?.balance}€) est insuffisant pour épargner {amountValue}€.
                </AlertDescription>
              </Alert>
            )}
            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-2">
                <Label htmlFor="message">Message (optionnel)</Label>
                <Input
                  id="message"
                  placeholder="Ajouter un message..."
                  value={message}
                  onChangeText={setMessage}
                  className="p-4 bg-white rounded-xl !h-24"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                />
              </View>

              <LoadingButton
                disabled={disabled || hasInsufficientFunds}
                onPress={() => mutation.mutate()}
                loading={mutation.isPending}
                className={cn(
                  "w-full h-14 rounded-xl text-lg font-semibold shadow-md transition-all duration-300",
                  disabled || hasInsufficientFunds
                    ? "bg-gray-300 text-gray-500 opacity-50"
                    : "bg-[#007C82] hover:bg-[#006b70] text-white"
                )}
              >
                <Text className={cn("text-lg font-semibold", disabled || hasInsufficientFunds ? "text-gray-500" : "text-white")}>
                  Épargner {amount ? `${amount}€` : ''}
                </Text>
              </LoadingButton>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 