import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-2xl font-bold text-gray-800">
        Welcome to NexCard
      </Text>
      <Text className="text-gray-500 mt-2">
        You are successfully logged in.
      </Text>

      <View className="mt-10 space-y-4 w-full px-10">
        <Link href="/login" asChild>
          <TouchableOpacity className="border border-red-500 p-3 rounded-lg items-center">
            <Text className="text-red-500 font-medium">Logout</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
