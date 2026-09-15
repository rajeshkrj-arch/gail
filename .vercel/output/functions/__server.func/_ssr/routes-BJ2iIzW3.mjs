import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { _ as node, a as HANDLES, c as PIECES, d as SAVE_KEY, f as SLOTS, g as midpoint, h as impactLabel, i as CITY_BY_ID, l as POINTS, m as badgeFor, n as CITIES, o as LAND_PATH, p as VIEW, r as CITIZENS, s as NODES, t as CHALLENGES, u as RIVER_PATH, v as pathD } from "./data-VSeDfhxJ.mjs";
import { a as string, i as object, r as number, t as boolean } from "../_libs/zod.mjs";
import { _ as CarTaxiFront, a as UtensilsCrossed, b as Bike, d as Leaf, f as Landmark, g as Download, h as Factory, i as Volume2, l as Share2, m as Hospital, n as X, o as Truck, p as House, r as VolumeX, s as Trophy, t as Zap, u as ListOrdered, v as Bus, y as Building2 } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BJ2iIzW3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
function ensure() {
	if (ctx) return ctx;
	ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
	master = ctx.createGain();
	sfx = ctx.createGain();
	sfx.gain.value = .7;
	master.gain.value = muted ? 0 : .85;
	sfx.connect(master);
	master.connect(ctx.destination);
	return ctx;
}
function unlockAudio() {
	const c = ensure();
	if (c.state === "suspended") c.resume();
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .85, ctx.currentTime, .03);
}
function isMuted() {
	return muted;
}
function tone(freq, dur, type, gain = .12, at = 0) {
	const c = ensure();
	if (!sfx) return;
	const t0 = c.currentTime + at;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t0);
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(gain, t0 + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
	osc.connect(g);
	g.connect(sfx);
	osc.start(t0);
	osc.stop(t0 + dur + .02);
	osc.onended = () => {
		osc.disconnect();
		g.disconnect();
	};
}
function playPickup() {
	tone(640, .07, "triangle", .07);
}
function playCorrect() {
	tone(420, .09, "sine", .1);
	tone(840, .12, "triangle", .06, .04);
}
function playWrong() {
	tone(140, .16, "square", .07);
}
function playCity() {
	tone(392, .18, "sine", .1);
	tone(494, .2, "sine", .08, .08);
	tone(587, .28, "triangle", .07, .16);
}
function playComplete() {
	tone(392, .2, "sine", .1);
	tone(523, .22, "sine", .09, .1);
	tone(659, .28, "triangle", .08, .2);
	tone(784, .4, "sine", .07, .32);
}
function playWhoosh() {
	const c = ensure();
	if (!sfx) return;
	const t0 = c.currentTime;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(180, t0);
	osc.frequency.exponentialRampToValueAtTime(720, t0 + .28);
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(.05, t0 + .04);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + .3);
	osc.connect(g);
	g.connect(sfx);
	osc.start(t0);
	osc.stop(t0 + .32);
}
if (typeof window !== "undefined") document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "visible" && ctx?.state === "suspended") ctx.resume();
});
function load() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return {
			v: 1,
			highScore: 0,
			badges: [],
			muted: false
		};
		const p = JSON.parse(raw);
		if (p.v !== 1) return {
			v: 1,
			highScore: 0,
			badges: [],
			muted: false
		};
		return p;
	} catch {
		return {
			v: 1,
			highScore: 0,
			badges: [],
			muted: false
		};
	}
}
function save(p) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(p));
	} catch {}
}
function emptyRun() {
	return {
		nextIndex: 0,
		connected: [],
		citiesOn: [],
		score: 0,
		combo: 0,
		wrong: 0,
		elapsedMs: 0,
		revealMs: 0,
		running: false,
		revealCity: null,
		pulseSlot: null,
		feedback: null,
		selectedPiece: null,
		shake: 0,
		cgdAwarded: false,
		combo3Awarded: false,
		pending: null
	};
}
function evaluate(s) {
	const ch = CHALLENGES.find((c) => c.id === s.challengeId) ?? CHALLENGES[4];
	if (ch.timeLimitMs && s.citiesOn.length < ch.cityTarget && s.elapsedMs >= ch.timeLimitMs) return {
		won: false,
		reason: "Time is up. The corridor is still waiting."
	};
	const mapDone = s.nextIndex >= SLOTS.length;
	if (s.citiesOn.length >= ch.cityTarget) {
		if (ch.noWrong && s.wrong > 0) return mapDone ? {
			won: false,
			reason: "A wrong connection cost the master run."
		} : null;
		if (ch.cityTarget < 7) return {
			won: true,
			reason: "Network live."
		};
		if (mapDone) return {
			won: true,
			reason: "The eastern corridor is live."
		};
	}
	if (mapDone && s.citiesOn.length < ch.cityTarget) return {
		won: false,
		reason: "The map is laid, but the challenge is unfinished."
	};
	return null;
}
var useGame = create((set, get) => {
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
				lastResult: null
			});
		},
		tick: (dt) => {
			const s = get();
			if (!s.running || s.screen !== "play") return;
			if (s.revealCity) {
				const revealMs = s.revealMs + dt * 1e3;
				if (revealMs >= 1800) {
					set({
						revealCity: null,
						revealMs: 0
					});
					const pending = get().pending;
					if (pending) get().finish(pending.won, pending.reason);
				} else set({
					revealMs,
					shake: Math.max(0, s.shake - dt * 4)
				});
				return;
			}
			const elapsedMs = s.elapsedMs + dt * 1e3;
			set({
				elapsedMs,
				shake: Math.max(0, s.shake - dt * 4)
			});
			const outcome = evaluate({
				...get(),
				elapsedMs
			});
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
					selectedPiece: null
				});
				const after = evaluate({
					...get(),
					wrong: s.wrong + 1
				});
				if (after && after.won === false && after.reason.includes("master")) {}
				return false;
			}
			playCorrect();
			playWhoosh();
			const connected = [...s.connected, slot.id];
			let score = s.score + POINTS.pipe;
			const combo = s.combo + 1;
			const feedback = combo >= 10 ? "super" : combo >= 5 ? "combo5" : combo >= 3 ? "combo3" : null;
			let combo3Awarded = s.combo3Awarded;
			if (combo === 3 && !combo3Awarded) {
				score += POINTS.combo3;
				combo3Awarded = true;
			}
			const citiesOn = [...s.citiesOn];
			let revealCity = null;
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
			const pending = evaluate({
				challengeId: s.challengeId,
				citiesOn,
				nextIndex,
				wrong: s.wrong,
				elapsedMs: s.elapsedMs
			});
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
				pending: revealCity ? pending : null
			});
			if (pending && !revealCity) get().finish(pending.won, pending.reason);
			return true;
		},
		selectPiece: (selectedPiece) => set({ selectedPiece }),
		clearReveal: () => {
			const pending = get().pending;
			set({
				revealCity: null,
				revealMs: 0
			});
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
				handleNum: prev.handleNum
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
					reason
				}
			});
		}
	};
});
function hydrateSave() {
	const p = load();
	useGame.setState({
		highScore: p.highScore,
		earnedBadges: p.badges
	});
	return p;
}
function challengeOf(id) {
	return CHALLENGES.find((c) => c.id === id) ?? CHALLENGES[4];
}
CITIES.length;
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 [&_svg]:pointer-events-none [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/92",
			secondary: "border border-border bg-elevated text-fg hover:bg-elevated/80",
			ghost: "text-fg hover:bg-elevated",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-elevated"
		},
		size: {
			default: "h-11 rounded-md px-5 text-sm",
			lg: "h-12 rounded-lg px-6 text-base",
			sm: "h-9 rounded-sm px-3 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function GailMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/gail-logo.svg",
		alt: "GAIL",
		className: cn("select-none", className),
		draggable: false
	});
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GailMark, { className: compact ? "size-10" : "size-14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[0.7rem] font-semibold tracking-[0.22em] text-muted",
					children: "GAIL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: cn("font-display font-semibold tracking-display text-fg", compact ? "text-lg" : "text-2xl"),
					children: "Energy Connect"
				}),
				!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs tracking-[0.14em] text-muted uppercase",
					children: "Jodo Pipeline. Jagao Shehar."
				}) : null
			]
		})]
	});
}
function TitleScreen() {
	const setScreen = useGame((s) => s.setScreen);
	const high = useGame((s) => s.highScore);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex h-full min-h-0 flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/hero-map.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-b from-bg/70 via-bg/55 to-bg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-between px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stagger-in mx-auto max-w-md space-y-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xs font-semibold tracking-[0.28em] text-primary uppercase",
								children: "Eastern India needs energy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-semibold leading-tight tracking-display text-fg sm:text-5xl",
								children: "Can you connect the network?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Drag the right pipe onto the JHBDPL corridor. When a city connects, life turns on."
							}),
							high > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-sm tabular-nums text-primary",
								children: ["Best ", high.toLocaleString("en-IN")]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex w-full max-w-md flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "h-12 w-full font-display text-base tracking-wide",
								onClick: () => {
									unlockAudio();
									setScreen("citizen");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" }), "Start connecting"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => setScreen("challenges"),
									children: "Challenges"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									onClick: () => setScreen("leaderboard"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), "Leaderboard"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: () => setScreen("badges"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { className: "size-4" }), "Badges"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pt-2 text-center text-[11px] tracking-[0.16em] text-subtle uppercase",
								children: "JHBDPL · Pradhan Mantri Urja Ganga"
							})
						]
					})
				]
			})
		]
	});
}
var ICONS$1 = {
	home: House,
	commute: Bus,
	industry: Factory,
	city: Building2,
	environment: Leaf
};
function CitizenScreen() {
	const setCitizen = useGame((s) => s.setCitizen);
	const startRun = useGame((s) => s.startRun);
	const setScreen = useGame((s) => s.setScreen);
	const citizen = useGame((s) => s.citizen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full flex-col bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 w-full max-w-md flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase",
						children: "Citizen mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-display",
						children: "Who do you want to energize?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The network is the same. Your bonus follows what you care about."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-2",
						children: CITIZENS.map((c) => {
							const Icon = ICONS$1[c.id];
							const on = citizen === c.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCitizen(c.id),
								className: `flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-transform duration-150 active:scale-[0.96] ${on ? "border-primary bg-elevated" : "border-border bg-surface"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-medium text-fg",
											children: c.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted",
											children: c.blurb
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-sm tabular-nums text-primary",
										children: ["+", c.bonus]
									})
								]
							}) }, c.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-md flex-col gap-2 pb-[env(safe-area-inset-bottom)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					disabled: !citizen,
					onClick: () => {
						unlockAudio();
						startRun();
					},
					children: "Connect the corridor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setScreen("title"),
					children: "Back"
				})]
			})
		]
	});
}
function Progress({ value, className }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative h-2 overflow-hidden rounded-xs bg-elevated", className),
		role: "progressbar",
		"aria-valuenow": Math.round(pct),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-xs bg-primary transition-[width] duration-500 ease-out",
			style: { width: `${pct}%` }
		})
	});
}
function PipeIcon({ type, lit = false }) {
	const stroke = lit ? "var(--color-primary)" : "var(--color-fg)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: "size-9",
		"aria-hidden": true,
		children: [
			type === "straight" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 6v36",
				fill: "none",
				stroke,
				strokeWidth: "6",
				strokeLinecap: "round"
			}) : null,
			type === "turn" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 38h14a14 14 0 0 0 14-14V8",
				fill: "none",
				stroke,
				strokeWidth: "6",
				strokeLinecap: "round"
			}) : null,
			type === "junction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 6v36M24 24h18",
				fill: "none",
				stroke,
				strokeWidth: "6",
				strokeLinecap: "round"
			}) : null,
			type === "city" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M8 24h16",
					fill: "none",
					stroke,
					strokeWidth: "6",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "24",
					r: "8",
					fill: "none",
					stroke,
					strokeWidth: "4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "24",
					r: "3",
					fill: stroke
				})
			] }) : null
		]
	});
}
function MapBoard() {
	const connected = useGame((s) => s.connected);
	const nextIndex = useGame((s) => s.nextIndex);
	const citiesOn = useGame((s) => s.citiesOn);
	const pulseSlot = useGame((s) => s.pulseSlot);
	const selectedPiece = useGame((s) => s.selectedPiece);
	const tryPlace = useGame((s) => s.tryPlace);
	const selectPiece = useGame((s) => s.selectPiece);
	const shake = useGame((s) => s.shake);
	const revealCity = useGame((s) => s.revealCity);
	const svgRef = (0, import_react.useRef)(null);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const [pulse, setPulse] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!pulseSlot) return;
		let raf = 0;
		let start = performance.now();
		const loop = (now) => {
			const t = Math.min(1, (now - start) / 900);
			setPulse(t);
			if (t < 1) raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [pulseSlot]);
	function clientToSvg(cx, cy) {
		const svg = svgRef.current;
		if (!svg) return {
			x: 0,
			y: 0
		};
		const pt = svg.createSVGPoint();
		pt.x = cx;
		pt.y = cy;
		const m = svg.getScreenCTM();
		if (!m) return {
			x: 0,
			y: 0
		};
		const p = pt.matrixTransform(m.inverse());
		return {
			x: p.x,
			y: p.y
		};
	}
	function onDropAt(type, cx, cy, requireNear) {
		const slot = SLOTS[nextIndex];
		if (!slot || revealCity) return;
		if (requireNear) {
			const a = node(slot.from);
			const b = node(slot.to);
			const mid = midpoint(a, b);
			const p = clientToSvg(cx, cy);
			if (Math.hypot(p.x - mid.x, p.y - mid.y) >= 48) return;
		}
		tryPlace(type);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full min-h-0 w-full overflow-hidden",
		style: { transform: shake > 0 ? `translateX(${Math.sin(shake * 40) * 6}px)` : void 0 },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 top-0 bottom-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					ref: svgRef,
					viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
					className: "h-full w-full touch-none",
					role: "img",
					"aria-label": "Eastern India JHBDPL network",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
							id: "glow",
							x: "-40%",
							y: "-40%",
							width: "180%",
							height: "180%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
								stdDeviation: "2.4",
								result: "b"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
							id: "landFill",
							cx: "48%",
							cy: "36%",
							r: "72%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#243044"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#141c28"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: VIEW.w,
							height: VIEW.h,
							fill: "var(--color-water)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: LAND_PATH,
							fill: "url(#landFill)",
							stroke: "color-mix(in oklab, var(--color-fg) 22%, transparent)",
							strokeWidth: "1.4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: RIVER_PATH,
							fill: "none",
							stroke: "#2a3d55",
							strokeWidth: "2.4",
							strokeLinecap: "round",
							opacity: "0.7"
						}),
						SLOTS.map((slot, i) => {
							const a = node(slot.from);
							const b = node(slot.to);
							const on = connected.includes(slot.id);
							const active = i === nextIndex;
							const d = pathD(a, b);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [(slot.extraPaths ?? []).map(([fa, tb]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: pathD(node(fa), node(tb)),
								fill: "none",
								stroke: on ? "var(--color-pipe)" : "var(--color-pipe-dim)",
								strokeWidth: on ? 4.5 : 2.5,
								strokeLinecap: "round",
								strokeDasharray: on ? "10 7" : void 0,
								className: on ? "origin-center" : void 0,
								style: on ? { animation: "energy-dash 1.1s linear infinite" } : void 0,
								filter: on ? "url(#glow)" : void 0
							}, `${fa}-${tb}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d,
								fill: "none",
								stroke: on ? "var(--color-pipe)" : active ? "color-mix(in oklab, var(--color-primary) 55%, #3d3824)" : "var(--color-pipe-dim)",
								strokeWidth: on ? 5 : active ? 4 : 2.5,
								strokeLinecap: "round",
								strokeDasharray: on ? "10 7" : active ? "6 6" : "2 6",
								style: on ? { animation: "energy-dash 1.1s linear infinite" } : void 0,
								filter: on ? "url(#glow)" : void 0
							})] }, slot.id);
						}),
						pulseSlot && pulse < 1 ? (() => {
							const slot = SLOTS.find((s) => s.id === pulseSlot);
							if (!slot) return null;
							const a = node(slot.from);
							const b = node(slot.to);
							const x = a.x + (b.x - a.x) * pulse;
							const y = a.y + (b.y - a.y) * pulse;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: x,
								cy: y,
								r: 7,
								fill: "var(--color-primary)",
								filter: "url(#glow)",
								opacity: 1 - pulse * .3
							});
						})() : null,
						SLOTS.map((slot, i) => {
							const a = node(slot.from);
							const b = node(slot.to);
							const mid = midpoint(a, b);
							const active = i === nextIndex && !connected.includes(slot.id);
							if (connected.includes(slot.id)) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: `translate(${mid.x} ${mid.y})`,
								className: active ? "origin-center" : void 0,
								style: active ? { animation: "pulse-slot 1.4s ease-in-out infinite" } : void 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									r: active ? 18 : 11,
									fill: active ? "color-mix(in oklab, var(--color-primary) 18%, #12151c)" : "#12151c",
									stroke: active ? "var(--color-primary)" : "var(--color-pipe-dim)",
									strokeWidth: active ? 2 : 1
								}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									r: "3.5",
									fill: "var(--color-primary)"
								}) : null]
							}, `slot-${slot.id}`);
						}),
						Object.values(NODES).map((n) => {
							const on = n.cityId ? citiesOn.includes(n.cityId) : connected.some((id) => {
								const sl = SLOTS.find((s) => s.id === id);
								return sl && (sl.from === n.id || sl.to === n.id);
							});
							const isCity = n.kind === "city";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: `translate(${n.x} ${n.y})`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									r: isCity ? 9 : 5,
									fill: on ? "var(--color-primary)" : isCity ? "var(--color-city-off)" : "#2a3140",
									stroke: on ? "var(--color-fg)" : "color-mix(in oklab, var(--color-fg) 25%, transparent)",
									strokeWidth: isCity ? 1.6 : 1,
									filter: on ? "url(#glow)" : void 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: n.lx ?? 0,
									y: (isCity ? 20 : 15) + (n.ly ?? 0),
									textAnchor: "middle",
									fill: on ? "var(--color-fg)" : "var(--color-muted)",
									fontSize: isCity ? 9 : 7.5,
									fontFamily: "Outfit, sans-serif",
									fontWeight: isCity ? 600 : 500,
									children: n.label
								})]
							}, n.id);
						})
					]
				})
			}),
			drag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-primary bg-surface p-2 shadow-panel",
				style: {
					left: drag.x,
					top: drag.y
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipeIcon, {
					type: drag.type,
					lit: true
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tray, {
				selected: selectedPiece,
				onSelect: (t) => {
					playPickup();
					selectPiece(t);
				},
				onDragStart: (t, x, y) => {
					playPickup();
					setDrag({
						type: t,
						x,
						y
					});
				},
				onDragMove: (x, y) => setDrag((d) => d ? {
					...d,
					x,
					y
				} : d),
				onDragEnd: (t, x, y) => {
					setDrag(null);
					onDropAt(t, x, y, true);
				},
				onTapPlace: (t) => tryPlace(t)
			})
		]
	});
}
function Tray({ selected, onSelect, onDragStart, onDragMove, onDragEnd, onTapPlace }) {
	const dragging = (0, import_react.useRef)(null);
	const moved = (0, import_react.useRef)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto mx-auto grid max-w-lg grid-cols-4 gap-2 rounded-xl border border-border bg-surface/95 p-2 shadow-panel backdrop-blur-sm",
			children: PIECES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-[10px] font-medium uppercase tracking-wide transition-transform duration-150 active:scale-[0.96]", selected === p.id ? "border-primary bg-elevated text-primary" : "border-border bg-elevated text-muted"),
				onPointerDown: (e) => {
					e.currentTarget.setPointerCapture(e.pointerId);
					dragging.current = p.id;
					moved.current = false;
					onSelect(p.id);
					onDragStart(p.id, e.clientX, e.clientY);
				},
				onPointerMove: (e) => {
					if (!dragging.current) return;
					if (Math.hypot(e.movementX, e.movementY) > 2) moved.current = true;
					onDragMove(e.clientX, e.clientY);
				},
				onPointerUp: (e) => {
					const t = dragging.current;
					dragging.current = null;
					if (!t) return;
					if (moved.current) onDragEnd(t, e.clientX, e.clientY);
					else onTapPlace(t);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipeIcon, {
					type: p.id,
					lit: selected === p.id
				}), p.label]
			}, p.id))
		})
	});
}
var ICONS = {
	auto: Bike,
	home: House,
	food: UtensilsCrossed,
	temple: Landmark,
	taxi: CarTaxiFront,
	office: Building2,
	hospital: Hospital,
	industry: Factory,
	bus: Bus,
	truck: Truck
};
function CityReveal() {
	const id = useGame((s) => s.revealCity);
	const clear = useGame((s) => s.clearReveal);
	const started = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!id) return;
		started.current = performance.now();
		let raf = 0;
		const loop = (now) => {
			if (now - started.current > 2400) {
				clear();
				return;
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [id, clear]);
	if (!id) return null;
	const city = CITY_BY_ID[id];
	if (!city) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center bg-bg/55 p-4 pb-28 backdrop-blur-[2px]",
		onClick: clear,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") clear();
		},
		role: "button",
		tabIndex: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stagger-in w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-panel",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-16/9 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/cities/dark.jpg",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover opacity-80",
						crossOrigin: "anonymous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: city.image,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover animate-[reveal-up_500ms_ease-out]",
						crossOrigin: "anonymous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 bg-linear-to-t from-bg to-transparent p-4 pt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase",
							children: "Energized"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-semibold tracking-display text-fg",
							children: city.name
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: city.line
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-2",
						children: city.activities.map((a) => {
							const Icon = ICONS[a.icon];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }), a.label]
							}, a.label);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold tabular-nums text-primary",
						children: "+500 energy points"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-subtle uppercase",
						children: "Tap to continue"
					})
				]
			})]
		})
	});
}
function PlayScreen() {
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
	const [muted, setMutedUi] = (0, import_react.useState)(isMuted);
	const ch = challengeOf(challengeId);
	const pct = Math.round(citiesOn.length / CITIES.length * 100);
	const slot = SLOTS[nextIndex];
	const tickRef = (0, import_react.useRef)(tick);
	tickRef.current = tick;
	(0, import_react.useEffect)(() => {
		if (!running) return;
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			tickRef.current(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [running]);
	(0, import_react.useEffect)(() => {
		if (!feedback) return;
		let raf = 0;
		const start = performance.now();
		const loop = (now) => {
			if (now - start > 1400) {
				clearFeedback();
				return;
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [feedback, clearFeedback]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex h-full min-h-0 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "z-10 flex items-start justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[11px] font-semibold tracking-[0.2em] text-muted uppercase",
							children: ch.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold tabular-nums leading-none text-fg",
								children: score.toLocaleString("en-IN")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm tabular-nums text-muted",
								children: formatTime(elapsedMs)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center justify-between text-[11px] text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Energy impact" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-primary",
										children: [pct, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-subtle",
									children: impactLabel(pct)
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-10",
						"aria-label": muted ? "Unmute" : "Mute",
						onClick: () => {
							unlockAudio();
							const next = !muted;
							setMuted(next);
							setMutedUi(next);
						},
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-10",
						"aria-label": "Exit",
						onClick: () => finish(false, "Run closed."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				})]
			}),
			combo >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-1 font-display text-xs font-semibold tracking-[0.18em] text-primary uppercase",
				children: combo >= 10 ? "Super energizer" : `Energy combo ×${combo}`
			}) : null,
			feedback === "check-route" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-1 text-sm text-signal",
				children: "Check the route."
			}) : null,
			slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 pb-1 text-xs text-muted",
				children: [
					"Place a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: labelPiece(slot.piece)
					}),
					slot.cityId ? ` to reach ${CITY_BY_ID[slot.cityId]?.name ?? slot.cityId}` : "",
					". Tap a piece, or drag it onto the glowing joint."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapBoard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityReveal, {})]
			})
		]
	});
}
function formatTime(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function labelPiece(p) {
	if (p === "city") return "city connector";
	return p;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var handleSchema = string().min(3).max(24).regex(/^[A-Za-z]+-?\d{0,3}$/);
var listScores = createServerFn({ method: "GET" }).handler(createSsrRpc("063d3025aad1bd80fb868a0213c71a02b04f554784fa5b12306c135589d02638"));
var submitScore = createServerFn({ method: "POST" }).validator(object({
	handle: handleSchema,
	score: number().int().min(0).max(2e5),
	cities: number().int().min(0).max(12),
	durationMs: number().int().min(0).max(36e5),
	badge: string().max(48),
	challengeId: string().max(32)
})).handler(createSsrRpc("5fb255a53919c2953dd858210577789b5388e0377e6c62638dec1eff1d18eabc"));
var recordPlay = createServerFn({ method: "POST" }).validator(object({
	source: string().max(24).default("direct"),
	completed: boolean(),
	cities: number().int().min(0).max(12)
})).handler(createSsrRpc("f74adc58b24261945d48bdd13fa3dc6840428ec315ad2c5b594051a137a44fc5"));
async function paintShareCard(opts) {
	const w = 1080;
	const h = 1350;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	ctx.fillStyle = "#07090e";
	ctx.fillRect(0, 0, w, h);
	const grad = ctx.createLinearGradient(0, 0, w, h);
	grad.addColorStop(0, "#12151c");
	grad.addColorStop(1, "#07090e");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "#ffd94f";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(90, 220);
	ctx.lineTo(90, 980);
	ctx.stroke();
	ctx.fillStyle = "#ffd94f";
	ctx.beginPath();
	ctx.arc(90, 340, 10, 0, Math.PI * 2);
	ctx.arc(90, 520, 10, 0, Math.PI * 2);
	ctx.arc(90, 700, 10, 0, Math.PI * 2);
	ctx.arc(90, 880, 10, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#f4f0e6";
	ctx.font = "600 28px Outfit, sans-serif";
	ctx.fillText("GAIL ENERGY CONNECT", 140, 120);
	ctx.fillStyle = "#8b93a1";
	ctx.font = "500 22px Outfit, sans-serif";
	ctx.fillText("JODO PIPELINE. JAGAO SHEHAR.", 140, 158);
	ctx.fillStyle = "#ffd94f";
	ctx.font = "700 92px Rajdhani, sans-serif";
	ctx.fillText(String(opts.score), 140, 360);
	ctx.fillStyle = "#8b93a1";
	ctx.font = "500 22px Outfit, sans-serif";
	ctx.fillText("ENERGY SCORE", 140, 400);
	ctx.fillStyle = "#f4f0e6";
	ctx.font = "600 48px Rajdhani, sans-serif";
	ctx.fillText(`${opts.cities} cities energized`, 140, 520);
	ctx.fillStyle = "#ffd94f";
	ctx.font = "700 36px Rajdhani, sans-serif";
	ctx.fillText(opts.badge.toUpperCase(), 140, 600);
	ctx.fillStyle = "#f4f0e6";
	ctx.font = "600 40px Rajdhani, sans-serif";
	ctx.fillText("WAH KYA ENERGY HAI", 140, 760);
	ctx.fillStyle = "#8b93a1";
	ctx.font = "400 24px Outfit, sans-serif";
	wrap(ctx, "I connected the network. I energized the city. Can you beat my score?", 140, 820, 800, 34);
	ctx.fillStyle = "#5c6573";
	ctx.font = "500 20px Outfit, sans-serif";
	ctx.fillText("#WahKyaEnergyHai   #EnergizingPossibilities   #PradhanMantriUrjaGanga", 140, 1220);
	ctx.fillText("JHBDPL  ·  GAIL (India) Limited", 140, 1260);
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("blob")), "image/png");
	});
}
function wrap(ctx, text, x, y, max, lh) {
	const words = text.split(" ");
	let line = "";
	let yy = y;
	for (const word of words) {
		const test = line ? `${line} ${word}` : word;
		if (ctx.measureText(test).width > max) {
			ctx.fillText(line, x, yy);
			line = word;
			yy += lh;
		} else line = test;
	}
	if (line) ctx.fillText(line, x, yy);
}
function shareCopy(score, cities) {
	return `I connected the network. I energized the city.\nEnergy score ${score} · ${cities} cities · ${badgeFor(cities, cities >= 7).name}\nCan you beat my score?\n#WahKyaEnergyHai #EnergizingPossibilities #PradhanMantriUrjaGanga`;
}
function ResultsScreen() {
	const result = useGame((s) => s.lastResult);
	const startRun = useGame((s) => s.startRun);
	const setScreen = useGame((s) => s.setScreen);
	const [handle, setHandle] = (0, import_react.useState)(HANDLES[0]);
	const [posted, setPosted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!result) return;
		recordPlay({ data: {
			source: "direct",
			completed: result.won,
			cities: result.cities
		} }).catch(() => void 0);
	}, [result]);
	if (!result) return null;
	const snap = result;
	async function share() {
		const text = shareCopy(snap.score, snap.cities);
		try {
			const blob = await paintShareCard({
				score: snap.score,
				cities: snap.cities,
				badge: snap.badge
			});
			const file = new File([blob], "gail-energy-connect.png", { type: "image/png" });
			if (navigator.share && navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					title: "GAIL Energy Connect",
					text,
					files: [file]
				});
				return;
			}
			if (navigator.share) {
				await navigator.share({
					title: "GAIL Energy Connect",
					text
				});
				return;
			}
			await navigator.clipboard.writeText(text);
			toast("Score copied. Paste it into WhatsApp or X.");
		} catch {
			toast("Sharing cancelled.");
		}
	}
	async function download() {
		const blob = await paintShareCard({
			score: snap.score,
			cities: snap.cities,
			badge: snap.badge
		});
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
				num = (raw ? JSON.parse(raw) : {}).handleNum ?? String(10 + Math.floor(Math.random() * 89));
				localStorage.setItem(SAVE_KEY, JSON.stringify({
					...raw ? JSON.parse(raw) : { v: 1 },
					handleRoot: handle,
					handleNum: num
				}));
			} catch {}
			await submitScore({ data: {
				handle: `${handle}-${num}`,
				score: snap.score,
				cities: snap.cities,
				durationMs: Math.round(snap.elapsedMs),
				badge: snap.badge,
				challengeId: snap.challengeId
			} });
			setPosted(true);
			toast("On the weekly board.");
		} catch {
			toast("Could not save this week. Play is still counted locally.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-8 w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase",
					children: result.won ? "Wah kya energy hai" : "Corridor unfinished"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl font-semibold tracking-display tabular-nums",
					children: result.score.toLocaleString("en-IN")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: result.reason
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Cities energized",
							v: String(result.cities)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Energy level",
							v: result.badge
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Time",
							v: format(result.elapsedMs)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Challenge",
							v: result.challengeId
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "mt-6 border-l-2 border-primary pl-4 text-sm text-fg",
					children: "I connected the network. I energized the city. Can you beat my score?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: share,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Share card"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: download,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download badge"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-lg border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Save this week’s board"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Pick a connector alias. No account needed."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-11 flex-1 rounded-md border border-border bg-elevated px-3 text-sm text-fg",
								value: handle,
								onChange: (e) => setHandle(e.target.value),
								children: HANDLES.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: h,
									children: h
								}, h))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: posted || busy || !result.won,
								onClick: post,
								children: "Post"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: startRun,
							children: "Play again"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => setScreen("leaderboard"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), "Weekly board"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setScreen("title"),
							children: "Home"
						})
					]
				})
			]
		})]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] tracking-wide text-muted uppercase",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-display text-lg font-semibold capitalize text-fg",
			children: v
		})]
	});
}
function format(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function LeaderboardScreen() {
	const setScreen = useGame((s) => s.setScreen);
	const last = useGame((s) => s.lastResult);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		listScores().then((r) => {
			if (live) setRows(r);
		}).catch(() => {
			if (live) setErr(true);
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 w-full max-w-md flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase",
						children: "This week"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-display",
						children: "Energy leaderboard"
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: "Board is warming up. Play and post a score."
					}) : null,
					rows === null && !err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: "Loading corridor standings…"
					}) : null,
					rows && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: "No scores this week. Be the first connector."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-6 space-y-2",
						children: rows?.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 font-display text-sm tabular-nums text-muted",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-sm text-fg",
									children: row.handle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tabular-nums text-primary",
									children: row.score.toLocaleString("en-IN")
								})
							]
						}, row.id))
					}),
					last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"You — ",
							last.score.toLocaleString("en-IN"),
							".",
							" ",
							rows && rows[0] && last.score < rows[0].score ? `Next target: beat ${rows[0].handle}.` : "You are on the pace."
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-md flex-col gap-2 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setScreen("citizen"),
					children: "Play"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setScreen("title"),
					children: "Home"
				})]
			})
		]
	});
}
function ChallengesScreen() {
	const setChallenge = useGame((s) => s.setChallenge);
	const setScreen = useGame((s) => s.setScreen);
	const current = useGame((s) => s.challengeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 w-full max-w-md flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase",
						children: "Weekly missions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-display",
						children: "Energy challenges"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-2",
						children: CHALLENGES.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setChallenge(c.id),
							className: `w-full rounded-lg border px-4 py-3 text-left transition-transform duration-150 active:scale-[0.96] ${current === c.id ? "border-primary bg-elevated" : "border-border bg-surface"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-display text-xs tracking-[0.16em] text-muted uppercase",
									children: ["Challenge ", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block font-medium text-fg",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-muted",
									children: c.brief
								})
							]
						}) }, c.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-md flex-col gap-2 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setScreen("citizen"),
					children: "Take this challenge"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setScreen("title"),
					children: "Home"
				})]
			})
		]
	});
}
var TIERS = [
	{
		id: "starter",
		name: "Energy Starter",
		rule: "Connect your first city."
	},
	{
		id: "connector",
		name: "Pipeline Connector",
		rule: "Connect 3 cities."
	},
	{
		id: "energizer",
		name: "City Energizer",
		rule: "Connect 5 cities."
	},
	{
		id: "master",
		name: "Wah Kya Energy Hai",
		rule: "Energize the complete map."
	}
];
function BadgesScreen() {
	const earned = useGame((s) => s.earnedBadges);
	const setScreen = useGame((s) => s.setScreen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full flex-col overflow-auto bg-bg px-5 py-6 pt-[max(1.5rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-8 w-full max-w-md flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase",
						children: "Connector ranks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-display",
						children: "Badge system"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-2",
						children: TIERS.map((t) => {
							const on = earned.includes(t.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `rounded-lg border px-4 py-3 ${on ? "border-primary bg-elevated" : "border-border bg-surface"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-fg",
										children: t.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: t.rule
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[11px] uppercase tracking-wide text-subtle",
										children: on ? "Earned" : "Locked"
									})
								]
							}, t.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-md pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					onClick: () => setScreen("title"),
					children: "Home"
				})
			})
		]
	});
}
function EnergyApp() {
	const screen = useGame((s) => s.screen);
	(0, import_react.useEffect)(() => {
		hydrateSave();
		const params = new URLSearchParams(window.location.search);
		const source = params.get("ref") || params.get("utm_source") || "direct";
		useGame.setState({ source });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto h-dvh max-w-lg overflow-hidden bg-bg text-fg",
		children: [
			screen === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {}) : null,
			screen === "citizen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenScreen, {}) : null,
			screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {}) : null,
			screen === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsScreen, {}) : null,
			screen === "leaderboard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderboardScreen, {}) : null,
			screen === "challenges" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChallengesScreen, {}) : null,
			screen === "badges" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgesScreen, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { className: "bg-surface text-fg border-border" }
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnergyApp, {});
}
//#endregion
export { Home as component };
