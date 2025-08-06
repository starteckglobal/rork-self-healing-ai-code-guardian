import { Tabs } from "expo-router";
import React from "react";
import { BarChart3, Eye, GitBranch, Cpu, TrendingUp, Settings } from "lucide-react-native";
// import { useColorScheme } from "react-native";
import { useSHAIStore } from "@/store/shai-store";

export default function TabLayout() {
  const { isAuthenticated } = useSHAIStore();
  // const colorScheme = useColorScheme();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4F46E5",
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E2E8F0",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="monitor"
        options={{
          title: "Monitor",
          tabBarIcon: ({ color }) => <Eye size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="repositories"
        options={{
          title: "Repos",
          tabBarIcon: ({ color }) => <GitBranch size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => <Cpu size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => <TrendingUp size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}