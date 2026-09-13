import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedVerse = {
  book: string;
  slug: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
};

type SeekState = {
  saved: SavedVerse[];
  recent: string[];
  toggleSaved: (verse: Omit<SavedVerse, "savedAt">) => void;
  isSaved: (slug: string, chapter: number, verse: number) => boolean;
  rememberQuery: (q: string) => void;
  clearRecent: () => void;
};

export const useSeekStore = create<SeekState>()(
  persist(
    (set, get) => ({
      saved: [],
      recent: [],
      toggleSaved: (verse) => {
        const key = `${verse.slug}:${verse.chapter}:${verse.verse}`;
        const exists = get().saved.some(
          (s) => `${s.slug}:${s.chapter}:${s.verse}` === key,
        );
        set({
          saved: exists
            ? get().saved.filter((s) => `${s.slug}:${s.chapter}:${s.verse}` !== key)
            : [{ ...verse, savedAt: Date.now() }, ...get().saved].slice(0, 200),
        });
      },
      isSaved: (slug, chapter, verse) =>
        get().saved.some(
          (s) => s.slug === slug && s.chapter === chapter && s.verse === verse,
        ),
      rememberQuery: (q) => {
        const query = q.trim();
        if (query.length < 2) return;
        set({
          recent: [query, ...get().recent.filter((x) => x.toLowerCase() !== query.toLowerCase())].slice(
            0,
            8,
          ),
        });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    { name: "seek-bible" },
  ),
);
