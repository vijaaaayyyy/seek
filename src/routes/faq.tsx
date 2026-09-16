import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/faq")({ component: Faq });

const QUESTIONS = [
  {
    q: "Is SEEK really free?",
    a: "Yes. The King James Version is in the public domain, and SEEK is free to use — reading, searching, saving and syncing across your own devices. There are no ads and no paywalls.",
  },
  {
    q: "What Bible translation do you use?",
    a: "The King James Version (KJV) — the Authorized Version of 1611 in its enduring 1769 edition. Its language is beloved, timeless, and public domain.",
  },
  {
    q: "Do I need an account to save verses?",
    a: "No. You can save up to a handful of verses on your own device without signing in. Signing in lets you keep more and sync them across all your devices.",
  },
  {
    q: "Where is my data stored?",
    a: "Your searches stay on your device. If you sign in, your saved verses are stored securely through our hosted database so they can follow you between devices.",
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