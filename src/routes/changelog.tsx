import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";
import { APP_VERSION, APP_VERSION_LABEL } from "@/lib/version";

export const Route = createFileRoute("/changelog")({
  component: Changelog,
  head: () =>
    pageSeo({
      title: "Changelog | SEEK",
      description: `Every release of SEEK, the free King James Bible search and reading app. You are running ${APP_VERSION_LABEL}.`,
      path: "/changelog",
    }),
});

type Release = {
  version: string;
  date: string;
  /** Optional one-line summary shown under the version heading. */
  summary?: string;
  /** Grouped notes. When absent, `notes` is used as a single flat list. */
  groups?: { title: string; notes: string[] }[];
  notes?: string[];
};

const ENTRIES: Release[] = [
  {
    version: APP_VERSION,
    date: "26 Sept 2026",
    summary:
      "A search-visibility and clarity pass. Every page now says what it is, to search engines and to you — and the site stops claiming things it does not do.",
    groups: [
      {
        title: "The footer, rebuilt",
        notes: [
          "The footer is now fully centred, with the facts stated plainly: KJV 1611, 66 books, 1,189 chapters, 31,102 verses, free, no ads, no trackers, no paywall.",
          "A large SEEK wordmark closes the page, faded from top to bottom so it reads as texture rather than a second headline.",
          "Fixed the forest illustration bleeding in behind the last screen of content on mobile — the page now ends on the wordmark, as intended.",
        ],
      },
      {
        title: "Search visibility",
        notes: [
          "Every page now has its own unique title, meta description, canonical URL and robots directive. Previously thirteen routes had none at all.",
          "Search results, saved verses, Explore, Login, Profile and the sign-in callback are now explicitly noindex, follow — personal and transient pages stay out of the index while still passing link equity onward.",
          "Search-result pages carry a per-query title for sharing, but all canonicalise to the single /search URL. Without that, every typo and every page number would have been a separate indexable page.",
          "A chapter URL for a book or chapter that does not exist now returns a real 404 instead of a 200 with a blank scripture pane. Invalid verses are also marked noindex, so they cannot be indexed by accident.",
          "Chapter structured data was invalid schema.org and is now correct: WebPage, Book and BreadcrumbList, with no fake chapter or verse counts.",
          "The sitemap grew from 1,191 URLs to 1,200 — it now includes About, FAQ, Groups, Download, Pricing, Changelog, Privacy, Terms and Report a bug.",
          "The share card and browser title now read SEEK, with a description that matches what the site actually offers.",
        ],
      },
      {
        title: "New and reshaped pages",
        notes: [
          "New: About — what SEEK is, what text it serves, what it costs, and how saving works.",
          "New: Groups — how to use SEEK in a church group, class or small group, with a fifteen-minute walkthrough and a way to ask for one.",
          "/demo now permanently redirects to /groups, so the old link keeps working and lands somewhere real.",
          "Pricing rewritten. The two fake “Seeker” and “Abiding” tiers are gone; it is now simply what free includes, with the real 200-verse limit.",
        ],
      },
      {
        title: "Corrections to what we told you",
        notes: [
          "Saving verses needs a free account — it was described in several places as working without one, and that was wrong. Reading and searching never need an account, and still never will.",
          "The saved-verse limit is 200, not the 25 we had written.",
          "Removed a “reading history” feature that does not exist.",
          "The Privacy Notice now describes precisely what is stored, and only on sign-in.",
          "SEEK is now versioned. The number is shown in the footer and at the top of this page — you are reading v14.5.6.",
        ],
      },
      {
        title: "Unchanged on purpose",
        notes: [
          "The Scripture is untouched. Still the King James Version, all 31,102 verses, exactly as before.",
          "The domain is unchanged.",
        ],
      },
    ],
  },
  {
    version: "14.5.0",
    date: "Sept 2026",
    summary:
      "The reading experience settles in: a calmer footer, richer “SEEK by the heart” topics, and a theme switch that matches the navigation.",
    notes: [
      "New antique parchment footer with centered navigation.",
      "Rebuilt “SEEK by the heart” topics with richer cards.",
      "Sun/moon switch now matches the top navigation island.",
      "New pages: Pricing, FAQ, Changelog, Privacy, Terms, Report a bug.",
    ],
  },
  {
    version: "14.0.0",
    date: "Aug 2026",
    summary: "The first public release of SEEK.",
    notes: [
      "Full King James Bible: 66 books, 1,189 chapters, 31,102 verses.",
      "Search by meaning across the whole Bible.",
      "Save verses to keep close. A free account is required, and saved verses follow you across your devices.",
      "Scroll and page reading modes, day & night themes.",
      "Installable as an app on phone, tablet and desktop.",
    ],
  },
];

function Changelog() {
  return (
    <InfoPage
      title="Changelog"
      lede={`Every change that shapes SEEK. You are running ${APP_VERSION_LABEL}. We believe honest, open books matter as much as quiet reading does.`}
      sections={[
        {
          title: "How SEEK is versioned",
          body: (
            <div className="space-y-3">
              <p>
                SEEK is versioned{" "}
                <span className="font-medium text-ink">MAJOR.MINOR.PATCH</span> — the
                number you see in the footer, and at the top of this page.
              </p>
              <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
                <li>
                  <span className="font-medium text-ink">MAJOR</span> — a redesign, or
                  a change that breaks something you relied on.
                </li>
                <li>
                  <span className="font-medium text-ink">MINOR</span> — new features
                  and new pages.
                </li>
                <li>
                  <span className="font-medium text-ink">PATCH</span> — fixes, and
                  corrections to what we got wrong.
                </li>
              </ul>
              <p>
                SEEK began on a 1.x line. It now runs on 14.x, and the releases below
                are all on that one line — so every entry is comparable with every
                other. Only released versions are listed; work between them ships as
                part of the next number.
              </p>
            </div>
          ),
        },
        ...ENTRIES.map((e) => {
          const isCurrent = e.version === APP_VERSION;
          return {
            title: `${e.version} — ${e.date}${isCurrent ? "  ·  current" : ""}`,
            body: (
              <>
                {e.summary ? (
                  <p className="mb-4 font-sans text-[13.5px] leading-relaxed text-ink/80">
                    {e.summary}
                  </p>
                ) : null}

                {e.groups ? (
                  <div className="space-y-5">
                    {e.groups.map((g) => (
                      <div key={g.title}>
                        <h3 className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest uppercase">
                          {g.title}
                        </h3>
                        <ul className="mt-2.5 list-disc space-y-1.5 pl-5 marker:text-forest">
                          {g.notes.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
                    {e.notes?.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </>
            ),
          };
        }),
      ]}
    />
  );
}
