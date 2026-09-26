import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: About,
  head: () =>
    pageSeo({
      title: "About SEEK — Bible Search & Reading | SEEK",
      description:
        "What SEEK is: a free, ad-free way to search and read the King James Bible (KJV) by wording or by meaning. All 66 books, 1,189 chapters, 31,102 verses.",
      path: "/about",
    }),
});

const EMAIL = "vijay.peddenti434@gmail.com";

function About() {
  return (
    <InfoPage
      title="About SEEK"
      lede="SEEK is a small, independent place to meet the Word: search the King James Bible by a half-remembered word, a fragment, or the meaning behind it — then read the chapter slowly."
      sections={[
        {
          title: "What SEEK is",
          body: (
            <>
              <p>
                SEEK is a Bible search and reading website. It holds the whole King
                James Version — 66 books, 1,189 chapters, 31,102 verses — and lets
                you find a verse two ways: by the exact wording you remember, or by
                the meaning you are after, when you only know the feeling behind the
                word.
              </p>
              <p className="mt-3">
                Once you find it, you can read the full chapter in a calm page mode
                or a scrolling mode, in day or night themes, and save the verses
                that hold you.
              </p>
            </>
          ),
        },
        {
          title: "The text",
          body: (
            <p>
              All scripture on SEEK is the King James Version (KJV), the Authorized
              Version of 1611. That text is in the public domain, so there is nothing
              to license and nothing to sell. SEEK does not offer other translations,
              and it does not alter the KJV text — what you read is the KJV.
            </p>
          ),
        },
        {
          title: "What it costs",
          body: (
            <p>
              Nothing. SEEK is free for everyone, with no advertising, no trackers,
              and no paywall. See{" "}
              <Link
                to="/pricing"
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                Pricing
              </Link>{" "}
              for the details.
            </p>
          ),
        },
        {
          title: "Reading and saving",
          body: (
            <p>
              You can read and search the whole Bible without an account, and that
              will never change. To save verses, SEEK asks you to sign in or create a
              free account — that is what lets your saved verses follow you to any
              device. Up to 200 verses can be saved. How we handle your data is
              described in the{" "}
              <Link
                to="/privacy"
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                Privacy Notice
              </Link>
              .
            </p>
          ),
        },
        {
          title: "Get in touch",
          body: (
            <p>
              Questions, corrections, or something you would like SEEK to do better —
              write to{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                {EMAIL}
              </a>
              . You can also{" "}
              <Link
                to="/report-bug"
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                report a bug
              </Link>{" "}
              or{" "}
              <Link
                to="/faq"
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                read the FAQ
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
