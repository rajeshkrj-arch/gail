import { useEffect, useState } from "react";
import { Download, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HANDLES, SAVE_KEY } from "@/lib/game/data";
import { submitScore, recordPlay } from "@/lib/game/leaderboard";
import { paintShareCard, shareCopy } from "@/lib/game/share";
import { useGame } from "@/lib/game/store";
import { Wordmark } from "./logo";

export function ResultsScreen() {
  const result = useGame((s) => s.lastResult);
  const startRun = useGame((s) => s.startRun);
  const setScreen = useGame((s) => s.setScreen);
  const [handle, setHandle] = useState<(typeof HANDLES)[number]>(HANDLES[0]);
  const [posted, setPosted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!result) return;
    void recordPlay({
      data: { source: "direct", completed: result.won, cities: result.cities },
    }).catch(() => undefined);
  }, [result]);

  if (!result) return null;
  const snap = result;

  async function share() {
    const text = shareCopy(snap.score, snap.cities);
    try {
      const blob = await paintShareCard({ score: snap.score, cities: snap.cities, badge: snap.badge });
      const file = new File([blob], "gail-energy-connect.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "GAIL Energy Connect", text, files: [file] });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "GAIL Energy Connect", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast("Score copied. Paste it into WhatsApp or X.");
    } catch {
      toast("Sharing cancelled.");
    }
  }

  async function download() {
    const blob = await paintShareCard({ score: snap.score, cities: snap.cities, badge: snap.badge });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gail-energy-connect.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function post() {
    setBusy(true);
    try {
      let num = "17";
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        const p = raw ? (JSON.parse(raw) as { handleNum?: string }) : {};
        num = p.handleNum ?? String(10 + Math.floor(Math.random() * 89));
        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify({ ...(raw ? JSON.parse(raw) : { v: 1 }), handleRoot: handle, handleNum: num }),
        );
      } catch {
        /* ignore */
      }
      await submitScore({
        data: {
          handle: `${handle}-${num}`,
          score: snap.score,
          cities: snap.cities,
          durationMs: Math.round(snap.elapsedMs),
          badge: snap.badge,
          challengeId: snap.challengeId,
        },
      });
      setPosted(true);
      toast("On the weekly board.");
    } catch {
      toast("Could not save this week. Play is still counted locally.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Wordmark compact />
      <div className="mx-auto mt-8 w-full max-w-md">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          {result.won ? "Wah kya energy hai" : "Corridor unfinished"}
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-display tabular-nums">
          {result.score.toLocaleString("en-IN")}
        </h2>
        <p className="mt-1 text-sm text-muted">{result.reason}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <Stat k="Cities energized" v={String(result.cities)} />
          <Stat k="Energy level" v={result.badge} />
          <Stat k="Time" v={format(result.elapsedMs)} />
          <Stat k="Challenge" v={result.challengeId} />
        </dl>
        <blockquote className="mt-6 border-l-2 border-primary pl-4 text-sm text-fg">
          I connected the network. I energized the city. Can you beat my score?
        </blockquote>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={share}>
            <Share2 className="size-4" />
            Share card
          </Button>
          <Button variant="secondary" onClick={download}>
            <Download className="size-4" />
            Download badge
          </Button>
        </div>
        <div className="mt-8 rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium">Save this week’s board</p>
          <p className="mt-1 text-xs text-muted">Pick a connector alias. No account needed.</p>
          <div className="mt-3 flex gap-2">
            <select
              className="h-11 flex-1 rounded-md border border-border bg-elevated px-3 text-sm text-fg"
              value={handle}
              onChange={(e) => setHandle(e.target.value as (typeof HANDLES)[number])}
            >
              {HANDLES.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <Button disabled={posted || busy || !result.won} onClick={post}>
              Post
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 pb-8">
          <Button size="lg" onClick={startRun}>
            Play again
          </Button>
          <Button variant="secondary" onClick={() => setScreen("leaderboard")}>
            <Trophy className="size-4" />
            Weekly board
          </Button>
          <Button variant="ghost" onClick={() => setScreen("title")}>
            Home
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-3">
      <dt className="text-[11px] tracking-wide text-muted uppercase">{k}</dt>
      <dd className="mt-1 font-display text-lg font-semibold capitalize text-fg">{v}</dd>
    </div>
  );
}

function format(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
