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



const MainTabs = createBottomTabNavigator<HomeTabParamList>();

const HomeTabsNavigator: React.FC = () => {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: baseColors.primary, // iOS blue for active tab
        tabBarInactiveTintColor: baseColors.gray500,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 50 : 80, // Adjust for iOS safe area
        },
        tabBarLabelStyle: {
          ...typography.caption
        },
      }}
    >
      <MainTabs.Screen
        name="Home"
        component={ClassPerformance}
        options={{
          tabBarLabel: "Class",
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
          tabBarLabel: "Students",
          tabBarIcon: ({ focused, color, size }) => (
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
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color, size }) => (
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
