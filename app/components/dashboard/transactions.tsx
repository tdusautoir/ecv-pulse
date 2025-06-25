import TransactionCard from "@/components/transaction-card";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/constants/api-client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { View } from "react-native";

export default function Transactions() {
    const { data, isPending } = useQuery<{ data: Transaction[] }>({
        queryKey: ['profile', 'transactions'],
        queryFn: () => api.get('/me/transactions')
    })

    return (<Card className="w-full">
        <CardTitle>Transactions récentes</CardTitle>
        <View className="flex flex-col gap-8 mt-4">
            {isPending && (
                [...Array(4)].map((_, index) => (
                    <Skeleton key={index} className='h-12 w-full' />
                ))
            )}
            {(!isPending && data) && (
                (data.data.slice(0, 4).map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                )))
            )}
            <Link href='/transactions' className="text-primary font-semibold text-center">Voir toutes les transactions</Link>
        </View>
    </Card>)
}