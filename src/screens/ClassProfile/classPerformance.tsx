import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useClassStore } from "../../store/classStore";
import { useTheme } from "../../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Strand, StrandStudent, CompetenceLevel } from "@/src/types";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/navigators";

import strings from "@/src/constant/strings";
import { baseColors } from "@/src/theme/colors";
import { StatusBar } from "expo-status-bar";
import ScalableStrandList from "./ScalableStrandList";
import { ScrollView } from "react-native-gesture-handler";
import MasteryKeyReference from "@/src/components/class/MasteryKey";

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function ClassPerformance() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const { classProfile, loading, error, fetchClassProfile } = useClassStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [competenceFilter, setCompetenceFilter] =
    useState<CompetenceLevel>("all");

  useEffect(() => {
    fetchClassProfile();
  }, [fetchClassProfile]);

  const filteredStrands = useMemo(() => {
    if (!classProfile) return [];
    return classProfile
      .map((strand: Strand) => ({
        ...strand,
        students: strand.students.filter((s: StrandStudent) => {
          const matchesSearch =
            strand.strand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCompetence =
            competenceFilter === "all" || s.competence === competenceFilter;
          return matchesSearch && matchesCompetence;
        }),
      }))
      .filter((strand) => strand.students.length > 0);
  }, [classProfile, searchQuery, competenceFilter]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Ionicons name="refresh" size={40} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {strings.home.loading}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={40} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {strings.home.error}: {error}
        </Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={fetchClassProfile}
        >
          <Text style={styles.retryButtonText}>{strings.home.retryButton}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={{ backgroundColor: baseColors.info }}>
        <StatusBar style={isDark ? "light" : "auto"} />
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {strings.home.title}
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder={strings.home.searchPlaceholder}
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

      {/* Strands List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <MasteryKeyReference
          selected={competenceFilter}
          onSelect={(level) => setCompetenceFilter(level)}
        />
        <ScalableStrandList
          filteredStrands={filteredStrands}
          navigation={navigation}
          theme={theme}
          baseColors={baseColors}
          strings={strings}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 44 : 54,
    backgroundColor: baseColors.info,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  masteryKeyButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  masteryKeyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  masteryKeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  masteryKeyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  masteryKeyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  masteryKeyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
  },
  masteryKeyContent: {
    flex: 1,
  },
  masteryKeyCode: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  masteryKeyDesc: {
    fontSize: 14,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
