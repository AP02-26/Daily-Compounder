import { LESSONS, TRACKS } from "./content/academy.js";
import { LEVELS } from "./content/skills.js";
import { GLOSSARY, lookup } from "./content/glossary.js";
import { GUESSTIMATES } from "./content/reps.js";

// ───────────────────────── state & storage ─────────────────────────
const $ = (s, el = document) => el.querySelector(s);
const app = $("#app");
const LS = {
  get(k, d) { try { const v = localStorage.getItem("dc:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("dc:" + k, JSON.stringify(v)); } catch {} },
};
const S = {
  edition: null, viewing: null, markets: null, fresh: null, busy: false,
  read: new Set(LS.get("read", [])), saved: LS.get("saved", {}), lessons: LS.get("lessons", {}),
  steps: LS.get("steps", {}), quiz: LS.get("quiz", {}),
  prefs: { name: "", level: 2, auto: true, ...LS.get("prefs", {}) },
};
const persist = () => {
  LS.set("read", [...S.read].slice(-1500)); LS.set("saved", S.saved); LS.set("lessons", S.lessons);
  LS.set("steps", S.steps); LS.set("quiz", S.quiz); LS.set("prefs", S.prefs);
};

// ───────────────────────── helpers ─────────────────────────
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const TZ = "Asia/Kolkata";
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const fmtDate = (d, o = {}) => new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ, ...o });
const istDay = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
function ago(d) {
  if (!d) return "";
  const m = Math.round((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now"; if (m < 60) return m + " min ago";
  const h = Math.round(m / 60); if (h < 24) return h + "h ago";
  const dd = Math.round(h / 24); return dd + "d ago";
}
const dayIndex = () => Math.floor((new Date(istDay()) - new Date("2026-01-01")) / 864e5);
const searchUrl = (q) => "https://www.google.com/search?q=" + encodeURIComponent(q);
function toast(msg, ms = 3200) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), ms); }
const itemKey = (it) => it.link || it.id;

// Jargon highlighting: AI-chosen terms for the item first, then built-in glossary (max 3 per text).
const AUTO_SKIP = new Set(["equity", "stake", "exit", "yield", "valuation", "inflation", "acquisition", "liquidity", "corpus", "tariff", "leverage", "recession", "volatility", "consolidated", "standalone", "buyback", "promoter", "mutual fund", "private equity", "venture capital", "gdp", "ipo", "upi", "ev", "nii", "roc", "fii", "carry", "nifty", "sensex", "deleveraging", "net profit", "dau", "mau", "nav", "lp", "gp", "pat", "bps", "cad", "aum", "fpi", "dii", "nim", "fta"]);
const AUTO_TERMS = Object.keys(GLOSSARY).filter((k) => !AUTO_SKIP.has(k) && k.length >= 3).sort((a, b) => b.length - a.length);
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function highlight(text, jargon = []) {
  let html = esc(text);
  if (!text) return html;
  const defs = new Map();
  for (const j of jargon) if (j.term && j.meaning) defs.set(j.term.toLowerCase(), j.meaning);
  const terms = [...defs.keys(), ...AUTO_TERMS.filter((t) => !defs.has(t))];
  const used = new Set(); let count = 0;
  const pattern = new RegExp("(^|[^\\w-])(" + terms.map((t) => reEsc(esc(t))).join("|") + ")(?=$|[^\\w-])", "gi");
  html = html.replace(pattern, (m, pre, word) => {
    const key = word.toLowerCase();
    if (used.has(key) || count >= 4) return m;
    const def = defs.get(key) || GLOSSARY[key];
    if (!def) return m;
    if (!defs.has(key) && word.length <= 4 && word !== word.toUpperCase()) return m; // short glossary keys only as acronyms
    used.add(key); count++;
    return `${pre}<span class="term" tabindex="0" data-def="${esc(def)}" data-term="${esc(word)}">${word}</span>`;
  });
  return html;
}

