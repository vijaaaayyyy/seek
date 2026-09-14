import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-transparent bg-ink/6 px-4 font-sans text-base text-ink shadow-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-faint focus-visible:border-ink/15 focus-visible:bg-ink/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
