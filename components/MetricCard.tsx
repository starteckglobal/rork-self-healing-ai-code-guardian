import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  gradientColors: [string, string];
  onPress?: () => void;
};

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradientColors, 
  onPress 
}: MetricCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
      testID={`metric-card-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon size={32} color="rgba(255, 255, 255, 0.8)" />
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const styles = StyleSheet.create({
  container: {
    width: width < 768 ? '48%' : '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  gradient: {
    flex: 1,
    padding: width < 768 ? 12 : 16,
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: width < 768 ? 12 : 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  value: {
    fontSize: width < 768 ? 20 : 24,
    fontWeight: "700",
    color: "white",
  },
  iconContainer: {
    padding: 4,
  },
  subtitle: {
    fontSize: width < 768 ? 10 : 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
  },
});