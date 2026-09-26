import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Mail } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/groups")({
  component: Groups,
  head: () =>
    pageSeo({
      title: "Using SEEK in Your Group or Class | SEEK",
      description:
        "How to use SEEK in a church group, Bible-study class or small group: search the KJV by wording or meaning, read together, and save verses. Free — reading needs no account.",
      path: "/groups",
    }),
});

const EMAIL = "vijay.peddenti434@gmail.com";

const GROUP_ABILITIES = [
  "Open any chapter and read it together in page mode or scrolling mode.",
  "Search by the exact wording someone half-remembers.",
  "Search by meaning — for when they remember the feeling but not the word.",
  "Read in day or night themes, so a room can be dim without losing the text.",
  "Save the verses that matter to the group; each person signs in once, and their saves then follow them to their own device.",
  "Install SEEK on a phone or tablet, so nobody needs to be at a desk.",
];

const WALKTHROUGH = [
  {
    n: "01",
    title: "Start from a passage",
    body: "Open the passage you are already studying. Nothing to set up — the whole King James Bible is there.",
  },
  {
    n: "02",
    title: "Search the hard way",
    body: "Try a phrase someone only half-remembers. Wording search finds the exact match; meaning search finds the verse behind the feeling.",
  },
  {
    n: "03",
    title: "Save what lands",
    body: "Save the verses that speak to the room. Reading needs no account; saving asks each person to sign in once, and their saves then follow them between devices.",
  },
  {
    n: "04",
    title: "Settle into reading",
    body: "Switch to page or scroll mode, and to night themes. Then stop talking and read.",
  },
];

function Groups() {
  return (
    <InfoPage
      title="Using SEEK in your group"
      lede="SEEK is free, has no advertising, and needs no account to read or search. That makes it straightforward to use in a church group, a Bible-study class, a small group, or at home — on a shared screen or on everyone's own phone."
      sections={[
        {
          title: "What your group can do",
          body: (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
              {GROUP_ABILITIES.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ),
        },
        {
          title: "A short walkthrough",
          body: (
            <>
              <p>
                If your group is new to SEEK, fifteen minutes is enough to cover the
                whole thing. Nothing needs installing first, and reading needs no
                account.
              </p>
              <ol className="mt-4 space-y-4">
                {WALKTHROUGH.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="font-sans text-[12px] font-semibold tracking-[0.18em] text-forest">
                      {s.n}
                    </span>
                    <span>
                      <span className="block font-serif text-[1.05rem] font-medium text-ink">
                        {s.title}
                      </span>
                      <span className="mt-1 block font-sans text-[13.5px] leading-relaxed text-muted">
                        {s.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          ),
        },
        {
          title: "Cost, text, and accounts",
          body: (
            <p>
              SEEK costs nothing — no advertising, no trackers, and no paywall. All
              scripture is the King James Version (1611), which is in the public
              domain. Reading never requires an account; signing in only adds
              cross-device sync for saved verses. The{" "}
              <Link
                to="/pricing"
                className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
              >
                Pricing
              </Link>{" "}
              page has the detail.
            </p>
          ),
        },
        {
          title: "Ask for a walkthrough",
          body: (
            <div className="space-y-3">
              <a
                href={`mailto:${EMAIL}?subject=SEEK%20group%20walkthrough`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="size-4" strokeWidth={1.9} />
                Email us about your group
              </a>
              <p className="font-sans text-[13px] text-muted">
                Write to <span className="text-ink">{EMAIL}</span> with "SEEK group
                walkthrough" in the subject, tell us roughly how many people, and we
                will suggest a time.
              </p>
              <div className="flex items-center gap-2 font-sans text-[13px] text-muted">
                <CalendarClock className="size-4 shrink-0 text-forest" strokeWidth={1.9} />
                Video call or voice — whichever is easiest for you.
              </div>
              <p className="font-sans text-[13px] text-muted">
                Not ready to talk? SEEK is free and open to your group right now —{" "}
                <Link
                  to="/books"
                  className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest"
                >
                  browse the books
                </Link>{" "}
                and start reading.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
