// Minimal Gemini REST client: picks the best available Flash model automatically,
// asks for strict JSON, retries on rate limits, and never throws past the caller's fallback.

const BASE = "https://generativelanguage.googleapis.com/v1beta";
let cachedModel = null;

function versionOf(name) {
  const m = name.match(/gemini-(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

export async function pickModel(key) {
  if (process.env.GEMINI_MODEL) return process.env.GEMINI_MODEL;
  if (cachedModel) return cachedModel;
  try {
    const res = await fetch(`${BASE}/models?pageSize=200&key=${key}`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    const names = (data.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""))
      .filter((n) => /^gemini-[\d.]+-flash/.test(n) && !/(lite|image|tts|audio|live|thinking|exp|embedding|8b)/.test(n));
    // Prefer stable over preview, then newest version.
    names.sort((a, b) => {
      const pa = /preview/.test(a) ? 1 : 0, pb = /preview/.test(b) ? 1 : 0;
      if (pa !== pb) return pa - pb;
      return versionOf(b) - versionOf(a) || a.length - b.length;
    });
    cachedModel = names[0] || "gemini-flash-latest";
  } catch {
    cachedModel = "gemini-flash-latest";
  }
  return cachedModel;
}

function extractJSON(textOut) {
  try { return JSON.parse(textOut); } catch {}
  const start = textOut.indexOf("{");
  const end = textOut.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(textOut.slice(start, end + 1)); } catch {}
  }
  throw new Error("Model did not return valid JSON");
}

export async function generateJSON({ key, system, prompt, schema, maxTokens = 16000, temperature = 0.35, timeoutMs = 90000 }) {
  const model = await pickModel(key);
  const body = (withSchema) => ({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
      ...(withSchema && schema ? { responseSchema: schema } : {}),
    },
  });
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    const withSchema = attempt < 2; // if the schema is rejected, retry without it
    try {
      const res = await fetch(`${BASE}/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body(withSchema)),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 429 || res.status === 503 || res.status === 500) {
        lastErr = new Error(`Gemini HTTP ${res.status}`);
        await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
        continue;
      }
      const data = await res.json();
      if (!res.ok) { lastErr = new Error(`Gemini HTTP ${res.status}: ${data?.error?.message?.slice(0, 200)}`); continue; }
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const out = parts.filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("");
      if (!out) { lastErr = new Error("Empty response: " + (data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || "unknown")); continue; }
      return { json: extractJSON(out), model };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Gemini failed");
}

// ---------- Prompt pieces ----------

export const EDITOR_SYSTEM = `You are the senior editor of "The Daily Compounder", a daily briefing read by an Indian MBA student preparing for a venture-capital internship, and by members of his family who are smart but not finance experts.

Your standard is the front page of the best business newspapers: only stories with real consequence for companies, money, jobs, prices or policy. Ruthlessly skip clickbait, stock tips, "stocks to buy", celebrity, sports, crime, routine price updates, minor appointments, and press-release fluff.

Hard rules:
1. Use ONLY facts present in the headline/snippet you are given. Never invent numbers, names, dates, quotes or outcomes. If a detail is not given, leave it out.
2. Write everything in your OWN words, in plain, simple English. Never copy any phrase of more than five words from the source.
3. Short sentences. No hype. No emojis.
4. "jargon": pick the 1-3 genuinely technical terms a smart non-finance reader would not know (e.g. "repo rate", "Series B", "DRHP", "EBITDA") and define each in under 20 words. Use the exact spelling of the term as it appears in your summary.
5. Select by importance, not by order. Prefer stories reported by several outlets (coverage) and from primary sources (RBI, SEBI, ministries).
6. Refer to items only by the id given in square brackets.`;

const ITEM_PROPS = {
  id: { type: "STRING" },
  headline: { type: "STRING", description: "Your own neutral headline, max 14 words" },
  summary: { type: "STRING", description: "2-3 plain sentences, own words, only facts from the snippet" },
  why: { type: "STRING", description: "One sentence: why this matters / what to watch" },
  jargon: { type: "ARRAY", items: { type: "OBJECT", properties: { term: { type: "STRING" }, meaning: { type: "STRING" } }, required: ["term", "meaning"] } },
  importance: { type: "INTEGER", description: "1-5" },
};
const REQ = ["id", "headline", "summary", "why", "importance"];

export const NEWS_SCHEMA = {
  type: "OBJECT",
  properties: {
    brief: {
      type: "ARRAY", description: "Exactly 3 must-know stories of the day across all sections",
      items: { type: "OBJECT", properties: { id: { type: "STRING" }, headline: { type: "STRING" }, sowhat: { type: "STRING", description: "One sentence so-what for the reader" }, tag: { type: "STRING", description: "Markets | Economy | Policy | Startups | Global | Companies" } }, required: ["id", "headline", "sowhat", "tag"] },
    },
    business: { type: "ARRAY", items: { type: "OBJECT", properties: ITEM_PROPS, required: REQ } },
    policy: {
      type: "ARRAY",
      items: { type: "OBJECT", properties: { ...ITEM_PROPS, impact: { type: "INTEGER", description: "1-5 business/national impact" }, scope: { type: "STRING", description: "Nationwide | Sector | State | Global" }, sector: { type: "STRING" } }, required: [...REQ, "impact", "scope"] },
    },
    global: { type: "ARRAY", items: { type: "OBJECT", properties: ITEM_PROPS, required: REQ } },
    xPost: { type: "STRING", description: "A short, modest, conversational X post (max 260 chars) with one sharp insight on the top business or startup story. No hashtags spam, max 1 hashtag." },
  },
  required: ["brief", "business", "policy", "global", "xPost"],
};

export const VC_SCHEMA = {
  type: "OBJECT",
  properties: {
    deals: {
      type: "ARRAY", description: "Every distinct funding round, acquisition, fund launch or IPO filing found in the candidates",
      items: { type: "OBJECT", properties: { id: { type: "STRING" }, company: { type: "STRING" }, type: { type: "STRING", description: "Funding | Acquisition | Fund | IPO | Exit" }, round: { type: "STRING", description: "e.g. Seed, Series A, or empty" }, amount: { type: "STRING", description: "As stated, e.g. $12M or ₹50 Cr; empty if not stated" }, investors: { type: "STRING", description: "Lead / notable investors or acquirer, if stated" }, sector: { type: "STRING" }, oneLiner: { type: "STRING", description: "What the company does, max 12 words, only if stated" } }, required: ["id", "company", "type"] },
    },
    stories: { type: "ARRAY", items: { type: "OBJECT", properties: { ...ITEM_PROPS, kind: { type: "STRING", description: "Funding | M&A | Fund | IPO/Exit | Policy | Trend | Layoffs/Shutdown" } }, required: [...REQ, "kind"] } },
    dealOfDay: {
      type: "OBJECT",
      properties: {
        id: { type: "STRING" }, title: { type: "STRING" },
        whatHappened: { type: "STRING", description: "2 sentences, facts only" },
        thesis: { type: "ARRAY", items: { type: "STRING" }, description: "3 bullets: why an investor might back this. Phrase as hypotheses ('Investors are likely betting that...')" },
        risks: { type: "ARRAY", items: { type: "STRING" }, description: "3 bullets: what could go wrong" },
        askFounder: { type: "ARRAY", items: { type: "STRING" }, description: "3 sharp diligence questions a VC analyst would ask" },
        concept: { type: "STRING", description: "One VC concept this deal teaches, with a 2-sentence explanation" },
      },
      required: ["id", "title", "whatHappened", "thesis", "risks", "askFounder", "concept"],
    },
    pulse: { type: "STRING", description: "2-3 sentences: what today's deal flow says about where capital is going. Only from the candidates." },
  },
  required: ["deals", "stories", "dealOfDay", "pulse"],
};

export const AI_SCHEMA = {
  type: "OBJECT",
  properties: {
    ai: {
      type: "ARRAY",
      items: { type: "OBJECT", properties: { ...ITEM_PROPS, level: { type: "INTEGER", description: "Skill Lab rung it matters for: 1 prompting, 2 skills, 3 connectors/MCP, 4 agents in browsers/websites, 5 APIs & automation" }, tryThis: { type: "STRING", description: "One concrete thing a non-developer can try this week because of this news (max 25 words)" } }, required: [...REQ, "level", "tryThis"] },
    },
    insider: { type: "ARRAY", items: { type: "OBJECT", properties: { ...ITEM_PROPS, takeaway: { type: "STRING", description: "The one idea worth remembering, max 25 words" } }, required: [...REQ, "takeaway"] } },
  },
  required: ["ai", "insider"],
};

export const LATEST_SCHEMA = {
  type: "OBJECT",
  properties: {
    items: { type: "ARRAY", items: { type: "OBJECT", properties: { ...ITEM_PROPS, section: { type: "STRING", description: "business | policy | vc | global" } }, required: [...REQ, "section"] } },
  },
  required: ["items"],
};

export function candidateBlock(list, now = Date.now()) {
  return list
    .map((it) => {
      const age = it.published ? Math.max(0, Math.round((now - new Date(it.published)) / 36e5)) + "h ago" : "time n/a";
      const cov = it.coverage > 1 ? `, covered by ${it.coverage} outlets` : "";
      const snip = it.snippet ? ` :: ${it.snippet.slice(0, 300)}` : "";
      return `[${it.id}] (${it.source}, ${age}${cov}) ${it.title}${snip}`;
    })
    .join("\n");
}
