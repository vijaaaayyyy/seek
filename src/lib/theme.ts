export type Theme = "light" | "dark";

export const THEME_KEY = "seek-theme";

export const THEME_COLORS = {
  light: "#f7f5f0",
  dark: "#0c0d12",
} as const;

/** iOS status bar: dark icons on light pages, light icons on dark surfaces */
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

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Status bar / theme-color chrome.
 * Home hero is always a dark forest photo — force light icons there even in light mode,
 * so time / battery stay visible.
 */
export function applyChrome(theme: Theme, opts?: { darkSurface?: boolean }) {
  const darkSurface = opts?.darkSurface ?? theme === "dark";
  const themeColor = darkSurface ? THEME_COLORS.dark : THEME_COLORS.light;
  const statusStyle = darkSurface ? STATUS_BAR_STYLES.dark : STATUS_BAR_STYLES.light;

  setMeta("theme-color", themeColor);
  setMeta("apple-mobile-web-app-status-bar-style", statusStyle);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const darkSurface = root.classList.contains("home-canopy") || theme === "dark";
  applyChrome(theme, { darkSurface });
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
