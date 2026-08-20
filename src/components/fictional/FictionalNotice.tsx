import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Verified Buyer Protection & Authenticity badge */
export function FictionalNotice({
  className,
  title = "Whim Cart Buyer Protection",
  description = "Every order is protected by 30-day hassle-free returns and authentic merchant verification.",
}: {
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="note"
      aria-label="Buyer protection notice"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-emerald-950",
        className,
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">{title}</h4>
        <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
