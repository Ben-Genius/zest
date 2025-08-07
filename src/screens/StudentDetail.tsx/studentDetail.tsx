import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeProvider";
import { CompetenceLevel, StudentDetails } from "../../types";
import strings from "@/src/constant/strings";
import { Ionicons } from "@expo/vector-icons";
import { getStudentById } from "@/src/services/studentServic";
import { baseColors } from "@/src/theme/colors";
import ModernStrandCards from "./detailStrandCard";
import { StatusBar } from "expo-status-bar";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import StatCard from "@/src/components/student/StatsCard";
type StudentDetailRouteProp = RouteProp<
  { StudentDetail: { studentId: string } },
  "StudentDetail"
>;

export default function StudentDetail() {
  const route = useRoute<StudentDetailRouteProp>();
  const { studentId } = route.params;
  const { theme, isDark } = useTheme();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  useEffect(() => {
    (async () => {
      const data = await getStudentById(studentId);
      setStudent(data);
    })();

    // Animate stats grid
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [studentId, fadeAnim, slideAnim]); // Added fadeAnim and slideAnim to dependencies

  const getCompetenceColor = (competence: Exclude<CompetenceLevel, "all">) => {
    switch (competence) {
      case "BE":
        return theme.colors.masteryBE;
      case "AE":
        return theme.colors.masteryAE;
      case "ME":
        return theme.colors.masteryME;
      case "EE":
        return theme.colors.masteryEE;
      default:
        return theme.colors.textSecondary;
    }
  };

  const metrics = useMemo(() => {
    if (!student) return null;
    const strands = Object.values(student.strands);
    const totalProgress = strands.reduce(
      (sum, strand) => sum + strand.progress,
      0
    );
    const avgProgress = strands.length
      ? Math.round(totalProgress / strands.length)
      : 0;

    const competenceCounts: {
      [key in Exclude<CompetenceLevel, "all">]: number;
    } = {
      BE: 0,
      AE: 0,
      ME: 0,
      EE: 0,
    };
    strands.forEach((strand) => {
      // Ensure strand.competence is a valid key (exclude "all")
      if (["BE", "AE", "ME", "EE"].includes(strand.competence)) {
        competenceCounts[
          strand.competence as Exclude<CompetenceLevel, "all">
        ]++;
      }
    });

    const completedStrands = strands.filter(
      (strand) => strand.progress === 100
    ).length;
    const highestCompetence = strands.reduce<Exclude<CompetenceLevel, "all">>(
      (max, strand) => {
        const scores: { [key in Exclude<CompetenceLevel, "all">]: number } = {
          BE: 1,
          AE: 2,
          ME: 3,
          EE: 4,
        };
        return scores[strand.competence as Exclude<CompetenceLevel, "all">] >
          scores[max]
          ? (strand.competence as Exclude<CompetenceLevel, "all">)
          : max;
      },
      "BE"
    );

    return {
      avgProgress,
      competenceCounts,
      completedStrands,
      highestCompetence,
    };
  }, [student]);

  if (!student || !metrics) {
    return (
      <View style={styles.center}>
        <Ionicons name="refresh" size={40} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }}>{strings.home.loading}</Text>
      </View>
    );
  }

  const strandData: { key: keyof StudentDetails["strands"]; label: string }[] =
    [
      {
        key: "letterIdentification",
        label: strings.home.strands.letterIdentification,
      },
      { key: "letterNaming", label: strings.home.strands.letterNaming },
      { key: "letterFormation", label: strings.home.strands.letterFormation },
      {
        key: "phonemicAwareness",
        label: strings.home.strands.phonemicAwareness,
      },
    ];

  const handleDownload = async () => {
    if (!student || !metrics) return;

    const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Performance Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          .section { margin-bottom: 20px; }
          .stat { margin: 8px 0; }
          .strand { border: 1px solid #ccc; padding: 10px; margin: 8px 0; }
        </style>
      </head>
      <body>
        <h1>Performance Report</h1>
        <div class="section">
          <h2>${student.name}</h2>
          <div class="stat">Average Progress: ${metrics.avgProgress}%</div>
          <div class="stat">Completed Strands: ${metrics.completedStrands}</div>
          <div class="stat">Highest Competence: ${
            metrics.highestCompetence
          }</div>
          <div class="stat">Competence Levels: ME + EE = ${
            metrics.competenceCounts.ME + metrics.competenceCounts.EE
          }/${Object.keys(student.strands).length}</div>
        </div>

        <div class="section">
          <h3>Strand Performance</h3>
          ${Object.entries(student.strands)
            .map(
              ([key, strand]) => `
              <div class="strand">
                <strong>${
                  strings.home.strands[key as keyof typeof strings.home.strands]
                }</strong><br />
                Competence: ${strand.competence}<br />
                Progress: ${strand.progress}%
              </div>
            `
            )
            .join("")}
        </div>
      </body>
    </html>
  `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <StatusBar style={isDark ? "dark" : "auto"} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.avatarText}>
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {student.name}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            {strings.studentDetail.studentPerformance}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label={strings.studentDetail.avgProgress.label}
              subtext={strings.studentDetail.avgProgress.subtext}
              value={`${metrics.avgProgress}%`}
              icon="trending-up"
              color={theme.colors.primary}
            />
            <StatCard
              label={strings.studentDetail.completedStrands.label}
              subtext={strings.studentDetail.completedStrands.subtext}
              value={metrics.completedStrands}
              icon="checkmark-done"
              color={theme.colors.masteryEE}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label={strings.studentDetail.competenceLevels.label}
              subtext={strings.studentDetail.competenceLevels.subtext}
              value={`${
                metrics.competenceCounts.ME + metrics.competenceCounts.EE
              }/${strandData.length}`}
              icon="star"
              color={theme.colors.masteryME}
            />
            <StatCard
              label={strings.studentDetail.highestCompetence.label}
              subtext={strings.studentDetail.highestCompetence.subtext}
              value={metrics.highestCompetence}
              icon="trophy"
              color={getCompetenceColor(metrics.highestCompetence)}
            />
          </View>
        </View>
      </Animated.View>

      {/* Strand Performance */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {strings.home.strandPerformance}
      </Text>
      <ModernStrandCards />
      <TouchableOpacity
        style={[
          styles.downloadButton,
          { backgroundColor: theme.colors.primary },
        ]}
        activeOpacity={0.8}
        onPress={handleDownload}
      >
        <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>
          {strings.studentDetail.downloadButton}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  headerTextContainer: { flex: 1 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  statsContainer: { marginBottom: 24 },
  statsGrid: { flex: 1 },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: baseColors.info,
    borderLeftWidth: 4,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    marginRight: 3,
  },
  statLabel: {
    fontSize: 12.5,
    color: "#6B7280",
    fontWeight: "500",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  competenceBadge: { fontSize: 16, fontWeight: "bold" },
  downloadButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
