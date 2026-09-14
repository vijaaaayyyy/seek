import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { persistTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

function subscribe(onStoreChange: () => void) {
  const onTheme = () => onStoreChange();
  window.addEventListener("seek-theme", onTheme);
  window.addEventListener("storage", onTheme);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onTheme);
  return () => {
    window.removeEventListener("seek-theme", onTheme);
    window.removeEventListener("storage", onTheme);
    media.removeEventListener("change", onTheme);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    persistTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
