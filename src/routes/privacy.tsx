import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () =>
    pageSeo({
      title: "Privacy Notice | SEEK",
      description:
        "What SEEK does and does not collect. No advertising, no tracking, no analytics. Your searches stay on your device; only a sign-in and the verses you save are stored.",
      path: "/privacy",
    }),
});

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
              <li>No advertising trackers, pixels, or third-party scripts.</li>
            </ul>
          ),
        },
        {
          title: "What stays on your device",
          body: (
            <p>
              Your searches and recent searches stay on your device. We never receive
              them, and we never see them — not even in aggregate, because we run no
              analytics.
            </p>
          ),
        },
        {
          title: "When you sign in",
          body: (
            <p>
              Reading never needs an account. Saving verses does: tapping save asks you
              to sign in, and your saved verses are then stored in our database so they
              can follow you to any device you sign in on. We store only what makes that
              possible: your sign-in identity and the verses you choose to save — up to
              200. You can delete a saved verse at any time, and deleting your account
              erases your saved verses from our systems.
            </p>
          ),
        },
        {
          title: "Email & contact",
          body: (
            <p>
              If you contact us (reporting a bug, or writing to us about your group), we
              use your message only to respond. It is never shared.
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