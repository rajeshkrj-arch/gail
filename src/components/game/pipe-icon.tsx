import type { PieceType } from "@/lib/game/data";

export function PipeIcon({ type, lit = false }: { type: PieceType; lit?: boolean }) {
  const stroke = lit ? "var(--color-primary)" : "var(--color-fg)";
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
      {type === "straight" ? (
        <path d="M24 6v36" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      ) : null}
      {type === "turn" ? (
        <path d="M10 38h14a14 14 0 0 0 14-14V8" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      ) : null}
      {type === "junction" ? (
        <path d="M24 6v36M24 24h18" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      ) : null}
      {type === "city" ? (
        <>
          <path d="M8 24h16" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="24" r="8" fill="none" stroke={stroke} strokeWidth="4" />
          <circle cx="32" cy="24" r="3" fill={stroke} />
        </>
      ) : null}
    </svg>
  );
}