// Tiny markdown renderer for lessons & guides.
function md(src) {
  const lines = src.replace(/\r/g, "").split("\n");
  let out = "", list = null, inCode = false, code = [], table = [];
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  const flushList = () => { if (list) { out += `</${list}>`; list = null; } };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.filter((r) => !/^\|\s*-/.test(r)).map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    out += "<table><thead><tr>" + rows[0].map((c) => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>" +
      rows.slice(1).map((r) => "<tr>" + r.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") + "</tbody></table>";
    table = [];
  };
  for (const raw of lines) {
    const l = raw;
    if (l.trim().startsWith("```")) {
      if (inCode) { out += `<pre><code>${esc(code.join("\n"))}</code></pre>`; code = []; inCode = false; } else { flushList(); flushTable(); inCode = true; }
      continue;
    }
    if (inCode) { code.push(l); continue; }
    if (/^\s*\|/.test(l)) { flushList(); table.push(l); continue; } else flushTable();
    if (/^###\s+/.test(l)) { flushList(); out += `<h3>${inline(l.replace(/^###\s+/, ""))}</h3>`; continue; }
    if (/^\s*-\s+/.test(l)) { if (list !== "ul") { flushList(); out += "<ul>"; list = "ul"; } out += `<li>${inline(l.replace(/^\s*-\s+/, ""))}</li>`; continue; }
    if (/^\s*\d+\.\s+/.test(l)) { if (list !== "ol") { flushList(); out += "<ol>"; list = "ol"; } out += `<li>${inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`; continue; }
    if (!l.trim()) { flushList(); continue; }
    flushList(); out += `<p>${inline(l)}</p>`;
  }
  flushList(); flushTable();
  return out;
}

function spark(values, w = 140, h = 26, color) {
  if (!values || values.length < 2) return "";
  const min = Math.min(...values), max = Math.max(...values), r = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 3 - ((v - min) / r) * (h - 6)}`).join(" ");
  const c = color || (values[values.length - 1] >= values[0] ? "#15925E" : "#D2453B");
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="${c}" stroke-width="2" points="${pts}"/></svg>`;
}
function fmtNum(q) {
  const v = q.price; if (v == null) return "–";
  if (q.fmt === "inr") return "₹" + Math.round(v).toLocaleString("en-IN");
  if (q.fmt === "fx" || q.fmt === "dec") return v.toFixed(2);
  if (q.fmt === "usd") return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return v.toLocaleString(q.sym?.startsWith("^NSE") || q.sym?.startsWith("^BSE") ? "en-IN" : "en-US", { maximumFractionDigits: 2 });
}
const isUpGood = (q) => (q.inverseColor ? q.pct < 0 : q.pct >= 0);

// ───────────────────────── data loading ─────────────────────────
async function getJSON(url, timeout = 15000) {
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(timeout) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
async function loadEdition() {
  try { S.edition = await getJSON("/data/edition.json?t=" + Date.now()); }
  catch { S.edition = null; }
  const f = LS.get("fresh", null);
  S.fresh = f && S.edition && f.base === S.edition.generatedAt ? f : null;
}
async function loadMarkets() {
  try {
    const m = await getJSON("/api/markets", 20000);
    if (m.quotes?.length) S.markets = m;
  } catch {}
  if (!S.markets && S.edition?.markets?.quotes?.length) S.markets = { ...S.edition.markets, snapshot: true };
  renderTicker();
  const el = document.getElementById("mkCard");
  if (el) el.outerHTML = marketsCard();
}

async function updateNow({ quiet = false } = {}) {
  if (S.busy) return;
  S.busy = true;
  const btn = $("#btnUpdate"); btn.classList.add("busy"); btn.querySelector("span").textContent = "Updating…";
  const before = S.edition?.generatedAt;
  try {
    await loadEdition();
    if (S.edition && S.edition.generatedAt !== before && !quiet) toast("A newer edition was published. Loaded it.");
    const since = S.edition?.generatedAt || new Date(Date.now() - 6 * 36e5).toISOString();
    const bucket = Math.floor(Date.now() / (10 * 60000));
    const res = await getJSON(`/api/latest?since=${encodeURIComponent(since)}&ai=1&b=${bucket}`, 60000);
    const known = new Set(allItems(S.edition).map((x) => x.link));
    const items = (res.items || []).filter((x) => !known.has(x.link));
    S.fresh = { base: S.edition?.generatedAt, fetchedAt: res.fetchedAt || new Date().toISOString(), items, note: res.note };
    LS.set("fresh", S.fresh);
    if (!quiet) toast(items.length ? `${items.length} new stor${items.length === 1 ? "y" : "ies"} since ${fmtTime(since)}` : "You're up to date. Nothing major since this edition.");
  } catch (e) {
    if (!quiet) toast("Couldn't reach the live update service. Showing the latest edition.");
  } finally {
    S.busy = false; btn.classList.remove("busy"); btn.querySelector("span").textContent = "Update now";
    loadMarkets();
    renderHeader(); route();
  }
}

function allItems(ed) {
  if (!ed) return [];
  return [...(ed.business || []), ...(ed.policy || []), ...(ed.global || []), ...(ed.vc?.stories || []), ...(ed.ai || []), ...(ed.insider || [])];
}

// ───────────────────────── header & ticker ─────────────────────────
function renderHeader() {
  const now = new Date();
  const h = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: TZ }).format(now));
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const name = S.prefs.name ? ", " + esc(S.prefs.name) : "";
  const ed = S.edition;
  const mins = ed ? estimateMinutes(ed) : 0;
  $("#dateline").innerHTML = `${fmtDate(now)} · ${greet}${name}${ed ? ` — today is about a <b>${mins}-minute read</b>` : ""}`;
  const parts = [];
  if (ed) parts.push(`Edition <b>${fmtTime(ed.generatedAt)}</b> · ${ago(ed.generatedAt)}`);
  if (S.fresh) parts.push(`Live check <b>${fmtTime(S.fresh.fetchedAt)}</b>${S.fresh.items.length ? ` · ${S.fresh.items.length} new` : ""}`);
  $("#updated").innerHTML = parts.join("<br>");
  const st = LS.get("streak", { last: null, count: 0 });
  $("#streak").textContent = `◆ ${st.count}-day streak`;
}
function estimateMinutes(ed) {
  const n = (ed.brief?.length || 0) + (ed.business?.length || 0) * 0.6 + (ed.policy?.length || 0) * 0.6 + (ed.vc?.stories?.length || 0) * 0.5 + 8;
  return Math.max(8, Math.round(n));
}
function bumpStreak() {
  const st = LS.get("streak", { last: null, count: 0 });
  const today = istDay();
  if (st.last === today) return;
  const y = istDay(new Date(Date.now() - 864e5));
  st.count = st.last === y ? st.count + 1 : 1; st.last = today;
  LS.set("streak", st);
}
function renderTicker() {
  const q = S.markets?.quotes || [];
  const track = $("#tickerTrack");
  if (!q.length) { track.innerHTML = `<span class="tk-empty">Market data unavailable right now</span>`; track.style.animation = "none"; return; }
  const one = q.map((x) => {
    const cls = isUpGood(x) ? "u" : "d";
    const arrow = x.pct >= 0 ? "▲" : "▼";
    return `<span class="tk"><b>${esc(x.name)}</b>${fmtNum(x)} <span class="${cls}">${arrow} ${Math.abs(x.pct ?? 0).toFixed(2)}%</span></span>`;
  }).join("");
  track.innerHTML = one + one; // duplicated for a seamless loop
  track.style.animation = "";
}

