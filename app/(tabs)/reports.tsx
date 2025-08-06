import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Download } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function ReportsScreen() {
  const { 
    systemMetrics,
    isAuthenticated
  } = useSHAIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <SHAIHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>System Reports & Analytics</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Download size={16} color="white" />
            <Text style={styles.buttonText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Issue Resolution Metrics</Text>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Total Issues Detected</Text>
                <Text style={styles.metricValue}>1,247</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Auto-Fixed</Text>
                <Text style={styles.metricValueGreen}>{systemMetrics.issuesAutoFixed}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Requiring Review</Text>
                <Text style={styles.metricValueOrange}>156</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Prevention Rate</Text>
                <Text style={styles.metricValueBlue}>94.2%</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cost Impact Analysis</Text>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Downtime Prevented</Text>
                <Text style={styles.metricValueGreen}>47 hrs</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Cost Savings</Text>
                <Text style={styles.metricValueGreen}>${systemMetrics.costSavings.toLocaleString()}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>ROI This Month</Text>
                <Text style={styles.metricValuePurple}>1,247%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Time Saved</Text>
                <Text style={styles.metricValueBlue}>342 hrs</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Performance</Text>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Claude 3.5 Accuracy</Text>
                <Text style={styles.metricValuePurple}>92.0%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>GPT-4o Accuracy</Text>
                <Text style={styles.metricValueBlue}>89.5%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Combined Accuracy</Text>
                <Text style={styles.metricValueGreen}>95.3%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>False Positives</Text>
                <Text style={styles.metricValueOrange}>2.1%</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Security Impact</Text>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Vulnerabilities Found</Text>
                <Text style={styles.metricValueRed}>23</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Auto-Patched</Text>
                <Text style={styles.metricValueGreen}>21</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Critical Blocked</Text>
                <Text style={styles.metricValuePurple}>7</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Response Time</Text>
                <Text style={styles.metricValueBlue}>{systemMetrics.responseTime}s</Text>
              </View>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["#ECFDF5", "#D1FAE5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>Monthly Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${systemMetrics.costSavings.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Cost Savings</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{systemMetrics.issuesAutoFixed}</Text>
              <Text style={styles.summaryLabel}>Issues Auto-Resolved</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>24/7</Text>
              <Text style={styles.summaryLabel}>Continuous Protection</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  exportButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  grid: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  metricsList: {
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  metricValueGreen: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
  },
  metricValueBlue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B82F6",
  },
  metricValuePurple: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B5CF6",
  },
  metricValueOrange: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F97316",
  },
  metricValueRed: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EF4444",
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 120,
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#047857",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#059669",
  },
});