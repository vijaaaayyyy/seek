export type Theme = "light" | "dark";

export const THEME_KEY = "seek-theme";

export const THEME_COLORS = {
  light: "#ede6d8",
  dark: "#0c0d12",
} as const;

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* private mode */
  }
  return null;
}

export function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode */
  }
  applyTheme(theme);
  window.dispatchEvent(new Event("seek-theme"));
}
