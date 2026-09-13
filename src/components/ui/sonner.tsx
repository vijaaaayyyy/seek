import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast border-line bg-surface text-ink font-sans shadow-soft",
          description: "text-muted",
          actionButton: "bg-forest text-forest-fg",
          cancelButton: "bg-wash text-ink",
        },
      }}
    />
  );
}
