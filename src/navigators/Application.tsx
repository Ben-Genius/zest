import React from "react";

import StudentDetail from "../screens/StudentDetail.tsx/studentDetail";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTabsNavigator from "./Main";
import { RootStackParamList } from ".";


// Create navigators
const Stack = createStackNavigator<RootStackParamList>();

// Root Navigator (handles auth and main app flow)
export default function ApplicationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetail}
        options={{
          title: "Student Details",
          headerTitleAlign: "center",
          headerTitleStyle: {marginRight:50}
        }}
      />
    </Stack.Navigator>
  );
}
