import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useClassStore } from "../../store/classStore";
import { useTheme } from "../../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import strings from "@/src/constant/strings";
import { Strand, StrandStudent } from "@/src/types";
import { baseColors } from "@/src/theme/colors";

export default function ClassMetrics() {
  const { theme } = useTheme();
  const { classProfile, loading, error, fetchClassProfile } = useClassStore();

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!classProfile) return null;

    // Unique students
    const studentSet = new Set<string>();
    classProfile.forEach((strand: Strand) =>
      strand.students.forEach((student: StrandStudent) =>
        studentSet.add(student.studentId)
      )
    );
    const totalStudents = studentSet.size;

    // Average work covered
    const totalWorkCovered = classProfile.reduce(
      (sum: number, strand: Strand) => sum + strand.workCovered,
      0
    );
    const avgWorkCovered =
      classProfile.length > 0
        ? Math.round(totalWorkCovered / classProfile.length)
        : 0;

    return { totalStudents, avgWorkCovered };
  }, [classProfile]);

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
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!metrics) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {strings.home.noStudent}
        </Text>
      </View>
    );
  }

  const renderProgressBar = (percentage: number) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percentage}%`,
              backgroundColor:
                percentage >= 80
                  ? theme.colors.masteryEE
                  : percentage >= 60
                  ? theme.colors.masteryME
                  : percentage >= 40
                  ? theme.colors.masteryAE
                  : theme.colors.masteryBE,
            },
          ]}
        />
      </View>
      <Text
        style={[styles.progressText, { color: theme.colors.textSecondary }]}
      >
        {percentage}%
      </Text>
    </View>
  );

  return (
    <View>
      <View style={[styles.card, { backgroundColor: baseColors.info }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Class Overview
        </Text>
        <View style={styles.metricRow}>
          <Ionicons
            name="people"
            size={20}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.metricText, { color: theme.colors.text }]}>
            Total Students: {metrics.totalStudents}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Ionicons name="book" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.metricText, { color: theme.colors.text }]}>
            Average Work Covered
          </Text>
        </View>
        {renderProgressBar(metrics.avgWorkCovered)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 44 : 24,
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
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  metricText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "white",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 35,
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
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
});
