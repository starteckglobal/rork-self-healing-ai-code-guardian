import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from "react-native";
import { Eye, GitBranch, Zap, TrendingUp } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import MetricCard from "@/components/MetricCard";
import ActivityItem from "@/components/ActivityItem";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isDesktop = width >= 1024;

export default function DashboardScreen() {
  const { 
    systemMetrics, 
    liveActivity, 
    isAuthenticated
  } = useSHAIStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../auth");
    }
  }, [isAuthenticated]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <SHAIHeader />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Live Monitoring"
            value="24/7"
            subtitle="Real-time code analysis"
            icon={Eye}
            gradientColors={["#3B82F6", "#2563EB"]}
            onPress={() => router.push("/monitor")}
          />
          <MetricCard
            title="Repositories"
            value={systemMetrics.repositoriesMonitored}
            subtitle="Under protection"
            icon={GitBranch}
            gradientColors={["#10B981", "#059669"]}
            onPress={() => router.push("/repositories")}
          />
          <MetricCard
            title="Auto-Fixed"
            value={systemMetrics.issuesAutoFixed}
            subtitle="Issues resolved"
            icon={Zap}
            gradientColors={["#8B5CF6", "#7C3AED"]}
            onPress={() => router.push("/analysis")}
          />
          <MetricCard
            title="Cost Savings"
            value={`$${(systemMetrics.costSavings / 1000).toFixed(0)}k`}
            subtitle="This month"
            icon={TrendingUp}
            gradientColors={["#F97316", "#EA580C"]}
            onPress={() => router.push("/reports")}
          />
        </View>

        <View style={[styles.grid, {
          flexDirection: isDesktop ? 'row' : 'column'
        }]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>System Performance</Text>
            <View style={styles.performanceStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Response Time</Text>
                <Text style={styles.statValueBlue}>{systemMetrics.responseTime}s</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Uptime</Text>
                <Text style={styles.statValueGreen}>{systemMetrics.uptime}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>AI Accuracy</Text>
                <Text style={styles.statValuePurple}>{systemMetrics.aiAccuracy}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>API Calls Today</Text>
                <Text style={styles.statValue}>{systemMetrics.apiCalls.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.liveHeader}>
              <Text style={styles.cardTitle}>Live Activity</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            <View style={styles.activityList}>
              {liveActivity.slice(0, 5).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </View>
          </View>
        </View>
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
    padding: width < 768 ? 12 : 16,
    paddingBottom: 100,
  },
  metricsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: width < 768 ? 8 : 12,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: width < 768 ? 12 : 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flex: isDesktop ? 1 : undefined,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  performanceStats: {
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  statValueBlue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
  statValueGreen: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  statValuePurple: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  liveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
    fontSize: 14,
    color: "#10B981",
  },
  activityList: {
    gap: 8,
  },
});