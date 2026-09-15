import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { listScores, type ScoreRow } from "@/lib/game/leaderboard";
import { useGame } from "@/lib/game/store";
import { Wordmark } from "./logo";

export function LeaderboardScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const last = useGame((s) => s.lastResult);
  const [rows, setRows] = useState<ScoreRow[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let live = true;
    listScores()
      .then((r) => {
        if (live) setRows(r);
      })
      .catch(() => {
        if (live) setErr(true);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <section className="flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Wordmark compact />
      <div className="mx-auto mt-8 w-full max-w-md flex-1">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">This week</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-display">Energy leaderboard</h2>
        {err ? <p className="mt-6 text-sm text-muted">Board is warming up. Play and post a score.</p> : null}
        {rows === null && !err ? <p className="mt-6 text-sm text-muted">Loading corridor standings…</p> : null}
        {rows && rows.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No scores this week. Be the first connector.</p>
        ) : null}
        <ol className="mt-6 space-y-2">
          {rows?.map((row, i) => (
            <li
              key={row.id}
              className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-3"
            >
              <span className="w-6 font-display text-sm tabular-nums text-muted">{i + 1}</span>
              <span className="flex-1 text-sm text-fg">{row.handle}</span>
              <span className="font-display text-sm tabular-nums text-primary">{row.score.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ol>
        {last ? (
          <p className="mt-4 text-sm text-muted">
            You — {last.score.toLocaleString("en-IN")}.{" "}
            {rows && rows[0] && last.score < rows[0].score
              ? `Next target: beat ${rows[0].handle}.`
              : "You are on the pace."}
          </p>
        ) : null}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 pb-6">
        <Button onClick={() => setScreen("citizen")}>Play</Button>
        <Button variant="ghost" onClick={() => setScreen("title")}>
          Home
        </Button>
      </div>
    </section>
  );
}
