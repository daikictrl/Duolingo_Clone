export const colors = {
  primary: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutrals: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
} as const;

export const COLORS = {
  // Brand colors
  primary: "#6C4EF5",       // Lingua Purple
  primaryDark: "#5B3BF6",   // Lingua Deep Purple (3D shadow / pressed state)
  secondary: "#4D8BFF",     // Lingua Blue
  secondaryDark: "#3575E6", // Lingua Dark Blue (3D shadow)
  
  // Semantic feedback / progress states
  success: "#21C16B",       // Lingua Green
  successDark: "#159E52",   // Green 3D shadow
  warning: "#FFC800",       // System Yellow
  warningDark: "#D99C00",   // Yellow 3D shadow
  streak: "#FF8A00",        // Streak Orange
  streakDark: "#D46200",    // Orange 3D shadow
  error: "#FF4D4F",         // System Red
  errorDark: "#CC3637",     // Red 3D shadow
  info: "#4D8BFF",          // Info Blue
  infoDark: "#3575E6",      // Info Blue shadow

  // Neutral colors
  textPrimary: "#0D132B",   // Headings, body titles
  textSecondary: "#6B7280", // Subheadings, caption helper texts
  border: "#E5E7EB",        // Division lines, light card borders
  surface: "#F6F7FB",       // Card background surfaces
  background: "#FFFFFF",    // Base screen layout background
} as const;

export type ColorToken = keyof typeof COLORS;
