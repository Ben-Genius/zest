// src/theme/useTheme.ts
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from './index';

export function useAppTheme() {
  const scheme = useColorScheme(); // returns 'dark' | 'light'
  return scheme === 'dark' ? DarkTheme : LightTheme;
}
