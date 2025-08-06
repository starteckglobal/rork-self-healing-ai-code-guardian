import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Animated, Dimensions } from "react-native";
import { CreditCard, Crown, Bell, X } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { router } from "expo-router";
import SHAIHeader from "@/components/SHAIHeader";
import StatusBar from "@/components/StatusBar";
import { useEffect, useRef } from "react";

export default function SettingsScreen() {
  const { 
    isAuthenticated,
    systemMetrics
  } = useSHAIStore();

  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [createPRsEnabled, setCreatePRsEnabled] = useState(true);
  
  const [notifySecurityIssues, setNotifySecurityIssues] = useState(true);
  const [notifyAutoFix, setNotifyAutoFix] = useState(true);
  const [notifyWeeklyReports, setNotifyWeeklyReports] = useState(false);
  
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated]);

  const toggleNotificationPanel = () => {
    if (showNotificationPanel) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowNotificationPanel(false));
    } else {
      setShowNotificationPanel(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNotificationToggle = (type: 'security' | 'autofix' | 'weekly', value: boolean) => {
    switch (type) {
      case 'security':
        setNotifySecurityIssues(value);
        break;
      case 'autofix':
        setNotifyAutoFix(value);
        break;
      case 'weekly':
        setNotifyWeeklyReports(value);
        break;
    }
    console.log(`Notification setting changed: ${type} = ${value}`);
  };

  return (
    <View style={styles.container}>
      <SHAIHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Configuration</Text>
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto-fix Critical Issues</Text>
                  <Text style={styles.settingDescription}>Automatically apply fixes for critical security vulnerabilities</Text>
                </View>
                <Switch
                  value={autoFixEnabled}
                  onValueChange={setAutoFixEnabled}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="white"
                  ios_backgroundColor="#E2E8F0"
                  testID="auto-fix-switch"
                />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Real-time Monitoring</Text>
                  <Text style={styles.settingDescription}>Monitor code changes in real-time</Text>
                </View>
                <Switch
                  value={monitoringEnabled}
                  onValueChange={setMonitoringEnabled}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="white"
                  ios_backgroundColor="#E2E8F0"
                  testID="monitoring-switch"
                />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Create Pull Requests</Text>
                  <Text style={styles.settingDescription}>Automatically create PRs for code fixes</Text>
                </View>
                <Switch
                  value={createPRsEnabled}
                  onValueChange={setCreatePRsEnabled}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="white"
                  ios_backgroundColor="#E2E8F0"
                  testID="create-prs-switch"
                />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Notification Preferences</Text>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={toggleNotificationPanel}
                testID="notification-panel-button"
              >
                <Bell size={20} color="#3B82F6" />
                <Text style={styles.notificationButtonText}>Configure</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxList}>
              <TouchableOpacity 
                style={styles.checkboxItem}
                onPress={() => handleNotificationToggle('security', !notifySecurityIssues)}
                testID="security-issues-checkbox"
              >
                <View style={[styles.checkbox, notifySecurityIssues && styles.checkboxChecked]}>
                  {notifySecurityIssues && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Critical security issues</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxItem}
                onPress={() => handleNotificationToggle('autofix', !notifyAutoFix)}
                testID="auto-fix-checkbox"
              >
                <View style={[styles.checkbox, notifyAutoFix && styles.checkboxChecked]}>
                  {notifyAutoFix && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Auto-fix completions</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxItem}
                onPress={() => handleNotificationToggle('weekly', !notifyWeeklyReports)}
                testID="weekly-reports-checkbox"
              >
                <View style={[styles.checkbox, notifyWeeklyReports && styles.checkboxChecked]}>
                  {notifyWeeklyReports && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Weekly reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subscription & Billing</Text>
            <View style={styles.planInfo}>
              <View style={styles.currentPlan}>
                <Crown size={20} color="#F59E0B" />
                <Text style={styles.planName}>Enterprise Plan</Text>
              </View>
              <Text style={styles.planStatus}>24/7 monitoring active</Text>
              <View style={styles.usageContainer}>
                <View style={styles.usageRow}>
                  <Text style={styles.usageLabel}>Repositories</Text>
                  <Text style={styles.usageValue}>{systemMetrics.repositoriesMonitored}/50</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(systemMetrics.repositoriesMonitored/50)*100}%` }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.planActions}>
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={() => router.push('/subscription')}
                  testID="upgrade-plan-button"
                >
                  <CreditCard size={16} color="#3B82F6" />
                  <Text style={styles.upgradeButtonText}>Manage Subscription</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {showNotificationPanel && (
        <>
          <TouchableOpacity 
            style={styles.overlay}
            onPress={toggleNotificationPanel}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              styles.notificationPanel,
              {
                transform: [{ translateX: slideAnim }],
                width: Math.min(screenWidth * 0.85, 320),
              }
            ]}
          >
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Notification Settings</Text>
              <TouchableOpacity 
                onPress={toggleNotificationPanel}
                style={styles.closeButton}
                testID="close-notification-panel"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.panelContent} showsVerticalScrollIndicator={false}>
              <View style={styles.panelSection}>
                <Text style={styles.panelSectionTitle}>Push Notifications</Text>
                <View style={styles.panelSettingItem}>
                  <Text style={styles.panelSettingLabel}>Critical Security Issues</Text>
                  <Switch
                    value={notifySecurityIssues}
                    onValueChange={(value) => handleNotificationToggle('security', value)}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="white"
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
                <View style={styles.panelSettingItem}>
                  <Text style={styles.panelSettingLabel}>Auto-fix Completions</Text>
                  <Switch
                    value={notifyAutoFix}
                    onValueChange={(value) => handleNotificationToggle('autofix', value)}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="white"
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
                <View style={styles.panelSettingItem}>
                  <Text style={styles.panelSettingLabel}>Weekly Reports</Text>
                  <Switch
                    value={notifyWeeklyReports}
                    onValueChange={(value) => handleNotificationToggle('weekly', value)}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="white"
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
              </View>
              
              <View style={styles.panelSection}>
                <Text style={styles.panelSectionTitle}>Email Notifications</Text>
                <Text style={styles.panelDescription}>
                  Email notifications are sent to your registered email address for important updates.
                </Text>
                <View style={styles.panelSettingItem}>
                  <Text style={styles.panelSettingLabel}>Daily Summary</Text>
                  <Switch
                    value={false}
                    onValueChange={() => console.log('Daily summary toggled')}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="white"
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
                <View style={styles.panelSettingItem}>
                  <Text style={styles.panelSettingLabel}>Security Alerts</Text>
                  <Switch
                    value={true}
                    onValueChange={() => console.log('Security alerts toggled')}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="white"
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
              </View>
              
              <View style={styles.panelSection}>
                <Text style={styles.panelSectionTitle}>Notification Timing</Text>
                <Text style={styles.panelDescription}>
                  Configure when you want to receive notifications.
                </Text>
                <TouchableOpacity style={styles.timingOption}>
                  <Text style={styles.timingLabel}>Quiet Hours</Text>
                  <Text style={styles.timingValue}>10:00 PM - 8:00 AM</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timingOption}>
                  <Text style={styles.timingLabel}>Frequency</Text>
                  <Text style={styles.timingValue}>Immediate</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </>
      )}
      
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  section: {
    gap: 16,
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
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  checkboxList: {
    gap: 16,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1E293B",
  },
  planInfo: {
    gap: 16,
  },
  currentPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  planStatus: {
    fontSize: 14,
    color: '#64748B',
  },
  planActions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  usageContainer: {
    gap: 8,
  },
  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usageLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  usageValue: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  notificationPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  panelContent: {
    flex: 1,
    padding: 20,
  },
  panelSection: {
    marginBottom: 24,
  },
  panelSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  panelDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  panelSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  panelSettingLabel: {
    fontSize: 15,
    color: '#1E293B',
    flex: 1,
  },
  timingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timingLabel: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  timingValue: {
    fontSize: 14,
    color: '#64748B',
  },
});