import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () =>
    pageSeo({
      title: "Contact — Write directly | SEEK",
      description:
        "Write directly about SEEK: feedback, corrections, collaborations, or questions. Email vijay.peddenti434@gmail.com.",
      path: "/contact",
    }),
});

const EMAIL = "vijay.peddenti434@gmail.com";

function Contact() {
  return (
    <div className="relative mx-auto w-full max-w-4xl pb-16">

      <Link
        to="/"
        className="font-sans text-[12px] tracking-[0.14em] text-ink/50 uppercase transition-colors hover:text-ink"
      >
        ← Home
      </Link>

      <Reveal as="p" className="mt-12 font-sans text-[11px] font-medium tracking-[0.2em] text-ink/45 uppercase">
        Contact
      </Reveal>
      <Reveal delay={40} className="mt-3">
        <h1 className="max-w-2xl font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em] text-ink">
          Write
          <br />
          directly.
        </h1>
      </Reveal>
      <Reveal delay={80} as="p" className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
        Feedback, corrections, collaborations, or a quiet question about SEEK —
        write to the address below. Selected messages get a reply.
      </Reveal>

      <Reveal delay={120} className="mt-14 border-t border-ink/10 pt-10">
        <p className="font-sans text-[11px] tracking-[0.18em] text-ink/45 uppercase">
          Email
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-3 block font-sans text-[clamp(1.25rem,3.5vw,1.85rem)] leading-snug text-ink underline-offset-4 hover:underline"
        >
          {EMAIL}
        </a>
      </Reveal>

      <Reveal delay={160} className="mt-12 border-t border-ink/10 pt-10">
        <p className="font-sans text-[11px] tracking-[0.18em] text-ink/45 uppercase">
          Also
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[14px] text-ink/60">
          <Link to="/report-bug" className="hover:text-ink">
            Report a bug
          </Link>
          <Link to="/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link to="/about" className="hover:text-ink">
            About SEEK
          </Link>
        </div>
      </Reveal>

      <p className="pointer-events-none mt-24 select-none font-sans text-[clamp(3rem,12vw,6rem)] font-medium tracking-tight text-ink/[0.05]">
        seek
      </p>
    </div>
  );
}
