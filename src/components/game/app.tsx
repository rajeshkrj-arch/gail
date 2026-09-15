import { useEffect } from "react";
import { Toaster } from "sonner";
import { hydrateSave, useGame } from "@/lib/game/store";
import { TitleScreen } from "./title-screen";
import { CitizenScreen } from "./citizen-screen";
import { PlayScreen } from "./play-screen";
import { ResultsScreen } from "./results-screen";
import { LeaderboardScreen } from "./leaderboard-screen";
import { ChallengesScreen } from "./challenges-screen";
import { BadgesScreen } from "./badges-screen";

export function EnergyApp() {
  const screen = useGame((s) => s.screen);

  useEffect(() => {
    hydrateSave();
    const params = new URLSearchParams(window.location.search);
    const source = params.get("ref") || params.get("utm_source") || "direct";
    useGame.setState({ source });
  }, []);

  return (
    <div className="mx-auto h-dvh max-w-lg overflow-hidden bg-bg text-fg">
      {screen === "title" ? <TitleScreen /> : null}
      {screen === "citizen" ? <CitizenScreen /> : null}
      {screen === "play" ? <PlayScreen /> : null}
      {screen === "results" ? <ResultsScreen /> : null}
      {screen === "leaderboard" ? <LeaderboardScreen /> : null}
      {screen === "challenges" ? <ChallengesScreen /> : null}
      {screen === "badges" ? <BadgesScreen /> : null}
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          className: "bg-surface text-fg border-border",
        }}
      />
    </div>
  );
}
