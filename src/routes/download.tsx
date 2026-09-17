import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Download, Monitor, Smartphone } from "lucide-react";
import { AppInstallButton } from "@/components/install-provider";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
});

export function DownloadPage() {
  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-3xl px-5 pt-6 pb-24 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2.5">
            <span className="h-px w-8 bg-forest/30" aria-hidden />
            <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">
              Get the app
            </span>
            <span className="h-px w-8 bg-forest/30" aria-hidden />
          </span>
          <h1 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium tracking-tight text-balance text-ink sm:text-[2.6rem]">
            Take SEEK with you.
          </h1>
          <p className="mx-auto mt-3 max-w-md font-sans text-[14px] leading-relaxed text-muted">
            Install SEEK as a real app on Windows, phone, or tablet — opens from
            your desktop or home screen, no browser tab needed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-3xl bg-surface p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-white/[0.03] sm:col-span-2">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#0078d4]/12 text-[#0078d4]">
              <Monitor className="size-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-5 font-serif text-[1.25rem] font-medium">Windows PC</h2>
            <p className="mx-auto mt-2 max-w-lg font-sans text-[13px] leading-relaxed text-muted">
              Install SEEK as a desktop app with Microsoft Edge or Google Chrome.
              It opens in its own window, pins to the taskbar, and works like a
              normal Windows program.
            </p>

            <div className="mx-auto mt-5 w-full max-w-md space-y-2.5 text-left">
              <div className="rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <p className="font-sans text-[12.5px] leading-snug text-ink dark:text-[#f5f0e8]">
                  <span className="font-semibold">Edge:</span> open this site →
                  menu (⋯) → <span className="font-semibold">Apps</span> →{" "}
                  <span className="font-semibold">Install this site as an app</span>
                </p>
              </div>
              <div className="rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <p className="font-sans text-[12.5px] leading-snug text-ink dark:text-[#f5f0e8]">
                  <span className="font-semibold">Chrome:</span> open this site →
                  menu (⋮) → <span className="font-semibold">Save and share</span> →{" "}
                  <span className="font-semibold">Install page as app…</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <AppInstallButton
                label="Install on this computer"
                className="h-12 min-w-[14rem] px-8 text-[14px] bg-forest text-forest-fg hover:opacity-85"
              />
              <p className="font-sans text-[11.5px] leading-relaxed text-muted">
                Free · Windows 10 &amp; 11 · Edge or Chrome
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl bg-surface p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-white/[0.03]">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#388e3c]/15 text-[#2e7d32]">
              <Smartphone className="size-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-5 font-serif text-[1.25rem] font-medium">Android</h2>
            <p className="mx-auto mt-2 max-w-[16rem] font-sans text-[13px] leading-relaxed text-muted">
              Download the SEEK app directly. Install it like any Android app.
            </p>
            <a
              href="/seek.apk"
              download="seek.apk"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-sans text-[14px] font-medium text-paper transition-transform active:scale-[0.98] dark:bg-paper dark:text-ink"
            >
              <Download className="size-4" strokeWidth={2} /> Download APK
            </a>
            <p className="mt-3 font-sans text-[11.5px] leading-relaxed text-muted">
              ~10 MB · Android 7.0+
            </p>
          </div>

          <div className="flex flex-col rounded-3xl bg-surface p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-white/[0.03]">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-ink/10 text-ink dark:bg-paper/10 dark:text-paper">
              <Apple className="size-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-5 font-serif text-[1.25rem] font-medium">iPhone &amp; iPad</h2>
            <p className="mx-auto mt-2 max-w-[16rem] font-sans text-[13px] leading-relaxed text-muted">
              The App Store version is on its way. Until then, add SEEK to your
              Home Screen for the full app experience.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <AppInstallButton
                label="Add to Home Screen"
                className="h-12 w-full text-[14px] bg-forest text-forest-fg hover:opacity-85"
              />
            </div>
            <p className="mt-3 font-sans text-[11.5px] leading-relaxed text-muted">
              Free · works offline-friendly
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-ink/5 px-4 py-3.5 dark:bg-paper/8">
          <Smartphone className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
          <p className="font-sans text-[12.5px] leading-snug text-muted">
            Prefer the browser?{" "}
            <Link
              to="/"
              className="font-semibold text-forest transition-opacity hover:opacity-80"
            >
              Open SEEK here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
