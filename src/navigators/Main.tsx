import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ClassPerformance from "../screens/ClassProfile/classPerformance";
import Settings from "../screens/Settings/settings";
import { typography } from "../theme/typography";
import { Platform } from "react-native";
import { baseColors } from "../theme/colors";
import Students from "../screens/Students/students";
import { HomeTabParamList } from ".";
import strings from "../constant/strings"; // ✅ Import strings
import { useTheme } from "../theme/ThemeProvider";

const MainTabs = createBottomTabNavigator<HomeTabParamList>();

const HomeTabsNavigator: React.FC = () => {
  const {theme,isDark} = useTheme()
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: baseColors.primary,
        tabBarInactiveTintColor: baseColors.gray500,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 50 : 80,
          backgroundColor:isDark ?  theme.colors.surface : theme.colors.background
        },
        tabBarLabelStyle: {
          ...typography.caption,
        },
       
      }}
    >
      <MainTabs.Screen
        name="Home"
        component={ClassPerformance}
        options={{
          tabBarLabel: strings.navigation.tabs.class, // ✅ Use string
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <MainTabs.Screen
        name="Students"
        component={Students}
        options={{
          tabBarLabel: strings.navigation.tabs.students, // ✅ Use string
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <MainTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: strings.navigation.tabs.settings, // ✅ Use string
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

export default HomeTabsNavigator;
