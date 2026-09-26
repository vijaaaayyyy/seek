export type Theme = "light" | "dark";

export const THEME_KEY = "seek-theme";

export const THEME_COLORS = {
  light: "#f7f5f0",
  dark: "#0c0d12",
} as const;

/** iOS status bar style */
export const STATUS_BAR_STYLES = {
  light: "default", // dark icons on light bar
  dark: "black-translucent", // light icons on dark bar
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

/**
 * Aggressively sync the system status / quick-settings bar color.
 * Android Chrome only updates reliably if we replace theme-color metas
 * (not just mutate content) and keep color-scheme in sync.
 */
export function applyChrome(theme: Theme, opts?: { darkSurface?: boolean }) {
  if (typeof document === "undefined") return;

  const darkSurface = opts?.darkSurface ?? theme === "dark";
  const themeColor = darkSurface ? THEME_COLORS.dark : THEME_COLORS.light;
  const statusStyle = darkSurface ? STATUS_BAR_STYLES.dark : STATUS_BAR_STYLES.light;

  // Keep HTML color-scheme aligned so system UI (time, battery icons) invert correctly
  const root = document.documentElement;
  root.style.colorScheme = darkSurface ? "dark" : "light";
  try {
    if (document.body) {
      document.body.style.colorScheme = darkSurface ? "dark" : "light";
    }
  } catch {
    /* private mode */
  }

  // Remove every existing theme-color so stale media queries can’t win
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

  const head = document.head;
  const make = (content: string, media?: string) => {
    const el = document.createElement("meta");
    el.setAttribute("name", "theme-color");
    el.setAttribute("content", content);
    if (media) el.setAttribute("media", media);
    head.appendChild(el);
  };

  // Primary + both schemes forced to the same color (no cream bar in dark mode)
  make(themeColor);
  make(themeColor, "(prefers-color-scheme: light)");
  make(themeColor, "(prefers-color-scheme: dark)");

  // iOS / installed web app status bar
  let apple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!apple) {
    apple = document.createElement("meta");
    apple.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    head.appendChild(apple);
  }
  apple.setAttribute("content", statusStyle);

  // Second tick — some Android WebViews only repaint on a delayed update
  window.setTimeout(() => {
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
      el.setAttribute("content", themeColor);
    });
  }, 50);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  // Base color-scheme follows theme; applyChrome may override on dark surfaces (home)
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
