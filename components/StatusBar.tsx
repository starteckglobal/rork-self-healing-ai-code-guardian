import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Shield, Cpu } from "lucide-react-native";
// import { useSHAIStore } from "@/store/shai-store";

export default function StatusBar() {
  return (
    <View style={styles.container}>
      <View style={styles.statusItems}>
        <View style={styles.statusItem}>
          <View style={styles.activeDot} />
          <Text style={styles.statusText}>System Status: Operational</Text>
        </View>
        <View style={styles.statusItem}>
          <Cpu size={16} color="#64748B" />
          <Text style={styles.statusText}>AI Models: Active</Text>
        </View>
        <View style={styles.statusItem}>
          <Shield size={16} color="#64748B" />
          <Text style={styles.statusText}>Security: SOC 2 Compliant</Text>
        </View>
      </View>
      <Text style={styles.timeText}>Last updated: {new Date().toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  statusItems: {
    flexDirection: "row",
    gap: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    color: "#64748B",
  },
  timeText: {
    fontSize: 12,
    color: "#94A3B8",
  },
});