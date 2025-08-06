import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Play, Github, Search, Filter } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import RepositoryItem from "@/components/RepositoryItem";
import { useEffect } from "react";

export default function RepositoriesScreen() {
  const { 
    analyzeAllRepos, 
    searchQuery, 
    setSearchQuery, 
    repoFilter, 
    setRepoFilter,
    getFilteredRepos,
    isAuthenticated
  } = useSHAIStore();

  const filteredRepos = getFilteredRepos();

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
          <Text style={styles.title}>Repository Management</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={analyzeAllRepos}
              testID="analyze-all-button"
            >
              <Play size={16} color="white" />
              <Text style={styles.buttonText}>Analyze All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <Github size={16} color="white" />
              <Text style={styles.buttonText}>Add Repository</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search repositories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Filter size={16} color="#64748B" />
            <TouchableOpacity 
              style={[styles.filterOption, repoFilter === "all" && styles.filterOptionActive]}
              onPress={() => setRepoFilter("all")}
            >
              <Text style={[styles.filterText, repoFilter === "all" && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, repoFilter === "issues" && styles.filterOptionActive]}
              onPress={() => setRepoFilter("issues")}
            >
              <Text style={[styles.filterText, repoFilter === "issues" && styles.filterTextActive]}>With Issues</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, repoFilter === "clean" && styles.filterOptionActive]}
              onPress={() => setRepoFilter("clean")}
            >
              <Text style={[styles.filterText, repoFilter === "clean" && styles.filterTextActive]}>Clean Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.repoList}>
          {filteredRepos.map((repo) => (
            <RepositoryItem key={repo.id} repository={repo} />
          ))}
        </View>

        {filteredRepos.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No repositories found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filter criteria</Text>
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
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  analyzeButton: {
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButton: {
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
  searchContainer: {
    marginBottom: 24,
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    padding: 0,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  filterOptionActive: {
    backgroundColor: "#3B82F6",
  },
  filterText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "500",
  },
  repoList: {
    gap: 12,
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