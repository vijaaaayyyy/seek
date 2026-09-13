import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadBible, type LoadedBible } from "@/lib/bible/load";

type BibleContextValue = {
  bible: LoadedBible | null;
  ready: boolean;
  error: string | null;
};

const BibleContext = createContext<BibleContextValue>({
  bible: null,
  ready: false,
  error: null,
});

export function BibleProvider({ children }: { children: ReactNode }) {
  const [bible, setBible] = useState<LoadedBible | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadBible()
      .then((data) => {
        if (!cancelled) setBible(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load the Bible.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BibleContext.Provider value={{ bible, ready: Boolean(bible), error }}>
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  return useContext(BibleContext);
}
