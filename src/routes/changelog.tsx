import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/changelog")({ component: Changelog });

const ENTRIES = [
  {
    version: "1.1.0",
    date: "Sept 2026",
    notes: [
      "New antique parchment footer with centered navigation.",
      "Rebuilt “Seek by the heart” topics with richer cards.",
      "Sun/moon switch now matches the top navigation island.",
      "New pages: Overview, Pricing, FAQ, Changelog, Privacy, Terms, Book a demo, Report a bug.",
    ],
  },
  {
    version: "1.0.0",
    date: "Aug 2026",
    notes: [
      "First public release of SEEK.",
      "Full King James Bible: 66 books, 1,189 chapters, 31,102 verses.",
      "Search by meaning across the whole Bible.",
      "Save verses to keep close, with optional cross-device sync.",
      "Scroll and page reading modes, day & night themes.",
    ],
  },
];

function Changelog() {
  return (
    <InfoPage
      title="Changelog"
      lede="Every change that shapes SEEK. We believe honest, open books matter as much as quiet reading does."
      sections={ENTRIES.map((e) => ({
        title: `${e.version} — ${e.date}`,
        body: (
          <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ),
      }))}
    />
  );
}