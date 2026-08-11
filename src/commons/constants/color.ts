/**
 * Color Foundation Tokens
 * Source: Figma Style Guide / color (node: 2009:2601)
 *
 * Figma style names may contain typos (Sementic, secondeary, teritray, teritary).
 * Token keys below use corrected semantic naming for consumption.
 */

export const colorLight = {
  white: '#FFFFFF',

  bg: {
    brandDisabled: '#A1CDCF',
    brandPrimary: '#158187',
    brandSecondary: '#E5F3F4',
    disabled: '#F1F1F2',
    primary: '#FFFFFF',
    secondary: '#FBFBFB',
  },

  border: {
    brandPrimary: '#158187',
    brandTertiary: '#A1CDCF',
    primary: '#C2C4CD',
    secondary: '#626572',
    tertiary: '#F1F1F2',
  },

  icon: {
    brand: '#158187',
    disabled: '#C2C4CD',
    onPrimary: '#FFFFFF',
    primary: '#2A2C34',
    secondary: '#626572',
    tertiary: '#878B9B',
  },

  text: {
    brand: '#158187',
    disabled: '#C2C4CD',
    onPrimary: '#FFFFFF',
    placeholder: '#878B9B',
    primary: '#2A2C34',
    secondary: '#626572',
    tertiary: '#3F424E',
  },
} as const;

/**
 * Dark theme tokens derived from the same Figma palette.
 * Surfaces invert toward neutral darks; brand hues stay consistent.
 */
export const colorDark = {
  white: '#FFFFFF',

  bg: {
    brandDisabled: '#0D4A4E',
    brandPrimary: '#158187',
    brandSecondary: '#0A3336',
    disabled: '#3F424E',
    primary: '#2A2C34',
    secondary: '#1F2128',
  },

  border: {
    brandPrimary: '#158187',
    brandTertiary: '#0D4A4E',
    primary: '#626572',
    secondary: '#878B9B',
    tertiary: '#3F424E',
  },

  icon: {
    brand: '#A1CDCF',
    disabled: '#626572',
    onPrimary: '#FFFFFF',
    primary: '#FFFFFF',
    secondary: '#C2C4CD',
    tertiary: '#878B9B',
  },

  text: {
    brand: '#A1CDCF',
    disabled: '#626572',
    onPrimary: '#FFFFFF',
    placeholder: '#878B9B',
    primary: '#FFFFFF',
    secondary: '#C2C4CD',
    tertiary: '#878B9B',
  },
} as const;

export type ColorTheme = typeof colorLight;

/** Flat CSS custom property map (without `--` prefix). */
export const colorCssVars = {
  white: '--color-white',

  'bg-brand-disabled': '--color-bg-brand-disabled',
  'bg-brand-primary': '--color-bg-brand-primary',
  'bg-brand-secondary': '--color-bg-brand-secondary',
  'bg-disabled': '--color-bg-disabled',
  'bg-primary': '--color-bg-primary',
  'bg-secondary': '--color-bg-secondary',

  'border-brand-primary': '--color-border-brand-primary',
  'border-brand-tertiary': '--color-border-brand-tertiary',
  'border-primary': '--color-border-primary',
  'border-secondary': '--color-border-secondary',
  'border-tertiary': '--color-border-tertiary',

  'icon-brand': '--color-icon-brand',
  'icon-disabled': '--color-icon-disabled',
  'icon-on-primary': '--color-icon-on-primary',
  'icon-primary': '--color-icon-primary',
  'icon-secondary': '--color-icon-secondary',
  'icon-tertiary': '--color-icon-tertiary',

  'text-brand': '--color-text-brand',
  'text-disabled': '--color-text-disabled',
  'text-on-primary': '--color-text-on-primary',
  'text-placeholder': '--color-text-placeholder',
  'text-primary': '--color-text-primary',
  'text-secondary': '--color-text-secondary',
  'text-tertiary': '--color-text-tertiary',
} as const;

export type ColorCssVarKey = keyof typeof colorCssVars;

/** Default export: light semantic palette (Figma foundation). */
export const color = colorLight;

export default color;
