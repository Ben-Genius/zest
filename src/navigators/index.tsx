import React, { createContext, useState } from "react";
import AuthNavigator from "./Auth";
import { ThemeProvider } from "../theme/ThemeProvider";
import ApplicationNavigator from "./Application";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Define types for the stack navigators
export type AuthStackParamList = {
  SignIn: undefined;
  Home: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  StudentDetail: { studentId: string };
  SignIn: undefined;
};

export type HomeTabParamList = {
  Home: undefined;
  Students: undefined;
  Settings: undefined;
};

// Auth context to manage login state
const AuthContext = createContext<{
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void; // Add logout here
}>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}, // Add a placeholder function
});

// Root Navigator (handles auth and main app flow)
export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authContextValue = {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false), // Define the logout function
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <SafeAreaProvider>
        <ThemeProvider>
          {isLoggedIn ? <ApplicationNavigator /> : <AuthNavigator />}
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

// Export AuthContext for use in SignIn screen
export { AuthContext };
