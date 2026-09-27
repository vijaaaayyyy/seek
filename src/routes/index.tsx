import { createFileRoute } from "@tanstack/react-router";
import { canonical, siteStructuredData } from "@/lib/seo";
import { Home } from "@/components/home-page";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SEEK — Bible Search & Scripture Discovery" },
      {
        name: "description",
        content:
          "Search and read the King James Bible on SEEK. Find a verse by a half-remembered word, a fragment, or the meaning you meant — all 66 books, 1,189 chapters, free.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { "script:ld+json": siteStructuredData() },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
});
