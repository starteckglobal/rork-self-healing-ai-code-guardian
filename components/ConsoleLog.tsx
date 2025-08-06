import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Terminal } from "lucide-react-native";
import { ConsoleLog as ConsoleLogType } from "@/store/shai-store";

type ConsoleLogProps = {
  logs: ConsoleLogType[];
};

export default function ConsoleLog({ logs }: ConsoleLogProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Analysis Console</Text>
        <Terminal size={20} color="#10B981" />
      </View>
      <ScrollView style={styles.logContainer}>
        {logs.map((log) => (
          <Text 
            key={log.id} 
            style={[
              styles.logText,
              log.level === "ERROR" ? styles.errorText :
              log.level === "WARN" ? styles.warnText :
              log.level === "SUCCESS" ? styles.successText : 
              styles.infoText
            ]}
          >
            [{new Date().toISOString().split("T")[0]} {log.timestamp}] {log.level}: {log.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logContainer: {
    maxHeight: 200,
  },
  logText: {
    fontFamily: "monospace",
    fontSize: 12,
    marginBottom: 4,
  },
  infoText: {
    color: "#10B981",
  },
  errorText: {
    color: "#EF4444",
  },
  warnText: {
    color: "#F59E0B",
  },
  successText: {
    color: "#10B981",
  },
});