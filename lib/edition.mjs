import { FEEDS, SECTION_RULES } from "../config/feeds.mjs";
import { fetchAll } from "./feeds.mjs";
import { rankCandidates, makeId } from "./rank.mjs";
import { generateJSON, EDITOR_SYSTEM, NEWS_SCHEMA, VC_SCHEMA, AI_SCHEMA, candidateBlock } from "./gemini.mjs";
import { getMarkets } from "./markets.mjs";

const LIMITS = { business: 45, policy: 30, global: 20, vc: 45, ai: 30, insider: 20 };
const OUT = { business: 10, policy: 6, global: 5, vc: 12, ai: 8, insider: 5 };

function assignIds(cands) {
  const map = {};
  for (const [sec, list] of Object.entries(cands)) {
    list.forEach((it, i) => { it.id = makeId(it, i); map[it.id] = it; });
  }
  return map;
}

// Merge the model's rewrite with the original item (link, source, time stay factual).
function merge(map, x, extra = {}) {
  const src = map[x.id];
  if (!src) return null;
  return {
    id: x.id,
    headline: (x.headline || src.title).trim(),
    summary: (x.summary || "").trim(),
    why: (x.why || "").trim(),
    jargon: (x.jargon || []).filter((j) => j.term && j.meaning).slice(0, 4),
    importance: x.importance ?? 3,
    originalTitle: src.title,
    link: src.link,
    source: src.source,
    alsoIn: src.alsoIn || [],
    published: src.published,
    section: src.section,
    ...extra,
  };
}

function plain(it) {
  return {
    id: it.id, headline: it.title, summary: it.snippet ? it.snippet.slice(0, 260) : "", why: "", jargon: [],
    importance: 3, originalTitle: it.title, link: it.link, source: it.source, alsoIn: it.alsoIn || [],
    published: it.published, section: it.section, ai: false,
  };
}

const uniq = (arr) => { const s = new Set(); return arr.filter((x) => x && !s.has(x.id) && s.add(x.id)); };

