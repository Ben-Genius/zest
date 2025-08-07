import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { AuthContext } from "@/src/navigators";
import { Ionicons } from "@expo/vector-icons";
import strings from "@/src/constant/strings";

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { logout } = useContext(AuthContext);
  const [autoDownload, setAutoDownload] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogout = () => {
 Alert.alert(
   strings.settings.logout.confirmTitle,
   strings.settings.logout.confirmMessage,
   [
     { text: "Cancel", style: "cancel" },
     {
       text: strings.settings.logout.button,
       style: "destructive",
       onPress: logout,
     },
   ]
 );

  };

  const handleThemeToggle = () => {
    try {
      toggleTheme();
    } catch (error) {
      console.warn("Theme toggle error:", error);
    }
  };

  const handleAutoDownloadToggle = (value: boolean) => {
    try {
      setAutoDownload(value);
    } catch (error) {
      console.warn("Auto download toggle error:", error);
    }
  };

  const settingsSections = [
    {
      title: strings.settings.account,
      items: [
        {
          icon: "person-outline",
          title: strings.settings.profileInfo.title,
          subtitle: strings.settings.profileInfo.subtitle,
          onPress: () => console.log("Profile pressed"),
          showArrow: true,
        },
        {
          icon: "shield-checkmark-outline",
          title: strings.settings.privacy.title,
          subtitle: strings.settings.privacy.subtitle,
          onPress: () => console.log("Privacy pressed"),
          showArrow: true,
        },
      ],
    },
    {
      title: strings.settings.preferences,
      items: [
        {
          icon: "moon-outline",
          title: strings.settings.darkMode.title,
          subtitle: strings.settings.darkMode.subtitle,
          component: (
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              thumbColor={isDark ? theme.colors.primary : "#f4f3f4"}
              trackColor={{
                false: "#767577",
                true: theme.colors.primary + "40",
              }}
            />
          ),
        },
        {
          icon: "download-outline",
          title: strings.settings.autoDownload.title,
          subtitle: strings.settings.autoDownload.subtitle,
          component: (
            <Switch
              value={autoDownload}
              onValueChange={handleAutoDownloadToggle}
              thumbColor={autoDownload ? theme.colors.primary : "#f4f3f4"}
              trackColor={{
                false: "#767577",
                true: theme.colors.primary + "40",
              }}
            />
          ),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={item.onPress}
      disabled={!item.onPress}
      activeOpacity={item.onPress ? 0.7 : 1}
    >
      <View style={styles.settingItemLeft}>
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: theme.colors.primary + "15" },
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={22}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.settingSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {item.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.settingItemRight}>
        {item.component ||
          (item.showArrow && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          ))}
      </View>
    </TouchableOpacity>
  );

  // Add a safety check for theme
  if (!theme || !theme.colors) {
    return (
      <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {strings.settings.headerTitle}
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}
        >
          {strings.settings.headerSubtitle}
        </Text>
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Profile Card */}
          <View
            style={[
              styles.profileCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.profileInfo}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.avatarText}>AG</Text>
              </View>
              <View style={styles.profileDetails}>
                <Text
                  style={[styles.profileName, { color: theme.colors.text }]}
                >
                  {strings.settings.profileName}
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {strings.settings.profileEmail}
                </Text>
                <View style={styles.profileMeta}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.colors.masteryME + "20" },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: theme.colors.masteryME },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: theme.colors.masteryME },
                      ]}
                    >
                      {strings.settings.profileStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {section.title}
              </Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) =>
                  renderSettingItem(item, itemIndex)
                )}
              </View>
            </View>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text
              style={[
                styles.appInfoText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {strings.settings.appInfo.version}
            </Text>
            <Text
              style={[
                styles.appInfoText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {strings.settings.appInfo.tagline}s{" "}
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                borderColor: theme.colors.error,
                backgroundColor: theme.colors.error + "10",
              },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              {strings.settings.logout.button}
            </Text>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  profileMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingItemRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: "center",
    marginBottom: 24,
    gap: 4,
  },
  appInfoText: {
    fontSize: 14,
    textAlign: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});
