import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <InfoPage
      title="Terms of Use"
      lede="The short version: SEEK is a free, quiet place to read Scripture, and we only ask you to use it in a way that honours that."
      lastUpdated="September 2026"
      sections={[
        {
          title: "Using SEEK",
          body: (
            <p>
              SEEK is provided as-is for personal and non-commercial use. You may read, search, quote,
              and share Scripture found here. Scripture text is the King James Version, which is public
              domain — you are free to use the verses themselves in your own writing.
            </p>
          ),
        },
        {
          title: "What we ask of you",
          body: (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
              <li>Don't try to break, overload, or abuse the service.</li>
              <li>Don't scrape or republish the app's own design and software.</li>
              <li>Don't use SEEK to misrepresent or denigrate the faith it serves.</li>
            </ul>
          ),
        },
        {
          title: "Our software, your verses",
          body: (
            <p>
              SEEK's design and software rights are reserved to us. The Bible text — every verse — is
              public domain and yours. Anything you save against your account belongs to you, and you may
              delete it at any time.
            </p>
          ),
        },
        {
          title: "No warranty",
          body: (
            <p>
              SEEK is offered in good faith, without warranty. We aim to keep it accurate and available,
              but we can't promise it will never have a technical fault.
            </p>
          ),
        },
        {
          title: "Getting in touch",
          body: (
            <p>
              Questions about these terms? Reach us through the{" "}
              <a href="mailto:vijay.peddenti434@gmail.com?subject=SEEK%20terms" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">
                contact email
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}