let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  master = ctx.createGain();
  sfx = ctx.createGain();
  sfx.gain.value = 0.7;
  master.gain.value = muted ? 0 : 0.85;
  sfx.connect(master);
  master.connect(ctx.destination);
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (c.state === "suspended") void c.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) master.gain.setTargetAtTime(next ? 0 : 0.85, ctx.currentTime, 0.03);
}

export function isMuted() {
  return muted;
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.12, at = 0) {
  const c = ensure();
  if (!sfx) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(sfx);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

export function playPickup() {
  tone(640, 0.07, "triangle", 0.07);
}

export function playCorrect() {
  tone(420, 0.09, "sine", 0.1);
  tone(840, 0.12, "triangle", 0.06, 0.04);
}

export function playWrong() {
  tone(140, 0.16, "square", 0.07);
}

export function playCity() {
  tone(392, 0.18, "sine", 0.1);
  tone(494, 0.2, "sine", 0.08, 0.08);
  tone(587, 0.28, "triangle", 0.07, 0.16);
}

export function playComplete() {
  tone(392, 0.2, "sine", 0.1);
  tone(523, 0.22, "sine", 0.09, 0.1);
  tone(659, 0.28, "triangle", 0.08, 0.2);
  tone(784, 0.4, "sine", 0.07, 0.32);
}

export function playWhoosh() {
  const c = ensure();
  if (!sfx) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, t0);
  osc.frequency.exponentialRampToValueAtTime(720, t0 + 0.28);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
  osc.connect(g);
  g.connect(sfx);
  osc.start(t0);
  osc.stop(t0 + 0.32);
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && ctx?.state === "suspended") void ctx.resume();
  });
}
