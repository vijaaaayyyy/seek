import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderView = "book" | "scroll";

type SeekState = {
  recent: string[];
  rememberQuery: (q: string) => void;
  clearRecent: () => void;
  readerView: ReaderView;
  setReaderView: (view: ReaderView) => void;
};

export const useSeekStore = create<SeekState>()(
  persist(
    (set, get) => ({
      recent: [],
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
      readerView: "book",
      setReaderView: (view) => set({ readerView: view }),
    }),
    { name: "seek-bible" },
  ),
);