// ───────────────────────── item rendering ─────────────────────────
function storyHTML(it, { big = false, showSection = false, fresh = false } = {}) {
  const key = itemKey(it);
  const read = S.read.has(key) ? " read" : "";
  const saved = S.saved[key] ? " on" : "";
  const imp = it.impact ? `<div class="imp">Impact&nbsp;${[1, 2, 3, 4, 5].map((i) => `<s class="${i <= it.impact ? "f" : ""}"></s>`).join("")}&nbsp;${esc(it.scope || "")}${it.sector ? " · " + esc(it.sector) : ""}</div>` : "";
  const also = it.alsoIn?.length ? `<span>· also in ${esc(it.alsoIn.slice(0, 3).join(", "))}</span>` : "";
  const sec = showSection ? `<span class="kind">${esc({ business: "Business", policy: "Policy", vc: "Startups", global: "Global" }[it.section] || it.section)}</span>` : "";
  const kind = it.kind ? `<span class="kind">${esc(it.kind)}</span>` : "";
  return `<article class="story${read}" data-key="${esc(key)}">
    <div class="src">${fresh ? '<span class="fresh-tag">NEW</span>' : ""}${sec}${kind}<b>${esc(it.source)}</b>${it.published ? `<span>· ${ago(it.published)}</span>` : ""}${also}</div>
    <h4 style="${big ? "font-size:20px" : ""}"><a href="${esc(it.link)}" target="_blank" rel="noopener" data-open="${esc(key)}">${esc(it.headline)}</a></h4>
    ${it.summary ? `<div class="sum">${highlight(it.summary, it.jargon)}</div>` : ""}
    ${it.why ? `<div class="why"><b>Why it matters:</b> ${highlight(it.why, it.jargon)}</div>` : ""}
    ${it.takeaway ? `<div class="why"><b>Takeaway:</b> ${esc(it.takeaway)}</div>` : ""}
    ${it.tryThis ? `<div class="why"><b>Try this:</b> ${esc(it.tryThis)}</div>` : ""}
    ${imp}
    <div class="acts"><a href="${esc(it.link)}" target="_blank" rel="noopener" data-open="${esc(key)}">Read original ↗</a><button data-save="${esc(key)}" class="${saved}">${saved ? "★ Saved" : "☆ Save"}</button><button data-read="${esc(key)}">${read ? "Mark unread" : "✓ Mark read"}</button></div>
  </article>`;
}
const list = (items, opts) => (items?.length ? items.map((x) => storyHTML(x, opts)).join("") : `<div class="muted small">Nothing here in this edition.</div>`);
const freshFor = (sec) => (S.fresh?.items || []).filter((x) => x.section === sec);

function card(title, color, meta, body, moreHref) {
  return `<section class="card"><div class="card-h"><h3><i style="background:var(--${color})"></i>${title}</h3><span class="meta">${meta || ""}</span></div>${body}${moreHref ? `<div style="margin-top:12px"><a class="more" href="${moreHref}">See all →</a></div>` : ""}</section>`;
}

function marketsCard() {
  const q = S.markets?.quotes || [];
  if (!q.length) return `<section class="card" id="mkCard"><div class="card-h"><h3><i style="background:var(--sat)"></i>Markets</h3></div><div class="muted small">Market data will appear here once the site is live.</div></section>`;
  const pick = ["^NSEI", "^BSESN", "INR=X", "GOLDINR"];
  const main = pick.map((s) => q.find((x) => x.sym === s)).filter(Boolean);
  const rest = q.filter((x) => !pick.includes(x.sym));
  const cell = (x) => `<div class="m" title="${esc(x.note || "")}"><div class="n">${esc(x.name)}</div><div class="v">${fmtNum(x)}</div><div class="c ${isUpGood(x) ? "up" : "dn"}">${x.pct >= 0 ? "▲" : "▼"} ${Math.abs(x.pct).toFixed(2)}%${x.sym === "INR=X" ? (x.pct >= 0 ? " (₹ weaker)" : " (₹ stronger)") : ""}</div>${spark(x.spark, 140, 24, x.inverseColor ? (x.spark?.at(-1) >= x.spark?.[0] ? "#D2453B" : "#15925E") : null)}</div>`;
  return `<section class="card" id="mkCard"><div class="card-h"><h3><i style="background:var(--sat)"></i>Markets</h3><span class="meta">${S.markets.snapshot ? "snapshot " : "as of "}${fmtTime(S.markets.asOf)} · delayed</span></div>
    <div class="mk">${main.map(cell).join("")}</div>
    <div class="mk-mini">${rest.map((x) => `<div><span>${esc(x.name)}</span><span>${fmtNum(x)} <span class="${isUpGood(x) ? "up" : "dn"}">${x.pct >= 0 ? "+" : ""}${x.pct.toFixed(2)}%</span></span></div>`).join("")}</div>
    <div class="muted small" style="margin-top:8px">*Gold ₹/10g is international parity (excludes import duty and GST).</div></section>`;
}

function briefCard(ed) {
  const items = (ed.brief || []).slice(0, 3);
  return `<section class="card dark"><div class="card-h"><h3>Today in 60 seconds</h3><span class="meta">the 3 things to know</span></div>
    ${items.map((b, i) => `<div class="bitem"><div class="bnum">${i + 1}</div><div><span class="tag ${esc(b.tag || "")}">${esc(b.tag || "Top")}</span>
      <h4><a href="${esc(b.link)}" target="_blank" rel="noopener">${esc(b.headline)}</a></h4>
      <p><b>So what:</b> ${esc(b.sowhat || "")}</p></div></div>`).join("") || '<div class="muted">No brief yet.</div>'}
  </section>`;
}

function dealsTable(deals, max = 99) {
  if (!deals?.length) return `<div class="muted small">No deals extracted in this edition.</div>`;
  return `<table class="tbl"><thead><tr><th>Company</th><th>Type</th><th class="hide-sm">Round</th><th>Amount</th><th class="hide-sm">Investors / buyer</th><th class="hide-sm">Sector</th></tr></thead><tbody>
    ${deals.slice(0, max).map((d) => `<tr><td><a class="co" href="${esc(d.link)}" target="_blank" rel="noopener">${esc(d.company)}</a>${d.oneLiner ? `<div class="sub">${esc(d.oneLiner)}</div>` : ""}</td>
      <td><span class="pill ${esc((d.type || "").split("/")[0])}">${esc(d.type || "")}</span></td><td class="hide-sm">${esc(d.round || "")}</td><td class="num">${esc(d.amount || "—")}</td>
      <td class="hide-sm">${esc(d.investors || "")}</td><td class="hide-sm sub">${esc(d.sector || "")}</td></tr>`).join("")}
  </tbody></table>`;
}

