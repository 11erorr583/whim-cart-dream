import { cn } from "@/lib/utils";

export function StepBadge({
  step,
  total = 5,
  label,
  className,
}: {
  step: number;
  total?: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-800",
        className,
      )}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-slate-500 font-medium">
        Stage {step} of {total}:
      </span>
      <span className="text-slate-900 font-semibold">{label}</span>
    </div>
  );
}
