import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { App } from "@capacitor/app";
import { supabase } from "@/lib/supa/client";
import { AuthProvider } from "@/lib/supa/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { BibleProvider } from "@/components/bible-provider";
import { SavedProvider } from "@/components/saved-provider";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SavePrompt } from "@/components/save-prompt";
import { InstallProvider } from "@/components/install-provider";
import appCss from "../styles.css?url";

const APP_NAME = "Seek";
const THEME_BOOT = `(function(){try{var k="seek-theme";var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.toggle("dark",t==="dark");var home=location.pathname==="/"||location.pathname==="";var darkSurface=home||t==="dark";r.style.colorScheme=darkSurface?"dark":"light";if(document.body)document.body.style.colorScheme=darkSurface?"dark":"light";var color=darkSurface?"#0c0d12":"#f7f5f0";document.querySelectorAll('meta[name="theme-color"]').forEach(function(el){el.remove()});function add(c,m){var el=document.createElement("meta");el.setAttribute("name","theme-color");el.setAttribute("content",c);if(m)el.setAttribute("media",m);document.head.appendChild(el)}add(color);add(color,"(prefers-color-scheme: light)");add(color,"(prefers-color-scheme: dark)");var s=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(s)s.setAttribute("content",darkSurface?"black-translucent":"default");}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "The whole King James Bible. Search by a half-remembered word, a fragment, or the meaning you meant.",
      },
      { name: "theme-color", content: "#f7f5f0" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "application-name", content: APP_NAME },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  useEffect(() => {
    let cancelled = false;
    let handle: { remove: () => Promise<void> } | null = null;

    const handleAuthCallback = async (url: string) => {
      try {
        if (!url.startsWith("com.seek.bible://auth/callback")) return;

        const callbackUrl = new URL(url);
        const code = callbackUrl.searchParams.get("code");
        if (!code) return;

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          console.error("Android auth callback failed:", error);
          return;
        }
        window.location.replace("/");
      } catch (error) {
        console.error("Android auth callback error:", error);
      }
    };

    // Capacitor App is native-only — must not throw on web / PWA
    void (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        handle = await App.addListener("appUrlOpen", ({ url }) => {
          void handleAuthCallback(url);
        });
        const launch = await App.getLaunchUrl();
        if (launch?.url) void handleAuthCallback(launch.url);
      } catch {
        /* web / unsupported */
      }
    })();

    return () => {
      cancelled = true;
      void handle?.remove();
    };
  }, []);

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>

      <body className="antialiased">
        <PreviewHostBridge />

        <AuthProvider>
          <ThemeProvider>
            <BibleProvider>
              <SavedProvider>
                <InstallProvider>
                  <AppShell>
                    <Outlet />
                  </AppShell>
                  <Toaster />
                  <SavePrompt />
                </InstallProvider>
            </SavedProvider>
          </BibleProvider>
        </ThemeProvider>
      </AuthProvider>

        <Scripts />
      </body>
    </html>
  );
}
