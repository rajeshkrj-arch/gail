import { create } from "zustand";
import {
  badgeFor,
  CHALLENGES,
  CITIES,
  CITIZENS,
  POINTS,
  SAVE_KEY,
  SLOTS,
  type CitizenId,
  type PieceType,
  type Screen,
} from "./data";
import { playCity, playComplete, playCorrect, playWrong, playWhoosh } from "./audio";

export type Feedback = null | "check-route" | "combo3" | "combo5" | "super";

interface Persist {
  v: 1;
  highScore: number;
  badges: string[];
  muted: boolean;
  handleRoot?: string;
  handleNum?: string;
}

function load(): Persist {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { v: 1, highScore: 0, badges: [], muted: false };
    const p = JSON.parse(raw) as Persist;
    if (p.v !== 1) return { v: 1, highScore: 0, badges: [], muted: false };
    return p;
  } catch {
    return { v: 1, highScore: 0, badges: [], muted: false };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

type Outcome = { won: boolean; reason: string } | null;

interface GameState {
  screen: Screen;
  challengeId: string;
  citizen: CitizenId | null;
  nextIndex: number;
  connected: string[];
  citiesOn: string[];
  score: number;
  combo: number;
  wrong: number;
  elapsedMs: number;
  revealMs: number;
  running: boolean;
  revealCity: string | null;
  pulseSlot: string | null;
  feedback: Feedback;
  selectedPiece: PieceType | null;
  shake: number;
  cgdAwarded: boolean;
  combo3Awarded: boolean;
  pending: Outcome;
  source: string;
  highScore: number;
  earnedBadges: string[];
  lastResult: {
    score: number;
    cities: number;
    elapsedMs: number;
    badge: string;
    challengeId: string;
    won: boolean;
    reason: string;
  } | null;
  setScreen: (s: Screen) => void;
  setCitizen: (id: CitizenId) => void;
  setChallenge: (id: string) => void;
  startRun: () => void;
  tick: (dt: number) => void;
  tryPlace: (piece: PieceType) => boolean;
  selectPiece: (p: PieceType | null) => void;
  clearReveal: () => void;
  clearFeedback: () => void;
  finish: (won: boolean, reason: string) => void;
}

function emptyRun() {
  return {
    nextIndex: 0,
    connected: [] as string[],
    citiesOn: [] as string[],
    score: 0,
    combo: 0,
    wrong: 0,
    elapsedMs: 0,
    revealMs: 0,
    running: false,
    revealCity: null as string | null,
    pulseSlot: null as string | null,
    feedback: null as Feedback,
    selectedPiece: null as PieceType | null,
    shake: 0,
    cgdAwarded: false,
    combo3Awarded: false,
    pending: null as Outcome,
  };
}

function evaluate(s: {
  challengeId: string;
  citiesOn: string[];
  nextIndex: number;
  wrong: number;
  elapsedMs: number;
}): Outcome {
  const ch = CHALLENGES.find((c) => c.id === s.challengeId) ?? CHALLENGES[4];
  if (ch.timeLimitMs && s.citiesOn.length < ch.cityTarget && s.elapsedMs >= ch.timeLimitMs) {
    return { won: false, reason: "Time is up. The corridor is still waiting." };
  }
  const mapDone = s.nextIndex >= SLOTS.length;
  if (s.citiesOn.length >= ch.cityTarget) {
    if (ch.noWrong && s.wrong > 0) {
      return mapDone ? { won: false, reason: "A wrong connection cost the master run." } : null;
    }
    if (ch.cityTarget < 7) return { won: true, reason: "Network live." };
    if (mapDone) return { won: true, reason: "The eastern corridor is live." };
  }
  if (mapDone && s.citiesOn.length < ch.cityTarget) {
    return { won: false, reason: "The map is laid, but the challenge is unfinished." };
  }
  return null;
}

export const useGame = create<GameState>((set, get) => {
  return {
    screen: "title",
    challengeId: "wah",
    citizen: null,
    ...emptyRun(),
    source: "direct",
    highScore: 0,
    earnedBadges: [],
    lastResult: null,

    setScreen: (screen) => set({ screen }),
    setCitizen: (citizen) => set({ citizen }),
    setChallenge: (challengeId) => set({ challengeId }),

    startRun: () => {
      set({
        ...emptyRun(),
        running: true,
        screen: "play",
        lastResult: null,
      });
    },

    tick: (dt) => {
      const s = get();
      if (!s.running || s.screen !== "play") return;
      if (s.revealCity) {
        const revealMs = s.revealMs + dt * 1000;
        if (revealMs >= 1800) {
          set({ revealCity: null, revealMs: 0 });
          const pending = get().pending;
          if (pending) get().finish(pending.won, pending.reason);
        } else {
          set({ revealMs, shake: Math.max(0, s.shake - dt * 4) });
        }
        return;
      }
      const elapsedMs = s.elapsedMs + dt * 1000;
      set({ elapsedMs, shake: Math.max(0, s.shake - dt * 4) });
      const outcome = evaluate({ ...get(), elapsedMs });
      if (outcome) get().finish(outcome.won, outcome.reason);
    },

    tryPlace: (piece) => {
      const s = get();
      if (!s.running || s.revealCity || s.pending) return false;
      const slot = SLOTS[s.nextIndex];
      if (!slot) return false;
      if (piece !== slot.piece) {
        playWrong();
        set({
          wrong: s.wrong + 1,
          combo: 0,
          feedback: "check-route",
          shake: 1,
          selectedPiece: null,
        });
        const after = evaluate({ ...get(), wrong: s.wrong + 1 });
        if (after && after.won === false && after.reason.includes("master")) {
          /* keep going until map done */
        }
        return false;
      }

      playCorrect();
      playWhoosh();
      const connected = [...s.connected, slot.id];
      let score = s.score + POINTS.pipe;
      const combo = s.combo + 1;
      const feedback: Feedback = combo >= 10 ? "super" : combo >= 5 ? "combo5" : combo >= 3 ? "combo3" : null;
      let combo3Awarded = s.combo3Awarded;
      if (combo === 3 && !combo3Awarded) {
        score += POINTS.combo3;
        combo3Awarded = true;
      }

      const citiesOn = [...s.citiesOn];
      let revealCity: string | null = null;
      if (slot.cityId && !citiesOn.includes(slot.cityId)) {
        citiesOn.push(slot.cityId);
        score += POINTS.city;
        revealCity = slot.cityId;
        playCity();
      }

      let cgdAwarded = s.cgdAwarded;
      if (!cgdAwarded && citiesOn.length >= 5) {
        score += POINTS.cgdNetwork;
        cgdAwarded = true;
      }

      const nextIndex = s.nextIndex + 1;
      const snapshot = {
        challengeId: s.challengeId,
        citiesOn,
        nextIndex,
        wrong: s.wrong,
        elapsedMs: s.elapsedMs,
      };
      const pending = evaluate(snapshot);

      set({
        connected,
        citiesOn,
        score,
        combo,
        feedback,
        combo3Awarded,
        cgdAwarded,
        nextIndex,
        revealCity,
        revealMs: 0,
        pulseSlot: slot.id,
        selectedPiece: null,
        pending: revealCity ? pending : null,
      });

      if (pending && !revealCity) get().finish(pending.won, pending.reason);
      return true;
    },

    selectPiece: (selectedPiece) => set({ selectedPiece }),
    clearReveal: () => {
      const pending = get().pending;
      set({ revealCity: null, revealMs: 0 });
      if (pending) get().finish(pending.won, pending.reason);
    },
    clearFeedback: () => set({ feedback: null }),

    finish: (won, reason) => {
      const s = get();
      if (s.screen === "results") return;
      const ch = CHALLENGES.find((c) => c.id === s.challengeId) ?? CHALLENGES[4];
      let score = s.score;
      const complete = won && s.citiesOn.length >= Math.min(7, ch.cityTarget);
      if (won && s.citiesOn.length >= 7) score += POINTS.completeRoute;
      if (won && s.wrong === 0) score += POINTS.noWrong;
      if (won) score += POINTS.completeChallenge;
      const citizen = CITIZENS.find((c) => c.id === s.citizen);
      if (won && citizen) score += citizen.bonus;
      const badge = badgeFor(s.citiesOn.length, Boolean(complete && s.citiesOn.length >= 7));
      const earnedBadges = s.earnedBadges.includes(badge.id) ? s.earnedBadges : [...s.earnedBadges, badge.id];
      const highScore = Math.max(s.highScore, score);
      const prev = load();
      save({
        v: 1,
        highScore,
        badges: earnedBadges,
        muted: prev.muted,
        handleRoot: prev.handleRoot,
        handleNum: prev.handleNum,
      });
      if (won) playComplete();
      set({
        running: false,
        score,
        screen: "results",
        revealCity: null,
        pending: null,
        highScore,
        earnedBadges,
        lastResult: {
          score,
          cities: s.citiesOn.length,
          elapsedMs: s.elapsedMs,
          badge: badge.name,
          challengeId: s.challengeId,
          won,
          reason,
        },
      });
    },
  };
});

export function hydrateSave() {
  const p = load();
  useGame.setState({ highScore: p.highScore, earnedBadges: p.badges });
  return p;
}

export function challengeOf(id: string) {
  return CHALLENGES.find((c) => c.id === id) ?? CHALLENGES[4];
}

export const TOTAL_CITIES = CITIES.length;
