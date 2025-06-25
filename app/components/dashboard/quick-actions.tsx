import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Send, Target, BarChart3 } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function QuickActions() {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardTitle>Actions rapides</CardTitle>
      <View className="flex flex-row gap-2 w-full mt-4">
        <TouchableOpacity
          className="flex-1 native:pt-5 pb-4 py-2 bg-[#25378d] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md"
          onPress={() => router.push('/(authenticated)/modals/payment')}>
          <Send size={16} color="white" />
          <Text className="text-sm font-medium text-white">Payer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 native:pt-5 pb-4 bg-[#007C82] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md"
          onPress={() => router.push('/(authenticated)/savings')}>
          <Target size={16} color="white" />
          <Text className="text-sm font-medium text-white">Épargner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 native:pt-5 pb-4 bg-[#1a4b8c] rounded-xl flex-col items-center justify-center gap-2 border-0 shadow-md"
          onPress={() => {
            // TODO: Navigate to budget screen
          }}>
          <BarChart3 size={16} color="white" />
          <Text className="text-sm font-medium text-white">Budget</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )
}
