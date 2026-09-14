import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import {
  listSavedVerses,
  removeSavedVerse,
  saveVerse,
  type SaveVerseInput,
  type SavedVerse,
} from "@/lib/saved-verses";

type Status = "idle" | "loading" | "ready" | "error";

type SavedContextValue = {
  saved: SavedVerse[];
  status: Status;
  isSaved: (slug: string, chapter: number, verse: number) => boolean;
  toggleSaved: (verse: SaveVerseInput) => Promise<void>;
  /** The verse waiting to be saved after sign-in, or null. */
  pendingSave: SaveVerseInput | null;
  clearPendingSave: () => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);

/**
 * Single saved-verses store per app region (the root), synced to the
 * signed-in user's rows in the database. Signed out, a save tap opens
 * the Oh noo! gate page that leads to sign-in.
 */
export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedVerse[]>([]);
  const [status, setStatus] = useState<Status>(isPending ? "loading" : user ? "idle" : "ready");
  const loadedFor = useRef<string | null>(null);
  const [pendingSave, setPendingSave] = useState<SaveVerseInput | null>(null);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (isPending) {
      setStatus("loading");
      return;
    }
    if (!userId) {
      loadedFor.current = null;
      setSaved([]);
      setStatus("ready");
      return;
    }
    if (loadedFor.current === userId) return;
    loadedFor.current = userId;
    let cancelled = false;
    setStatus("loading");
    listSavedVerses()
      .then((rows) => {
        if (cancelled) return;
        setSaved(rows);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        loadedFor.current = null;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  const isSaved = useCallback(
    (slug: string, chapter: number, verse: number) =>
      saved.some((s) => s.slug === slug && s.chapter === chapter && s.verse === verse),
    [saved],
  );

  const clearPendingSave = useCallback(() => setPendingSave(null), []);

  const toggleSaved = useCallback(
    async (verse: SaveVerseInput) => {
      if (!userId) {
        // Remember the verse, then send them to the full-page gate
        setPendingSave(verse);
        void navigate({
          to: "/save-gate",
          search: {
            redirect:
              typeof window !== "undefined"
                ? window.location.pathname + window.location.search + window.location.hash
                : "/",
          },
        });
        return;
      }
      const existed = isSaved(verse.slug, verse.chapter, verse.verse);
      setSaved((prev) =>
        existed
          ? prev.filter((s) => !(s.slug === verse.slug && s.chapter === verse.chapter && s.verse === verse.verse))
          : [{ ...verse, savedAt: Date.now() }, ...prev].slice(0, 200),
      );
      try {
        if (existed) await removeSavedVerse({ data: verse });
        else await saveVerse({ data: verse });
      } catch {
        setSaved((prev) =>
          existed
            ? [{ ...verse, savedAt: Date.now() }, ...prev]
            : prev.filter((s) => !(s.slug === verse.slug && s.chapter === verse.chapter && s.verse === verse.verse)),
        );
        toast("Could not update saved verses. Try again.");
      }
    },
    [isSaved, userId, navigate],
  );

  const value = useMemo(
    () => ({ saved, status, isSaved, toggleSaved, pendingSave, clearPendingSave }),
    [saved, status, isSaved, toggleSaved, pendingSave, clearPendingSave],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within <SavedProvider>");
  return ctx;
}
