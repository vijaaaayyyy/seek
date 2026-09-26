import { createServerFn } from "@tanstack/react-start";
import { chapterText } from "@/lib/bible/kjv.server";

/**
 * One chapter of KJV text, fetched from the server.
 *
 * This exists purely so a chapter URL has its text in the server-rendered HTML.
 * The browser still fetches the whole Bible for search and paging, and once it
 * does, the reader takes over from this.
 *
 * Failures resolve to null rather than throwing: a chapter page that cannot be
 * server-rendered should still render for a human, exactly as it did before.
 */
export const loadChapterText = createServerFn({ method: "GET" })
  .validator((input: { bookIndex: number; chapter: number }) => ({
    bookIndex: Math.max(0, Math.min(65, Math.floor(Number(input.bookIndex) || 0))),
    chapter: Math.max(1, Math.min(150, Math.floor(Number(input.chapter) || 1))),
  }))
  .handler(async ({ data }): Promise<string[] | null> => {
    try {
      return chapterText(data.bookIndex, data.chapter)?.verses ?? null;
    } catch {
      return null;
    }
  });