function dealOfDayHTML(dd, compact = false) {
  if (!dd) return "";
  const ul = (a) => `<ul>${(a || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  if (compact) return `<div class="x"><div class="k">Deal of the day</div><h4>${esc(dd.title)}</h4><p>${esc(dd.whatHappened)}</p><div class="row-btns"><a class="btn vio" href="#/vc">Break it down →</a></div></div>`;
  return `<section class="card dod"><div class="card-h"><h3><i style="background:var(--vio)"></i>Deal of the day · think like an analyst</h3><a class="more" href="${esc(dd.link)}" target="_blank" rel="noopener">Source: ${esc(dd.source)} ↗</a></div>
    <h4>${esc(dd.title)}</h4><div class="sum">${highlight(dd.whatHappened)}</div>
    <div class="cols"><div><h5>Why investors might back it</h5>${ul(dd.thesis)}</div><div><h5>What could go wrong</h5>${ul(dd.risks)}</div><div><h5>Questions for the founder</h5>${ul(dd.askFounder)}</div></div>
    ${dd.concept ? `<div class="concept"><b>Concept this teaches:</b> ${highlight(dd.concept)}</div>` : ""}
  </section>`;
}

// ───────────────────────── views ─────────────────────────
function viewToday(ed, { archive = false } = {}) {
  if (!ed) return noEdition();
  const lesson = LESSONS[((dayIndex() % LESSONS.length) + LESSONS.length) % LESSONS.length];
  const g = GUESSTIMATES[((dayIndex() % GUESSTIMATES.length) + GUESSTIMATES.length) % GUESSTIMATES.length];
  const fresh = archive ? [] : S.fresh?.items || [];
  const banners = [];
  if (archive) banners.push(`<div class="banner info">You're viewing the edition from <b>${fmtDate(ed.generatedAt)}</b>. <a href="#/today">Back to today →</a></div>`);
  if (ed.sample) banners.push(`<div class="banner">This is a <b>sample edition</b> to preview the design. Your first real edition appears after the first GitHub run (see SETUP.md).</div>`);
  else if (!ed.aiUsed) banners.push(`<div class="banner">AI summaries weren't available for this edition, so you're seeing headlines ranked by rules. ${esc((ed.notes || [])[0] || "")}</div>`);
  const freshBlock = fresh.length ? `<section class="card" style="border-color:#F3D3A8"><div class="card-h"><h3><i style="background:var(--sat)"></i>New since ${fmtTime(ed.generatedAt)}</h3><span class="meta">checked ${ago(S.fresh.fetchedAt)}${S.fresh.note ? " · " + esc(S.fresh.note) : ""}</span></div>
      <div class="grid g-2">${[fresh.filter((_, i) => i % 2 === 0), fresh.filter((_, i) => i % 2 === 1)].map((col) => `<div>${col.map((x) => storyHTML(x, { showSection: true, fresh: true })).join("")}</div>`).join("")}</div></section>` : "";

  const pulse = ed.vc?.pulse ? `<div class="pulse-box"><b>Deal-flow pulse:</b> ${highlight(ed.vc.pulse)}</div>` : "";
  return `${banners.join("")}
    <div class="grid g-2-1">${briefCard(ed)}${marketsCard()}</div>
    ${freshBlock}
    <section class="card"><div class="card-h"><h3><i style="background:var(--vio)"></i>VC Desk · today's deals</h3><a class="more" href="#/vc">Open VC Desk →</a></div>
      ${pulse}<div style="margin-top:${pulse ? 14 : 0}px">${dealsTable(ed.vc?.deals, 6)}</div></section>
    <div class="grid g-3">
      ${card("Startups & VC", "vio", `${ed.vc?.stories?.length || 0} stories`, list((ed.vc?.stories || []).slice(0, 4)), "#/vc")}
      ${card("Business & Markets", "sat", `${ed.business?.length || 0} stories`, list((ed.business || []).slice(0, 4)), "#/news/business")}
      ${card("Policy & Politics", "crim", "business-impact only", list((ed.policy || []).slice(0, 4)), "#/news/policy")}
    </div>
    <div class="grid g-4">
      <section class="card x"><div class="k">Academy · lesson of the day</div><h4>${esc(lesson.title)}</h4><p>${esc(lesson.summary)}</p><div class="row-btns"><a class="btn teal" href="#/academy/${lesson.id}">Read · ${lesson.mins} min</a></div></section>
      <section class="card">${dealOfDayHTML(ed.vc?.dealOfDay, true) || `<div class="x"><div class="k">Deal of the day</div><p class="muted">Appears when the AI picks one.</p></div>`}</section>
      <section class="card x" id="todayQuiz">${quizHTML(lesson, "today")}</section>
      <section class="card x"><div class="k">Guesstimate · 7 minutes</div><h4>${esc(g.q)}</h4><details><summary class="small muted" style="cursor:pointer;margin-top:6px">Show a structure</summary><p style="margin-top:6px">${esc(g.hint)}</p></details></section>
    </div>
    <div class="grid g-2">
      ${card("Global", "teal", "what moves Indian markets", list((ed.global || []).slice(0, 4)), "#/news/global")}
      <section class="card"><div class="card-h"><h3><i style="background:var(--ink)"></i>Insider reads</h3><span class="meta">essays from investors</span></div>${list((ed.insider || []).slice(0, 3))}
        ${ed.xPost ? `<div style="margin-top:14px"><div class="k small muted" style="font-weight:700;letter-spacing:.07em;text-transform:uppercase">Post idea for X</div><div class="post" style="margin-top:6px">${esc(ed.xPost)}</div><div class="row-btns"><button class="btn ghost" data-copy="${esc(ed.xPost)}">Copy</button><a class="btn" target="_blank" rel="noopener" href="https://x.com/intent/post?text=${encodeURIComponent(ed.xPost)}">Open in X</a></div></div>` : ""}
      </section>
    </div>`;
}

