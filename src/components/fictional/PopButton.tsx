import { Link, type LinkProps } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "ghost" | "mint";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink font-display font-bold tracking-tight transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-pop-sm",
  accent: "bg-accent text-accent-foreground shadow-pop-sm",
  mint: "bg-mint text-mint-foreground shadow-pop-sm",
  ghost: "bg-card text-foreground shadow-pop-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export const popButtonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export function PopButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button className={popButtonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function PopLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkProps & { variant?: Variant; size?: Size; className?: string; children?: ReactNode }) {
  return (
    <Link className={popButtonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
