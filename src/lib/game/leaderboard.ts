import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { HANDLES } from "./data";

const handleSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[A-Za-z]+-?\d{0,3}$/);

export type ScoreRow = {
  id: number;
  handle: string;
  score: number;
  cities: number;
  duration_ms: number;
  badge: string;
  challenge_id: string;
  created_at: string;
};

export const listScores = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  return sql<ScoreRow>`
    select id, handle, score, cities, duration_ms, badge, challenge_id, created_at
    from energy_scores
    where created_at > now() - interval '7 days'
    order by score desc, created_at asc
    limit 20
  `;
});

export const submitScore = createServerFn({ method: "POST" })
  .validator(
    z.object({
      handle: handleSchema,
      score: z.number().int().min(0).max(200000),
      cities: z.number().int().min(0).max(12),
      durationMs: z.number().int().min(0).max(3_600_000),
      badge: z.string().max(48),
      challengeId: z.string().max(32),
    }),
  )
  .handler(async ({ data }) => {
    const root = data.handle.split("-")[0] ?? "";
    if (!(HANDLES as readonly string[]).includes(root)) {
      throw new Error("Unknown connector handle");
    }
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into energy_scores (handle, score, cities, duration_ms, badge, challenge_id)
      values (${data.handle}, ${data.score}, ${data.cities}, ${data.durationMs}, ${data.badge}, ${data.challengeId})
      returning id
    `;
    return { id: rows[0]?.id ?? 0 };
  });

export const recordPlay = createServerFn({ method: "POST" })
  .validator(
    z.object({
      source: z.string().max(24).default("direct"),
      completed: z.boolean(),
      cities: z.number().int().min(0).max(12),
    }),
  )
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into energy_plays (source, completed, cities)
      values (${data.source}, ${data.completed}, ${data.cities})
    `;
    return { ok: true as const };
  });
