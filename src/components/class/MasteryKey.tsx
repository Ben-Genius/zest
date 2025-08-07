import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { baseColors } from "@/src/theme/colors";
import strings from "@/src/constant/strings";
import { CompetenceLevel } from "@/src/types";

// Constants
const MASTERY_LEVELS = [
  {
    code: "BE",
    color: baseColors.masteryBE,
    icon: "trending-down",
  },
  {
    code: "AE",
    color: baseColors.masteryAE,
    icon: "trending-up",
  },
  {
    code: "ME",
    color: baseColors.masteryME,
    icon: "checkmark-circle",
  },
  {
    code: "EE",
    color: baseColors.masteryEE,
    icon: "trophy",
  },
] as const;

interface Props {
  selected: CompetenceLevel;
  onSelect: (level: CompetenceLevel) => void;
}

const MasteryKeyReference: React.FC<Props> = ({ selected, onSelect }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {strings.home.masteryKeyTitle}
        </Text>
      </View>

      <View style={styles.grid}>
        {MASTERY_LEVELS.map((level) => {
          const levelData = strings.masteryLevels[level.code];
          const isSelected = selected === level.code;
          return (
            <TouchableOpacity
              key={level.code}
              onPress={() =>
                onSelect(level.code === selected ? "all" : level.code)
              }
              style={[
                styles.gridItem,
                {
                  backgroundColor: isSelected
                    ? level.color + "33"
                    : level.color + "12",
                  borderColor: isSelected ? level.color : "rgba(0,0,0,0.04)",
                  borderWidth: 1.5,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.itemHeader}>
                <View
                  style={[styles.iconBadge, { backgroundColor: level.color }]}
                >
                  <Ionicons
                    name={level.icon as any}
                    size={14}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={[styles.code, { color: level.color }]}>
                  {level.code}
                </Text>
              </View>

              <Text style={[styles.label, { color: theme.colors.text }]}>
                {levelData.label}
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {levelData.description}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MasteryKeyReference;
