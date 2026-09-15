import { Building2, Bus, Factory, Home, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CITIZENS, type CitizenId } from "@/lib/game/data";
import { useGame } from "@/lib/game/store";
import { unlockAudio } from "@/lib/game/audio";
import { Wordmark } from "./logo";

const ICONS: Record<CitizenId, typeof Home> = {
  home: Home,
  commute: Bus,
  industry: Factory,
  city: Building2,
  environment: Leaf,
};

export function CitizenScreen() {
  const setCitizen = useGame((s) => s.setCitizen);
  const startRun = useGame((s) => s.startRun);
  const setScreen = useGame((s) => s.setScreen);
  const citizen = useGame((s) => s.citizen);

  return (
    <section className="flex h-full flex-col bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Wordmark compact />
      <div className="mx-auto mt-8 w-full max-w-md flex-1">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">Citizen mode</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-display">Who do you want to energize?</h2>
        <p className="mt-2 text-sm text-muted">The network is the same. Your bonus follows what you care about.</p>
        <ul className="mt-6 grid gap-2">
          {CITIZENS.map((c) => {
            const Icon = ICONS[c.id];
            const on = citizen === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCitizen(c.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-transform duration-150 active:scale-[0.96] ${
                    on ? "border-primary bg-elevated" : "border-border bg-surface"
                  }`}
                >
                  <Icon className="size-5 text-primary" />
                  <span className="flex-1">
                    <span className="block font-medium text-fg">{c.label}</span>
                    <span className="block text-xs text-muted">{c.blurb}</span>
                  </span>
                  <span className="font-display text-sm tabular-nums text-primary">+{c.bonus}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
        <Button
          size="lg"
          disabled={!citizen}
          onClick={() => {
            unlockAudio();
            startRun();
          }}
        >
          Connect the corridor
        </Button>
        <Button variant="ghost" onClick={() => setScreen("title")}>
          Back
        </Button>
      </div>
    </section>
  );
}
