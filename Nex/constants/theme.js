/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// import { Platform } from "react-native";

// const tintColorLight = "#0a7ea4";
// // const tintColorDark = "#fff";

export const Colors = {
  light: {
    /* ---------- Base ---------- */
    background: "#FFFFFF", // App background
    surface: "#FFFFFF", // Cards / sheets
    surfaceAlt: "#F8F9FA", // Subtle sections
    divider: "#EAEAEA",

    /* ---------- Text ---------- */
    textPrimary: "#11181C",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    textInverse: "#FFFFFF",

    /* ---------- Brand ---------- */
    primary: "#0A7EA4", // Brand / CTA
    primarySoft: "#E6F4F8",
    accent: "#D4AF37", // Gold accent (fits NexCard vibe)

    /* ---------- Icons ---------- */
    icon: "#687076",
    iconActive: "#0A7EA4",
    iconMuted: "#9CA3AF",

    /* ---------- Tabs ---------- */
    tabBackground: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#0A7EA4",
    tabBorder: "#F1F1F1",

    /* ---------- States ---------- */
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    /* ---------- Shadows ---------- */
    shadow: "rgba(0,0,0,0.08)",
  },

  dark: {
    /* ⚠️ Still WHITE UI as requested */
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F8F9FA",
    divider: "#EAEAEA",

    textPrimary: "#11181C",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    textInverse: "#FFFFFF",

    primary: "#0A7EA4",
    primarySoft: "#E6F4F8",
    accent: "#D4AF37",

    icon: "#687076",
    iconActive: "#0A7EA4",
    iconMuted: "#9CA3AF",

    tabBackground: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#0A7EA4",
    tabBorder: "#F1F1F1",

    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    shadow: "rgba(0,0,0,0.08)",
  },
};
