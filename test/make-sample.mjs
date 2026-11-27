// Writes a clearly-labelled SAMPLE edition so the site has something to show before the first real run.
// The first GitHub Actions run replaces it with real news.
import { writeFile, mkdir } from "node:fs/promises";
import { FEEDS } from "../config/feeds.mjs";

const now = Date.now();
const t = (h) => new Date(now - h * 36e5).toISOString();
const S = (o) => ({ importance: 4, alsoIn: [], jargon: [], ai: true, ...o });

const edition = {
  sample: true,
  generatedAt: t(1.2),
  model: "sample", aiUsed: true, notes: ["Sample edition with illustrative stories. Real news arrives after the first scheduled run."],
  brief: [
    { id: "p0", headline: "RBI holds the repo rate and signals room to cut if inflation stays low", sowhat: "Loan rates may ease later this year; rate-sensitive sectors like NBFCs and real estate react first.", tag: "Policy", link: "https://www.rbi.org.in", source: "RBI", section: "policy" },
    { id: "v0", headline: "Sample: Kirana-tech startup raises $40M Series C to expand to 30 cities", sowhat: "Large B2B commerce rounds are back, a sign growth investors are returning to Indian retail tech.", tag: "Startups", link: "https://inc42.com", source: "Inc42", section: "vc" },
    { id: "b0", headline: "Sample: Steelmakers raise prices for a third month as import curbs bite", sowhat: "Better margins for steel companies, higher costs for carmakers and builders.", tag: "Companies", link: "https://www.livemint.com", source: "Mint", section: "business" },
  ],
  business: [
    S({ id: "b0", headline: "Sample: Steelmakers raise prices for a third month as import curbs bite", summary: "Major steel producers increased prices again this month. A safeguard duty on cheap imports has reduced competition from overseas suppliers.", why: "Margins improve for steel firms, while auto, appliance and construction companies face higher input costs.", jargon: [{ term: "safeguard duty", meaning: "A temporary extra tax on imports to protect domestic industry from a sudden surge." }], source: "Mint", link: "https://www.livemint.com", published: t(2), section: "business", alsoIn: ["Business Standard", "ET"] }),
    S({ id: "b1", headline: "Sample: Conglomerate plans ₹30,000 crore green hydrogen investment over five years", summary: "The group said it will build electrolyser capacity and a hydrogen hub in phases. The first phase is due in two years.", why: "Shows how large groups are steering capex into energy transition; watch for supplier and PLI tie-ups.", jargon: [{ term: "capex", meaning: "Capital expenditure: money spent on long-term assets like plants." }], source: "Business Standard", link: "https://www.business-standard.com", published: t(3), section: "business" }),
    S({ id: "b2", headline: "Sample: Foreign investors turn net buyers of Indian shares this month", summary: "Overseas portfolio investors bought more Indian stocks than they sold, after several months of selling.", why: "Steady FPI inflows usually support large banks and IT stocks and the rupee.", jargon: [{ term: "FPI", meaning: "Foreign portfolio investors: overseas funds buying Indian stocks and bonds." }], source: "BusinessLine", link: "https://www.thehindubusinessline.com", published: t(5), section: "business" }),
    S({ id: "b3", headline: "Sample: Private bank's loan growth slows as it tightens unsecured lending", summary: "The lender reported slower growth in personal loans and credit cards after raising its approval standards.", why: "Signals banks are still cautious on unsecured credit after regulatory warnings.", source: "ET", link: "https://economictimes.indiatimes.com", published: t(6), section: "business" }),
  ],
  policy: [
    S({ id: "p0", headline: "RBI holds the repo rate and signals room to cut if inflation stays low", summary: "The Monetary Policy Committee kept the key lending rate unchanged. It said a cut is possible if inflation stays comfortably within its target.", why: "Borrowing costs could fall later; banks may reprice home and business loans.", jargon: [{ term: "repo rate", meaning: "The rate at which the RBI lends short-term money to banks." }, { term: "Monetary Policy Committee", meaning: "The RBI panel that votes on interest rates." }], source: "RBI", link: "https://www.rbi.org.in", published: t(4), section: "policy", impact: 5, scope: "Nationwide", sector: "Banking" }),
    S({ id: "p1", headline: "Sample: Cabinet clears rules for new labour codes; states to notify next", summary: "The Union Cabinet approved the rules needed to put the labour codes into effect. States must issue their own notifications.", why: "Hiring costs, gig-worker benefits and compliance change for most employers.", source: "ET", link: "https://economictimes.indiatimes.com", published: t(6), section: "policy", impact: 4, scope: "Nationwide" }),
    S({ id: "p2", headline: "Sample: GST Council to review rates on insurance and EV parts", summary: "The Council's next meeting will discuss lowering GST on some insurance products and electric-vehicle components.", why: "Could cut prices for buyers and change demand for insurers and EV makers.", jargon: [{ term: "GST Council", meaning: "The body of central and state finance ministers that sets GST rates." }], source: "Mint", link: "https://www.livemint.com", published: t(8), section: "policy", impact: 3, scope: "Sector", sector: "Insurance, EV" }),
  ],
  global: [
    S({ id: "g0", headline: "Sample: US Federal Reserve keeps rates steady, hints at one more cut", summary: "The Fed left its policy rate unchanged and said it expects one further cut if inflation keeps easing.", why: "Lower US rates tend to draw foreign money into emerging markets like India.", source: "BBC", link: "https://www.bbc.com/news/business", published: t(9), section: "global" }),
    S({ id: "g1", headline: "Sample: Oil slips as major producers signal higher output", summary: "Crude prices fell after producer nations indicated they may raise supply next quarter.", why: "Cheaper oil lowers India's import bill and helps keep inflation in check.", source: "CNBC", link: "https://www.cnbc.com/world", published: t(7), section: "global" }),
  ],
  vc: {
    pulse: "Sample: capital is concentrating in B2B commerce, fintech infrastructure and climate tech, while consumer apps see smaller rounds. Expect more down-round and secondary activity in late-stage consumer names.",
    deals: [
      { id: "v0", company: "Sample KiranaTech", type: "Funding", round: "Series C", amount: "$40M", investors: "A US growth fund", sector: "B2B commerce", oneLiner: "Supplies inventory and credit to neighbourhood stores", link: "https://inc42.com", source: "Inc42", published: t(2) },
      { id: "v1", company: "Sample CareLoop", type: "Funding", round: "Series A", amount: "$12M", investors: "Early-stage VC (lead)", sector: "Healthtech", link: "https://entrackr.com", source: "Entrackr", published: t(3) },
      { id: "v2", company: "Sample Munch Foods", type: "Acquisition", round: "", amount: "Undisclosed", investors: "Listed FMCG company", sector: "D2C snacks", link: "https://yourstory.com", source: "YourStory", published: t(5) },
      { id: "v3", company: "Sample Seedwell Ventures", type: "Fund", round: "Fund II, first close", amount: "₹400 Cr", investors: "Domestic LPs and family offices", sector: "Seed-stage, multi-sector", link: "https://inc42.com", source: "Inc42", published: t(9) },
      { id: "v4", company: "Sample QuickBasket", type: "IPO", round: "DRHP filed", amount: "₹4,000 Cr", investors: "", sector: "Quick commerce", link: "https://economictimes.indiatimes.com", source: "ET Tech", published: t(10) },
      { id: "v5", company: "Sample VoltFleet", type: "Funding", round: "Series B", amount: "$28M", investors: "Climate fund", sector: "EV fleets", link: "https://techcrunch.com", source: "TechCrunch", published: t(11) },
    ],
    stories: [
      S({ id: "v0", headline: "Sample: Kirana-tech startup raises $40M Series C to expand to 30 cities", summary: "The company, which supplies inventory and working-capital credit to small stores, raised a Series C led by a US growth investor. It plans to enter 30 more cities.", why: "A sizeable growth round in B2B commerce suggests investors see a path to profitability in serving India's small retailers.", jargon: [{ term: "Series C", meaning: "A later-stage round to scale a proven business." }, { term: "working capital", meaning: "Short-term money a business needs to buy stock and run day to day." }], source: "Inc42", link: "https://inc42.com", published: t(2), section: "vc", kind: "Funding", alsoIn: ["Entrackr"] }),
      S({ id: "v4", headline: "Sample: Quick-commerce firm files DRHP for a ₹4,000 crore IPO", summary: "The company filed its draft IPO papers with SEBI. The issue includes new shares and an offer for sale by early investors.", why: "A public-market test of loss-making consumer tech, and a chance for early VCs to return cash (DPI).", jargon: [{ term: "DRHP", meaning: "Draft Red Herring Prospectus: the first IPO filing with SEBI." }, { term: "offer for sale", meaning: "Existing shareholders sell shares; money goes to them." }], source: "ET Tech", link: "https://economictimes.indiatimes.com", published: t(10), section: "vc", kind: "IPO/Exit" }),
      S({ id: "v3", headline: "Sample: Seed fund announces ₹400 crore first close of its second fund", summary: "The firm raised commitments mainly from domestic family offices and institutions. It will back about 30 seed-stage startups.", why: "More domestic LP money means Indian seed funds rely less on global cycles.", jargon: [{ term: "first close", meaning: "The first point at which a fund accepts commitments and can start investing." }], source: "Inc42", link: "https://inc42.com", published: t(9), section: "vc", kind: "Fund" }),
      S({ id: "v6", headline: "Sample: Edtech unicorn lays off 300 staff to extend its runway", summary: "The company cut jobs across sales and content teams. It said the move would make it profitable within 18 months.", why: "A classic runway story: cost cuts ahead of a possible next round or IPO.", jargon: [{ term: "runway", meaning: "Months a company can operate before its cash runs out." }], source: "Entrackr", link: "https://entrackr.com", published: t(12), section: "vc", kind: "Layoffs/Shutdown" }),
    ],
    dealOfDay: {
      id: "v0", title: "Sample: KiranaTech's $40M Series C", source: "Inc42", link: "https://inc42.com",
      whatHappened: "A B2B platform serving neighbourhood stores raised $40M led by a US growth fund. It plans to expand to 30 cities and grow its credit book.",
      thesis: ["Investors are likely betting that bundling credit with inventory locks in stores and lifts margins.", "They may see a large, under-digitised market of millions of small retailers.", "Data from orders could make lending safer and cheaper over time."],
      risks: ["Credit losses if small stores struggle to repay.", "Competition from large e-commerce and FMCG companies' own distribution.", "Thin margins in distribution if lending doesn't scale."],
      askFounder: ["What is your contribution margin per store after credit losses?", "How do retention and order frequency differ for stores that use credit?", "What share of revenue comes from your top 3 cities?"],
      concept: "Contribution margin after credit losses: in lending-led commerce, unit economics must include defaults, not just delivery and product costs.",
    },
  },
  ai: [
    S({ id: "a0", headline: "Sample: A step-by-step guide to packaging a workflow as a Claude Skill", summary: "A developer walks through writing a SKILL.md file, adding an example and uploading the zip.", why: "Exactly the next step on the Skill Lab ladder.", source: "Simon Willison", link: "https://simonwillison.net", published: t(30), section: "ai", level: 2, tryThis: "Turn your case-interview note format into a skill this week." }),
    S({ id: "a1", headline: "Sample: Browser agents can now work across several tabs at once", summary: "A new update lets the assistant read and act across multiple open tabs for research tasks.", why: "Makes comparison research (funds, competitors) much faster.", source: "Google AI blog", link: "https://blog.google/technology/ai/", published: t(50), section: "ai", level: 4, tryThis: "Compare five seed funds' websites in one prompt and build a table." }),
    S({ id: "a2", headline: "Sample: How remote MCP servers connect AI assistants to business apps", summary: "An explainer on how connectors use the Model Context Protocol to reach tools like Drive and Notion.", why: "Foundation for Level 3: connecting Claude to your own data.", jargon: [{ term: "MCP", meaning: "Model Context Protocol: an open standard for connecting AI apps to tools and data." }], source: "Latent Space", link: "https://www.latent.space", published: t(70), section: "ai", level: 3, tryThis: "Connect Google Drive in Claude and ask it to summarise your PE notes." }),
  ],
  insider: [
    S({ id: "i0", headline: "Sample: Why seed funds need more shots on goal than they think", summary: "An investor uses simple maths to show how the power law shapes portfolio size and reserves.", why: "Explains the logic behind fund sizes you see in the news.", takeaway: "Ownership in the one outlier matters more than avoiding losers.", source: "Tomasz Tunguz", link: "https://tomtunguz.com", published: t(120), section: "insider" }),
    S({ id: "i1", headline: "Sample: What makes a great board member at Series A", summary: "A founder-turned-VC describes how the best investors help without micromanaging.", why: "Useful context for how VCs add value after the cheque.", takeaway: "Help on hiring and the next round matters more than weekly advice.", source: "Both Sides of the Table", link: "https://bothsidesofthetable.com", published: t(200), section: "insider" }),
  ],
  xPost: "Third new-age IPO filing this quarter. The real question isn't the valuation, it's whether quick-commerce unit economics hold once the discount war cools. (sample)",
  markets: {
    asOf: t(1.2), snapshot: true,
    quotes: [
      { sym: "^NSEI", name: "NIFTY 50", fmt: "idx", price: 26184.35, prev: 26074.9, pct: 0.42, spark: [25600, 25700, 25650, 25800, 25900, 25880, 26000, 26050, 26100, 26184] },
      { sym: "^BSESN", name: "SENSEX", fmt: "idx", price: 85912.1, prev: 85587, pct: 0.38, spark: [84200, 84500, 84400, 84900, 85100, 85000, 85400, 85600, 85700, 85912] },
      { sym: "^NSEBANK", name: "BANK NIFTY", fmt: "idx", price: 58240.8, pct: -0.21, spark: [] },
      { sym: "^INDIAVIX", name: "INDIA VIX", fmt: "dec", price: 12.84, pct: -3.1, spark: [] },
      { sym: "INR=X", name: "USD/INR", fmt: "fx", inverseColor: true, price: 88.62, pct: 0.08, spark: [88.1, 88.2, 88.15, 88.3, 88.4, 88.45, 88.5, 88.62] },
      { sym: "GC=F", name: "GOLD $/oz", fmt: "usd", price: 4080.5, pct: 0.65, spark: [] },
      { sym: "GOLDINR", name: "GOLD ₹/10g*", fmt: "inr", price: 116270, pct: 0.7, spark: [112000, 113000, 112800, 114000, 114900, 115200, 115800, 116270] },
      { sym: "BZ=F", name: "BRENT $/bbl", fmt: "usd", price: 63.4, pct: -1.12, spark: [] },
      { sym: "^GSPC", name: "S&P 500", fmt: "idx", price: 6812, pct: 0.3, spark: [] },
      { sym: "BTC-USD", name: "BITCOIN $", fmt: "idx", price: 91250, pct: -1.4, spark: [] },
    ],
  },
  feedHealth: FEEDS.map((f) => ({ id: f.id, name: f.name, section: f.section, ok: true, count: 0, error: "sample — not fetched yet", ms: 0 })),
};

await mkdir(new URL("../public/data/archive/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/data/edition.json", import.meta.url), JSON.stringify(edition, null, 1));
await writeFile(new URL("../public/data/archive/index.json", import.meta.url), "[]");
console.log("sample edition written");
