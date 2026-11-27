// Market quotes from Yahoo Finance's public chart endpoint (no key needed, ~15 min delayed for most).
// Used by /api/markets (live, cached 5 min) and by the morning build (snapshot fallback).

export const SYMBOLS = [
  { sym: "^NSEI", name: "NIFTY 50", fmt: "idx" },
  { sym: "^BSESN", name: "SENSEX", fmt: "idx" },
  { sym: "^NSEBANK", name: "BANK NIFTY", fmt: "idx" },
  { sym: "^INDIAVIX", name: "INDIA VIX", fmt: "dec" },
  { sym: "INR=X", name: "USD/INR", fmt: "fx", inverseColor: true },
  { sym: "GC=F", name: "GOLD $/oz", fmt: "usd" },
  { sym: "SI=F", name: "SILVER $/oz", fmt: "usd" },
  { sym: "BZ=F", name: "BRENT $/bbl", fmt: "usd" },
  { sym: "^GSPC", name: "S&P 500", fmt: "idx" },
  { sym: "^IXIC", name: "NASDAQ", fmt: "idx" },
  { sym: "BTC-USD", name: "BITCOIN $", fmt: "idx" },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

async function chart(sym, range, interval) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=${range}&interval=${interval}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const r = data?.chart?.result?.[0];
  if (!r) throw new Error("no data");
  return r;
}

async function quote(s) {
  try {
    const [day, month] = await Promise.all([chart(s.sym, "1d", "5m"), chart(s.sym, "1mo", "1d").catch(() => null)]);
    const price = day.meta.regularMarketPrice;
    const prev = day.meta.chartPreviousClose ?? day.meta.previousClose;
    const spark = (month?.indicators?.quote?.[0]?.close || []).filter((x) => typeof x === "number");
    return {
      ...s, price, prev,
      change: prev ? price - prev : null,
      pct: prev ? ((price - prev) / prev) * 100 : null,
      spark: spark.slice(-22).map((x) => Math.round(x * 100) / 100),
      time: day.meta.regularMarketTime ? new Date(day.meta.regularMarketTime * 1000).toISOString() : null,
      ok: true,
    };
  } catch (e) {
    return { ...s, ok: false, error: String(e.message || e) };
  }
}

export async function getMarkets() {
  const quotes = await Promise.all(SYMBOLS.map(quote));
  const gold = quotes.find((q) => q.sym === "GC=F");
  const inr = quotes.find((q) => q.sym === "INR=X");
  if (gold?.ok && inr?.ok) {
    // International parity price of 10 g of gold in rupees (excludes import duty & GST, so Indian retail is higher).
    const per10g = (p, fx) => (p * fx) / 31.1035 * 10;
    const price = per10g(gold.price, inr.price);
    const prev = per10g(gold.prev, inr.prev);
    quotes.splice(6, 0, {
      sym: "GOLDINR", name: "GOLD ₹/10g*", fmt: "inr", price, prev,
      change: price - prev, pct: ((price - prev) / prev) * 100,
      spark: [], ok: true, note: "International parity; excludes import duty and GST",
    });
  }
  return { asOf: new Date().toISOString(), quotes: quotes.filter((q) => q.ok), failed: quotes.filter((q) => !q.ok).map((q) => q.sym) };
}
