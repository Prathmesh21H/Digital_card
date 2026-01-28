import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Image } from "react-native";

import { HapticTab } from "../../components/haptic-tab";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: "#333",

        tabBarStyle: {
          height: 65,
          backgroundColor: "#fff",
          borderTopWidth: 10,
          borderTopColor: "#f5f5f5",
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Wallet */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Profile (Avatar Icon) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=Alex+Rivera&background=333&color=fff",
              }}
              style={{
                width: focused ? 30 : 26,
                height: focused ? 30 : 26,
                borderRadius: 15,
                borderWidth: focused ? 2 : 1,
                borderColor: focused ? "#000" : "#ddd",
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
