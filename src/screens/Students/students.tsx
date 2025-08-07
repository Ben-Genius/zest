import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useClassStore } from "../../store/classStore";
import { useTheme } from "../../theme/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { CompetenceLevel, StrandStudent } from "@/src/types";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/navigators";

import { SafeAreaView } from "react-native-safe-area-context";
import { baseColors } from "@/src/theme/colors";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MASTERY_LEVELS = [
  { code: "BE", label: "Below Expectation", color: baseColors.masteryBE },
  { code: "AE", label: "Approaching", color: baseColors.masteryAE},
  { code: "ME", label: "Meeting", color: baseColors.masteryME },
  { code: "EE", label: "Exceeding", color:baseColors.masteryEE },
  { code: "all", label: "All Students", color: "#8E8E93" },
] as const;

type FilterType = CompetenceLevel

export default function Students() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { classProfile } = useClassStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Extract all students from strands
  const allStudents = useMemo(() => {
    if (!classProfile) return [];

    const students: (StrandStudent & { strandName: string })[] = [];

    classProfile.forEach((strand) => {
      strand.students.forEach((student) => {
        students.push({
          ...student,
          strandName: strand.strand,
        });
      });
    });

    // Remove duplicates based on studentId
    const uniqueStudents = students.filter(
      (student, index, self) =>
        index === self.findIndex((s) => s.studentId === student.studentId)
    );

    return uniqueStudents;
  }, [classProfile]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || student.competence === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allStudents, searchQuery, selectedFilter]);

  const getCompetenceColor = (competence: string) => {
    const level = MASTERY_LEVELS.find((l) => l.code === competence);
    return level ? level.color : theme.colors.textSecondary;
  };

  const renderStudentCard = ({
    item,
  }: {
    item: StrandStudent & { strandName: string };
  }) => (
    <TouchableOpacity
      style={[styles.studentCard, { backgroundColor: theme.colors.surface }]}
      onPress={() =>
        navigation.navigate("StudentDetail", { studentId: item.studentId })
      }
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: getCompetenceColor(item.competence) },
        ]}
      >
        <Text style={styles.avatarText}>
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </Text>
      </View>

      {/* Student Info */}
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[styles.strandName, { color: theme.colors.textSecondary }]}
        >
          {item.strandName}
        </Text>
      </View>

      {/* Performance Badge */}
      <View
        style={[
          styles.performanceBadge,
          { backgroundColor: getCompetenceColor(item.competence) + "15" },
        ]}
      >
        <Text
          style={[
            styles.performanceText,
            { color: getCompetenceColor(item.competence) },
          ]}
        >
          {item.competence}
        </Text>
      </View>

      {/* Arrow */}
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );

  const renderFilterChip = (filter: (typeof MASTERY_LEVELS)[0]) => (
    <TouchableOpacity
      key={filter.code}
      style={[
        styles.filterChip,
        {
          backgroundColor:
            selectedFilter === filter.code
              ? filter.color + "15"
              : "transparent",
          borderColor:
            selectedFilter === filter.code
              ? filter.color
              : theme.colors.textSecondary + "30",
        },
      ]}
      onPress={() => setSelectedFilter(filter.code as FilterType)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterText,
          {
            color:
              selectedFilter === filter.code
                ? filter.color
                : theme.colors.textSecondary,
            fontWeight: selectedFilter === filter.code ? "600" : "500",
          },
        ]}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Students
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {filteredStudents.length} of {allStudents.length} students
        </Text>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search students..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {MASTERY_LEVELS.map(renderFilterChip)}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: theme.colors.textSecondary + "15" },
        ]}
      >
        <Ionicons name="people" size={32} color={theme.colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No students found
      </Text>
      <Text
        style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}
      >
        Try adjusting your search or filter criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="auto" />

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.studentId}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 30 : 25,
  },
  listContent: {
    paddingBottom: 100,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },

  // Filters
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
  },

  // Student Card
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
   
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  strandName: {
    fontSize: 14,
    fontWeight: "500",
  },
  performanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
