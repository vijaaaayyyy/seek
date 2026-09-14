import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[opacity,transform,background-color,color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:opacity-90",
        secondary: "bg-wash text-ink hover:bg-ink/10",
        outline: "glass text-ink hover:bg-ink/5",
        ghost: "text-ink hover:bg-ink/8",
        link: "text-forest underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 rounded-xl px-4",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-2xl px-5",
        icon: "size-11 rounded-full",
        "icon-sm": "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { buttonVariants };
