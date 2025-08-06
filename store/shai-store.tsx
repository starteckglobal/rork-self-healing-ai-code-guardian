import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export type Repository = {
  id: number;
  name: string;
  owner: string;
  language: string;
  private: boolean;
  issues: number;
  health: number;
  lastScanned: string;
};

export type Notification = {
  id: number;
  message: string;
  time: string;
  type: "success" | "info" | "warning" | "error";
};

export type Activity = {
  id: number;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "info";
  repo: string;
};

export type ConsoleLog = {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
};

export type SystemMetrics = {
  repositoriesMonitored: number;
  issuesAutoFixed: number;
  responseTime: number;
  costSavings: number;
  uptime: number;
  aiAccuracy: number;
  apiCalls: number;
};

export type AnalysisResult = {
  id: number;
  file: string;
  line: number;
  type: "security" | "performance" | "quality";
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  description: string;
  suggestion: string;
  fixedCode?: string;
  autoFixed: boolean;
  prNumber?: number;
  impact?: string;
};

export const [SHAIProvider, useSHAIStore] = createContextHook(() => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [liveActivity, setLiveActivity] = useState<Activity[]>([]);
  const [githubRepos, setGithubRepos] = useState<Repository[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [repoFilter, setRepoFilter] = useState<string>("all");
  const [consoleLog, setConsoleLog] = useState<ConsoleLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    repositoriesMonitored: 12,
    issuesAutoFixed: 847,
    responseTime: 1.2,
    costSavings: 127000,
    uptime: 99.9,
    aiAccuracy: 92,
    apiCalls: 15247,
  });

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AsyncStorage.getItem("isAuthenticated");
        if (authStatus === "true") {
          handleGitHubAuth();
        }
      } catch (error) {
        console.log("Error checking auth status:", error);
      }
    };
    
    checkAuth();
  }, []);

  // Simulate GitHub authentication
  const handleGitHubAuth = async () => {
    setIsAuthenticated(true);
    
    try {
      await AsyncStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.log("Error saving auth status:", error);
    }
    
    // Simulate fetching repositories
    setGithubRepos([
      { id: 1, name: "music-streaming-app", owner: "yourcompany", language: "React/Node.js", private: true, issues: 3, health: 85, lastScanned: "2 min ago" },
      { id: 2, name: "payment-processor", owner: "yourcompany", language: "Python", private: true, issues: 1, health: 92, lastScanned: "5 min ago" },
      { id: 3, name: "user-auth-service", owner: "yourcompany", language: "Go", private: true, issues: 0, health: 98, lastScanned: "1 min ago" },
      { id: 4, name: "analytics-dashboard", owner: "yourcompany", language: "TypeScript", private: true, issues: 2, health: 88, lastScanned: "3 min ago" },
      { id: 5, name: "mobile-app-backend", owner: "yourcompany", language: "Java", private: true, issues: 1, health: 91, lastScanned: "4 min ago" },
    ]);

    setNotifications([
      { id: 1, message: "Critical vulnerability auto-fixed in payment-processor", time: "2 min ago", type: "success" },
      { id: 2, message: "New repository connected: mobile-app-backend", time: "1 hour ago", type: "info" },
      { id: 3, message: "Weekly security report ready for download", time: "2 hours ago", type: "info" },
    ]);

    setConsoleLog([
      { id: 1, timestamp: "10:23:45", level: "INFO", message: "SHAI: Starting repository scan..." },
      { id: 2, timestamp: "10:23:46", level: "INFO", message: "AI: Analyzing music-streaming-app/src/auth.js" },
      { id: 3, timestamp: "10:23:47", level: "WARN", message: "DETECT: SQL injection vulnerability found (line 42)" },
      { id: 4, timestamp: "10:23:48", level: "INFO", message: "FIX: Applying parameterized query fix..." },
      { id: 5, timestamp: "10:23:49", level: "SUCCESS", message: "Auto-fix applied, creating PR #156" },
    ]);

    router.replace("/(tabs)");
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    try {
      await AsyncStorage.removeItem("isAuthenticated");
    } catch (error) {
      console.log("Error removing auth status:", error);
    }
    router.replace("../auth");
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const activities = [
        "Memory leak detected in user-service.js - Auto-fixing…",
        "SQL injection vulnerability found in payment.py - Fixed automatically",
        "Performance issue in API endpoint /users - Optimized",
        "Unused imports detected in dashboard.tsx - Cleaned up",
        "Security vulnerability in auth.go - Patched",
        "Code quality issue in analytics.js - Improved",
        "Potential buffer overflow in image-processor.cpp - Fixed",
        "Dead code removed from legacy-utils.js",
        "Race condition detected in concurrent.go - Resolved",
      ];

      const newActivity = {
        id: Date.now(),
        message: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date().toLocaleTimeString(),
        type: Math.random() > 0.7 ? "critical" : Math.random() > 0.4 ? "warning" : "info",
        repo: githubRepos[Math.floor(Math.random() * githubRepos.length)]?.name || "music-streaming-app",
      } as Activity;
      
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);

      // Add console log
      const newLog = {
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString(),
        level: newActivity.type === "critical" ? "ERROR" : newActivity.type === "warning" ? "WARN" : "INFO",
        message: newActivity.message,
      };
      
      setConsoleLog(prev => [newLog as ConsoleLog, ...prev.slice(0, 19)]);

      // Update metrics occasionally
      if (Math.random() > 0.8) {
        setSystemMetrics(prev => ({
          ...prev,
          issuesAutoFixed: prev.issuesAutoFixed + Math.floor(Math.random() * 3),
          apiCalls: prev.apiCalls + Math.floor(Math.random() * 50) + 10,
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [githubRepos, isAuthenticated]);

  // Simulate code analysis
  const analyzeRepository = async (repo: Repository) => {
    setSelectedRepo(repo);
    setIsAnalyzing(true);
    setCurrentView("analysis");

    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          id: 1,
          file: "src/components/UserAuth.js",
          line: 42,
          type: "security",
          severity: "critical",
          issue: "SQL Injection vulnerability in user authentication",
          description: "Raw SQL query construction with user input without parameterization",
          suggestion: "Use parameterized queries or ORM to prevent SQL injection",
          fixedCode: `// BEFORE (Vulnerable)
const query = \`SELECT * FROM users WHERE email = '\${userEmail}'\`;

// AFTER (Fixed)
const query = 'SELECT * FROM users WHERE email = ?';
const result = await db.query(query, [userEmail]);`,
          autoFixed: true,
          prNumber: 156,
          impact: "High - Prevents unauthorized data access",
        },
        {
          id: 2,
          file: "src/services/PaymentService.js",
          line: 89,
          type: "performance",
          severity: "high",
          issue: "Memory leak in payment processing loop",
          description: "Event listeners not properly removed causing memory accumulation",
          suggestion: "Add cleanup function to remove event listeners",
          fixedCode: `// BEFORE
paymentItems.forEach(item => {
  item.addEventListener('click', handlePayment);
});

// AFTER (Fixed)
paymentItems.forEach(item => {
  item.addEventListener('click', handlePayment);
});

const cleanup = () => {
  paymentItems.forEach(item => {
    item.removeEventListener('click', handlePayment);
  });
};`,
          autoFixed: true,
          prNumber: 157,
          impact: "Medium - Improves application performance",
        },
        {
          id: 3,
          file: "src/utils/DataProcessor.js",
          line: 23,
          type: "quality",
          severity: "medium",
          issue: "Unused variable declarations",
          description: "Multiple variables declared but never used",
          suggestion: "Remove unused variables to improve code cleanliness",
          fixedCode: `// BEFORE
const unusedVar = processData();
const anotherUnused = calculateMetrics();
const result = performOperation();

// AFTER (Fixed)
const result = performOperation();`,
          autoFixed: true,
          prNumber: 158,
          impact: "Low - Code cleanliness improvement",
        },
      ];

      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      
      setSystemMetrics(prev => ({
        ...prev,
        issuesAutoFixed: prev.issuesAutoFixed + mockResults.filter(r => r.autoFixed).length,
      }));

      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        message: `Analysis complete for ${repo.name}: ${mockResults.length} issues found and fixed`,
        time: "just now",
        type: "success",
      }, ...prev.slice(0, 4)]);
    }, 4000);
  };

  const analyzeAllRepos = () => {
    setCurrentView("analysis");
    setIsAnalyzing(true);
    setSelectedRepo({ 
      id: 0, 
      name: "All Repositories", 
      owner: "", 
      language: "", 
      private: false, 
      issues: 0, 
      health: 0, 
      lastScanned: "" 
    });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setNotifications(prev => [{
        id: Date.now(),
        message: "Bulk analysis complete: 12 issues found across all repositories",
        time: "just now",
        type: "success",
      }, ...prev.slice(0, 4)]);
    }, 6000);
  };

  const getFilteredRepos = () => {
    return githubRepos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = repoFilter === "all" || 
        (repoFilter === "issues" && repo.issues > 0) ||
        (repoFilter === "clean" && repo.issues === 0);
      return matchesSearch && matchesFilter;
    });
  };

  return {
    isAuthenticated,
    currentView,
    selectedRepo,
    isAnalyzing,
    analysisResults,
    liveActivity,
    githubRepos,
    notifications,
    showNotifications,
    showUserMenu,
    searchQuery,
    repoFilter,
    consoleLog,
    systemMetrics,
    setCurrentView,
    setSelectedRepo,
    setIsAnalyzing,
    setAnalysisResults,
    setLiveActivity,
    setGithubRepos,
    setNotifications,
    setShowNotifications,
    setShowUserMenu,
    setSearchQuery,
    setRepoFilter,
    setConsoleLog,
    setSystemMetrics,
    handleGitHubAuth,
    handleLogout,
    analyzeRepository,
    analyzeAllRepos,
    getFilteredRepos,
  };
});