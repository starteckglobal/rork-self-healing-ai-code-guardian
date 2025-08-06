import React from "react";
import { Redirect } from "expo-router";
import { useSHAIStore } from "@/store/shai-store";

export default function Index() {
  const { isAuthenticated } = useSHAIStore();

  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/auth" />;
}