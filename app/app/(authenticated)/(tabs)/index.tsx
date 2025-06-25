import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H3, H4, P, Small } from "@/components/ui/typography";
import { useAuth } from "@/context/auth-context";
import { ScrollView, StatusBar, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { StarIcon, TrendingUpIcon } from "lucide-react-native";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Transactions from "../../../components/dashboard/transactions";
import colors from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
    const { logout, user } = useAuth()
    const insets = useSafeAreaInsets();

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
                            <View className="flex flex-row justify-between items-center">
                                <Logo white width={80} height={38} />
                                <View className="flex flex-row bg-white/20 py-2 px-4 rounded-full blur-md items-center gap-2">
                                    <StarIcon width={16} height={16} color={colors["tertiary-foreground"]} />
                                    <P className="text-white font-medium"> Niveau {user!.level}</P>
                                </View>
                            </View>
                            <View className="flex flex-col gap-2">
                                <H3 className="text-white">Salut {user!.fullName!.split(' ')[0]} 👋 !</H3>
                                <P className="text-white/80">Prêt à gérer tes finances ?</P>
                            </View>
                            <View className="flex flex-col gap-2">
                                <View className="flex flex-row justify-between">
                                    <Small className="text-white/80 uppercase">{user!.xp * (user!.level + 1)} xp</Small>
                                    <Small className="text-white/80 uppercase">{1000 * (user!.level + 1)} xp</Small>
                                </View>
                                <Progress
                                    indicatorClassName={`bg-[${colors["tertiary-foreground"]}]`}
                                    value={user!.xp}
                                    max={1000}
                                    className="h-2 bg-white/20"
                                />
                            </View>
                            <View className="bg-white/20 p-8 rounded-2xl flex-col gap-4">
                                <View>
                                    <View className="flex flex-row justify-between items-center">
                                        <H1 className="text-white">{parseFloat(user!.balance.toString()).toLocaleString()} €</H1>
                                        <Button style={{ backgroundColor: '#111827CC' }} className="rounded-full">
                                            <P className="text-white font-medium">Gérer</P>
                                        </Button>
                                    </View>
                                    <H4 className="text-white">Solde disponible</H4>
                                </View>
                                <P className="text-white">Gagne des intérêts, et plus encore</P>
                                <Separator className="bg-white/20" />
                                <View className="flex flex-row justify-between">
                                    <P className="text-white font-bold">Évolution</P>
                                    <View className="flex flex-row gap-2">
                                        <TrendingUpIcon color={colors["tertiary-foreground"]} />
                                        <P className={`text-[#86EFAC] font-extrabold`}>+0€ ce mois</P>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View className="flex flex-col gap-8 px-6 w-full">
                    <Transactions />
                    <Button variant='destructive' onPress={() => logout()}>
                        <Text className="">Deconnexion</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    )
}