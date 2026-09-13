import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-line bg-surface px-4 font-sans text-base text-ink shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus-visible:border-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
