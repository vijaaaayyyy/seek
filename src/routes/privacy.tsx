import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <InfoPage
      title="Privacy Notice"
      lede="SEEK is built to be a quiet, private place to meet the Word. Here's exactly what we do and don't collect."
      lastUpdated="September 2026"
      sections={[
        {
          title: "What we don't do",
          body: (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
              <li>No advertising, ever.</li>
              <li>No tracking or analytics scripts on your device.</li>
              <li>No reading habits sold, shared, or studied.</li>
              <li>No accounts or emails required to simply read.</li>
            </ul>
          ),
        },
        {
          title: "What stays on your device",
          body: (
            <p>
              Your searches, recent searches, and any verses you save locally remain on your device.
              We never see them unless you choose to sign in and sync.
            </p>
          ),
        },
        {
          title: "When you sign in",
          body: (
            <p>
              Signing in lets your saved verses sync across your devices. We store only what makes that
              possible: your sign-in identity and the verses you choose to save. You can delete your
              saved verses at any time, and removing your sign-in erases them from our systems.
            </p>
          ),
        },
        {
          title: "Email & contact",
          body: (
            <p>
              If you contact us (reporting a bug, booking a demo, or writing to us), we use your message
              only to respond. It is never shared.
            </p>
          ),
        },
        {
          title: "Changes to this notice",
          body: (
            <p>
              If this notice changes, the updated version will appear here with a new date. Your trust is
              not a product to us — it is a gift, and we guard it.
            </p>
          ),
        },
      ]}
    />
  );
}