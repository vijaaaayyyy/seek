import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  component: Faq,
  head: () =>
    pageSeo({
      title: "Frequently Asked Questions | SEEK",
      description:
        "Answers about SEEK: which Bible translation is used, whether you need an account to save verses, where your data lives, and how to report a problem.",
      path: "/faq",
    }),
});

const QUESTIONS = [
  {
    q: "Is SEEK really free?",
    a: "Yes — every part of it. The King James Version is in the public domain, and SEEK charges nothing for reading, searching, saving, or syncing across your own devices. There are no ads, no trackers, and no paywalls.",
  },
  {
    q: "What Bible translation do you use?",
    a: "The King James Version (KJV) — the Authorized Version of 1611, in its enduring 1769 edition. Its language is beloved, timeless, and public domain. It is the only translation on SEEK.",
  },
  {
    q: "Do I need an account to read the Bible?",
    a: "No. Reading and searching the whole Bible never needs an account, and never will.",
  },
  {
    q: "Do I need an account to save verses?",
    a: "Yes. Tapping save asks you to sign in or create a free account, because that is what lets your saved verses follow you between devices. The account costs nothing, and you can keep up to 200 verses.",
  },
  {
    q: "Where is my data stored?",
    a: "Your searches and recent searches stay on your device and never reach us. If you sign in, your saved verses are stored in our hosted database, and that is the only reading data we hold.",
  },
  {
    q: "Can I search for a phrase I half-remember?",
    a: "Yes — that's what SEEK is for. Type a word, a phrase, or the meaning you're after (like “mercy,” “sacrifice” or “God so loved the world”) and SEEK returns the verses that match.",
  },
  {
    q: "Is there an app for my phone?",
    a: "SEEK is a web app that works beautifully on a phone in your browser, with an app-like feel and offline-friendly reading. Any web-ready device works.",
  },
  {
    q: "Who makes SEEK?",
    a: "SEEK is built by a small, independent team. We're not affiliated with any denomination; our aim is simply to help people meet God in His Word.",
  },
  {
    q: "I found a problem. How do I report it?",
    a: "Please tell us via the <report-bug-link>Report a bug</report-bug-link> page so we can fix it as quickly as possible.",
  },
];

function Faq() {
  return (
    <InfoPage
      title="Frequently Asked Questions"
      lede="Everything you might want to know about SEEK — from what we use to where your data lives."
      sections={QUESTIONS.map((item) => ({
        title: item.q,
        body: item.a.includes("<report-bug-link>") ? (
          <p>
            {item.a.split("<report-bug-link>")[0]}
            <Link to="/report-bug" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">
              Report a bug
            </Link>
            {item.a.split("<report-bug-link>")[1]}
          </p>
        ) : (
          <p>{item.a}</p>
        ),
      }))}
    />
  );
}