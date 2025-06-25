import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, LoadingButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { H1, H3, H4, P, Small } from "@/components/ui/typography";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUpIcon, TrendingDownIcon, PlusIcon, RefreshCwIcon } from "lucide-react-native";
import colors from "@/constants/colors";
import api from "@/constants/api-client";
import { useQuery, useMutation } from '@tanstack/react-query';
import { cn, formatCurrency } from "@/lib/utils";
import ExpensesStats from "@/components/budget/expenses";

const createBudget = async (data: { totalAmount: number }): Promise<Budget> => {
    const response = await api.post('/me/budget', data);
    return response.data;
};

export default function BudgetScreen() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [targetAmount, setTargetAmount] = useState("");
    const insets = useSafeAreaInsets();

    const budgetQuery = useQuery<Budget>({
        queryKey: ['budget'],
        queryFn: async () => {
            const { data } = await api.get('/me/budget');
            return data;
        },
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) { setShowCreateForm(true); return false; }
            return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000,
    });
    const budget = budgetQuery.data;

    const createBudgetMutation = useMutation({
        mutationFn: createBudget,
        onSuccess: async () => {
            await budgetQuery.refetch();
            setShowCreateForm(false);
            setTargetAmount("");
            Alert.alert("Succès", "Budget créé avec succès !");
        },
        onError: () => {
            Alert.alert("Erreur", "Impossible de créer le budget");
        },
    });

    const handleCreateBudget = () => {
        if (!targetAmount || parseFloat(targetAmount) <= 0) {
            Alert.alert("Erreur", "Veuillez entrer un montant valide");
            return;
        }

        createBudgetMutation.mutate({ totalAmount: parseFloat(targetAmount), });
    };

    if (budgetQuery.isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-background justify-center items-center">
                <View className="flex flex-col items-center gap-4">
                    <RefreshCwIcon size={32} color={colors.primary} className="animate-spin" />
                    <Text className="text-muted-foreground">Chargement du budget...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!showCreateForm && budgetQuery.isError && budget === undefined) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-background justify-center items-center px-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Erreur de chargement</CardTitle>
                        <CardDescription>
                            Impossible de charger votre budget. Vérifiez votre connexion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="flex flex-row gap-4" onPress={() => budgetQuery.refetch()}>
                            <RefreshCwIcon size={20} color="white" />
                            <Text className="text-white font-medium ml-2">Réessayer</Text>
                        </Button>
                    </CardContent>
                </Card>
            </SafeAreaView>
        );
    }

    if (showCreateForm || !budget) {
        return (
            <ScrollView style={{ flex: 1 }} className="bg-background">
                <View className="flex flex-col gap-8 items-center">
                    <View className="w-full relative rounded-b-3xl overflow-hidden">
                        <LinearGradient
                            colors={[colors.primary, colors.tertiary]}
                            end={{ x: 0.75, y: 0.75 }}
                            style={{ width: '100%', paddingTop: insets.top }}
                        >
                            <View className="p-6 py-8 flex flex-col gap-8">
                                <View className="flex flex-col gap-2">
                                    <H3 className="text-white">Budget</H3>
                                    <P className="text-white/80">Gérez vos dépenses mensuelles</P>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                    <View className="flex flex-col gap-8 px-6 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex flex-row items-center gap-4">
                                    Aucun budget configuré
                                </CardTitle>
                                <CardDescription>
                                    Créez votre premier budget mensuel pour commencer à suivre vos dépenses
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {!showCreateForm ? (
                                    <Button onPress={() => setShowCreateForm(true)}>
                                        <PlusIcon size={20} color="white" />
                                        <Text className="text-white font-medium ml-2">Créer un budget</Text>
                                    </Button>
                                ) : (
                                    <View className="flex flex-col gap-4">
                                        <View>
                                            <Text className="text-sm font-medium mb-2">Montant mensuel cible</Text>
                                            <Input
                                                placeholder="1000"
                                                value={targetAmount}
                                                onChangeText={setTargetAmount}
                                                keyboardType="numeric"
                                                className="text-lg"
                                            />
                                        </View>
                                        <View className="flex flex-row gap-2">
                                            <LoadingButton
                                                loading={createBudgetMutation.isPending}
                                                onPress={handleCreateBudget}
                                                className="flex-1"
                                            >
                                                <Text className="text-white font-medium">Créer</Text>
                                            </LoadingButton>
                                        </View>
                                    </View>
                                )}
                            </CardContent>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={{ flex: 1 }} className="bg-background">
            <View className="flex flex-col gap-8 items-center pb-8">
                <View className="w-full relative rounded-b-3xl overflow-hidden">
                    <LinearGradient
                        colors={[colors.primary, colors.tertiary]}
                        end={{ x: 0.75, y: 0.75 }}
                        style={{ width: '100%', paddingTop: insets.top }}>
                        <View className="p-6 py-8 flex flex-col gap-8">
                            <View className="flex flex-col gap-2">
                                <H3 className="text-white">Budget</H3>
                                <P className="text-white/80">Gérez vos dépenses mensuelles</P>
                            </View>
                            <View className="bg-white/20 p-8 rounded-2xl flex-col gap-4">
                                <View>
                                    <View className="flex flex-row justify-between items-center">
                                        <H1 className="text-white">{formatCurrency(budget.totalAmount)}</H1>
                                        <View className="flex flex-row items-center gap-2">
                                            {budget.isExceeded ? (
                                                <TrendingDownIcon color={colors.destructive} size={20} />
                                            ) : (
                                                <TrendingUpIcon color={colors["tertiary-foreground"]} size={20} />
                                            )}
                                            <P className={`font-bold ${budget.isExceeded ? 'text-red-500' : 'text-green-300'}`}>
                                                {budget.isExceeded ? 'Dépassé' : 'En cours'}
                                            </P>
                                        </View>
                                    </View>
                                    <H4 className="text-white">Budget mensuel</H4>
                                </View>
                                <View className="flex flex-col gap-2">
                                    <View className="flex flex-row justify-between">
                                        <Small className="text-white/80">Dépensé</Small>
                                        <Small className="text-white/80">{formatCurrency(budget.totalSpent)}</Small>
                                    </View>
                                    <Progress
                                        value={budget.utilizationPercentage}
                                        className="h-2 bg-white/20"
                                        indicatorClassName={cn('bg-[#86EFAC]', budget.utilizationPercentage > 80 && 'bg-[#facc15]', budget.isExceeded && 'bg-destructive')}
                                    />
                                    <View className="flex flex-row justify-between">
                                        <Small className="text-white/80">Restant</Small>
                                        <Small className="text-white/80">{formatCurrency(budget.remainingAmount)}</Small>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View className="flex flex-col gap-6 px-6 w-full">
                    <View className="flex flex-row gap-4">
                        <Button
                            variant="outline"
                            onPress={() => budgetQuery.refetch()}
                            className="flex-1 flex flex-row items-center justify-center gap-2 bg-white">
                            <RefreshCwIcon size={16} color={colors.primary} />
                            <Text>Actualiser</Text>
                        </Button>
                        <Button
                            variant="destructive"
                            onPress={() => setShowCreateForm(true)}
                            className="flex-1 flex flex-row items-center justify-center gap-2">
                            <Text>Changer de budget</Text>
                        </Button>
                    </View>
                    <Card>
                        <CardHeader className="p-0 mb-4">
                            <CardTitle>Résumé du mois</CardTitle>
                            <CardDescription>
                                {budget.isExceeded
                                    ? `Vous avez dépassé votre budget de ${formatCurrency(Number(budget.totalSpent) - Number(budget.totalAmount))}`
                                    : `Il vous reste ${formatCurrency(budget.remainingAmount)} ce mois`
                                }
                            </CardDescription>
                        </CardHeader>
                        <View className="flex flex-row justify-between items-center">
                            <View className="flex flex-col">
                                <Text className="text-2xl font-bold">{formatCurrency(budget.totalSpent)}</Text>
                                <Text className="text-muted-foreground">Dépensé ce mois</Text>
                            </View>
                            <View className="flex flex-col items-end">
                                <Text className={`text-2xl font-bold ${budget.isExceeded ? 'text-destructive' : 'text-primary'}`}>
                                    {budget.utilizationPercentage.toFixed(1)}%
                                </Text>
                                <Text className="text-muted-foreground">Utilisation</Text>
                            </View>
                        </View>
                    </Card>
                    <ExpensesStats />
                </View>
            </View>
        </ScrollView>
    );
}