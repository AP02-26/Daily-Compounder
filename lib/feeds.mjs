import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  textNodeName: "#text",
  removeNSPrefix: true,
  processEntities: true,
  htmlEntities: true,
  trimValues: true,
});

const UA =
  "Mozilla/5.0 (compatible; DailyCompounder/1.0; personal news reader; +https://vercel.com)";

const asArray = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const text = (x) => {
  if (x == null) return "";
  if (typeof x === "string" || typeof x === "number") return String(x);
  if (Array.isArray(x)) return text(x[0]);
  if (typeof x === "object") return text(x["#text"] ?? x["@href"] ?? "");
  return "";
};

const ENT = { "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&lt;": "<", "&gt;": ">", "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”", "&hellip;": "…", "&ndash;": "–", "&mdash;": "—", "&#8217;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”", "&#8230;": "…", "&#8211;": "–", "&#8212;": "—", "&#038;": "&" };

export function cleanText(s, max = 600) {
  if (!s) return "";
  let t = String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, (m) => {
      if (ENT[m.toLowerCase()]) return ENT[m.toLowerCase()];
      const num = m.match(/&#(x?)([0-9a-f]+);/i);
      if (num) { try { return String.fromCodePoint(parseInt(num[2], num[1] ? 16 : 10)); } catch { return " "; } }
      return " ";
    })
    .replace(/\s+/g, " ")
    .replace(/The post .* appeared first on .*$/i, "")
    .replace(/Continue reading.*$/i, "")
    .trim();
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, "") + "…";
  return t;
}

function parseDate(s) {
  if (!s) return null;
  const d = new Date(text(s));
  return isNaN(d) ? null : d;
}

// Turn any RSS 2.0 / Atom / RDF document into a flat list of items.
export function parseFeed(xml, feed) {
  const doc = parser.parse(xml);
  let raw = [];
  if (doc.rss?.channel) raw = asArray(doc.rss.channel.item);
  else if (doc.feed) raw = asArray(doc.feed.entry);
  else if (doc.RDF) raw = asArray(doc.RDF.item);
  const isGoogle = feed.url.includes("news.google.com");
  return raw
    .map((it) => {
      let title = cleanText(text(it.title), 300);
      let link = "";
      if (it.link) {
        const links = asArray(it.link);
        const alt = links.find((l) => typeof l === "object" && (l["@rel"] === "alternate" || !l["@rel"]));
        link = typeof links[0] === "string" ? links[0] : text(alt ?? links[0]);
        if (!link && alt) link = alt["@href"];
      }
      if (!link && it.guid) link = text(it.guid);
      let source = feed.name;
      if (isGoogle) {
        const src = text(it.source);
        if (src) source = src;
        const suffix = " - " + source;
        if (title.endsWith(suffix)) title = title.slice(0, -suffix.length);
      }
      const desc = cleanText(
        text(it.description) || text(it.summary) || text(it.content) || text(it.encoded),
        isGoogle ? 0 : 600
      );
      const published = parseDate(it.pubDate || it.published || it.updated || it.date);
      return {
        title,
        link: link.trim(),
        snippet: isGoogle ? "" : desc === title ? "" : desc,
        source,
        feedId: feed.id,
        section: feed.section,
        tier: feed.tier ?? 1,
        published: published ? published.toISOString() : null,
      };
    })
    .filter((x) => x.title && x.link && /^https?:/i.test(x.link));
}

export async function fetchFeed(feed, { timeoutMs = 12000 } = {}) {
  const started = Date.now();
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseFeed(xml, feed);
    if (!items.length) throw new Error("no items parsed");
    return { feed, items, ok: true, ms: Date.now() - started };
  } catch (err) {
    return { feed, items: [], ok: false, error: String(err.message || err).slice(0, 140), ms: Date.now() - started };
  }
}

export async function fetchAll(feeds, opts) {
  const results = await Promise.all(feeds.map((f) => fetchFeed(f, opts)));
  return {
    items: results.flatMap((r) => r.items),
    health: results.map((r) => ({
      id: r.feed.id, name: r.feed.name, section: r.feed.section, ok: r.ok,
      count: r.items.length, error: r.error || null, ms: r.ms,
    })),
  };
}