function quizHTML(lesson, ctx) {
  const q = lesson.quiz; if (!q) return "";
  const ans = S.quiz[lesson.id];
  return `<div class="k">Concept check</div><h4 style="font-size:15.5px">${esc(q.q)}</h4>
    ${q.options.map((o, i) => `<button class="opt ${ans != null ? (i === q.answer ? "right" : i === ans ? "wrong" : "") : ""}" data-quiz="${lesson.id}" data-i="${i}" data-ctx="${ctx}" ${ans != null ? "disabled" : ""}>${String.fromCharCode(65 + i)} · ${esc(o)}</button>`).join("")}
    ${ans != null ? `<div class="explain">${ans === q.answer ? "✓ Correct. " : "Not quite. "}${esc(q.explain)} <a href="#/academy/${lesson.id}">Lesson →</a></div>` : ""}`;
}

function viewVC(ed) {
  if (!ed) return noEdition();
  const types = ["All", ...new Set((ed.vc?.deals || []).map((d) => d.type).filter(Boolean))];
  const filt = viewVC.filter || "All";
  const deals = (ed.vc?.deals || []).filter((d) => filt === "All" || d.type === filt);
  const fr = freshFor("vc");
  return `<div><h2 class="section-title">VC Desk</h2><p class="section-sub">Every funding round, acquisition, fund launch and IPO filing in today's news, plus how an analyst would think about it.</p></div>
    ${ed.vc?.pulse ? `<div class="pulse-box"><b>Deal-flow pulse:</b> ${highlight(ed.vc.pulse)}</div>` : ""}
    <section class="card"><div class="card-h"><h3><i style="background:var(--vio)"></i>Deals tracker</h3><div class="chips">${types.map((t) => `<button class="chip ${t === filt ? "on" : ""}" data-dealfilter="${esc(t)}">${esc(t)}</button>`).join("")}</div></div>${dealsTable(deals)}</section>
    ${dealOfDayHTML(ed.vc?.dealOfDay)}
    ${fr.length ? card("New since this morning", "sat", `${fr.length} stories`, list(fr, { fresh: true })) : ""}
    <div class="grid g-2-1">
      ${card("Startup, VC & M&A stories", "vio", `${ed.vc?.stories?.length || 0} stories`, list(ed.vc?.stories))}
      <div class="grid" style="align-content:start">
        ${card("Insider reads", "ink", "how investors think", list(ed.insider))}
        <section class="card x"><div class="k">Build insider knowledge</div><h4>The VC Academy</h4><p>${LESSONS.length} short lessons: fund economics, term sheets, metrics, India's ecosystem, PE and the intern playbook.</p><div class="row-btns"><a class="btn teal" href="#/academy">Open Academy →</a></div></section>
      </div>
    </div>`;
}

function viewNews(ed, tab = "business") {
  if (!ed) return noEdition();
  const tabs = [["business", "Business & Markets"], ["policy", "Policy & Politics"], ["global", "Global"], ["fresh", `New today${S.fresh?.items?.length ? " (" + S.fresh.items.length + ")" : ""}`]];
  let body;
  if (tab === "fresh") body = S.fresh?.items?.length ? list(S.fresh.items, { showSection: true, fresh: true }) : `<div class="empty">No live check yet. Tap <b>Update now</b> to fetch stories published since ${fmtTime(ed.generatedAt)}.</div>`;
  else {
    const fr = freshFor(tab), base = ed[tab] || [];
    body = fr.length || base.length ? [...fr.map((x) => storyHTML(x, { fresh: true })), ...base.map((x) => storyHTML(x))].join("") : `<div class="muted small">Nothing here in this edition.</div>`;
  }
  const notes = { business: "Indian companies, markets and the economy.", policy: "Only government, regulatory, court and political news with real business or nationwide impact, scored 1–5.", global: "World business news that moves Indian markets.", fresh: "Stories published after this edition, pulled when you tapped Update." };
  return `<div><h2 class="section-title">News</h2><p class="section-sub">${notes[tab]}</p></div>
    <div class="chips">${tabs.map(([k, l]) => `<a class="chip ${k === tab ? "on" : ""}" href="#/news/${k}" style="text-decoration:none">${l}</a>`).join("")}</div>
    <section class="card">${body}</section>`;
}

function viewAcademy() {
  const done = Object.keys(S.lessons).filter((k) => S.lessons[k]).length;
  const today = LESSONS[((dayIndex() % LESSONS.length) + LESSONS.length) % LESSONS.length];
  return `<div class="grid g-2-1" style="align-items:end"><div><h2 class="section-title">VC & PE Academy</h2><p class="section-sub">Evergreen lessons so you understand the industry like an insider. About 5–8 minutes each, with a quiz and a practical exercise.</p></div>
      <div><div class="small muted" style="margin-bottom:6px">${done} of ${LESSONS.length} lessons completed</div><div class="progress"><i style="width:${(done / LESSONS.length) * 100}%"></i></div></div></div>
    <section class="card x" style="background:var(--teal-soft);border-color:#BFDDD6"><div class="k" style="color:var(--teal)">Lesson of the day</div><h4>${esc(today.title)}</h4><p>${esc(today.summary)}</p><div class="row-btns"><a class="btn teal" href="#/academy/${today.id}">Start · ${today.mins} min</a></div></section>
    ${TRACKS.map((t) => {
      const ls = LESSONS.filter((l) => l.track === t.id);
      return `<div class="track"><h3>${esc(t.title)}</h3><div class="muted small">${esc(t.blurb)}</div><div class="lessons">${ls.map((l) => `<a class="lesson-card ${S.lessons[l.id] ? "done" : ""}" href="#/academy/${l.id}"><span class="check">✓</span><div class="small muted">${l.mins} min</div><h4>${esc(l.title)}</h4><p>${esc(l.summary)}</p></a>`).join("")}</div></div>`;
    }).join("")}`;
}

