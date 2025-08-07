import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../theme/ThemeProvider";
import { AuthContext } from "../contexts/AuthContext";
import AuthNavigator from "./Auth";
import ApplicationNavigator from "./Application";

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authContextValue = {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
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
