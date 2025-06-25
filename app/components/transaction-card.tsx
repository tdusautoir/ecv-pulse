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
    CircleQuestionMarkIcon,
    PiggyBankIcon,
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
    other: CircleQuestionMarkIcon,
};

export function useTransaction(transaction: Transaction, userId: number): {
    icon: LucideIcon,
    description: string,
    type: 'income' | 'outcome'
} {
    let type: 'income' | 'outcome' = 'outcome';
    if (transaction.receiverId === userId) type = 'income';

    if (transaction.type === 'p2p') {
        return {
            icon: ArrowLeftRightIcon,
            description: transaction.receiverId === userId ? (transaction.sender.fullName ?? transaction.sender.phoneNumber) : (transaction.receiver.fullName ?? transaction.receiver.phoneNumber),
            type
        };
    }

    if (transaction.type === 'saving') {
        return {
            icon: PiggyBankIcon,
            description: transaction.description || "Épargne",
            type: 'outcome'
        };
    }

    if (transaction.category) {
        const icon = categoryIconMap[transaction.category as TransactionCategory] || CircleIcon;
        return {
            icon,
            description: transaction.description,
            type
        };
    }

    return {
        icon: CircleQuestionMarkIcon,
        description: 'Inconnu',
        type
    };
}

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
    const { user } = useAuth();
    const info = useTransaction(transaction, user!.id);

    const isSaving = transaction.type === 'saving';
    const iconColor = isSaving ? "#007C82" : colors['primary'];
    const amountColor = isSaving ? "text-[#007C82]" : info.type === 'income' ? "text-green-500" : "text-black";
    const bgClass = isSaving ? "bg-[#007C82]/20" : "bg-secondary";

    return (
        <View className="flex flex-row items-center gap-4 justify-between w-full">
            <View className="flex flex-row items-center overflow-hidden gap-4">
                <View className={cn("flex items-center justify-center size-12 rounded-xl", bgClass)}>
                    <info.icon width={24} height={24} color={iconColor} />
                </View>
                <View className="flex flex-col">
                    <P className="truncate font-bold">{info.description}</P>
                    <Muted>{formatDistance(new Date(transaction.createdAt), new Date(), { locale: fr })}</Muted>
                </View>
            </View>
            <H4 className={cn("flex-1 text-right", amountColor)}>
                {info.type === 'income'
                    ? <>+{transaction.amount}€</>
                    : <>-{transaction.amount}€</>
                }
            </H4>
        </View >
    )
}