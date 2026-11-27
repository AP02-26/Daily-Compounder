// GET /api/markets — delayed quotes for the ticker and market cards, cached 5 minutes at the edge.
import { getMarkets } from "../lib/markets.mjs";

export default async function handler(req, res) {
  try {
    const data = await getMarkets();
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ asOf: new Date().toISOString(), quotes: [], error: String(e.message || e) });
  }
}
