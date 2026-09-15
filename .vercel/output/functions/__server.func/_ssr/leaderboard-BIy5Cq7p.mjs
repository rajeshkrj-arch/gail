import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as HANDLES } from "./data-VSeDfhxJ.mjs";
import { a as string, i as object, r as number, t as boolean } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-BIy5Cq7p.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var handleSchema = string().min(3).max(24).regex(/^[A-Za-z]+-?\d{0,3}$/);
var listScores_createServerFn_handler = createServerRpc({
	id: "063d3025aad1bd80fb868a0213c71a02b04f554784fa5b12306c135589d02638",
	name: "listScores",
	filename: "src/lib/game/leaderboard.ts"
}, (opts) => listScores.__executeServer(opts));
var listScores = createServerFn({ method: "GET" }).handler(listScores_createServerFn_handler, async () => {
	const { getSql } = await import("./db-I3Pji5-t.mjs");
	return (await getSql())`
    select id, handle, score, cities, duration_ms, badge, challenge_id, created_at
    from energy_scores
    where created_at > now() - interval '7 days'
    order by score desc, created_at asc
    limit 20
  `;
});
var submitScore_createServerFn_handler = createServerRpc({
	id: "5fb255a53919c2953dd858210577789b5388e0377e6c62638dec1eff1d18eabc",
	name: "submitScore",
	filename: "src/lib/game/leaderboard.ts"
}, (opts) => submitScore.__executeServer(opts));
var submitScore = createServerFn({ method: "POST" }).validator(object({
	handle: handleSchema,
	score: number().int().min(0).max(2e5),
	cities: number().int().min(0).max(12),
	durationMs: number().int().min(0).max(36e5),
	badge: string().max(48),
	challengeId: string().max(32)
})).handler(submitScore_createServerFn_handler, async ({ data }) => {
	const root = data.handle.split("-")[0] ?? "";
	if (!HANDLES.includes(root)) throw new Error("Unknown connector handle");
	const { getSql } = await import("./db-I3Pji5-t.mjs");
	return { id: (await (await getSql())`
      insert into energy_scores (handle, score, cities, duration_ms, badge, challenge_id)
      values (${data.handle}, ${data.score}, ${data.cities}, ${data.durationMs}, ${data.badge}, ${data.challengeId})
      returning id
    `)[0]?.id ?? 0 };
});
var recordPlay_createServerFn_handler = createServerRpc({
	id: "f74adc58b24261945d48bdd13fa3dc6840428ec315ad2c5b594051a137a44fc5",
	name: "recordPlay",
	filename: "src/lib/game/leaderboard.ts"
}, (opts) => recordPlay.__executeServer(opts));
var recordPlay = createServerFn({ method: "POST" }).validator(object({
	source: string().max(24).default("direct"),
	completed: boolean(),
	cities: number().int().min(0).max(12)
})).handler(recordPlay_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-I3Pji5-t.mjs");
	await (await getSql())`
      insert into energy_plays (source, completed, cities)
      values (${data.source}, ${data.completed}, ${data.cities})
    `;
	return { ok: true };
});
//#endregion
export { listScores_createServerFn_handler, recordPlay_createServerFn_handler, submitScore_createServerFn_handler };
