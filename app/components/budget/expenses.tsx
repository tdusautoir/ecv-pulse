import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import api from "@/constants/api-client";

const categoryTranslations: Record<string, string> = {
    shopping: "Shopping",
    video_games: "Jeux vidéo",
    food: "Alimentation",
    bar: "Bar/Restaurant",
    transport: "Transport",
    entertainment: "Divertissement",
    health: "Santé",
    education: "Éducation",
    utilities: "Services publics",
    other: "Autre"
};

const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
        food: "🍽️",
        transport: "🚗",
        shopping: "🛍️",
        entertainment: "🎬",
        health: "🏥",
        education: "🏫",
        bar: "🍻",
        video_games: "🎮",
        utilities: "⚡",
        other: "🥷"
    };
    return icons[category] || "📦";
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        food: "#ef4444",
        transport: "#3b82f6",
        shopping: "#8b5cf6",
        entertainment: "#f59e0b",
        health: "#10b981",
        education: "#06b6d4",
        bar: "#ec4899",
        video_games: "#6366f1",
        utilities: "#fbbf24",
        other: "#6b7280"
    };
    return colors[category] || "#6b7280";
};

export default function ExpensesStats() {
    const userQuery = useQuery<User>({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await api.get('/me');
            return data;
        }
    });

    const user = userQuery.data;

    if (!user || !user.stats.spendingByCategory) {
        return null;
    }

    const sortedCategories = Object.entries(user.stats.spendingByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (sortedCategories.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="p-0 mb-4">
                <CardTitle className="flex flex-row items-center gap-2">
                    Dépenses par catégorie
                </CardTitle>
                <CardDescription>
                    Top 5 des catégories les plus dépensées ce mois
                </CardDescription>
            </CardHeader>
            <View className="flex flex-col gap-4">
                {sortedCategories.map(([category, amount]) => {
                    const percentage = user.stats.currentMonthSpent > 0
                        ? (amount / user.stats.currentMonthSpent) * 100
                        : 0;

                    return (
                        <View key={category} className="flex flex-col gap-2">
                            <View className="flex flex-row justify-between items-center">
                                <View className="flex flex-row items-center gap-3">
                                    <Text className="text-lg">{getCategoryIcon(category)}</Text>
                                    <View className="flex flex-col">
                                        <Text className="font-medium capitalize">
                                            {categoryTranslations[category] || category}
                                        </Text>
                                        <Text className="text-xs text-muted-foreground">
                                            {percentage.toFixed(1)}% du total
                                        </Text>
                                    </View>
                                </View>
                                <Text className="font-semibold">
                                    {formatCurrency(amount)}
                                </Text>
                            </View>
                            <Progress
                                value={percentage}
                                className="h-2"
                                indicatorClassName="bg-primary"
                                style={{
                                    backgroundColor: `${getCategoryColor(category)}20`
                                }}
                            />
                        </View>
                    );
                })}
            </View>
            <View className="mt-6 pt-4 border-t border-border">
                <View className="flex flex-row justify-between items-center">
                    <Text className="font-semibold">Total dépensé ce mois</Text>
                    <Text className="text-lg font-bold text-primary">
                        {formatCurrency(user.stats.currentMonthSpent)}
                    </Text>
                </View>
            </View>
        </Card>
    );
}
