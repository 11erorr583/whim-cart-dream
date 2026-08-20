import { Link, type LinkProps } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "ghost" | "mint" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-normal transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-sm border border-slate-900 hover:border-slate-800",
  accent: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm border border-emerald-600",
  mint: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200",
  ghost: "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-xs",
  outline: "bg-transparent text-slate-700 hover:bg-slate-100 border border-slate-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-rose-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-md",
  md: "px-4 py-2 text-sm font-semibold rounded-lg",
  lg: "px-6 py-3 text-base font-semibold rounded-lg",
};

export const popButtonClass = (
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) => cn(base, variants[variant], sizes[size], className);

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
