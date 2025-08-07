// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme, Theme } from "./index";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme(); // auto detect dark/light
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = useMemo(
    () => ({
      theme: isDark ? DarkTheme : LightTheme,
      toggleTheme,
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
