// src/theme/colors.ts
export const baseColors = {
  primary: "#fac85b",
  secondary: "#faf3e8",
  error: "#FF3B30",
  warning: "#FFCC00",
  success: "#34C759",
  info: "#bbdefb4c",

  // Mastery levels
  masteryBE: "#FF3B30", // Below Expectation
  masteryAE: "#FFCC00", // Approaching Expectation
  masteryME: "#34C759", // Meeting Expectation
  masteryEE: "#007AFF", // Exceeding Expectation

  black: "#000000",
  white: "#FFFFFF",
  gray100: "#f2f2f278",
  gray200: "#E5E5EA",
  gray300: "#D1D1D6",
  gray400: "#C7C7CC",
  gray500: "#8E8E93",
  gray600: "#636366",
  gray700: "#3A3A3C",
  gray800: "#1C1C1E",
  gray900: "#0D0D0D"
};

export const lightColors = {
  ...baseColors,
  background: baseColors.white,
  surface: baseColors.gray100,
  text: baseColors.black,
  textSecondary: baseColors.gray600,
  border: baseColors.gray200
};

export const darkColors = {
  ...baseColors,
  background: baseColors.gray900,
  surface: baseColors.gray800,
  text: baseColors.white,
  textSecondary: baseColors.gray300,
  border: baseColors.gray700
};

export type ThemeColors = typeof lightColors;
