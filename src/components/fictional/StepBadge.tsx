import { cn } from "@/lib/utils";

export function StepBadge({
  step,
  total = 11,
  label,
  className,
}: {
  step: number;
  total?: number;
  label: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-mint-foreground",
        className,
      )}
    >
      <span>
        Step {step}/{total}
      </span>
      <span aria-hidden="true">•</span>
      <span>{label}</span>
    </p>
  );
}
