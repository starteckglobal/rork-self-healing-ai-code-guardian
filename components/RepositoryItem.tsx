import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GitBranch, Play, ExternalLink } from "lucide-react-native";
import { Repository, useSHAIStore } from "@/store/shai-store";

type RepositoryItemProps = {
  repository: Repository;
};

export default function RepositoryItem({ repository }: RepositoryItemProps) {
  const { analyzeRepository } = useSHAIStore();

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <View style={styles.repoInfo}>
            <View style={styles.iconContainer}>
              <GitBranch size={24} color="#64748B" />
            </View>
            <View style={styles.repoDetails}>
              <Text style={styles.repoName}>{repository.name}</Text>
              <Text style={styles.repoOwner}>{repository.owner}/{repository.name} • {repository.language}</Text>
              <Text style={styles.lastScanned}>Last scanned: {repository.lastScanned}</Text>
            </View>
          </View>
          <View style={styles.statsSection}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Health Score</Text>
              <Text 
                style={[
                  styles.metricValue, 
                  repository.health >= 90 ? styles.healthGood : 
                  repository.health >= 70 ? styles.healthWarning : 
                  styles.healthBad
                ]}
              >
                {repository.health}%
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Issues Found</Text>
              <Text style={styles.metricValue}>{repository.issues}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={() => analyzeRepository(repository)}
              testID={`analyze-repo-${repository.id}`}
            >
              <Play size={16} color="white" />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <ExternalLink size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  rightSection: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  repoInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  repoDetails: {
    flex: 1,
    justifyContent: "flex-start",
  },
  repoName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
    textAlign: "left",
  },
  repoOwner: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
    textAlign: "left",
  },
  lastScanned: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "left",
  },
  statsSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    paddingLeft: 64,
  },
  metric: {
    alignItems: "flex-start",
  },
  metricLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    textAlign: "left",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "left",
  },
  healthGood: {
    color: "#10B981",
  },
  healthWarning: {
    color: "#F59E0B",
  },
  healthBad: {
    color: "#EF4444",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  analyzeButton: {
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  analyzeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  linkButton: {
    backgroundColor: "#F1F5F9",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});