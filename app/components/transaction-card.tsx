import colors from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import {
    LucideIcon,
    ArrowLeftRightIcon,
    ShoppingBagIcon,
    Gamepad2Icon,
    UtensilsIcon,
    BeerIcon,
    BusIcon,
    FilmIcon,
    HeartPulseIcon,
    BookOpenIcon,
    LightbulbIcon,
    CircleIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { H4, Muted, P } from "./ui/typography";
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from "@/lib/utils";

const categoryIconMap: Record<TransactionCategory, LucideIcon> = {
    shopping: ShoppingBagIcon,
    video_games: Gamepad2Icon,
    food: UtensilsIcon,
    bar: BeerIcon,
    transport: BusIcon,
    entertainment: FilmIcon,
    health: HeartPulseIcon,
    education: BookOpenIcon,
    utilities: LightbulbIcon,
    other: CircleIcon,
};

export function useTransaction(transaction: Transaction, userId: number): {
    icon: LucideIcon,
    description: string,
    type: 'income' | 'outcome'
} {
    if (transaction.type === 'p2p') {
        return {
            icon: ArrowLeftRightIcon,
            description: transaction.receiverId === userId ? transaction.sender.fullName : transaction.receiver.fullName,
            type: transaction.receiverId === userId ? 'income' : 'outcome'
        };
    }

    if (transaction.category) {
        const icon = categoryIconMap[transaction.category as TransactionCategory] || CircleIcon;
        return {
            icon,
            description: transaction.description,
            type: 'outcome'
        };
    }

    return {
        icon: CircleIcon,
        description: 'Inconnu',
        type: 'outcome'
    };
}

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
    const { user } = useAuth();
    const info = useTransaction(transaction, user!.id);

    return (
        <View className="flex flex-row items-center gap-4 justify-between w-full">
            <View className="flex flex-row items-center overflow-hidden gap-4">
                <View className="flex items-center justify-center bg-secondary size-12 rounded-xl">
                    <info.icon width={24} height={24} color={colors['primary']} />
                </View>
                <View className="flex flex-col">
                    <P className="truncate font-bold">{info.description}</P>
                    <Muted>{formatDistance(new Date(transaction.createdAt), new Date(), { locale: fr })}</Muted>
                </View>
            </View>
            <H4 className={cn("flex-1 text-right", info.type === 'income' ? 'text-green-500' : 'text-black')}> {info.type === 'income' ? '+' : '-'}{transaction.amount}€</H4>
        </View >
    )
}