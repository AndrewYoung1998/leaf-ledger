/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Palette: Eucalyptus (nav/headers), Cedarwood (buttons/icons), Cloud White (cards), Sage Shadow (typography).
 */

/** App color palette - use these for consistent theming */
export const Palette = {
  eucalyptus: '#829079',   // Primary Navigation / Headers
  cedarwood: '#A67B5B',    // Buttons / Important Icons
  cloudWhite: '#F9F9F9',   // Card Backgrounds
  sageShadow: '#4E5945',   // Typography / Depth
  sageShadowLight: '#5c6b52', // Lighter sage for secondary text
  border: '#c4ccb8',       // Sage-tinted border
} as const;

const tintColorLight = Palette.eucalyptus;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: Palette.sageShadow,
    background: '#fff',
    tint: tintColorLight,
    icon: Palette.sageShadowLight,
    tabIconDefault: Palette.sageShadowLight,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
