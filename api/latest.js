// GET /api/latest?since=<ISO time>&ai=1
// Fetches the fastest feeds right now and returns stories published after `since`,
// rewritten by Gemini when a key is configured. Responses are cached at Vercel's edge
// for 10 minutes, so everyone opening the site shares one fetch.
import { FEEDS, LIVE_FEED_IDS, SECTION_RULES } from "../config/feeds.mjs";
import { fetchAll } from "../lib/feeds.mjs";
import { rankCandidates, makeId } from "../lib/rank.mjs";
import { generateJSON, EDITOR_SYSTEM, LATEST_SCHEMA, candidateBlock } from "../lib/gemini.mjs";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : new Date(Date.now() - 6 * 36e5);
  const wantAI = url.searchParams.get("ai") !== "0";
  const now = Date.now();

  const feeds = FEEDS.filter((f) => LIVE_FEED_IDS.includes(f.id));
  const { items, health } = await fetchAll(feeds, { timeoutMs: 8000 });
  const fresh = items.filter((it) => it.published && new Date(it.published) > since);
  const cands = rankCandidates(fresh, { rules: SECTION_RULES, limits: { business: 12, policy: 8, vc: 12, global: 6 }, now });

  const all = [];
  for (const [sec, list] of Object.entries(cands)) list.forEach((it, i) => { it.id = "n" + makeId(it, i); all.push(it); });
  all.sort((a, b) => b.score - a.score);
  const top = all.slice(0, 24);
  const map = Object.fromEntries(top.map((x) => [x.id, x]));

  let out = top.map((it) => ({
    id: it.id, headline: it.title, summary: it.snippet ? it.snippet.slice(0, 240) : "", why: "", jargon: [],
    importance: 3, link: it.link, source: it.source, alsoIn: it.alsoIn, published: it.published, section: it.section, ai: false,
  }));
  let model = null, note = null;

  if (wantAI && process.env.GEMINI_API_KEY && top.length) {
    try {
      const { json, model: m } = await generateJSON({
        key: process.env.GEMINI_API_KEY, system: EDITOR_SYSTEM, schema: LATEST_SCHEMA, timeoutMs: 40000, maxTokens: 8000,
        prompt: `These stories were published since the morning edition. Pick the up-to-12 that genuinely matter (skip minor or duplicate ones), rewrite each, and set its section (business | policy | vc | global). For policy, include only items with real business or nationwide impact.\n\nCANDIDATES:\n${candidateBlock(top, now)}`,
      });
      model = m;
      const picked = (json.items || []).filter((x) => map[x.id]).map((x) => ({
        id: x.id, headline: x.headline, summary: x.summary, why: x.why, jargon: (x.jargon || []).slice(0, 4), importance: x.importance ?? 3,
        link: map[x.id].link, source: map[x.id].source, alsoIn: map[x.id].alsoIn, published: map[x.id].published,
        section: ["business", "policy", "vc", "global"].includes(x.section) ? x.section : map[x.id].section, ai: true,
      }));
      if (picked.length) out = picked;
    } catch (e) {
      note = "AI rewrite unavailable right now; showing headlines.";
    }
  }

  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=300");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify({
    fetchedAt: new Date(now).toISOString(), since: since.toISOString(), model, note,
    items: out, feedsOk: health.filter((h) => h.ok).length, feedsTotal: health.length,
  }));
}
