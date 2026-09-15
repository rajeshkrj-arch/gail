import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CITIES, CITY_BY_ID, impactLabel, SLOTS } from "@/lib/game/data";
import { challengeOf, useGame } from "@/lib/game/store";
import { isMuted, setMuted, unlockAudio } from "@/lib/game/audio";
import { MapBoard } from "./map-board";
import { CityReveal } from "./city-reveal";

export function PlayScreen() {
  const tick = useGame((s) => s.tick);
  const running = useGame((s) => s.running);
  const score = useGame((s) => s.score);
  const citiesOn = useGame((s) => s.citiesOn);
  const elapsedMs = useGame((s) => s.elapsedMs);
  const combo = useGame((s) => s.combo);
  const feedback = useGame((s) => s.feedback);
  const challengeId = useGame((s) => s.challengeId);
  const nextIndex = useGame((s) => s.nextIndex);
  const finish = useGame((s) => s.finish);
  const clearFeedback = useGame((s) => s.clearFeedback);
  const [muted, setMutedUi] = useState(isMuted);
  const ch = challengeOf(challengeId);
  const pct = Math.round((citiesOn.length / CITIES.length) * 100);
  const slot = SLOTS[nextIndex];

  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      tickRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  useEffect(() => {
    if (!feedback) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (now - start > 1400) {
        clearFeedback();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [feedback, clearFeedback]);

  return (
    <section className="relative flex h-full min-h-0 flex-col bg-bg">
      <header className="z-10 flex items-start justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">{ch.name}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-display text-2xl font-semibold tabular-nums leading-none text-fg">
              {score.toLocaleString("en-IN")}
            </p>
            <p className="font-display text-sm tabular-nums text-muted">{formatTime(elapsedMs)}</p>
          </div>
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
              <span>Energy impact</span>
              <span className="tabular-nums text-primary">{pct}%</span>
            </div>
            <Progress value={pct} />
            <p className="mt-1 text-[11px] text-subtle">{impactLabel(pct)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              unlockAudio();
              const next = !muted;
              setMuted(next);
              setMutedUi(next);
            }}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-10" aria-label="Exit" onClick={() => finish(false, "Run closed.")}>
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {combo >= 3 ? (
        <p className="px-4 pb-1 font-display text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {combo >= 10 ? "Super energizer" : `Energy combo ×${combo}`}
        </p>
      ) : null}

      {feedback === "check-route" ? (
        <p className="px-4 pb-1 text-sm text-signal">Check the route.</p>
      ) : null}

      {slot ? (
        <p className="px-4 pb-1 text-xs text-muted">
          Place a <span className="text-fg">{labelPiece(slot.piece)}</span>
          {slot.cityId ? ` to reach ${CITY_BY_ID[slot.cityId]?.name ?? slot.cityId}` : ""}. Tap a piece, or drag it onto the glowing joint.
        </p>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <MapBoard />
        <CityReveal />
      </div>
    </section>
  );
}

function formatTime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function labelPiece(p: string) {
  if (p === "city") return "city connector";
  return p;
}
