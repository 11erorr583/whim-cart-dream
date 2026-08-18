import { FICTIONAL_DISCLAIMER } from "@/lib/fictional-config";
import { cn } from "@/lib/utils";

/** The mandatory "this is not real" banner. Used on every money-adjacent screen. */
export function FictionalNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Fictional experience notice"
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 border-ink bg-sunny/60 px-4 py-3",
        className,
      )}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        🎭
      </span>
      <p className="text-sm font-semibold leading-snug text-ink">{FICTIONAL_DISCLAIMER}</p>
    </div>
  );
}
