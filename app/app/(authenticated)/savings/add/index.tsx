import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { H1, H3, P } from "@/components/ui/typography";
import { useState } from "react";
import { Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/constants/api-client";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleXIcon, ArrowLeftIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import colors from "@/constants/colors";

type SavingsObjective = {
  name: string;
  targetAmount: string;
};

export default function AddSavingsObjectiveScreen() {
  const [objective, setObjective] = useState<SavingsObjective>({
    name: '',
    targetAmount: ''
  });
  const [error, setError] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const disabled = objective.name.trim() === '' ||
    objective.targetAmount.trim() === '';

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
      setObjective(prev => ({ ...prev, targetAmount: '' }));
      return;
    }

    const parsedValue = parseFloat(cleanedValue);
    if (!isNaN(parsedValue)) {
      setObjective(prev => ({ ...prev, targetAmount: cleanedValue }));
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (disabled) throw new Error();

      await api.post('/me/savings-objectives', {
        name: objective.name.trim(),
        targetAmount: parseFloat(objective.targetAmount)
      });

      queryClient.invalidateQueries({ queryKey: ['savings-objectives'] });
      await queryClient.refetchQueries({ queryKey: ['savings-objectives'] });
    },
    onSuccess: () => router.back(),
    onError: () => setError(true),
    onMutate: () => setError(false)
  });

  return (
    <ScrollView style={{ flex: 1 }} className="bg-gray-50">
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
                  <H1 className="text-white text-2xl font-bold">Nouvel objectif</H1>
                  <P className="text-white/80">Crée ton objectif d'épargne personnalisé</P>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" icon={CircleXIcon} className="mb-6">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur est survenue lors de la création de l'objectif. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <View className="p-0">
              <Text className="text-lg font-semibold text-gray-700 mt-0 mb-3 block">Nom de l'objectif</Text>
              <Input
                value={objective.name}
                onChangeText={(text) => setObjective(prev => ({ ...prev, name: text }))}
                placeholder="Ex: Vacances en Espagne"
                className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-[#007C82] focus:ring-0"
                style={{ fontSize: 18 }}
              />
            </View>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-6">
            <View className="p-0">
              <Text className="text-lg font-semibold text-gray-700 mt-0 mb-3 block">Montant objectif</Text>
              <View className="relative">
                <Input
                  keyboardType="numeric"
                  value={objective.targetAmount}
                  onChangeText={handleAmountChange}
                  placeholder="1200"
                  className="h-14 text-lg pr-12 border-2 border-gray-200 rounded-xl focus:border-[#007C82] focus:ring-0"
                  style={{ fontSize: 18 }}
                />
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Text className="text-gray-500 font-medium">€</Text>
                </View>
              </View>
            </View>
          </Card>

          <LoadingButton
            disabled={disabled}
            onPress={() => mutation.mutate()}
            loading={mutation.isPending}
            className={cn(
              "w-full h-14 rounded-xl text-lg font-semibold shadow-md transition-all duration-300 my-6",
              disabled
                ? "bg-gray-300 text-gray-500 opacity-50"
                : "bg-[#007C82] hover:bg-[#006b70] text-white"
            )}
          >
            <Text className={cn("text-lg font-semibold", disabled ? "text-gray-500" : "text-white")}>
              Créer l'objectif
            </Text>
          </LoadingButton>
        </View>
      </View>
    </ScrollView>
  );
}
