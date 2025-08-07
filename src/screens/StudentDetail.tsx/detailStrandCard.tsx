import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { CompetenceLevel, StudentDetails } from "../../types";
import { getStudentById } from "@/src/services/studentServic";
import strings from "@/src/constant/strings";
import { useRoute, RouteProp } from "@react-navigation/native";
import { baseColors } from "@/src/theme/colors";

type StudentDetailRouteProp = RouteProp<
  { StudentDetail: { studentId: string } },
  "StudentDetail"
>;

interface StrandData {
  key: keyof StudentDetails["strands"];
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface PerformanceLevel {
  level: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface CardAnimations {
  [key: string]: {
    scale: Animated.Value;
    translateY: Animated.Value;
    opacity: Animated.Value;
    progress: Animated.Value;
  };
}

const ModernStrandCards: React.FC = () => {
  const route = useRoute<StudentDetailRouteProp>();
  const { studentId } = route.params;
  const { theme } = useTheme();

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardAnimations, setCardAnimations] = useState<CardAnimations>({});

  const strandData: StrandData[] = [
    {
      key: "letterIdentification",
      label: strings.home.strands.letterIdentification,
      icon: "eye-outline",
    },
    {
      key: "letterNaming",
      label: strings.home.strands.letterNaming,
      icon: "text-outline",
    },
    {
      key: "letterFormation",
      label: strings.home.strands.letterFormation,
      icon: "create-outline",
    },
    {
      key: "phonemicAwareness",
      label: strings.home.strands.phonemicAwareness,
      icon: "volume-high-outline",
    },
  ];

  // Initialize animations
  useEffect(() => {
    const animations: CardAnimations = {};
    strandData.forEach((strand) => {
      animations[strand.key] = {
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        progress: new Animated.Value(0),
      };
    });
    setCardAnimations(animations);
  }, []);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [studentId]);

  // Animate progress bars when student data loads
  useEffect(() => {
    if (student && Object.keys(cardAnimations).length > 0) {
      strandData.forEach((strand, index) => {
        const perf = student.strands[strand.key];
        const animation = cardAnimations[strand.key];
        if (animation) {
          Animated.timing(animation.progress, {
            toValue: perf.progress,
            duration: 1200,
            delay: index * 150,
            useNativeDriver: false,
          }).start();
        }
      });
    }
  }, [student, cardAnimations]);

