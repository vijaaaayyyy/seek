import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/supa/middleware";
import { getSql } from "@/lib/db";

export type SavedVerse = {
  book: string;
  slug: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
};

export type SaveVerseInput = Omit<SavedVerse, "savedAt">;

/**
 * Every row is scoped to the verified caller — never trust a client-sent id.
 * `saved_at` is cast to epoch milliseconds (bigint -> number) so preview
 * (PGLite) and production (Supabase/Neon) return identical JSON-safe shapes.
 */
export const listSavedVerses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SavedVerse[]> => {
    const sql = await getSql();
    return sql<SavedVerse>`
      select book, slug, chapter, verse, text,
             cast(extract(epoch from saved_at) * 1000 as bigint) as "savedAt"
      from saved_verses
      where user_id = ${context.userId}
      order by saved_at desc
    `;
  });

export const saveVerse = createServerFn({ method: "POST" })
  .validator((input: SaveVerseInput) => {
    const verse = {
      book: input.book.trim().slice(0, 80),
      slug: input.slug.trim().slice(0, 40),
      chapter: Math.max(1, Math.floor(Number(input.chapter) || 1)),
      verse: Math.max(1, Math.floor(Number(input.verse) || 1)),
      text: input.text.trim().slice(0, 900),
    };
    return verse;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<SaveVerseInput> => {
    const sql = await getSql();
    await sql`
      insert into saved_verses (user_id, slug, book, chapter, verse, text)
      values (${context.userId}, ${data.slug}, ${data.book}, ${data.chapter}, ${data.verse}, ${data.text})
      on conflict (user_id, slug, chapter, verse) do nothing
    `;
    return data;
  });

export const removeSavedVerse = createServerFn({ method: "POST" })
  .validator((input: { slug: string; chapter: number; verse: number }) => ({
    slug: input.slug.trim().slice(0, 40),
    chapter: Math.max(1, Math.floor(Number(input.chapter) || 1)),
    verse: Math.max(1, Math.floor(Number(input.verse) || 1)),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      delete from saved_verses
      where user_id = ${context.userId} and slug = ${data.slug} and chapter = ${data.chapter} and verse = ${data.verse}
    `;
  });