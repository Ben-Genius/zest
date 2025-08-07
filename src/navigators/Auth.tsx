import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../screens/Login/signIn";

export type RootStackParamList = {
  SignIn: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Root Navigator (handles auth and main app flow)
export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
