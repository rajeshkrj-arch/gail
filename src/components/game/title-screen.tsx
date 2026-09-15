import { ListOrdered, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "./logo";
import { useGame } from "@/lib/game/store";
import { unlockAudio } from "@/lib/game/audio";
import { asset } from "@/lib/asset";

export function TitleScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const high = useGame((s) => s.highScore);

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <img
        src={asset("/hero-map.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-linear-to-b from-bg/70 via-bg/55 to-bg" />
      <div className="relative flex h-full flex-col justify-between px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Wordmark />
        <div className="stagger-in mx-auto max-w-md space-y-4 text-center">
          <p className="font-display text-xs font-semibold tracking-[0.28em] text-primary uppercase">
            Eastern India needs energy
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-display text-fg sm:text-5xl">
            Can you connect the network?
          </h2>
          <p className="text-sm text-muted">
            Drag the right pipe onto the JHBDPL corridor. When a city connects, life turns on.
          </p>
          {high > 0 ? (
            <p className="font-display text-sm tabular-nums text-primary">Best {high.toLocaleString("en-IN")}</p>
          ) : null}
        </div>
        <div className="mx-auto flex w-full max-w-md flex-col gap-2">
          <Button
            size="lg"
            className="h-12 w-full font-display text-base tracking-wide"
            onClick={() => {
              unlockAudio();
              setScreen("citizen");
            }}
          >
            <Zap className="size-4" />
            Start connecting
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setScreen("challenges")}>
              Challenges
            </Button>
            <Button variant="secondary" onClick={() => setScreen("leaderboard")}>
              <Trophy className="size-4" />
              Leaderboard
            </Button>
          </div>
          <Button variant="ghost" onClick={() => setScreen("badges")}>
            <ListOrdered className="size-4" />
            Badges
          </Button>
          <p className="pt-2 text-center text-[11px] tracking-[0.16em] text-subtle uppercase">
            JHBDPL · Pradhan Mantri Urja Ganga
          </p>
        </div>
      </div>
    </section>
  );
}
