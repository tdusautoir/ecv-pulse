import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, H3, H4, P, Small } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TrendingUpIcon,
  CalendarIcon,
  ArrowLeftIcon,
  PlusIcon,
  EuroIcon,
  PiggyBankIcon
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/constants/api-client";
import { getObjectiveEmoji, formatSavingsDate } from "@/lib/savings-utils";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

type SavingsObjective = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  remainingAmount: number;
  progressPercentage: number;
};

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user!;

  const { data: objectives, isPending } = useQuery<SavingsObjective[]>({
    queryKey: ['savings-objectives'],
    queryFn: async () => {
      const response = await api.get('/me/savings-objectives');
      return response.data;
    },
  });

  const totalSaved = objectives ? objectives.reduce((sum, obj) => sum + parseFloat(obj.currentAmount.toString()), 0) : 0;
  const totalTarget = objectives ? objectives.reduce((sum, obj) => sum + parseFloat(obj.targetAmount.toString()), 0) : 0;

  const calculateProgression = () => {
    if (totalTarget === 0) return 0;
    return Math.round((totalSaved / totalTarget) * 100);
  };

  const getObjectiveIcon = (name: string) => {
    return getObjectiveEmoji(name);
  };

  // FAKES VALUES
  const monthlyEvolution = 0

  return (
    <ScrollView style={{ flex: 1 }} className="bg-gray-50">
      <View className="flex flex-col">
        <View className="relative rounded-b-3xl overflow-hidden">
          <LinearGradient
            colors={[colors.primary, colors.tertiary]}
            end={{ x: 0.75, y: 0.75 }}
            style={{ width: '100%', paddingTop: insets.top }}
          >
            <View className="p-6 pb-10 ">
              <View className="flex flex-row items-center gap-4 mb-6">
                <Button
                  onPress={() => router.back()}
                  className="p-2 bg-white/20 rounded-full"
                  style={{ width: 40, height: 40 }}
                >
                  <ArrowLeftIcon size={24} color="white" />
                </Button>
                <View>
                  <H1 className="text-white text-2xl font-bold">Épargne</H1>
                  <P className="text-white/80">Gère tes objectifs d'épargne</P>
                </View>
              </View>

              <Card className="bg-white/10 backdrop-blur-md border-0 text-white rounded-2xl shadow-2xl">
                <View className="p-2">
                  <View className="flex flex-row gap-6">
                    <View className="flex-1">
                      <H1 className="text-white text-3xl font-bold mb-1">{totalSaved}€</H1>
                      <P className="text-white/90 mb-2">Total épargné</P>
                      <View className="flex flex-row items-center gap-2">
                        <TrendingUpIcon color="#86EFAC" size={16} />
                        <P className="text-[#86EFAC] font-extrabold text-sm">+{monthlyEvolution}% ce mois</P>
                      </View>
                    </View>
                    <View className="flex-1">
                      <H1 className="text-white text-3xl font-bold mb-1">{calculateProgression()}%</H1>
                      <P className="text-white/90 mb-2">Progression</P>
                      <Progress
                        value={totalSaved}
                        max={totalTarget}
                        className="h-2 mt-2 bg-white/20 rounded-full"
                        indicatorClassName="bg-[#86EFAC] rounded-full"
                      />
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </LinearGradient>
        </View>
        <View className="p-6 space-y-6 mt-2">
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-col gap-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Résumé du mois</CardTitle>
              <CardDescription>
                {user.stats.currentMonthGainSpentDiff < 0
                  ? `Vous avez dépensé ${Math.abs(user.stats.currentMonthGainSpentDiff).toFixed(2)}€ de plus que vos gains ce mois-ci.`
                  : user.stats.currentMonthGainSpentDiff === 0
                    ? "Vous avez équilibré vos gains et dépenses ce mois-ci."
                    : `Il vous reste ${user.stats.currentMonthGainSpentDiff.toFixed(2)}€ à épargner ce mois-ci.`}
              </CardDescription>
            </CardHeader>
            <View className="space-y-2">
              <View className="flex flex-row items-center justify-between mb-2">
                <P className="text-gray-700 font-medium text-lg">Dépensé</P>
                <H3 className="text-2xl font-bold text-destructive">
                  {user.stats.currentMonthSpent.toFixed(2)}€
                </H3>
              </View>
              <View className="flex flex-row items-center justify-between mb-4">
                <P className="text-gray-700 font-medium text-lg">Reçu</P>
                <H3 className="text-2xl font-bold text-[#007C82]">
                  {user.stats.currentMonthGain.toFixed(2)}€
                </H3>
              </View>
              <Separator className="border-gray-200" />
              <View className="flex flex-row items-center justify-between mt-4 mb-2">
                <P className="text-gray-700 font-medium">Disponible pour épargne</P>
                <H3 className={cn("text-2xl font-bold text-[#007C82]", user.stats.currentMonthGainSpentDiff < 0 && 'text-destructive')}>
                  {user.stats.currentMonthGainSpentDiff.toFixed(2)}€
                </H3>
              </View>
            </View>
          </Card>
          <View className="space-y-4 mt-8">
            <View className="flex flex-row items-center justify-between mb-4">
              <H3 className="text-xl font-bold text-gray-900">Mes objectifs</H3>
              <Button
                size='sm'
                className="bg-[#007C82] text-white rounded-xl px-4 py-2 h-10 shadow-md"
                onPress={() => {
                  router.push('/savings/add');
                }}
              >
                <View className="flex flex-row items-center gap-2">
                  <PlusIcon size={16} color="white" />
                  <P className="text-white font-medium text-sm">Ajouter</P>
                </View>
              </Button>
            </View>

            {isPending && (
              [...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-2xl" />
              ))
            )}

            {(!isPending && objectives) && objectives.map(obj => {
              const percent = Math.round(obj.progressPercentage);
              const formattedDate = formatSavingsDate(obj.targetDate);

              return (
                <Card key={obj.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                  <View className="flex flex-col gap-4">
                    <View className="flex flex-row items-center gap-4">
                      <Text className="text-3xl">{getObjectiveIcon(obj.name)}</Text>
                      <View>
                        <H4 className="text-lg font-bold text-gray-900">{obj.name}</H4>
                        {formattedDate && (
                          <View className="flex flex-row items-center gap-2">
                            <CalendarIcon size={16} color="#64748b" />
                            <Small className="text-gray-600">{formattedDate}</Small>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="mb-4">
                      <View className="flex flex-row items-center justify-between mb-2">
                        <H3 className="text-2xl font-bold text-gray-900">{obj.currentAmount}€ / {obj.targetAmount}€</H3>
                        <Small className="text-[#007C82] font-semibold">{percent}%</Small>
                      </View>
                      <Progress
                        value={percent}
                        className="h-3 bg-gray-200 rounded-full mb-2"
                        indicatorClassName="bg-[#007C82] rounded-full"
                      />
                      <View className="flex flex-row items-center justify-between text-sm">
                        <Small className="text-gray-600">Plus que {obj.remainingAmount}€</Small>
                        <Small className="text-gray-600">
                          {Number(obj.currentAmount) >= Number(obj.targetAmount) ? 'Objectif atteint !' : `${Math.round(obj.targetAmount / 12)}€/mois`}
                        </Small>
                      </View>
                    </View>
                    <Button
                      size='sm'
                      className="bg-[#007C82] hover:bg-[#006b70] text-white rounded-xl px-4 py-2 h-10 shadow-md"
                      onPress={() => {
                        router.push(`/savings/${obj.id}`);
                      }}
                    >
                      <View className="flex flex-row items-center gap-1">
                        <EuroIcon size={16} color="white" />
                        <P className="text-white font-medium text-sm">Épargner</P>
                      </View>
                    </Button>
                  </View>
                </Card>
              );
            })}
          </View>
          <Card className="rounded-2xl shadow-lg border border-[#007C82]/20 p-2 mb-6">
            <View className="p-6">
              <View className="flex flex-row items-center gap-3 mb-4">
                <View className="w-10 h-10 bg-[#007C82] rounded-xl flex items-center justify-center">
                  <PiggyBankIcon size={24} color="white" />
                </View>
                <View>
                  <H3 className="text-lg font-bold text-gray-900">Conseil épargne</H3>
                  <P className="text-gray-600">Optimise tes économies</P>
                </View>
              </View>
              <P className="text-gray-700 mb-4">Tu peux encore épargner 350€ par mois ! Pourquoi ne pas créer un nouvel objectif ?</P>
              <Button
                className="bg-white border border-[#007C82] text-[#007C82] rounded-xl h-10 px-4 py-2"
                onPress={() => {
                  router.push('/savings/add');
                }}
              >
                <P className="text-[#007C82] font-medium text-sm">Créer un objectif</P>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
} 