function viewLesson(id) {
  const i = LESSONS.findIndex((l) => l.id === id);
  if (i < 0) return `<div class="empty">Lesson not found. <a href="#/academy">Back to Academy</a></div>`;
  const l = LESSONS[i], prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const track = TRACKS.find((t) => t.id === l.track);
  return `<div class="grid g-2-1" style="align-items:start">
    <article class="card"><div class="lesson-head"><a class="more" href="#/academy">← Academy</a> <span class="muted small">· ${esc(track.title)} · ${l.mins} min</span><h2>${esc(l.title)}</h2><p class="muted" style="font-size:16px;margin:0">${esc(l.summary)}</p></div>
      <div class="prose" style="margin-top:14px">${md(l.body)}</div>
      <div class="callout" style="margin-top:18px"><b>Try this:</b> ${esc(l.tryThis)}</div>
      <div class="row-btns" style="margin-top:18px"><button class="btn ${S.lessons[l.id] ? "ghost" : "teal"}" data-lessondone="${l.id}">${S.lessons[l.id] ? "✓ Completed (undo)" : "Mark lesson complete"}</button>
        ${prev ? `<a class="btn ghost" href="#/academy/${prev.id}">← ${esc(prev.title.slice(0, 32))}…</a>` : ""}${next ? `<a class="btn ghost" href="#/academy/${next.id}">Next: ${esc(next.title.slice(0, 32))}… →</a>` : ""}</div>
    </article>
    <aside class="grid" style="align-content:start">
      <section class="card x" id="lessonQuiz">${quizHTML(l, "lesson")}</section>
      <section class="card"><div class="card-h"><h3>Key terms</h3></div><div class="chips">${l.terms.map((t) => { const d = lookup(t); return `<span class="chip ${d ? "term" : ""}" ${d ? `data-def="${esc(d)}" data-term="${esc(t)}"` : ""}>${esc(t)}</span>`; }).join("")}</div><div class="small muted" style="margin-top:8px">Tap a term with a dotted underline for its meaning.</div></section>
      <section class="card side-links"><div class="card-h"><h3>Go deeper</h3></div>${l.further.map((f) => `<a href="${searchUrl(f)}" target="_blank" rel="noopener">🔎 ${esc(f)}</a>`).join("")}</section>
    </aside></div>`;
}

function viewSkills(levelParam) {
  const ed = S.viewing || S.edition;
  const cur = Number(S.prefs.level) || 2;
  const open = Number(levelParam) || cur;
  const pct = (L) => { const n = L.steps.length; const d = L.steps.filter((_, i) => S.steps[`${L.level}.${i}`]).length; return Math.round((d / n) * 100); };
  const L = LEVELS.find((x) => x.level === open) || LEVELS[1];
  const news = (ed?.ai || []).slice().sort((a, b) => Math.abs((a.level || 3) - cur) - Math.abs((b.level || 3) - cur));
  return `<div><h2 class="section-title">Skill Lab · AI builder track</h2><p class="section-sub">Five levels from power user to builder. Tick off steps as you go; your current level is set in Settings.</p></div>
    <div class="ladder">${LEVELS.map((x) => `<a class="rung ${x.level === cur ? "now" : ""}" href="#/skills/${x.level}" style="${x.level === open ? "outline:2px solid var(--ink);outline-offset:2px" : ""}"><div class="st">${x.level < cur ? "Done" : x.level === cur ? "You are here" : "Level " + x.level}</div><h4>${x.level} · ${esc(x.title)}</h4><p>${esc(x.tagline)}</p><div class="progress"><i style="width:${pct(x)}%"></i></div></a>`).join("")}</div>
    <div class="grid g-2-1" style="align-items:start">
      <section class="card"><div class="card-h"><h3><i style="background:var(--olive)"></i>Level ${L.level} · ${esc(L.title)}: how to proceed</h3><span class="meta">${pct(L)}% done</span></div>
        <div class="callout teal"><b>By the end:</b> ${esc(L.outcome)}</div>
        <div style="margin-top:8px">${L.steps.map((s, i) => `<div class="step"><label class="step-h"><input type="checkbox" data-step="${L.level}.${i}" ${S.steps[`${L.level}.${i}`] ? "checked" : ""}/><h4>${i + 1}. ${esc(s.title)}</h4></label><div class="prose">${md(s.md)}</div></div>`).join("")}</div>
        <div class="callout" style="margin-top:10px"><b>Build challenge:</b> ${esc(L.challenge)}</div>
        <div class="side-links" style="margin-top:12px"><b class="small">Resources</b>${L.resources.map((r) => `<a href="${esc(r.url || searchUrl(r.q))}" target="_blank" rel="noopener">${r.url ? "↗" : "🔎"} ${esc(r.label)}</a>`).join("")}</div>
        <div class="row-btns" style="margin-top:14px">${L.level > 1 ? `<a class="btn ghost" href="#/skills/${L.level - 1}">← Level ${L.level - 1}</a>` : ""}${L.level < 5 ? `<a class="btn ghost" href="#/skills/${L.level + 1}">Level ${L.level + 1} →</a>` : ""}${L.level !== cur ? `<button class="btn olive" data-setlevel="${L.level}">Set as my current level</button>` : ""}</div>
      </section>
      <section class="card"><div class="card-h"><h3><i style="background:var(--olive)"></i>New this week in AI tools</h3><span class="meta">sorted for your level</span></div>
        ${news.length ? news.map((x) => `<div class="story"><div class="src">${x.level ? `<span class="lvl">L${x.level}</span>` : ""}<b>${esc(x.source)}</b><span>· ${ago(x.published)}</span></div><h4><a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.headline)}</a></h4>${x.summary ? `<div class="sum">${highlight(x.summary, x.jargon)}</div>` : ""}${x.tryThis ? `<div class="why"><b>Try this:</b> ${esc(x.tryThis)}</div>` : ""}</div>`).join("") : `<div class="muted small">AI tool news appears after the first edition.</div>`}
      </section>
    </div>`;
}

function viewSaved() {
  const items = Object.values(S.saved).sort((a, b) => (b._savedAt || 0) - (a._savedAt || 0));
  return `<div><h2 class="section-title">Saved</h2><p class="section-sub">Stories you starred. Stored in this browser only.</p></div>
    <section class="card">${items.length ? list(items, { showSection: true }) : `<div class="empty">Nothing saved yet. Tap ☆ Save on any story.</div>`}</section>`;
}

