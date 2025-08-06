import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import ConsoleLog from "@/components/ConsoleLog";

export default function MonitorScreen() {
  const { 
    githubRepos, 
    consoleLog,
    isAuthenticated
  } = useSHAIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../auth");
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <SHAIHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Code Monitoring</Text>
          <View style={styles.headerRight}>
            <View style={styles.monitoringStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Monitoring Active</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <RefreshCw size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.repoGrid}>
          {githubRepos.slice(0, 3).map((repo, index) => (
            <View key={repo.id} style={styles.repoCard}>
              <View style={styles.repoHeader}>
                <Text style={styles.repoName}>{repo.name}</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live</Text>
                </View>
              </View>
              
              <View style={styles.repoStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Files Monitored:</Text>
                  <Text style={styles.statValue}>{42 + index * 15}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Last Check:</Text>
                  <Text style={styles.statValue}>2s ago</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Issues Today:</Text>
                  <Text style={styles.statValueGreen}>{repo.issues} fixed</Text>
                </View>
              </View>

              <View style={styles.repoFooter}>
                <Text style={styles.checkItem}>✓ Security scan complete</Text>
                <Text style={styles.checkItem}>✓ Performance analysis running</Text>
                <Text style={styles.checkItem}>✓ Code quality check passed</Text>
              </View>
            </View>
          ))}
        </View>

        <ConsoleLog logs={consoleLog} />
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  monitoringStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  refreshButton: {
    backgroundColor: "#F1F5F9",
    padding: 8,
    borderRadius: 8,
  },
  repoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  repoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flex: 1,
    minWidth: 300,
  },
  repoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  liveText: {
    fontSize: 12,
    color: "#10B981",
  },
  repoStats: {
    gap: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },
  statValueGreen: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  repoFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 4,
  },
  checkItem: {
    fontSize: 12,
    color: "#64748B",
  },
});