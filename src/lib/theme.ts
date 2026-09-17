export type Theme = "light" | "dark";

export const THEME_KEY = "seek-theme";

export const THEME_COLORS = {
  light: "#f7f5f0",
  dark: "#0c0d12",
} as const;

/** iOS status bar: dark icons on light, light icons on dark translucent */
export const STATUS_BAR_STYLES = {
  light: "default",
  dark: "black-translucent",
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

  // Keep system clock / battery readable on both themes (esp. light mode)
  let status = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!status) {
    status = document.createElement("meta");
    status.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    document.head.appendChild(status);
  }
  status.setAttribute("content", STATUS_BAR_STYLES[theme]);
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
