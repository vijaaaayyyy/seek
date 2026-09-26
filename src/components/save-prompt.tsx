import { useEffect, useState } from "react";
import { BookmarkCheck } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/supa/client";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { useSaved } from "@/components/saved-provider";
import { saveVerse } from "@/lib/saved-verses";
import { formatRef } from "@/lib/bible/meta";

export function SavePrompt() {
  const { pendingSave, clearPendingSave } = useSaved();
  const { user } = useCurrentUserState();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const open = pendingSave !== null;

  useEffect(() => {
    if (user && pendingSave) {
      setBusy(true);
      saveVerse({ data: pendingSave })
        .then(() => {
          setSaved(true);
          setTimeout(() => {
            clearPendingSave();
            setSaved(false);
            setBusy(false);
          }, 1400);
        })
        .catch(() => {
          clearPendingSave();
          setBusy(false);
        });
    }
  }, [user, pendingSave, clearPendingSave]);

  function handleClose() {
    clearPendingSave();
    setSaved(false);
    setBusy(false);
  }

  if (!pendingSave) return null;

  const ref = formatRef(pendingSave.book, pendingSave.chapter, pendingSave.verse);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent
        side="bottom"
        className="max-w-[430px] mx-auto rounded-t-[32px] border border-line bg-paper dark:bg-ink px-6 pt-4 pb-10 text-center"
        onPointerDownOutside={handleClose}
      >
        <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-ink/15 dark:bg-white/20" />

        {saved ? (
          <div className="flex flex-col items-center gap-3 pt-6 pb-4">
            <span className="grid size-12 place-items-center rounded-full bg-forest/15">
              <BookmarkCheck className="size-6 text-forest" />
            </span>
            <p className="font-sans text-[15px] font-semibold text-ink dark:text-[#f5f0e8]">
              Saved to your collection
            </p>
          </div>
        ) : busy ? (
          <div className="flex flex-col items-center gap-3 pt-6 pb-4">
            <span className="size-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink dark:border-white/25 dark:border-t-[#f5f0e8]" />
            <p className="font-sans text-[13px] text-muted dark:text-[#f5f0e8]/80">Saving…</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-2 mb-3 w-full max-w-[260px] overflow-hidden rounded-2xl">
              <img
                src="/morgan-merrick.jpg"
                alt="Save verse"
                className="h-auto w-full object-cover"
                loading="eager"
              />
            </div>

            <h2 className="font-serif text-[1.3rem] font-medium leading-snug text-ink dark:text-[#f5f0e8]">
              Save "{ref}"
            </h2>
            <p className="mx-auto mt-2 max-w-[260px] font-sans text-[13.5px] leading-relaxed text-ink/75 dark:text-[#f5f0e8]/90">
              Sign in to save this verse to your collection and access it from any device.
            </p>

            {pendingSave.text && (
              <div className="mx-auto mt-4 max-w-[300px] rounded-2xl bg-ink/5 dark:bg-white/[0.08] px-4 py-3">
                <p className="font-serif text-[13.5px] leading-relaxed text-ink/85 dark:text-[#f5f0e8]/90 line-clamp-3">
                  "{pendingSave.text}"
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void signIn("google", { callbackURL: window.location.pathname })}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-paper dark:border-white/20 dark:bg-white/[0.08] font-sans text-[14px] font-medium text-ink dark:text-[#f5f0e8] transition-colors hover:bg-ink/5 dark:hover:bg-white/[0.12]"
              >
                <GoogleIcon /> Continue with Google
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void signIn("github", { callbackURL: window.location.pathname })}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-paper dark:border-white/20 dark:bg-white/[0.08] font-sans text-[14px] font-medium text-ink dark:text-[#f5f0e8] transition-colors hover:bg-ink/5 dark:hover:bg-white/[0.12]"
              >
                <GithubIcon /> Continue with GitHub
              </Button>
            </div>

            <p className="mt-4 font-sans text-[12.5px] text-ink/55 dark:text-[#f5f0e8]/70">
              Free · Takes 10 seconds
            </p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.25.45-2.28 1.18-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.77-.01 3.15 0 .31.2.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
