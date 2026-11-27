// Offline test: parses fixture feeds, ranks them, and runs the full edition build
// with a fake Gemini + fake Yahoo, so the pipeline can be checked without internet.
import { readFile } from "node:fs/promises";
import { parseFeed } from "../lib/feeds.mjs";
import { rankCandidates } from "../lib/rank.mjs";
import { buildEdition } from "../lib/edition.mjs";

const now = Date.now();
const fill = (x) => x.replace(/__NOW1__/g, new Date(now - 2 * 36e5).toUTCString()).replace(/__NOW2__/g, new Date(now - 5 * 36e5).toUTCString()).replace(/__NOW3__/g, new Date(now - 72 * 36e5).toISOString());
const read = async (f) => fill(await readFile(new URL(`./fixtures/${f}`, import.meta.url), "utf8"));

const items = [
  ...parseFeed(await read("rss.xml"), { id: "t1", name: "Mint", section: "business", tier: 3, url: "https://x" }),
  ...parseFeed(await read("rss.xml"), { id: "t2", name: "Inc42", section: "vc", tier: 3, url: "https://x" }),
  ...parseFeed(await read("rss.xml"), { id: "t3", name: "ET", section: "policy", tier: 3, url: "https://x" }),
  ...parseFeed(await read("gnews.xml"), { id: "t4", name: "Google News", section: "vc", tier: 1, url: "https://news.google.com/rss/search?q=x" }),
  ...parseFeed(await read("atom.xml"), { id: "t5", name: "Simon Willison", section: "ai", tier: 3, url: "https://x" }),
  ...parseFeed(await read("atom.xml"), { id: "t6", name: "AVC", section: "insider", tier: 3, url: "https://x" }),
];
console.log("parsed", items.length, "items; sample:", items[0].title, "|", items[0].snippet.slice(0, 60));
const g = items.find((i) => i.source === "Entrackr");
console.log("google news source/title:", g.source, "|", g.title);
const ranked = rankCandidates(items, { now });
for (const [k, v] of Object.entries(ranked)) console.log(" ranked", k, v.map((x) => `${x.title.slice(0, 40)} (${x.score}, cov ${x.coverage})`));

// --- fake network ---
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  url = String(url);
  if (url.includes("/models?")) return new Response(JSON.stringify({ models: [
    { name: "models/gemini-3.5-flash", supportedGenerationMethods: ["generateContent"] },
    { name: "models/gemini-3.8-flash-preview", supportedGenerationMethods: ["generateContent"] },
    { name: "models/gemini-3.6-flash", supportedGenerationMethods: ["generateContent"] },
    { name: "models/gemini-3.6-flash-lite", supportedGenerationMethods: ["generateContent"] },
  ] }));
  if (url.includes(":generateContent")) {
    const body = JSON.parse(opts.body);
    const p = body.contents[0].parts[0].text;
    const ids = [...p.matchAll(/^\[(\w+)\]/gm)].map((m) => m[1]);
    const it = (id) => ({ id, headline: "Rewritten " + id, summary: "Plain summary for " + id + " with repo rate inside.", why: "Why " + id, jargon: [{ term: "repo rate", meaning: "Rate at which RBI lends to banks." }], importance: 4 });
    let json;
    if (body.generationConfig.responseSchema?.properties?.brief || p.includes("business = b*")) json = { brief: ids.slice(0, 3).map((id) => ({ id, headline: "Brief " + id, sowhat: "So what " + id, tag: "Markets" })), business: ids.filter((i) => i[0] === "b").map(it), policy: ids.filter((i) => i[0] === "p").map((id) => ({ ...it(id), impact: 4, scope: "Nationwide" })), global: [], xPost: "Test post" };
    else if (p.includes("VC Desk")) json = { deals: ids.map((id) => ({ id, company: "Acme", type: "Funding", round: "Series B", amount: "$25M", investors: "Growth Fund", sector: "Fintech" })), stories: ids.map((id) => ({ ...it(id), kind: "Funding" })), dealOfDay: { id: ids[0], title: "Acme", whatHappened: "x", thesis: ["a"], risks: ["b"], askFounder: ["c"], concept: "d" }, pulse: "Capital flows to fintech." };
    else json = { ai: ids.filter((i) => i[0] === "a").map((id) => ({ ...it(id), level: 2, tryThis: "Try it" })), insider: ids.filter((i) => i[0] === "i").map((id) => ({ ...it(id), takeaway: "Power law" })) };
    // simulate a thinking part + text part
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "thinking...", thought: true }, { text: JSON.stringify(json) }] } }] }));
  }
  if (url.includes("finance.yahoo.com")) {
    return new Response(JSON.stringify({ chart: { result: [{ meta: { regularMarketPrice: 100, chartPreviousClose: 99, regularMarketTime: now / 1000 }, indicators: { quote: [{ close: [97, 98, 99, 100] }] } }] } }));
  }
  return realFetch(url, opts);
};

const ed = await buildEdition({ key: "FAKE", now, items, log: () => {} });
console.log("model:", ed.model, "aiUsed:", ed.aiUsed, "notes:", ed.notes);
console.log("brief:", ed.brief.map((b) => b.headline));
console.log("business:", ed.business.length, "policy:", ed.policy.length, "vc stories:", ed.vc.stories.length, "deals:", ed.vc.deals.length, "ai:", ed.ai.length, "insider:", ed.insider.length);
console.log("markets:", ed.markets.quotes.length, ed.markets.quotes.map((q) => q.name).join(", "));
const plain = await buildEdition({ key: "", now, items, log: () => {} });
console.log("no-key fallback -> business:", plain.business.length, "brief:", plain.brief.length, "notes:", plain.notes);
