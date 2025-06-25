import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { H1, H3, H4, P, Small } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TrendingUpIcon,
  CalendarIcon,
  ArrowLeftIcon,
  BarChart3Icon,
  PlusIcon,
  EuroIcon,
  PiggyBankIcon
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const totalSaved = 1617;
  const progression = 46;
  const monthlyEvolution = 12;
  const monthlyIncome = 2500;
  const monthlyExpenses = 1800;
  const availableToSave = 700;
  const currentMonthlySaving = 350;

  const objectives = [
    {
      id: 1,
      label: "Vacances d'été",
      icon: "🏖️",
      date: "Juillet 2024",
      saved: 847,
      target: 1200,
      monthly: 120,
    },
    {
      id: 2,
      label: "Nouveau téléphone",
      icon: "📱",
      date: "Mars 2024",
      saved: 320,
      target: 800,
      monthly: 80,
    },
    {
      id: 3,
      label: "Permis de conduire",
      icon: "🚗",
      date: "Juin 2024",
      saved: 450,
      target: 1500,
      monthly: 150,
    },
  ];

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

              {/* Stats & card */}
              <Card className="bg-white/10 backdrop-blur-md border-0 text-white rounded-2xl shadow-2xl">
                <View className="p-2">
                  <View className="flex flex-row gap-6">
                    <View className="flex-1">
                      <H1 className="text-white text-3xl font-bold mb-1">{totalSaved}€</H1>
                      <P className="text-white/90 mb-2">Total épargné</P>
                      <View className="flex flex-row items-center gap-2">
                        <TrendingUpIcon color="#4ade80" size={16} />
                        <P className="text-[#4ade80] font-medium text-sm">+{monthlyEvolution}% ce mois</P>
                      </View>
                    </View>
                    <View className="flex-1">
                      <H1 className="text-white text-3xl font-bold mb-1">{progression}%</H1>
                      <P className="text-white/90 mb-2">Progression</P>
                      <Progress
                        value={progression}
                        className="h-2 bg-white/20 rounded-full"
                        indicatorClassName="bg-[#4ade80] rounded-full"
                      />
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </LinearGradient>
        </View>

        <View className="p-6 space-y-6 mt-2">
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <View className="p-0">
              <View className="flex flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 bg-[#007C82]/10 rounded-xl flex items-center justify-center">
                  <BarChart3Icon size={24} color={colors.primary} />
                </View>
                <View>
                  <H3 className="text-xl font-bold text-gray-900">Budget mensuel</H3>
                  <P className="text-gray-600">Aperçu de tes finances</P>
                </View>
              </View>

              <View className="gap-3">
                <View className="flex flex-row items-center justify-between">
                  <P className="text-gray-700 font-medium">Revenus</P>
                  <H3 className="text-2xl font-bold text-green-600">+{monthlyIncome}€</H3>
                </View>
                <View className="flex flex-row items-center justify-between">
                  <P className="text-gray-700 font-medium">Dépenses</P>
                  <H3 className="text-2xl font-bold text-gray-900">-{monthlyExpenses}€</H3>
                </View>
                <Separator className="border-gray-200 my-2" />
                <View className="pt-2">
                  <View className="flex flex-row items-center justify-between mb-2">
                    <P className="text-gray-700 font-medium">Disponible pour épargne</P>
                    <H3 className="text-2xl font-bold text-[#007C82]">{availableToSave}€</H3>
                  </View>
                  <View className="flex flex-row items-center justify-between text-sm">
                    <Small className="text-gray-600">Épargne actuelle</Small>
                    <Small className="text-gray-600">{currentMonthlySaving}€/mois</Small>
                  </View>
                  <Progress
                    value={availableToSave / 1000 * 100}
                    className="h-2 mt-2 bg-gray-200 rounded-full"
                    indicatorClassName="bg-[#25378d] rounded-full"
                  />
                </View>
              </View>
            </View>
          </Card>

          {/* Objectifs d'épargne */}
          <View className="space-y-4 mt-8">
            <View className="flex flex-row items-center justify-between mb-4">
              <H3 className="text-xl font-bold text-gray-900">Mes objectifs</H3>
              <Button
                className="bg-primary text-white rounded-xl px-4 py-2 h-10 shadow-md"
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

            {objectives.map(obj => {
              const percent = Math.round((obj.saved / obj.target) * 100);
              return (
                <Card key={obj.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                  <View className="p-0">
                    <View className="flex flex-row items-start justify-between mb-4">
                      <View className="flex flex-row items-center gap-4">
                        <Text className="text-3xl">{obj.icon}</Text>
                        <View>
                          <H4 className="text-lg font-bold text-gray-900">{obj.label}</H4>
                          <View className="flex flex-row items-center gap-2">
                            <CalendarIcon size={16} color="#64748b" />
                            <Small className="text-gray-600">{obj.date}</Small>
                          </View>
                        </View>
                      </View>
                      <Button
                        className="bg-[#007C82] hover:bg-[#006b70] text-white rounded-xl px-4 py-2 h-10 shadow-md"
                        onPress={() => {
                          // TODO: Navigate to save money screen
                        }}
                      >
                        <View className="flex flex-row items-center gap-1">
                          <EuroIcon size={16} color="white" />
                          <P className="text-white font-medium text-sm">Épargner</P>
                        </View>
                      </Button>
                    </View>

                    <View className="mb-4">
                      <View className="flex flex-row items-center justify-between mb-2">
                        <H3 className="text-2xl font-bold text-gray-900">{obj.saved}€ / {obj.target}€</H3>
                        <Small className="text-[#007C82] font-semibold">{percent}%</Small>
                      </View>
                      <Progress
                        value={percent}
                        className="h-3 bg-gray-200 rounded-full mb-2"
                        indicatorClassName="bg-[#25378d] rounded-full"
                      />
                      <View className="flex flex-row items-center justify-between text-sm">
                        <Small className="text-gray-600">Plus que {obj.target - obj.saved}€</Small>
                        <Small className="text-gray-600">{obj.monthly}€/mois</Small>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>

          {/* Conseil épargne */}
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
              <P className="text-gray-700 mb-4">
                Tu peux encore épargner 350€ par mois ! Pourquoi ne pas créer un nouvel objectif ?
              </P>
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