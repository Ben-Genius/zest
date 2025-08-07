// src/theme/index.ts
import { lightColors, darkColors, ThemeColors } from './colors';
import { typography, Typography } from './typography';
import { spacing, radius } from './spacing';

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: typeof spacing;
  radius: typeof radius;
  isDark: boolean;
}

export const LightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  radius,
  isDark: false,
};

export const DarkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  radius,
  isDark: true,
};
