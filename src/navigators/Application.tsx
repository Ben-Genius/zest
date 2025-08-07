import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import HomeTabsNavigator from "./Main";
import StudentDetail from "../screens/StudentDetail.tsx/studentDetail";

const Stack = createStackNavigator<RootStackParamList>();

export default function ApplicationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={HomeTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetail}
        options={{
          title: "Student Details",
          headerTitleAlign: "center",
          headerTitleStyle: { marginRight: 50 },
        }}
      />
    </Stack.Navigator>
  );
}
