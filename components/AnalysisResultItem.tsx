import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ShieldAlert, Gauge, Code, ExternalLink } from "lucide-react-native";
import { AnalysisResult } from "@/store/shai-store";

type AnalysisResultItemProps = {
  result: AnalysisResult;
};

export default function AnalysisResultItem({ result }: AnalysisResultItemProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.issueContainer}>
          <View style={[
            styles.iconContainer,
            result.severity === "critical" ? styles.criticalBg :
            result.severity === "high" ? styles.highBg :
            result.severity === "medium" ? styles.mediumBg : styles.lowBg
          ]}>
            {result.type === "security" && (
              <ShieldAlert 
                size={20} 
                color={
                  result.severity === "critical" ? "#EF4444" :
                  result.severity === "high" ? "#F97316" :
                  result.severity === "medium" ? "#F59E0B" : "#3B82F6"
                } 
              />
            )}
            {result.type === "performance" && (
              <Gauge 
                size={20} 
                color={
                  result.severity === "critical" ? "#EF4444" :
                  result.severity === "high" ? "#F97316" :
                  result.severity === "medium" ? "#F59E0B" : "#3B82F6"
                } 
              />
            )}
            {result.type === "quality" && (
              <Code 
                size={20} 
                color={
                  result.severity === "critical" ? "#EF4444" :
                  result.severity === "high" ? "#F97316" :
                  result.severity === "medium" ? "#F59E0B" : "#3B82F6"
                } 
              />
            )}
          </View>
          <View style={styles.issueInfo}>
            <View style={styles.issueTitleRow}>
              <Text style={styles.issueTitle}>{result.issue}</Text>
              <View style={[
                styles.severityBadge,
                result.severity === "critical" ? styles.criticalBadge :
                result.severity === "high" ? styles.highBadge :
                result.severity === "medium" ? styles.mediumBadge : styles.lowBadge
              ]}>
                <Text style={styles.severityText}>{result.severity.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.issueDescription}>{result.description}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Code size={16} color="#64748B" />
                <Text style={styles.metaText}>{result.file}:{result.line}</Text>
              </View>
              <Text style={styles.metaText}>{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</Text>
            </View>
          </View>
        </View>
        {result.autoFixed && (
          <View style={styles.autoFixedBadge}>
            <Text style={styles.autoFixedText}>Auto-Fixed</Text>
          </View>
        )}
      </View>

      <View style={styles.suggestionContainer}>
        <Text style={styles.sectionTitle}>AI Suggestion:</Text>
        <Text style={styles.suggestionText}>{result.suggestion}</Text>
        {result.impact && (
          <Text style={styles.impactText}>Impact: {result.impact}</Text>
        )}
      </View>

      {result.fixedCode && (
        <TouchableOpacity 
          style={styles.codeContainer} 
          onPress={() => setShowCode(!showCode)}
          activeOpacity={0.9}
        >
          <Text style={styles.codeTitle}>Code Fix Applied:</Text>
          {showCode ? (
            <ScrollView horizontal style={styles.codeScroll}>
              <Text style={styles.codeText}>{result.fixedCode}</Text>
            </ScrollView>
          ) : (
            <Text style={styles.codePreview}>Tap to view code...</Text>
          )}
        </TouchableOpacity>
      )}

      {result.prNumber && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Fix automatically applied and deployed
          </Text>
          <TouchableOpacity style={styles.prButton}>
            <ExternalLink size={16} color="white" />
            <Text style={styles.prButtonText}>View PR #{result.prNumber}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  issueContainer: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  criticalBg: {
    backgroundColor: "#FEE2E2",
  },
  highBg: {
    backgroundColor: "#FFEDD5",
  },
  mediumBg: {
    backgroundColor: "#FEF3C7",
  },
  lowBg: {
    backgroundColor: "#DBEAFE",
  },
  issueInfo: {
    flex: 1,
  },
  issueTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  criticalBadge: {
    backgroundColor: "#FEE2E2",
  },
  highBadge: {
    backgroundColor: "#FFEDD5",
  },
  mediumBadge: {
    backgroundColor: "#FEF3C7",
  },
  lowBadge: {
    backgroundColor: "#DBEAFE",
  },
  severityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1E293B",
  },
  issueDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748B",
  },
  autoFixedBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  autoFixedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#047857",
  },
  suggestionContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
  },
  impactText: {
    fontSize: 12,
    color: "#64748B",
  },
  codeContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  codeScroll: {
    maxHeight: 150,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#10B981",
  },
  codePreview: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  prButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  prButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});