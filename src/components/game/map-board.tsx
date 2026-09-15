import { useEffect, useRef, useState } from "react";
import {
  LAND_PATH,
  NODES,
  PIECES,
  RIVER_PATH,
  SLOTS,
  VIEW,
  midpoint,
  node,
  pathD,
  type PieceType,
} from "@/lib/game/data";
import { useGame } from "@/lib/game/store";
import { PipeIcon } from "./pipe-icon";
import { playPickup } from "@/lib/game/audio";
import { cn } from "@/lib/utils";

export function MapBoard() {
  const connected = useGame((s) => s.connected);
  const nextIndex = useGame((s) => s.nextIndex);
  const citiesOn = useGame((s) => s.citiesOn);
  const pulseSlot = useGame((s) => s.pulseSlot);
  const selectedPiece = useGame((s) => s.selectedPiece);
  const tryPlace = useGame((s) => s.tryPlace);
  const selectPiece = useGame((s) => s.selectPiece);
  const shake = useGame((s) => s.shake);
  const revealCity = useGame((s) => s.revealCity);
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ type: PieceType; x: number; y: number } | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!pulseSlot) return;
    let raf = 0;
    let start = performance.now();
    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setPulse(t);
      if (t < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pulseSlot]);

  function clientToSvg(cx: number, cy: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  function onDropAt(type: PieceType, cx: number, cy: number, requireNear: boolean) {
    const slot = SLOTS[nextIndex];
    if (!slot || revealCity) return;
    if (requireNear) {
      const a = node(slot.from);
      const b = node(slot.to);
      const mid = midpoint(a, b);
      const p = clientToSvg(cx, cy);
      const d = Math.hypot(p.x - mid.x, p.y - mid.y);
      if (d >= 48) return;
    }
    tryPlace(type);
  }

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden"
      style={{ transform: shake > 0 ? `translateX(${Math.sin(shake * 40) * 6}px)` : undefined }}
    >
      <div className="absolute inset-x-0 top-0 bottom-28">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-full w-full touch-none"
        role="img"
        aria-label="Eastern India JHBDPL network"
      >
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="landFill" cx="48%" cy="36%" r="72%">
            <stop offset="0%" stopColor="#243044" />
            <stop offset="100%" stopColor="#141c28" />
          </radialGradient>
        </defs>

        <rect width={VIEW.w} height={VIEW.h} fill="var(--color-water)" />
        <path d={LAND_PATH} fill="url(#landFill)" stroke="color-mix(in oklab, var(--color-fg) 22%, transparent)" strokeWidth="1.4" />
        <path d={RIVER_PATH} fill="none" stroke="#2a3d55" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />

        {SLOTS.map((slot, i) => {
          const a = node(slot.from);
          const b = node(slot.to);
          const on = connected.includes(slot.id);
          const active = i === nextIndex;
          const d = pathD(a, b);
          return (
            <g key={slot.id}>
              {(slot.extraPaths ?? []).map(([fa, tb]) => (
                <path
                  key={`${fa}-${tb}`}
                  d={pathD(node(fa), node(tb))}
                  fill="none"
                  stroke={on ? "var(--color-pipe)" : "var(--color-pipe-dim)"}
                  strokeWidth={on ? 4.5 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray={on ? "10 7" : undefined}
                  className={on ? "origin-center" : undefined}
                  style={on ? { animation: "energy-dash 1.1s linear infinite" } : undefined}
                  filter={on ? "url(#glow)" : undefined}
                />
              ))}
              <path
                d={d}
                fill="none"
                stroke={on ? "var(--color-pipe)" : active ? "color-mix(in oklab, var(--color-primary) 55%, #3d3824)" : "var(--color-pipe-dim)"}
                strokeWidth={on ? 5 : active ? 4 : 2.5}
                strokeLinecap="round"
                strokeDasharray={on ? "10 7" : active ? "6 6" : "2 6"}
                style={on ? { animation: "energy-dash 1.1s linear infinite" } : undefined}
                filter={on ? "url(#glow)" : undefined}
              />
            </g>
          );
        })}

        {pulseSlot && pulse < 1
          ? (() => {
              const slot = SLOTS.find((s) => s.id === pulseSlot);
              if (!slot) return null;
              const a = node(slot.from);
              const b = node(slot.to);
              const x = a.x + (b.x - a.x) * pulse;
              const y = a.y + (b.y - a.y) * pulse;
              return <circle cx={x} cy={y} r={7} fill="var(--color-primary)" filter="url(#glow)" opacity={1 - pulse * 0.3} />;
            })()
          : null}

        {SLOTS.map((slot, i) => {
          const a = node(slot.from);
          const b = node(slot.to);
          const mid = midpoint(a, b);
          const active = i === nextIndex && !connected.includes(slot.id);
          const on = connected.includes(slot.id);
          if (on) return null;
          return (
            <g
              key={`slot-${slot.id}`}
              transform={`translate(${mid.x} ${mid.y})`}
              className={active ? "origin-center" : undefined}
              style={active ? { animation: "pulse-slot 1.4s ease-in-out infinite" } : undefined}
            >
              <circle
                r={active ? 18 : 11}
                fill={active ? "color-mix(in oklab, var(--color-primary) 18%, #12151c)" : "#12151c"}
                stroke={active ? "var(--color-primary)" : "var(--color-pipe-dim)"}
                strokeWidth={active ? 2 : 1}
              />
              {active ? (
                <circle r="3.5" fill="var(--color-primary)" />
              ) : null}
            </g>
          );
        })}

        {Object.values(NODES).map((n) => {
          const on = n.cityId ? citiesOn.includes(n.cityId) : connected.some((id) => {
            const sl = SLOTS.find((s) => s.id === id);
            return sl && (sl.from === n.id || sl.to === n.id);
          });
          const isCity = n.kind === "city";
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              <circle
                r={isCity ? 9 : 5}
                fill={on ? "var(--color-primary)" : isCity ? "var(--color-city-off)" : "#2a3140"}
                stroke={on ? "var(--color-fg)" : "color-mix(in oklab, var(--color-fg) 25%, transparent)"}
                strokeWidth={isCity ? 1.6 : 1}
                filter={on ? "url(#glow)" : undefined}
              />
              <text
                x={n.lx ?? 0}
                y={(isCity ? 20 : 15) + (n.ly ?? 0)}
                textAnchor="middle"
                fill={on ? "var(--color-fg)" : "var(--color-muted)"}
                fontSize={isCity ? 9 : 7.5}
                fontFamily="Outfit, sans-serif"
                fontWeight={isCity ? 600 : 500}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {drag ? (
        <div
          className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-primary bg-surface p-2 shadow-panel"
          style={{ left: drag.x, top: drag.y }}
        >
          <PipeIcon type={drag.type} lit />
        </div>
      ) : null}

      <Tray
        selected={selectedPiece}
        onSelect={(t) => {
          playPickup();
          selectPiece(t);
        }}
        onDragStart={(t, x, y) => {
          playPickup();
          setDrag({ type: t, x, y });
        }}
        onDragMove={(x, y) => setDrag((d) => (d ? { ...d, x, y } : d))}
        onDragEnd={(t, x, y) => {
          setDrag(null);
          onDropAt(t, x, y, true);
        }}
        onTapPlace={(t) => tryPlace(t)}
      />
    </div>
  );
}

function Tray({
  selected,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTapPlace,
}: {
  selected: PieceType | null;
  onSelect: (t: PieceType) => void;
  onDragStart: (t: PieceType, x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (t: PieceType, x: number, y: number) => void;
  onTapPlace: (t: PieceType) => void;
}) {
  const dragging = useRef<PieceType | null>(null);
  const moved = useRef(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto grid max-w-lg grid-cols-4 gap-2 rounded-xl border border-border bg-surface/95 p-2 shadow-panel backdrop-blur-sm">
        {PIECES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-[10px] font-medium uppercase tracking-wide transition-transform duration-150 active:scale-[0.96]",
              selected === p.id
                ? "border-primary bg-elevated text-primary"
                : "border-border bg-elevated text-muted",
            )}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
              dragging.current = p.id;
              moved.current = false;
              onSelect(p.id);
              onDragStart(p.id, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              if (Math.hypot(e.movementX, e.movementY) > 2) moved.current = true;
              onDragMove(e.clientX, e.clientY);
            }}
            onPointerUp={(e) => {
              const t = dragging.current;
              dragging.current = null;
              if (!t) return;
              if (moved.current) onDragEnd(t, e.clientX, e.clientY);
              else onTapPlace(t);
            }}
          >
            <PipeIcon type={p.id} lit={selected === p.id} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
