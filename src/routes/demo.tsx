import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Mail } from "lucide-react";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/demo")({ component: Demo });

const EMAIL = "vijay.peddenti434@gmail.com";

function Demo() {
  return (
    <InfoPage
      title="Book a demo"
      lede="No sales fluff — if you're a believer, a church, a small group, or just curious, we'd love to walk you through SEEK and hear what you'd find helpful."
      sections={[
        {
          title: "What happens on a demo",
          body: (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
              <li>A 15–20 minute tour of reading, searching and saving.</li>
              <li>Your questions answered honestly.</li>
              <li>No pressure, no cost, no account needed to watch.</li>
            </ul>
          ),
        },
        {
          title: "How to book",
          body: (
            <div className="space-y-3">
              <a
                href={`mailto:${EMAIL}?subject=SEEK%20demo`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Mail className="size-4" strokeWidth={1.9} />
                Email to book a demo
              </a>
              <p className="font-sans text-[13px] text-muted">
                Email <span className="text-ink">{EMAIL}</span> with“SEEK demo” in the subject and a couple of
                times that suit you. We usually reply within a day.
              </p>
              <div className="flex items-center gap-2 font-sans text-[13px] text-muted">
                <CalendarClock className="size-4 shrink-0 text-forest" strokeWidth={1.9} />
                Video call or voice — whichever is easiest for you.
              </div>
            </div>
          ),
        },
        {
          title: "Not ready to talk?",
          body: (
            <p>
              That's fine — SEEK is free and open for you right now.{" "}
              <Link to="/books" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">
                Browse the books
              </Link>{" "}
              and start reading whenever you like.
            </p>
          ),
        },
      ]}
    />
  );
}