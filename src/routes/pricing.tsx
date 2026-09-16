import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const PLANS = [
  {
    name: "Seeker",
    price: "Free",
    blurb: "Everything you need to read and search the King James Bible.",
    features: [
      "Search 31,102 verses by meaning",
      "Read all 66 books, scroll & page mode",
      "Save up to 25 verses on this device",
      "Day & night reading modes",
    ],
  },
  {
    name: "Abiding",
    price: "Free",
    blurb: "For those who want to keep the Word close, everywhere.",
    features: [
      "Everything in Seeker",
      "Unlimited saved verses",
      "Saves synced across devices",
      "Reading history",
    ],
  },
];

function Pricing() {
  return (
    <InfoPage
      title="Pricing"
      lede="The Word of God should never cost anything. SEEK is free — for everyone, forever. Scripture text is the public-domain King James Version (1611 tradition), so there is nothing to license and nothing to sell."
      sections={[
        {
          title: "Two ways to abide",
          body: (
            <div className="grid gap-4 sm:grid-cols-2">
              {PLANS.map((p) => (
                <div key={p.name} className="rounded-2xl border border-line bg-surface p-5 text-left">
                  <p className="font-serif text-[1.1rem] font-medium text-ink">{p.name}</p>
                  <p className="mt-0.5 font-sans text-[12px] tracking-[0.12em] text-forest uppercase">{p.price}</p>
                  <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-muted">{p.blurb}</p>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-sans text-[13px] text-muted">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-forest" strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "How SEEK stays free",
          body: (
            <p>
              SEEK is a small, independent project. There are no ads, no trackers, and no paywalls.
              Your searches live on your device, and saving is free whether you sign in or not.
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
              or <Link to="/demo" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">book a demo</Link> to talk with us directly.
            </p>
          ),
        },
      ]}
    />
  );
}