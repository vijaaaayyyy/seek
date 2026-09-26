import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () =>
    pageSeo({
      title: "Pricing — SEEK Is Free | SEEK",
      description:
        "SEEK is free for everyone, forever. No ads, no trackers, no paywall. The King James Bible is public domain, so there is nothing to license and nothing to sell.",
      path: "/pricing",
    }),
});

const PLANS = [
  {
    name: "Reading",
    price: "Free",
    blurb: "Everything needed to search and read the King James Bible. No account, nothing to install.",
    features: [
      "Search all 31,102 verses by meaning",
      "Search by exact wording, phrase or fragment",
      "Read all 66 books, scroll & page mode",
      "Day & night reading modes",
      "Installable as an app on phone, tablet or desktop",
    ],
  },
  {
    name: "Saving",
    price: "Free",
    blurb: "For those who want to keep the Word close, on every device they sign in on.",
    requiresAccount: true,
    features: [
      "Everything in Reading",
      "Save up to 200 verses",
      "Saves follow you across your devices",
      "Sign out whenever you like — the account is optional",
    ],
  },
];

function Pricing() {
  return (
    <InfoPage
      title="Pricing"
      lede="The Word of God should never cost anything. SEEK is free — for everyone, forever. Scripture text is the public-domain King James Version (1611), so there is nothing to license and nothing to sell."
      sections={[
        {
          title: "What free includes",
          body: (
            <div className="grid gap-4 sm:grid-cols-2">
              {PLANS.map((p) => (
                <div key={p.name} className="rounded-2xl border border-line bg-surface p-5 text-left">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-[1.1rem] font-medium text-ink">{p.name}</p>
                    <p className="font-sans text-[12px] tracking-[0.12em] text-forest uppercase">{p.price}</p>
                  </div>
                  <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-muted">{p.blurb}</p>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-sans text-[13px] text-muted">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-forest" strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.requiresAccount ? (
                    <p className="mt-4 border-t border-line/60 pt-3 font-sans text-[12px] text-muted/80">
                      Needs a free account — only so your saves can follow you.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "How SEEK stays free",
          body: (
            <p>
              SEEK is a thoughtful, independent project. There are no ads, no trackers, and no paywalls.
              Reading and searching the Bible never requires an account. If you sign in, it is only so your
              saved verses can follow you to another device — and that is free too.
              If people wish to support the work, that is a gift of prayer — never a requirement to read.
            </p>
          ),
        },
        {
          title: "No price for grace",
          body: (
            <p>
              “Ho, every one that thirsteth, come ye to the waters, and he that hath no money;
              come ye, buy, and eat… without money and without price.” (Isaiah 55:1).
              That is the heart of SEEK.
            </p>
          ),
        },
        {
          title: "Questions?",
          body: (
            <p>
              See the <Link to="/faq" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">FAQ</Link>{" "}
              for the common ones. Reading with a church group or a class? See{" "}
              <Link to="/groups" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">Using SEEK in your group</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}