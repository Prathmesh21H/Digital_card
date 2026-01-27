import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-8 text-blue-600">
        EmployeeConnect
      </Text>

      <TextInput
        placeholder="Email"
        className="w-full border border-gray-300 p-4 rounded-xl mb-4"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="w-full border border-gray-300 p-4 rounded-xl mb-6"
      />

      <TouchableOpacity
        className="bg-blue-600 w-full p-4 rounded-xl items-center"
        onPress={() => router.replace("/")} // Navigate to Home
      >
        <Text className="text-white font-semibold text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
