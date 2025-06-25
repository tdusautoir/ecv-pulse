import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Send, Target, BarChart3 } from "lucide-react-native";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function QuickActions() {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardTitle>Actions rapides</CardTitle>
      <View className="p-0">
        <View className="flex flex-row gap-2 w-full mt-4">

          <Button
            className="flex-1 bg-[#25378d] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md !h-20 !w-full"
            onPress={() => router.push('/(authenticated)/modals/payment')}
          >
            <Send size={16} color="white" />
            <Text className="text-sm font-medium text-white">Payer</Text>
          </Button>

          <Button
            className="flex-1 bg-[#007C82] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md !h-20 !w-full"
            onPress={() => router.push('/(authenticated)/savings')}
          >
            <Target size={16} color="white" />
            <Text className="text-sm font-medium text-white">Épargner</Text>
          </Button>

          <Button
            className="flex-1 bg-[#1a4b8c] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md !h-20 !w-full"
            onPress={() => {
              // TODO: Navigate to budget screen
            }}
          >
            <BarChart3 size={16} color="white" />
            <Text className="text-sm font-medium text-white">Budget</Text>
          </Button>
        </View>
      </View>
    </Card>
  )
}
