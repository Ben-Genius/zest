import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Strand } from "@/src/types";

// Types
interface StrandStudent {
  studentId: string;
  name: string;
  competence: string;
  avatar?: string;
  lastActivity?: string;
  performance?: "excellent" | "good" | "needs-improvement" | "at-risk";
}

interface StrandListProps {
  filteredStrands: Strand[];
  navigation: any;
  theme: any;
  baseColors: any;
  strings: any;
  onStrandPress?: (strand: Strand) => void;
  onStudentPress?: (student: StrandStudent) => void;
  onBulkAction?: (strandIds: string[], action: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");

const ScalableStrandList: React.FC<StrandListProps> = ({
  filteredStrands,
  navigation,
  theme,
  baseColors,
  strings,
  onStrandPress,
  onStudentPress,
  onBulkAction,
}) => {
  // State for enhanced functionality
  const [selectedStrands, setSelectedStrands] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [expandedStrands, setExpandedStrands] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("detailed");

  // Memoized calculations for performance
  const strandStats = useMemo(() => {
    const total = filteredStrands.length;
    const completed = filteredStrands.filter(
      (s) => s.workCovered === 100
    ).length;
    const inProgress = filteredStrands.filter(
      (s) => s.workCovered > 0 && s.workCovered < 100
    ).length;
    const notStarted = total - completed - inProgress;

    return { total, completed, inProgress, notStarted };
  }, [filteredStrands]);

  // Selection handlers
  const toggleStrandSelection = useCallback(
    (strandId: string) => {
      const newSelection = new Set(selectedStrands);
      if (newSelection.has(strandId)) {
        newSelection.delete(strandId);
      } else {
        newSelection.add(strandId);
      }
      setSelectedStrands(newSelection);

      if (newSelection.size === 0) {
        setIsSelectionMode(false);
      }
    },
    [selectedStrands]
  );

  const selectAllStrands = useCallback(() => {
    if (selectedStrands.size === filteredStrands.length) {
      setSelectedStrands(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedStrands(new Set(filteredStrands.map((s) => s.strandId)));
      setIsSelectionMode(true);
    }
  }, [filteredStrands, selectedStrands.size]);

  const toggleExpandStrand = useCallback(
    (strandId: string) => {
      const newExpanded = new Set(expandedStrands);
      if (newExpanded.has(strandId)) {
        newExpanded.delete(strandId);
      } else {
        newExpanded.add(strandId);
      }
      setExpandedStrands(newExpanded);
    },
    [expandedStrands]
  );

  // Utility functions
  const getCompetenceColor = (competence: string) => {
    const colorMap: { [key: string]: string } = {
      BE: "#FF3B30", // Below Expectation
      AE: "#FFCC00", // Approaching Expectation
      ME: "#34C759", // Meeting Expectation
      EE: "#007AFF", // Exceeding Expectation
    };
    return colorMap[competence] || theme.colors.primary;
  };

  const getPerformanceColor = (performance?: string) => {
    const colorMap: { [key: string]: string } = {
      excellent: "#34C759",
      good: "#8BC34A",
      "needs-improvement": "#FF9800",
      "at-risk": "#FF3B30",
    };
    return colorMap[performance || "good"] || theme.colors.textSecondary;
  };

  // Render functions
  const renderProgressBar = (workCovered: number, totalWork?: number) => {
    const progress = totalWork ? (workCovered / totalWork) * 100 : workCovered;
    const progressColor =
      progress < 30 ? "#FF3B30" : progress < 70 ? "#FF9800" : "#34C759";

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: progressColor },
            ]}
          />
        </View>
        <Text
          style={[styles.progressText, { color: theme.colors.textSecondary }]}
        >
          {progress.toFixed(0)}%
        </Text>
      </View>
    );
  };

  const renderStudentChip = (
    student: StrandStudent,
    index: number,
    isExpanded: boolean
  ) => (
    <TouchableOpacity
      key={student.studentId}
      style={[
        styles.studentChip,
        isExpanded ? styles.studentChipExpanded : styles.studentChipCompact,
        {
          backgroundColor: `${getCompetenceColor(student.competence)}20`,
          borderColor: getCompetenceColor(student.competence),
          marginLeft: !isExpanded && index > 0 ? -8 : 0,
          zIndex: 1000 - index,
          marginBottom: isExpanded ? 8 : 0,
        },
      ]}
      onPress={() => {
        if (onStudentPress) {
          onStudentPress(student);
        } else {
          navigation.navigate("StudentDetail", {
            studentId: student.studentId,
          });
        }
      }}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.studentAvatar,
          { backgroundColor: getCompetenceColor(student.competence) },
        ]}
      >
        <Text style={styles.studentAvatarText}>{student.competence}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text
          style={[styles.studentName, { color: theme.colors.text }]}
          numberOfLines={isExpanded ? 2 : 1}
        >
          {student.name}
        </Text>
        {isExpanded && student.performance && (
          <View style={styles.studentMeta}>
            <View
              style={[
                styles.performanceIndicator,
                { backgroundColor: getPerformanceColor(student.performance) },
              ]}
            />
            <Text
              style={[
                styles.performanceText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {student.performance.replace("-", " ")}
            </Text>
          </View>
        )}
      </View>
      {isExpanded && student.lastActivity && (
        <Text
          style={[styles.lastActivity, { color: theme.colors.textSecondary }]}
        >
          {student.lastActivity}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderBulkActions = () => (
    <View
      style={[
        styles.bulkActionsContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Text style={[styles.bulkActionsTitle, { color: theme.colors.text }]}>
        {selectedStrands.size} selected
      </Text>
      <View style={styles.bulkActionsButtons}>
        <TouchableOpacity
          style={[
            styles.bulkActionButton,
            { backgroundColor: baseColors.primary },
          ]}
          onPress={() => {
            Alert.alert(
              "Archive Strands",
              `Archive ${selectedStrands.size} selected strands?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Archive",
                  onPress: () => {
                    onBulkAction?.(Array.from(selectedStrands), "archive");
                    setSelectedStrands(new Set());
                    setIsSelectionMode(false);
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="archive" size={16} color="white" />
          <Text style={styles.bulkActionText}>Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bulkActionButton,
            { backgroundColor: baseColors.success },
          ]}
          onPress={() => {
            onBulkAction?.(Array.from(selectedStrands), "export");
            setSelectedStrands(new Set());
            setIsSelectionMode(false);
          }}
        >
          <Ionicons name="download" size={16} color="white" />
          <Text style={styles.bulkActionText}>Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {strandStats.total}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Total
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: baseColors.success }]}>
            {strandStats.completed}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: baseColors.warning }]}>
            {strandStats.inProgress}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            In Progress
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: baseColors.error }]}>
            {strandStats.notStarted}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.textSecondary }]}
          >
            Not Started
          </Text>
        </View>
      </View>
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={selectAllStrands}
        >
          <Ionicons
            name={
              selectedStrands.size === filteredStrands.length
                ? "checkbox"
                : "square-outline"
            }
            size={20}
            color={theme.colors.text}
          />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            Select All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={() =>
            setViewMode(viewMode === "compact" ? "detailed" : "compact")
          }
        >
          <Ionicons
            name={viewMode === "compact" ? "list" : "grid"}
            size={20}
            color={theme.colors.text}
          />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            {viewMode === "compact" ? "Detailed" : "Compact"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStrandItem = ({
    item,
    index,
  }: {
    item: Strand;
    index: number;
  }) => {
    const isSelected = selectedStrands.has(item.strandId);
    const isExpanded = expandedStrands.has(item.strandId);
    const isLastItem = index === filteredStrands.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.strandCard,
          viewMode === "detailed" && styles.strandCardCompact,
          {
            backgroundColor: isSelected
              ? `${baseColors.primary}20`
              : theme.colors.surface,
            borderColor: isSelected ? baseColors.primary : "transparent",
            borderWidth: isSelected ? 1 : 0,
            marginBottom: isLastItem ? 100 : 16,
          },
        ]}
        activeOpacity={0.7}
        onPress={() => {
          if (isSelectionMode) {
            toggleStrandSelection(item.strandId);
          } else if (onStrandPress) {
            onStrandPress(item);
          }
        }}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleStrandSelection(item.strandId);
        }}
      >
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={
                isSelected ? baseColors.primary : theme.colors.textSecondary
              }
            />
          </View>
        )}
        <View style={styles.strandHeader}>
          <View style={styles.strandTitleContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.strandTitle,
                  viewMode === "compact" && styles.strandTitleCompact,
                  { color: theme.colors.text },
                ]}
                numberOfLines={viewMode === "compact" ? 1 : 2}
              >
                {item.strand}
              </Text>
            </View>
            <View style={styles.strandMeta}>
              <Ionicons
                name="people"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.studentCount,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {item.students.length} students
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => toggleExpandStrand(item.strandId)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {(viewMode === "detailed" || isExpanded) && (
          <View style={styles.progressSection}>
            <Text
              style={[
                styles.progressLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Work Covered
            </Text>
            {renderProgressBar(item.workCovered)}
          </View>
        )}
        <View style={styles.studentsPreview}>
          <View style={styles.studentsPreviewHeader}>
            <Text
              style={[
                styles.studentsPreviewLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Students
            </Text>
          </View>
          <View
            style={[
              styles.studentChipsContainer,
              isExpanded && styles.studentChipsContainerExpanded,
            ]}
          >
            {(isExpanded ? item.students : item.students.slice(0, 3)).map(
              (student, studentIndex) =>
                renderStudentChip(student, studentIndex, isExpanded)
            )}
            {!isExpanded && item.students.length > 3 && (
              <TouchableOpacity
                style={[
                  styles.moreStudentsChip,
                  { backgroundColor: `${theme.colors.textSecondary}20` },
                ]}
                onPress={() => toggleExpandStrand(item.strandId)}
              >
                <Text
                  style={[
                    styles.moreStudentsText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  +{item.students.length - 3}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isSelectionMode && renderBulkActions()}
      <FlatList
        data={filteredStrands}
        keyExtractor={(item) => item.strandId}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        renderItem={renderStrandItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons
              name="filter"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              {strings.home.noStudent}
            </Text>
          </View>
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: viewMode === "compact" ? 120 : 200,
          offset: (viewMode === "compact" ? 120 : 200) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    paddingTop: 8,
  },
  headerContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  bulkActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bulkActionsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  bulkActionsButtons: {
    flexDirection: "row",
    gap: 8,
  },
  bulkActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  bulkActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  strandCard: {
    borderRadius: 16,
    padding: 16,
  },
  strandCardCompact: {
    padding: 12,
  },
  selectionIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  strandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  strandTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  strandTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  strandTitleCompact: {
    fontSize: 16,
  },
  strandMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  subjectText: {
    fontSize: 14,
    marginLeft: 4,
  },
  expandButton: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 35,
    textAlign: "right",
  },
  studentsPreview: {
    marginBottom: 8,
  },
  studentsPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  studentsPreviewLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  lastUpdated: {
    fontSize: 12,
  },
  studentChipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  studentChipsContainerExpanded: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  studentChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  studentChipCompact: {
    maxWidth: screenWidth * 0.3,
  },
  studentChipExpanded: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  studentAvatar: {
    width: 27,
    height: 27,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  studentAvatarText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    fontSize: 12,
    fontWeight: "500",
  },
  studentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  performanceIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  performanceText: {
    fontSize: 10,
  },
  lastActivity: {
    fontSize: 10,
    marginLeft: 8,
  },
  moreStudentsChip: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: -4,
  },
  moreStudentsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

export default ScalableStrandList;
