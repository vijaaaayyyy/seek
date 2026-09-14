import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast glass glass-strong text-ink font-sans border-transparent",
          description: "text-muted",
          actionButton: "bg-ink text-paper",
          cancelButton: "bg-wash text-ink",
        },
      }}
    />
  );
}
