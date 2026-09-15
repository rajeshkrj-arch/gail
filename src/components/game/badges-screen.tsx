import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game/store";
import { Wordmark } from "./logo";

const TIERS = [
  { id: "starter", name: "Energy Starter", rule: "Connect your first city." },
  { id: "connector", name: "Pipeline Connector", rule: "Connect 3 cities." },
  { id: "energizer", name: "City Energizer", rule: "Connect 5 cities." },
  { id: "master", name: "Wah Kya Energy Hai", rule: "Energize the complete map." },
];

export function BadgesScreen() {
  const earned = useGame((s) => s.earnedBadges);
  const setScreen = useGame((s) => s.setScreen);

  return (
    <section className="flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Wordmark compact />
      <div className="mx-auto mt-8 w-full max-w-md flex-1">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">Connector ranks</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-display">Badge system</h2>
        <ul className="mt-6 space-y-2">
          {TIERS.map((t) => {
            const on = earned.includes(t.id);
            return (
              <li
                key={t.id}
                className={`rounded-lg border px-4 py-3 ${on ? "border-primary bg-elevated" : "border-border bg-surface"}`}
              >
                <p className="font-medium text-fg">{t.name}</p>
                <p className="mt-1 text-sm text-muted">{t.rule}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-subtle">{on ? "Earned" : "Locked"}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mx-auto w-full max-w-md pb-6">
        <Button variant="ghost" className="w-full" onClick={() => setScreen("title")}>
          Home
        </Button>
      </div>
    </section>
  );
}
