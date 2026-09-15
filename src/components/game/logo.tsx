import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export function GailMark({ className }: { className?: string }) {
  return (
    <img
      src={asset("/gail-logo.svg")}
      alt="GAIL"
      className={cn("select-none", className)}
      draggable={false}
    />
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <GailMark className={compact ? "size-10" : "size-14"} />
      <div className="leading-tight">
        <p className="font-display text-[0.7rem] font-semibold tracking-[0.22em] text-muted">GAIL</p>
        <h1 className={cn("font-display font-semibold tracking-display text-fg", compact ? "text-lg" : "text-2xl")}>
          Energy Connect
        </h1>
        {!compact ? (
          <p className="mt-0.5 text-xs tracking-[0.14em] text-muted uppercase">Jodo Pipeline. Jagao Shehar.</p>
        ) : null}
      </div>
    </div>
  );
}
