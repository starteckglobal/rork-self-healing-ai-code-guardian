import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Cpu, Code } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import AnalysisResultItem from "@/components/AnalysisResultItem";
import { useEffect } from "react";

export default function AnalysisScreen() {
  const { 
    selectedRepo, 
    isAnalyzing, 
    analysisResults,
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
          <View>
            <Text style={styles.title}>Analysis Results</Text>
            {selectedRepo && (
              <Text style={styles.subtitle}>Repository: {selectedRepo.name}</Text>
            )}
          </View>
          {isAnalyzing && (
            <View style={styles.analyzing}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.analyzingText}>AI Analysis in Progress…</Text>
            </View>
          )}
        </View>

        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <View style={styles.iconContainer}>
                <Cpu size={32} color="white" />
              </View>
              <Text style={styles.loadingTitle}>AI Deep Scan in Progress</Text>
              <Text style={styles.loadingSubtitle}>Claude 3.5 Sonnet analyzing your codebase...</Text>
              <View style={styles.stepsContainer}>
                <View style={styles.step}>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <Text style={styles.stepText}>Security Analysis</Text>
                </View>
                <View style={styles.step}>
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text style={styles.stepText}>Performance Check</Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.pendingIcon} />
                  <Text style={styles.stepTextPending}>Code Quality</Text>
                </View>
              </View>
            </View>
          </View>
        ) : analysisResults.length > 0 ? (
          <View style={styles.resultsList}>
            {analysisResults.map((result) => (
              <AnalysisResultItem key={result.id} result={result} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Code size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Analysis Results</Text>
            <Text style={styles.emptyText}>Select a repository from the Repositories tab to start analysis</Text>
          </View>
        )}
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
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  analyzing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  analyzingText: {
    fontSize: 14,
    color: "#3B82F6",
  },
  loadingContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  pendingIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  stepText: {
    fontSize: 14,
    color: "#64748B",
  },
  stepTextPending: {
    fontSize: 14,
    color: "#94A3B8",
  },
  resultsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});