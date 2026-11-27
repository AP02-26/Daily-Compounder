// Rule-based pre-ranking. Runs before (and without) AI.
// 1) drop junk  2) group duplicate stories across sources  3) score  4) keep the best per section.

const STOP = new Set("a an the of to in on for and or with by at from as is are was were be its it this that after over into amid says said says, new report reports india indian rs cr crore lakh".split(" "));

const JUNK = [
  /\bhoroscope\b/i, /\bcricket\b/i, /\bipl\b/i, /\bbollywood\b/i, /\bcelebrity\b/i,
  /\bin pics\b/i, /\bphotos?:/i, /^watch\b/i, /\bvideo\b:/i, /\bquiz\b/i,
  /stocks? to buy/i, /\bbuy or sell\b/i, /\bmultibagger\b/i, /\btarget price\b/i, /\bstock picks?\b/i,
  /should you (buy|sell|invest)/i, /\bshare price today\b/i, /\bgold rate today\b/i, /\bpetrol.*price today\b/i,
  /\bsponsored\b/i, /\bpartner content\b/i, /\bbrand(ed)? (post|content)\b/i, /\blottery\b/i, /\bwordle\b/i,
  /\bmarket live\b/i, /\blive updates?\b/i, /\bopening bell\b/i, /\bclosing bell\b/i,
];

export const LEX = {
  vc: /\b(raises?|raised|funding|fund-?raise|seed|pre-seed|series [a-f]|round|valuation|unicorn|acquires?|acquired|acquisition|acqui-?hire|merger|merge|stake|investors?|led by|ipo|drhp|listing|lists|fund|corpus|first close|final close|exit|secondary|buyback|esop|layoffs?|shuts? down|shutdown|pivot|venture|vc|angel|startup|founder)\b/i,
  policy: /\b(rbi|sebi|gst|tax|budget|tariff|duty|duties|cabinet|ministry|minister|government|govt|centre|policy|regulat\w*|bill|act|law|court|supreme court|high court|notif\w*|scheme|pli|fdi|subsid\w*|ban|bans|parliament|lok sabha|rajya sabha|irdai|trai|cci|dpiit|mca|nclt|nclat|rules|guidelines|circular|repo|monetary|fiscal|deficit|election commission|trade deal|fta|labour code|niti aayog|state government)\b/i,
  business: /\b(earnings|profit|revenue|q[1-4]|results|capex|order|deal|shares|stake|ipo|nifty|sensex|rupee|inflation|gdp|exports?|imports?|margin|ebitda|guidance|merger|acquisition|investment|plant|launch|expansion|bank|nbfc|credit|loan|fii|fpi|dii|bond|yield|crude|steel|cement|power|telecom|auto|pharma|it services|fmcg)\b/i,
  global: /\b(fed|federal reserve|ecb|china|us |u\.s\.|tariff|oil|opec|recession|inflation|wall street|dow|nasdaq|treasury|dollar|trade war|earnings|ai|chip|semiconductor|nvidia|apple|microsoft|amazon|alphabet|google|meta|tesla)\b/i,
  ai: /\b(claude|anthropic|openai|chatgpt|gpt|gemini|google ai|deepmind|llm|agent|agents|mcp|model context protocol|skills?|connector|api|copilot|cursor|prompt|automation|workflow|open-?source model|llama|mistral|deepseek|notebooklm|perplexity)\b/i,
  insider: /./,
};

function tokens(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u20b9$%. ]+/g, " ")
    .replace(/\b(mn|million)\b/g, "mn").replace(/\b(bn|billion)\b/g, "bn")
    .split(/\s+/)
    .map((w) => w.replace(/^\$|\.$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const j = inter / (A.size + B.size - inter || 1);
  // Same story, different wording: a moderate overlap with 4+ shared key words counts as a match.
  return inter >= 4 && j >= 0.28 ? Math.max(j, 0.5) : j;
}

export function isJunk(item) {
  return JUNK.some((re) => re.test(item.title));
}

// Groups the same story reported by different outlets. Returns clusters with a representative item.
export function cluster(items, threshold = 0.45) {
  const clusters = [];
  for (const it of items) {
    const tk = tokens(it.title);
    let best = null, bestSim = 0;
    for (const c of clusters) {
      const sim = jaccard(tk, c.tokens);
      if (sim > bestSim) { bestSim = sim; best = c; }
    }
    if (best && bestSim >= threshold) {
      best.members.push(it);
      best.sources.add(it.source);
      if (it.tier > best.rep.tier || (it.tier === best.rep.tier && (it.snippet?.length || 0) > (best.rep.snippet?.length || 0))) best.rep = it;
    } else {
      clusters.push({ rep: it, members: [it], sources: new Set([it.source]), tokens: tk });
    }
  }
  return clusters;
}

export function score(c, now = Date.now()) {
  const it = c.rep;
  const ageH = it.published ? (now - new Date(it.published)) / 36e5 : 12;
  const coverage = c.sources.size;
  let s = it.tier * 1.0 + Math.log2(1 + coverage) * 1.6;
  const lex = LEX[it.section];
  if (lex && lex.test(it.title)) s += 1.2;
  if (it.snippet && it.snippet.length > 80) s += 0.4;
  // freshness: news decays fast, essays slowly
  const halfLife = { business: 14, policy: 18, global: 14, vc: 24, ai: 96, insider: 400 }[it.section] || 24;
  s += 2.0 * Math.pow(0.5, Math.max(ageH, 0) / halfLife);
  return Math.round(s * 100) / 100;
}

// Main entry: raw items -> { section: [candidate, ...] } sorted by score.
export function rankCandidates(items, { rules, limits, now = Date.now(), seenLinks = new Set() } = {}) {
  const bySection = {};
  for (const it of items) {
    if (isJunk(it)) continue;
    if (seenLinks.has(it.link)) continue;
    const maxAge = rules?.[it.section]?.maxAgeH ?? 36;
    if (it.published) {
      const ageH = (now - new Date(it.published)) / 36e5;
      if (ageH > maxAge || ageH < -6) continue;
    }
    // Policy must look like policy; VC must look like deals/startups.
    if (it.section === "policy" && !LEX.policy.test(it.title + " " + it.snippet)) continue;
    if (it.section === "vc" && !LEX.vc.test(it.title + " " + it.snippet)) continue;
    (bySection[it.section] ||= []).push(it);
  }
  const out = {};
  for (const [sec, list] of Object.entries(bySection)) {
    list.sort((a, b) => (b.tier - a.tier) || ((b.snippet?.length || 0) - (a.snippet?.length || 0)));
    const cl = cluster(list);
    const ranked = cl
      .map((c) => ({ ...c.rep, coverage: c.sources.size, alsoIn: [...c.sources].filter((s) => s !== c.rep.source).slice(0, 4), score: score(c, now) }))
      .sort((a, b) => b.score - a.score);
    out[sec] = ranked.slice(0, limits?.[sec] ?? 40);
  }
  // Cross-section duplicates: keep a story in only one section (first by priority).
  const order = ["vc", "policy", "business", "global", "ai", "insider"];
  const seen = [];
  for (const sec of order) {
    if (!out[sec]) continue;
    out[sec] = out[sec].filter((it) => {
      const tk = tokens(it.title);
      if (seen.some((s) => jaccard(s, tk) >= 0.5)) return false;
      seen.push(tk);
      return true;
    });
  }
  return out;
}

export function makeId(item, i) {
  const p = { business: "b", policy: "p", vc: "v", global: "g", ai: "a", insider: "i" }[item.section] || "x";
  return `${p}${i}`;
}
