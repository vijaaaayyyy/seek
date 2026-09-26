import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, Mail } from "lucide-react";
import { InfoPage } from "@/components/info-page";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/report-bug")({
  component: ReportBug,
  head: () =>
    pageSeo({
      title: "Report a Bug | SEEK",
      description:
        "Found a problem with SEEK? Tell us what happened and which device and browser you were using, and we will fix it.",
      path: "/report-bug",
    }),
});

const EMAIL = "vijay.peddenti434@gmail.com";

function ReportBug() {
  return (
    <InfoPage
      title="Report a bug"
      lede="Thank you for caring enough to tell us. Portions of Scripture may hold together perfectly; we can't always say the same for our code — and we want to fix it."
      sections={[
        {
          title: "What to include",
          body: (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-forest">
              <li>What you were doing when it happened.</li>
              <li>What you expected to happen, and what actually did.</li>
              <li>Your device and browser (e.g. iPhone / Safari, or Windows / Chrome).</li>
              <li>If it's a verse or search that misbehaved, the exact wording.</li>
            </ul>
          ),
        },
        {
          title: "Send it to us",
          body: (
            <div className="space-y-3">
              <a
                href={`mailto:${EMAIL}?subject=SEEK%20bug%20report`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Mail className="size-4" strokeWidth={1.9} />
                Email a bug report
              </a>
              <p className="flex items-center gap-2 font-sans text-[13px] text-muted">
                <Bug className="size-4 shrink-0 text-forest" strokeWidth={1.9} />
                You can also use the “Report a bug” link in the footer, which opens your mail app with the
                subject already set.
              </p>
            </div>
          ),
        },
        {
          title: "What happens next",
          body: (
            <p>
              Every report is read by a human. We fix what we can as fast as we can, and note meaningful
              changes in the <Link to="/changelog" className="text-forest underline decoration-forest/30 underline-offset-2 hover:decoration-forest">changelog</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}