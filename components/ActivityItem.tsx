import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react-native";
import { Activity } from "@/store/shai-store";

type ActivityItemProps = {
  activity: Activity;
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {activity.type === "critical" && <AlertTriangle size={16} color="#EF4444" />}
        {activity.type === "warning" && <Clock size={16} color="#F59E0B" />}
        {activity.type === "info" && <CheckCircle size={16} color="#10B981" />}
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{activity.message}</Text>
        <View style={styles.footer}>
          <Text style={styles.repo}>{activity.repo}</Text>
          <Text style={styles.timestamp}>{activity.timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repo: {
    fontSize: 12,
    color: "#64748B",
  },
  timestamp: {
    fontSize: 12,
    color: "#94A3B8",
  },
});