async function viewArchive(day) {
  if (day) {
    try { const ed = await getJSON(`/data/archive/${day}.json`); S.viewing = ed; return viewToday(ed, { archive: true }); }
    catch { return `<div class="empty">No edition saved for ${esc(day)}.</div>`; }
  }
  let idx = [];
  try { idx = await getJSON("/data/archive/index.json"); } catch {}
  return `<div><h2 class="section-title">Archive</h2><p class="section-sub">Every day's final edition, kept for a year.</p></div>
    <section class="card">${idx.length ? `<div class="chips">${idx.map((d) => `<a class="chip" style="text-decoration:none" href="#/archive/${d}">${new Date(d + "T12:00:00+05:30").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</a>`).join("")}</div>` : `<div class="empty">The archive fills up from the first real edition.</div>`}</section>`;
}

function viewStatus(ed) {
  if (!ed) return noEdition();
  const h = ed.feedHealth || [];
  const ok = h.filter((x) => x.ok).length;
  return `<div><h2 class="section-title">Sources & status</h2><p class="section-sub">Edition built ${fmtDate(ed.generatedAt)}, ${fmtTime(ed.generatedAt)} IST. AI model: <b>${esc(ed.model || "none")}</b>. Feeds working: <b>${ok}/${h.length}</b>.</p></div>
    ${(ed.notes || []).length ? `<div class="banner">${ed.notes.map(esc).join("<br>")}</div>` : ""}
    <section class="card"><table class="tbl"><thead><tr><th>Feed</th><th>Section</th><th>Status</th><th>Items</th><th class="hide-sm">Detail</th></tr></thead><tbody>
      ${h.map((x) => `<tr><td>${esc(x.name)} <span class="sub">(${esc(x.id)})</span></td><td>${esc(x.section)}</td><td class="${x.ok ? "status-ok" : "status-bad"}">${x.ok ? "OK" : "Failed"}</td><td class="num">${x.count}</td><td class="hide-sm sub">${esc(x.error || x.ms + " ms")}</td></tr>`).join("")}
    </tbody></table><p class="small muted">To fix a failed feed, edit <code>config/feeds.mjs</code> in GitHub (replace or remove its URL). The next run picks it up.</p></section>`;
}

function viewAbout() {
  return `<article class="card prose" style="max-width:none">${md(`### How The Daily Compounder works
- **Four editions a day.** A scheduled GitHub job runs at about 6:40 am, 12:45 pm, 6:50 pm and 10:55 pm IST. It reads around 50 news feeds, removes duplicates, ranks stories with rules, then asks Gemini to pick the important ones and rewrite them in plain English with "why it matters" and jargon explained.
- **Update now** checks the fastest sources for anything published after the current edition and shows it under "New since…". Results are shared for 10 minutes, so it's quick.
- **Your progress** (saved stories, read marks, lessons, Skill Lab steps, streak) is stored only in your browser.
- **Summaries are AI-written** from headlines and short excerpts only. They can miss nuance; tap "Read original" for the full story.
- **Double-click any word** (or select a phrase) to see a definition. Dotted underlines mark explained jargon.
- **Market data** is delayed and indicative, from public sources.`)}</article>`;
}

function noEdition() {
  return `<div class="empty"><b>No edition found yet.</b><br>Run the "Build daily edition" workflow once from your GitHub repository's Actions tab (see SETUP.md), or wait for the next scheduled run.</div>`;
}

// ───────────────────────── router ─────────────────────────
async function route() {
  const [, r = "today", a] = (location.hash || "#/today").split("/");
  document.querySelectorAll("#nav a").forEach((x) => x.classList.toggle("on", x.dataset.route === r || (r === "academy" && x.dataset.route === "academy")));
  if (r !== "archive") S.viewing = null;
  let html;
  switch (r) {
    case "vc": html = viewVC(S.edition); break;
    case "news": html = viewNews(S.edition, a || "business"); break;
    case "academy": html = a ? viewLesson(a) : viewAcademy(); break;
    case "skills": html = viewSkills(a); break;
    case "saved": html = viewSaved(); break;
    case "archive": html = await viewArchive(a); break;
    case "status": html = viewStatus(S.edition); break;
    case "about": html = viewAbout(); break;
    default: html = viewToday(S.edition);
  }
  app.innerHTML = html;
  hidePop();
}
let lastHash = location.hash;
window.addEventListener("hashchange", () => { const sameView = lastHash.split("/")[1] === location.hash.split("/")[1]; lastHash = location.hash; route().then(() => { if (!sameView || location.hash.startsWith("#/academy/")) window.scrollTo({ top: 0 }); }); });

