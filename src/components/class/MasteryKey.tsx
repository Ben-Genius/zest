import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { baseColors } from "@/src/theme/colors";

// Constants
const MASTERY_LEVELS = [
  {
    code: "BE",
    label: "Below Expectation",
    color: baseColors.masteryBE,
    description: "Needs support",
    icon: "trending-down",
  },
  {
    code: "AE",
    label: "Approaching Expectation",
    color: baseColors.masteryAE,
    description: "Developing",
    icon: "trending-up",
  },
  {
    code: "ME",
    label: "Meeting Expectation",
    color: baseColors.masteryME,
    description: "On track",
    icon: "checkmark-circle",
  },
  {
    code: "EE",
    label: "Exceeding Expectation",
    color: baseColors.masteryEE,
    description: "Advanced",
    icon: "trophy",
  },
] as const;

const MasteryKeyReference: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Mastery Key Panel
        </Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {MASTERY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.code}
            style={[styles.gridItem, { backgroundColor: level.color + "12" }]}
            activeOpacity={0.7}
          >
            {/* Icon & Code */}
            <View style={styles.itemHeader}>
              <View
                style={[styles.iconBadge, { backgroundColor: level.color }]}
              >
                <Ionicons name={level.icon as any} size={14} color="#FFFFFF" />
              </View>
              <Text style={[styles.code, { color: level.color }]}>
                {level.code}
              </Text>
            </View>

            {/* Content */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {level.label}
            </Text>
            <Text
              style={[
                styles.description,
                { color: theme.colors.textSecondary },
              ]}
            >
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },

  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
});

export default MasteryKeyReference;
