import { baseColors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text ,StyleSheet} from "react-native";

// Define interface for StatCard props
interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: string;
  color?: string;
}

const StatCard = ({
  label,
  value,
  subtext,
  icon,
  color = "#3B82F6",
}: StatCardProps) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statCardHeader}>
      <Ionicons name={icon} size={18} color={color} style={styles.statIcon} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={[styles.statNumber, { color }]}>{value}</Text>
    <Text style={styles.statSubtext}>{subtext}</Text>
  </View>
);

const styles = StyleSheet.create({

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
  
});
export default StatCard
