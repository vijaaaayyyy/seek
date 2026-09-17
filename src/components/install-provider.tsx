import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Download, Plus, Share } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallStatus = "ready" | "ios" | "installed" | "unsupported";

interface InstallContextValue {
  status: InstallStatus;
  install: () => void;
  openGuide: () => void;
}

const InstallContext = createContext<InstallContextValue | null>(null);

function detectIOS() {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  return /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
}

function detectDesktop() {
  return !/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function useInstall() {
  const ctx = useContext(InstallContext);
  if (!ctx) {
    return {
      status: "unsupported" as InstallStatus,
      install: () => {},
      openGuide: () => {},
    };
  }
  return ctx;
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<InstallStatus>("unsupported");
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setStatus("installed");
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setStatus("ready");
    };
    const onInstalled = () => setStatus("installed");
    const onDisplayMode = (e: MediaQueryListEvent) => {
      if (e.matches) setStatus("installed");
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener("change", onDisplayMode);
    } else if (standaloneQuery.addListener) {
      standaloneQuery.addListener(onDisplayMode);
    }

    if (detectIOS()) setStatus("ios");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener("change", onDisplayMode);
      } else if (standaloneQuery.removeListener) {
        standaloneQuery.removeListener(onDisplayMode);
      }
    };
  }, []);

  function install() {
    if (deferred.current) {
      const promptEvent = deferred.current;
      deferred.current = null;
      void promptEvent.prompt();
      void promptEvent.userChoice.then(({ outcome }) => {
        if (outcome === "accepted") setStatus("installed");
      });
      return;
    }
    setGuideOpen(true);
  }

  function openGuide() {
    setGuideOpen(true);
  }

  const isDesktop = typeof navigator !== "undefined" && detectDesktop();
  const isIos = status === "ios";

  return (
    <InstallContext.Provider value={{ status, install, openGuide }}>
      {children}
      <Sheet open={guideOpen} onOpenChange={(o) => { if (!o) setGuideOpen(false); }}>
        <SheetContent
          side="bottom"
          onPointerDownOutside={() => setGuideOpen(false)}
          className="mx-auto max-w-[430px] rounded-t-[32px] border border-line bg-paper px-6 pt-4 pb-10 text-center dark:bg-ink"
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 dark:bg-paper/20" />
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-forest/15">
            <Download className="size-6 text-forest" strokeWidth={1.8} />
          </span>
          <h2 className="mt-4 font-serif text-[1.3rem] font-medium leading-snug text-ink dark:text-paper">
            {isDesktop ? "Install SEEK on this PC" : "Add SEEK to Home Screen"}
          </h2>
          <p className="mx-auto mt-2 max-w-[280px] font-sans text-[13px] leading-relaxed text-muted">
            {isDesktop
              ? "One install — SEEK opens in its own window from the Start menu or taskbar."
              : "Add SEEK to your Home Screen so it opens like a normal app."}
          </p>

          {status === "ready" && (
            <button
              type="button"
              onClick={install}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-sans text-[14px] font-medium text-paper transition-transform active:scale-[0.98] dark:bg-paper dark:text-ink"
            >
              <Download className="size-4" strokeWidth={2} /> Install now
            </button>
          )}

          {isIos && (
            <div className="mx-auto mt-6 w-full max-w-[300px] space-y-2.5 text-left">
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Share className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  Tap <span className="font-semibold text-ink dark:text-paper">Share</span> at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Plus className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  Tap <span className="font-semibold text-ink dark:text-paper">Add to Home Screen</span>, then Add.
                </p>
              </div>
            </div>
          )}

          {!isIos && status !== "ready" && isDesktop && (
            <div className="mx-auto mt-6 w-full max-w-[300px] space-y-2.5 text-left">
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Download className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  In <span className="font-semibold text-ink dark:text-paper">Edge or Chrome</span>, look for the{" "}
                  <span className="font-semibold text-ink dark:text-paper">Install</span> icon in the address bar.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Plus className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  Click <span className="font-semibold text-ink dark:text-paper">Install</span> — SEEK pins to Start and the taskbar.
                </p>
              </div>
            </div>
          )}

          {!isIos && status !== "ready" && !isDesktop && (
            <div className="mx-auto mt-6 w-full max-w-[300px] space-y-2.5 text-left">
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Plus className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  Tap <span className="font-semibold text-ink dark:text-paper">Add to Home Screen</span> when your browser offers it.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/8">
                <Download className="size-4 shrink-0 text-forest" strokeWidth={1.8} />
                <p className="font-sans text-[12.5px] leading-snug text-muted">
                  Or open <span className="font-semibold text-ink dark:text-paper">Download</span> and get the Android APK file.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </InstallContext.Provider>
  );
}

export function AppInstallButton({
  className,
  variant = "solid",
  label = "Install app",
}: {
  className?: string;
  variant?: "solid" | "outline" | "icon";
  label?: string;
}) {
  const { status, install, openGuide } = useInstall();

  if (status === "installed") return null;

  const on = () => (status === "ready" ? install() : openGuide());
  const view =
    status === "ios"
      ? "Add to Home Screen"
      : status === "ready"
        ? label
        : label;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={on}
        title={view}
        aria-label={view}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-black/10 transition-transform active:scale-95 dark:ring-white/15",
          className,
        )}
      >
        <Download className="size-[18px]" strokeWidth={1.9} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={on}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-sans text-[13px] font-medium transition-opacity active:scale-[0.98]",
        variant === "solid"
          ? "bg-forest px-6 text-forest-fg hover:opacity-85"
          : "border border-line bg-surface px-6 transition-colors hover:border-ink/25 hover:bg-white dark:hover:bg-white/5",
        className,
      )}
    >
      <Download className="size-4" strokeWidth={2} />
      {view}
    </button>
  );
}