export async function buildEdition({ key = process.env.GEMINI_API_KEY, now = Date.now(), items: injected, log = console.log } = {}) {
  let items, health;
  if (injected) { items = injected; health = []; }
  else ({ items, health } = await fetchAll(FEEDS));
  log(`Fetched ${items.length} items from ${health.filter((h) => h.ok).length}/${health.length} feeds`);

  const cands = rankCandidates(items, { rules: SECTION_RULES, limits: LIMITS, now });
  const map = assignIds(cands);
  for (const [s, l] of Object.entries(cands)) log(`  ${s}: ${l.length} candidates`);

  const edition = {
    generatedAt: new Date(now).toISOString(),
    model: null, aiUsed: false, notes: [],
    brief: [], business: [], policy: [], global: [],
    vc: { deals: [], stories: [], dealOfDay: null, pulse: "" },
    ai: [], insider: [], xPost: "",
    markets: null, feedHealth: health,
  };

  const tasks = [];
  if (key) {
    const news = [...(cands.business || []), ...(cands.policy || []), ...(cands.global || [])];
    tasks.push(
      generateJSON({
        key, system: EDITOR_SYSTEM, schema: NEWS_SCHEMA,
        prompt: `Today's candidate stories (business = b*, policy & politics = p*, global = g*).

Pick and rewrite:
- business: the ${OUT.business} most important Indian business, markets and economy stories.
- policy: up to ${OUT.policy} government, regulatory, court or political stories that materially affect businesses, markets, prices or the whole country. Score impact 1-5 and include ONLY impact >= 3. Pure party politics, rallies, statements and allegations do not qualify unless they change a policy.
- global: the ${OUT.global} global stories that matter most for Indian markets or business.
- brief: the 3 must-know stories of the day from any section (can include the same ids).
- xPost: one post idea.
Order every list by importance.

CANDIDATES:
${candidateBlock(news, now)}`,
      }).then(({ json, model }) => {
        edition.model = model;
        edition.brief = (json.brief || []).slice(0, 3).map((b) => ({ ...b, link: map[b.id]?.link, source: map[b.id]?.source, section: map[b.id]?.section })).filter((b) => b.link);
        edition.business = uniq((json.business || []).map((x) => merge(map, x, { ai: true }))).slice(0, OUT.business);
        edition.policy = uniq((json.policy || []).filter((x) => (x.impact ?? 3) >= 3).map((x) => merge(map, x, { ai: true, impact: x.impact, scope: x.scope, sector: x.sector }))).slice(0, OUT.policy);
        edition.global = uniq((json.global || []).map((x) => merge(map, x, { ai: true }))).slice(0, OUT.global);
        edition.xPost = json.xPost || "";
      }).catch((e) => edition.notes.push("News AI failed: " + e.message))
    );
    tasks.push(
      generateJSON({
        key, system: EDITOR_SYSTEM, schema: VC_SCHEMA,
        prompt: `You are also the editor of the VC Desk. The reader wants to think like an insider at an Indian venture fund.

From the candidates:
- deals: extract EVERY distinct funding round, acquisition, fund launch/close, or IPO filing/listing. Facts only; leave fields empty if not stated. Prefer Indian deals; include major global ones only if notable.
- stories: the ${OUT.vc} most important startup/VC/M&A stories (include trends, shutdowns, layoffs and regulation that matter to investors).
- dealOfDay: the single most instructive deal for a VC intern to study.
- pulse: what today's flow says about where capital is going.

CANDIDATES:
${candidateBlock(cands.vc || [], now)}`,
      }).then(({ json, model }) => {
        edition.model ||= model;
        edition.vc.deals = (json.deals || []).filter((d) => map[d.id]).map((d) => ({ ...d, link: map[d.id].link, source: map[d.id].source, published: map[d.id].published }));
        edition.vc.stories = uniq((json.stories || []).map((x) => merge(map, x, { ai: true, kind: x.kind }))).slice(0, OUT.vc);
        const dd = json.dealOfDay;
        if (dd && map[dd.id]) edition.vc.dealOfDay = { ...dd, link: map[dd.id].link, source: map[dd.id].source };
        edition.vc.pulse = json.pulse || "";
      }).catch((e) => edition.notes.push("VC AI failed: " + e.message))
    );
    tasks.push(
      generateJSON({
        key, system: EDITOR_SYSTEM, schema: AI_SCHEMA,
        prompt: `Two jobs.

1) ai (a* ids): pick the ${OUT.ai} most useful updates about AI tools for someone moving from power user to AI builder (Claude skills and connectors/MCP, agents in browsers, using Claude/ChatGPT/Gemini inside other websites, APIs and automation). Prefer official announcements, practical how-tos and genuinely new capabilities; skip funding gossip and hype. Tag each with its Skill Lab level and a concrete "tryThis".

2) insider (i* ids): pick the ${OUT.insider} best essays from investors and operators for someone learning how venture capital really works. Give each a one-line takeaway.

CANDIDATES:
${candidateBlock([...(cands.ai || []), ...(cands.insider || [])], now)}`,
      }).then(({ json, model }) => {
        edition.model ||= model;
        edition.ai = uniq((json.ai || []).map((x) => merge(map, x, { ai: true, level: x.level, tryThis: x.tryThis }))).slice(0, OUT.ai);
        edition.insider = uniq((json.insider || []).map((x) => merge(map, x, { ai: true, takeaway: x.takeaway }))).slice(0, OUT.insider);
      }).catch((e) => edition.notes.push("AI-section AI failed: " + e.message))
    );
  } else {
    edition.notes.push("No GEMINI_API_KEY set: showing rule-ranked headlines without AI summaries.");
  }

  tasks.push(getMarkets().then((m) => (edition.markets = m)).catch((e) => edition.notes.push("Markets failed: " + e.message)));
  await Promise.all(tasks);

  // Fallbacks: any section the AI didn't fill gets rule-ranked headlines.
  const fill = (sec, n) => (cands[sec] || []).slice(0, n).map(plain);
  if (!edition.business.length) edition.business = fill("business", OUT.business);
  if (!edition.policy.length) edition.policy = fill("policy", 4);
  if (!edition.global.length) edition.global = fill("global", OUT.global);
  if (!edition.vc.stories.length) edition.vc.stories = fill("vc", OUT.vc);
  if (!edition.ai.length) edition.ai = fill("ai", OUT.ai);
  if (!edition.insider.length) edition.insider = fill("insider", OUT.insider);
  if (!edition.brief.length) {
    edition.brief = [edition.business[0], edition.vc.stories[0], edition.policy[0] || edition.global[0]]
      .filter(Boolean)
      .map((x) => ({ id: x.id, headline: x.headline, sowhat: x.why || x.summary.slice(0, 140), tag: { business: "Companies", vc: "Startups", policy: "Policy", global: "Global" }[x.section], link: x.link, source: x.source, section: x.section }));
  }
  edition.aiUsed = !!edition.model && edition.notes.filter((n) => /AI failed/.test(n)).length < 3;
  edition.counts = { candidates: Object.fromEntries(Object.entries(cands).map(([k, v]) => [k, v.length])), fetched: items.length };
  return edition;
}
