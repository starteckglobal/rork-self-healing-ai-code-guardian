import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Dimensions } from "react-native";
import { Shield, Search, Bell, User, LogOut, Settings, HelpCircle } from "lucide-react-native";
import { useSHAIStore } from "@/store/shai-store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function SHAIHeader() {
  const { 
    notifications, 
    showNotifications, 
    setShowNotifications, 
    showUserMenu, 
    setShowUserMenu,
    searchQuery,
    setSearchQuery,
    handleLogout
  } = useSHAIStore();
  
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <LinearGradient
            colors={["#4F46E5", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBackground}
          >
            <Shield size={24} color="white" />
          </LinearGradient>
          <View style={styles.activeDot} />
        </View>
        <View>
          <Text style={styles.logoText}>SHAI</Text>
          <Text style={styles.logoSubtext}>Self-Healing AI</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        {!isMobile && (
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search repositories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
        )}

        <View style={styles.iconContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowNotifications(!showNotifications)}
            testID="notification-button"
          >
            <Bell size={20} color="#64748B" />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {showNotifications && (
            <View style={styles.notificationDropdown}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Notifications</Text>
              </View>
              <View style={styles.notificationList}>
                {notifications.map((notification) => (
                  <View key={notification.id} style={styles.notificationItem}>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => setShowUserMenu(!showUserMenu)}
            testID="user-menu-button"
          >
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userAvatar}
            >
              <Text style={styles.userInitials}>JD</Text>
            </LinearGradient>
          </TouchableOpacity>

          {showUserMenu && (
            <View style={styles.userDropdown}>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/settings")}>
                <User size={16} color="#64748B" />
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/settings")}>
                <Settings size={16} color="#64748B" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <HelpCircle size={16} color="#64748B" />
                <Text style={styles.menuItemText}>Help</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <LogOut size={16} color="#64748B" />
                <Text style={styles.menuItemText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoWrapper: {
    position: "relative",
  },
  logoBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "white",
  },
  logoText: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: "700",
    color: "#4F46E5",
  },
  logoSubtext: {
    fontSize: isMobile ? 10 : 12,
    color: "#94A3B8",
    marginTop: -4,
    display: isMobile ? 'none' : 'flex',
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: isMobile ? 8 : 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: width < 1024 ? 160 : 200,
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    position: "relative",
    padding: 8,
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  userButton: {
    padding: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  userInitials: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  notificationDropdown: {
    position: "absolute",
    top: 45,
    right: isMobile ? 0 : 40,
    width: isMobile ? width - 32 : 280,
    backgroundColor: "white",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 9999,
  },
  userDropdown: {
    position: "absolute",
    top: 45,
    right: 0,
    width: 180,
    backgroundColor: "white",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    zIndex: 9999,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  notificationList: {
    maxHeight: 300,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  notificationText: {
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
});