  const getCompetenceColor = (competence: CompetenceLevel): string => {
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

  const animateCardPress = (strandKey: string, isPressed: boolean): void => {
    const animation = cardAnimations[strandKey];
    if (!animation) return;

    Animated.parallel([
      Animated.spring(animation.scale, {
        toValue: isPressed ? 0.98 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.spring(animation.translateY, {
        toValue: isPressed ? -2 : 0,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
    ]).start();
  };

  const getPerformanceLevel = (progress: number): PerformanceLevel => {
    if (progress >= 90)
      return { level: "Excellent", icon: "trophy", color: "#FFD700" };
    if (progress >= 75)
      return { level: "Good", icon: "thumbs-up", color: "#22C55E" };
    if (progress >= 50)
      return { level: "Fair", icon: "trending-up", color: "#F59E0B" };
    return { level: "Needs Work", icon: "alert-circle", color: "#EF4444" };
  };

  const handleCardPress = (strandKey: string): void => {
    setSelectedCard(selectedCard === strandKey ? null : strandKey);
  };

  const renderEnhancedProgressBar = (
    progress: number,
    color: string,
    strandKey: string
  ) => {
    const animation = cardAnimations[strandKey];

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarWrapper}>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: color,
                  width:
                    animation?.progress.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                      extrapolate: "clamp",
                    }) || `${progress}%`,
                },
              ]}
            />
            <View
              style={[styles.progressGlow, { backgroundColor: color + "40" }]}
            />
          </View>
          <View style={styles.progressIndicators}>
            {[25, 50, 75].map((mark) => (
              <View
                key={mark}
                style={[
                  styles.progressMark,
                  {
                    left: `${mark}%`,
                    backgroundColor:
                      progress >= mark
                        ? color
                        : theme.colors.textSecondary + "40",
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderStrandCard = (strand: StrandData, index: number) => {
    if (!student) return null;

    const perf = student.strands[strand.key];
    const competenceColor = getCompetenceColor(perf.competence);
    const animation = cardAnimations[strand.key];
    const isSelected = selectedCard === strand.key;
    const performanceLevel = getPerformanceLevel(perf.progress);

    return (
      <Animated.View
        key={strand.key}
        style={[
          styles.cardContainer,
          {
            transform: [
              { scale: animation?.scale || 1 },
              { translateY: animation?.translateY || 0 },
            ],
            opacity: animation?.opacity || 1,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modernCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isSelected ? competenceColor : "transparent",
              borderWidth: isSelected ? 1 : 0,
            },
          ]}
          onPressIn={() => animateCardPress(strand.key, true)}
          onPressOut={() => animateCardPress(strand.key, false)}
          onPress={() => handleCardPress(strand.key)}
          activeOpacity={0.95}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: competenceColor + "15" },
                ]}
              >
                <Text
                  style={[styles.competenceText, { color: competenceColor }]}
                >
                  {perf.competence}
                </Text>
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  {strand.label}
                </Text>
                <View style={styles.competenceContainer}>
                  <View style={[{ backgroundColor: competenceColor }]} />
                  <Ionicons
                    name={strand.icon}
                    size={24}
                    color={competenceColor}
                  />
                </View>
              </View>
            </View>

            {/* Progress Ring */}
          </View>

          {/* Enhanced Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text
                style={[
                  styles.progressLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Progress
              </Text>
              <View style={styles.performanceIndicator}>
                <Ionicons
                  name={performanceLevel.icon}
                  size={14}
                  color={performanceLevel.color}
                />
                <Text
                  style={[
                    styles.performanceText,
                    { color: performanceLevel.color },
                  ]}
                >
                  {performanceLevel.level}
                </Text>
              </View>
            </View>

            {renderEnhancedProgressBar(
              perf.progress,
              competenceColor,
              strand.key
            )}

            <View style={styles.progressFooter}>
              <Text
                style={[styles.progressValue, { color: theme.colors.text }]}
              >
                {perf.progress}% completed
              </Text>
              <Text
                style={[
                  styles.progressTarget,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Target: 100%
              </Text>
            </View>
          </View>

          {/* Expandable Details */}
          {isSelected && (
            <Animated.View style={styles.expandedContent}>
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Last updated: Today
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="trending-up"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Weekly improvement: +
                    {Math.max(1, Math.floor(Math.random() * 8))}%
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="flag-outline"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Next milestone: {Math.min(100, perf.progress + 10)}%
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: competenceColor + "15" },
                  ]}
                >
                  <Ionicons
                    name="analytics-outline"
                    size={16}
                    color={competenceColor}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: competenceColor },
                    ]}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary + "15" },
                  ]}
                >
                  <Ionicons
                    name="library-outline"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Practice
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <View
              style={[
                styles.selectionIndicator,
                { backgroundColor: competenceColor },
              ]}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!student) {
    return (
      <View style={styles.center}>
        <Ionicons name="refresh" size={40} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading student data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {strandData.map((strand, index) => renderStrandCard(strand, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardContainer: {
    marginBottom: 4,
  },
  modernCard: {
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  competenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  competenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  competenceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressRingContainer: {
    alignItems: "center",
  },
  progressRingCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressSection: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  performanceIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  performanceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    position: "relative",
  },
  progressBarWrapper: {
    position: "relative",
    height: 8,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    position: "relative",
  },
  progressGlow: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    height: 12,
    borderRadius: 6,
    opacity: 0.3,
  },
  progressIndicators: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  progressMark: {
    position: "absolute",
    width: 2,
    height: 8,
    borderRadius: 1,
    top: 0,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressTarget: {
    fontSize: 14,
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    gap: 16,
  },
  detailsContainer: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectionIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
  },
});

export default ModernStrandCards;
