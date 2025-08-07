// src/theme/typography.ts
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

export const typography = {
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  subheading: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
};

export type Typography = typeof typography;