// ───────────────────────── interactions ─────────────────────────
function findItem(key) {
  const pool = [...allItems(S.viewing || S.edition), ...(S.fresh?.items || []), ...Object.values(S.saved)];
  return pool.find((x) => itemKey(x) === key);
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-save],[data-read],[data-open],[data-quiz],[data-copy],[data-lessondone],[data-setlevel],[data-dealfilter],.term");
  if (!t) { if (!e.target.closest("#pop")) hidePop(); return; }
  if (t.matches(".term")) { e.preventDefault(); showPop(t.dataset.term, t.dataset.def, t.getBoundingClientRect()); return; }
  if (t.dataset.open) { S.read.add(t.dataset.open); persist(); setTimeout(() => t.closest(".story")?.classList.add("read"), 300); return; }
  if (t.dataset.save) {
    const k = t.dataset.save;
    if (S.saved[k]) delete S.saved[k]; else { const it = findItem(k); if (it) S.saved[k] = { ...it, _savedAt: Date.now() }; }
    persist(); t.classList.toggle("on", !!S.saved[k]); t.textContent = S.saved[k] ? "★ Saved" : "☆ Save";
    toast(S.saved[k] ? "Saved. Find it under Saved." : "Removed from Saved.", 1800); return;
  }
  if (t.dataset.read) {
    const k = t.dataset.read; S.read.has(k) ? S.read.delete(k) : S.read.add(k); persist();
    const st = t.closest(".story"); st?.classList.toggle("read", S.read.has(k)); t.textContent = S.read.has(k) ? "Mark unread" : "✓ Mark read"; return;
  }
  if (t.dataset.quiz) {
    const id = t.dataset.quiz; if (S.quiz[id] != null) return;
    S.quiz[id] = Number(t.dataset.i); persist();
    const l = LESSONS.find((x) => x.id === id); const box = t.closest(".card"); if (box) box.innerHTML = quizHTML(l, t.dataset.ctx); return;
  }
  if (t.dataset.copy) { navigator.clipboard?.writeText(t.dataset.copy).then(() => toast("Copied", 1500)); return; }
  if (t.dataset.lessondone) { const id = t.dataset.lessondone; S.lessons[id] = !S.lessons[id]; persist(); route(); if (S.lessons[id]) toast("Lesson complete. Nice work.", 1800); return; }
  if (t.dataset.setlevel) { S.prefs.level = Number(t.dataset.setlevel); persist(); route(); toast(`Current level set to ${S.prefs.level}`, 1800); return; }
  if (t.dataset.dealfilter) { viewVC.filter = t.dataset.dealfilter; route(); }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.step) { S.steps[t.dataset.step] = t.checked; persist(); const L = LEVELS.find((x) => x.level === Number(t.dataset.step.split(".")[0])); if (L && L.steps.every((_, i) => S.steps[`${L.level}.${i}`])) toast(`Level ${L.level} complete! Try the build challenge.`); route(); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePop(); if (e.key === "Enter" && e.target.matches?.(".term")) e.target.click(); });

// Dictionary popover: double-click a word, or select a short phrase and tap "Define".
const pop = $("#pop"), chip = $("#defineChip");
function hidePop() { pop.hidden = true; chip.hidden = true; }
async function showPop(term, def, rect) {
  term = (term || "").trim().replace(/^[^\w₹$]+|[^\w%]+$/g, "");
  if (!term || term.length > 60) return;
  const local = def || lookup(term);
  const links = `<div class="links"><a target="_blank" rel="noopener" href="${searchUrl(term + " meaning finance")}">Search Google ↗</a><a target="_blank" rel="noopener" href="https://www.investopedia.com/search?q=${encodeURIComponent(term)}">Investopedia ↗</a></div>`;
  pop.innerHTML = `<button class="x-close" aria-label="Close">×</button><h5>${esc(term)}</h5><div class="def">${local ? esc(local) : "Looking it up…"}</div>${links}`;
  pop.hidden = false; chip.hidden = true;
  const top = window.scrollY + rect.bottom + 8;
  const left = Math.max(10, Math.min(window.scrollX + rect.left, window.scrollX + document.documentElement.clientWidth - 345));
  pop.style.top = top + "px"; pop.style.left = left + "px";
  pop.querySelector(".x-close").onclick = hidePop;
  if (!local) {
    let text = "No built-in definition. Try the links below.";
    if (/^[a-z-]+$/i.test(term) && !term.includes(" ")) {
      try {
        const r = await getJSON("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(term.toLowerCase()), 6000);
        const m = r?.[0]?.meanings?.[0]; const d = m?.definitions?.[0]?.definition;
        if (d) text = (m.partOfSpeech ? `(${m.partOfSpeech}) ` : "") + d;
      } catch {}
    }
    const el = pop.querySelector(".def"); if (el) el.textContent = text;
  }
}
document.addEventListener("dblclick", (e) => {
  if (e.target.closest("input,textarea,select,button,.pop")) return;
  const sel = window.getSelection(); const word = sel?.toString();
  if (!word || !sel.rangeCount) return;
  showPop(word, null, sel.getRangeAt(0).getBoundingClientRect());
});
let selTimer;
document.addEventListener("selectionchange", () => {
  clearTimeout(selTimer);
  selTimer = setTimeout(() => {
    const sel = window.getSelection(); const txt = sel?.toString().trim();
    if (!txt || txt.split(/\s+/).length > 5 || txt.length > 60 || !sel.rangeCount || !pop.hidden) { chip.hidden = true; return; }
    if (sel.anchorNode && sel.anchorNode.parentElement?.closest("input,textarea,.pop")) return;
    const r = sel.getRangeAt(0).getBoundingClientRect(); if (!r.width) return;
    chip.style.top = window.scrollY + r.top - 36 + "px"; chip.style.left = window.scrollX + r.left + r.width / 2 - 30 + "px"; chip.hidden = false;
    chip.onclick = () => showPop(txt, null, r);
  }, 350);
});

// Settings
$("#btnSettings").onclick = () => { $("#setName").value = S.prefs.name || ""; $("#setLevel").value = S.prefs.level; $("#setAuto").checked = S.prefs.auto !== false; $("#settings").showModal(); };
$("#settings").addEventListener("close", () => { if ($("#settings").returnValue === "save") { S.prefs.name = $("#setName").value.trim(); S.prefs.level = Number($("#setLevel").value); S.prefs.auto = $("#setAuto").checked; persist(); renderHeader(); route(); } });
$("#btnReset").onclick = () => { if (confirm("Reset your saved stories, read marks, lesson and Skill Lab progress in this browser?")) { ["read", "saved", "lessons", "steps", "quiz", "streak", "fresh"].forEach((k) => localStorage.removeItem("dc:" + k)); location.reload(); } };
$("#btnUpdate").onclick = () => updateNow();

// ───────────────────────── boot ─────────────────────────
(async function boot() {
  bumpStreak();
  await loadEdition();
  renderHeader();
  await route();
  loadMarkets();
  setInterval(loadMarkets, 5 * 60000);
  setInterval(renderHeader, 60000);
  // Auto-check for new stories if the edition is over 90 minutes old and we haven't checked in 30 minutes.
  const stale = S.edition && Date.now() - new Date(S.edition.generatedAt) > 90 * 60000;
  const recent = S.fresh && Date.now() - new Date(S.fresh.fetchedAt) < 30 * 60000;
  if (S.prefs.auto !== false && stale && !recent && !S.edition?.sample) updateNow({ quiet: true });
})();
