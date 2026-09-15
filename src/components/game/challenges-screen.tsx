import { Button } from "@/components/ui/button";
import { CHALLENGES } from "@/lib/game/data";
import { useGame } from "@/lib/game/store";
import { Wordmark } from "./logo";

export function ChallengesScreen() {
  const setChallenge = useGame((s) => s.setChallenge);
  const setScreen = useGame((s) => s.setScreen);
  const current = useGame((s) => s.challengeId);

  return (
    <section className="flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Wordmark compact />
      <div className="mx-auto mt-8 w-full max-w-md flex-1">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">Weekly missions</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-display">Energy challenges</h2>
        <ul className="mt-6 space-y-2">
          {CHALLENGES.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setChallenge(c.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-transform duration-150 active:scale-[0.96] ${
                  current === c.id ? "border-primary bg-elevated" : "border-border bg-surface"
                }`}
              >
                <span className="block font-display text-xs tracking-[0.16em] text-muted uppercase">
                  Challenge {i + 1}
                </span>
                <span className="mt-1 block font-medium text-fg">{c.name}</span>
                <span className="mt-1 block text-sm text-muted">{c.brief}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 pb-6">
        <Button onClick={() => setScreen("citizen")}>Take this challenge</Button>
        <Button variant="ghost" onClick={() => setScreen("title")}>
          Home
        </Button>
      </div>
    </section>
  );
}
