// src/theme/ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme, Theme } from "./index";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme only once to prevent flickering
  useEffect(() => {
    if (!isInitialized) {
      setIsDark(systemColorScheme === "dark");
      setIsInitialized(true);
    }
  }, [systemColorScheme, isInitialized]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      theme: isDark ? DarkTheme : LightTheme,
      toggleTheme,
      isDark,
    }),
    [isDark]
  );

  // Don't render until initialized to prevent blank screen
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
