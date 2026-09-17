import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Download, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { AppInstallButton, useInstall } from "@/components/install-provider";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
});

function usePlatform() {
  const [platform, setPlatform] = useState<"windows" | "android" | "ios" | "other">("other");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
      setPlatform("ios");
    } else if (/android/i.test(ua)) {
      setPlatform("android");
    } else if (/windows|win64|win32/i.test(ua)) {
      setPlatform("windows");
    } else {
      setPlatform("other");
    }
  }, []);
  return platform;
}

export function DownloadPage() {
  const platform = usePlatform();
  const { status, install, openGuide } = useInstall();
  const installed = status === "installed";

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
            {installed ? "SEEK is installed" : "Install SEEK as an app"}
          </h1>
          <p className="mx-auto mt-3 max-w-md font-sans text-[14px] leading-relaxed text-muted">
            {installed
              ? "You already have SEEK on this device. Open it from your home screen, Start menu, or taskbar."
              : "Not a website bookmark — a real app window with its own icon."}
          </p>
        </div>

        {!installed && (
          <div className="mt-8 rounded-3xl bg-surface p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-white/[0.03]">
            {platform === "windows" && (
              <>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#0078d4]/12 text-[#0078d4]">
                  <Monitor className="size-7" strokeWidth={1.7} />
                </span>
                <h2 className="mt-4 font-serif text-[1.35rem] font-medium">Windows app</h2>
                <p className="mx-auto mt-2 max-w-sm font-sans text-[13px] leading-relaxed text-muted">
                  Install SEEK on this PC. It opens full-screen like a desktop app and pins to Start and the taskbar.
                </p>
                <button
                  type="button"
                  onClick={() => (status === "ready" ? install() : openGuide())}
                  className="mt-6 inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-ink font-sans text-[15px] font-medium text-paper transition-transform active:scale-[0.98] dark:bg-paper dark:text-ink"
                >
                  <Download className="size-4" strokeWidth={2} />
                  Install SEEK for Windows
                </button>
                <p className="mt-3 font-sans text-[12px] text-muted">
                  Works in Microsoft Edge and Google Chrome
                </p>
              </>
            )}
            {platform === "ios" && (
              <>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-ink/10 text-ink dark:bg-paper/10 dark:text-paper">
                  <Apple className="size-7" strokeWidth={1.7} />
                </span>
                <h2 className="mt-4 font-serif text-[1.35rem] font-medium">Add to Home Screen</h2>
                <p className="mx-auto mt-2 max-w-sm font-sans text-[13px] leading-relaxed text-muted">
                  Put SEEK on your Home Screen. Tap the icon anytime — no Safari tab.
                </p>
                <button
                  type="button"
                  onClick={() => openGuide()}
                  className="mt-6 inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-ink font-sans text-[15px] font-medium text-paper transition-transform active:scale-[0.98] dark:bg-paper dark:text-ink"
                >
                  <Download className="size-4" strokeWidth={2} />
                  Add to Home Screen
                </button>
              </>
            )}
            {platform === "android" && (
              <>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#388e3c]/15 text-[#2e7d32]">
                  <Smartphone className="size-7" strokeWidth={1.7} />
                </span>
                <h2 className="mt-4 font-serif text-[1.35rem] font-medium">Android app</h2>
                <p className="mx-auto mt-2 max-w-sm font-sans text-[13px] leading-relaxed text-muted">
                  Download the APK, or install from Chrome for a Home Screen app.
                </p>
                <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-2.5">
                  <a
                    href="/seek.apk"
                    download="seek.apk"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-sans text-[15px] font-medium text-paper dark:bg-paper dark:text-ink"
                  >
                    <Download className="size-4" strokeWidth={2} /> Download APK
                  </a>
                  <button
                    type="button"
                    onClick={() => (status === "ready" ? install() : openGuide())}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-surface font-sans text-[14px] font-medium text-ink"
                  >
                    Add to Home Screen
                  </button>
                </div>
              </>
            )}
            {platform === "other" && (
              <>
                <h2 className="font-serif text-[1.35rem] font-medium">Install SEEK</h2>
                <p className="mx-auto mt-2 max-w-sm font-sans text-[13px] leading-relaxed text-muted">
                  Install as an app on this device for a full-screen experience.
                </p>
                <AppInstallButton
                  label="Install SEEK"
                  className="mt-6 h-12 w-full max-w-sm rounded-full bg-ink text-[15px] text-paper dark:bg-paper dark:text-ink"
                />
              </>
            )}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col rounded-3xl bg-surface p-5 text-center dark:bg-white/[0.03]">
            <Monitor className="mx-auto size-6 text-[#0078d4]" strokeWidth={1.7} />
            <h3 className="mt-3 font-serif text-[1.05rem] font-medium">Windows</h3>
            <p className="mt-1.5 font-sans text-[12.5px] text-muted">Install from Edge or Chrome</p>
            <AppInstallButton
              label="Install for Windows"
              className="mt-4 h-11 w-full rounded-full bg-ink/90 text-[13px] text-paper dark:bg-paper dark:text-ink"
            />
          </div>
          <div className="flex flex-col rounded-3xl bg-surface p-5 text-center dark:bg-white/[0.03]">
            <Smartphone className="mx-auto size-6 text-[#2e7d32]" strokeWidth={1.7} />
            <h3 className="mt-3 font-serif text-[1.05rem] font-medium">Android</h3>
            <p className="mt-1.5 font-sans text-[12.5px] text-muted">APK file download</p>
            <a
              href="/seek.apk"
              download="seek.apk"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink/90 font-sans text-[13px] font-medium text-paper dark:bg-paper dark:text-ink"
            >
              <Download className="size-3.5" strokeWidth={2} /> Download APK
            </a>
          </div>
          <div className="flex flex-col rounded-3xl bg-surface p-5 text-center dark:bg-white/[0.03]">
            <Apple className="mx-auto size-6 text-ink dark:text-paper" strokeWidth={1.7} />
            <h3 className="mt-3 font-serif text-[1.05rem] font-medium">iPhone</h3>
            <p className="mt-1.5 font-sans text-[12.5px] text-muted">Home Screen app</p>
            <AppInstallButton
              label="Add to Home Screen"
              className="mt-4 h-11 w-full rounded-full bg-ink/90 text-[13px] text-paper dark:bg-paper dark:text-ink"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-ink/5 px-4 py-3.5 dark:bg-paper/8">
          <p className="font-sans text-[12.5px] leading-snug text-muted">
            Prefer the browser?{" "}
            <Link to="/" className="font-semibold text-forest transition-opacity hover:opacity-80">
              Open SEEK here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
