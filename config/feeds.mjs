// Every source the portal reads. Edit freely: add, remove or re-weight feeds.
// section: business | policy | vc | global | ai | insider
// tier:    3 = flagship source, 2 = solid, 1 = filler (used to break ties)
// maxAgeH: how old an item may be (hours) before it is ignored
// A feed that fails is skipped and reported on the site's #/status page.

const gnews = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;

export const SECTION_RULES = {
  business: { maxAgeH: 36 },
  policy: { maxAgeH: 36 },
  global: { maxAgeH: 30 },
  vc: { maxAgeH: 48 },
  ai: { maxAgeH: 24 * 8 },
  insider: { maxAgeH: 24 * 30 },
};

export const FEEDS = [
  // ---------- Business & markets (India) ----------
  { id: "et-top", name: "Economic Times", section: "business", tier: 3, url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms" },
  { id: "et-markets", name: "Economic Times", section: "business", tier: 2, url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
  { id: "et-industry", name: "Economic Times", section: "business", tier: 2, url: "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms" },
  { id: "mint-companies", name: "Mint", section: "business", tier: 3, url: "https://www.livemint.com/rss/companies" },
  { id: "mint-markets", name: "Mint", section: "business", tier: 2, url: "https://www.livemint.com/rss/markets" },
  { id: "mint-economy", name: "Mint", section: "business", tier: 3, url: "https://www.livemint.com/rss/economy" },
  { id: "bs-companies", name: "Business Standard", section: "business", tier: 3, url: "https://www.business-standard.com/rss/companies-101.rss" },
  { id: "bs-markets", name: "Business Standard", section: "business", tier: 2, url: "https://www.business-standard.com/rss/markets-106.rss" },
  { id: "bs-economy", name: "Business Standard", section: "business", tier: 3, url: "https://www.business-standard.com/rss/economy-102.rss" },
  { id: "hbl", name: "BusinessLine", section: "business", tier: 2, url: "https://www.thehindubusinessline.com/feeder/default.rss" },
  { id: "mc-business", name: "Moneycontrol", section: "business", tier: 1, url: "https://www.moneycontrol.com/rss/business.xml" },
  { id: "gn-business", name: "Google News", section: "business", tier: 1, url: gnews("India (earnings OR capex OR acquisition OR economy OR RBI OR rupee) when:1d") },

  // ---------- Policy & politics (business-impact only; filtered later) ----------
  { id: "pib", name: "PIB", section: "policy", tier: 2, url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3" },
  { id: "rbi", name: "RBI", section: "policy", tier: 3, url: "https://www.rbi.org.in/pressreleases_rss.xml" },
  { id: "sebi", name: "SEBI", section: "policy", tier: 3, url: "https://www.sebi.gov.in/sebirss.xml" },
  { id: "mint-politics", name: "Mint", section: "policy", tier: 2, url: "https://www.livemint.com/rss/politics" },
  { id: "et-policy", name: "Economic Times", section: "policy", tier: 3, url: "https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1106944246.cms" },
  { id: "gn-policy", name: "Google News", section: "policy", tier: 1, url: gnews("India (cabinet OR GST OR tariff OR SEBI OR RBI OR budget OR policy OR regulation) business when:1d") },

  // ---------- Startups, VC, M&A ----------
  { id: "inc42", name: "Inc42", section: "vc", tier: 3, url: "https://inc42.com/feed/" },
  { id: "entrackr", name: "Entrackr", section: "vc", tier: 3, url: "https://entrackr.com/feed/" },
  { id: "yourstory", name: "YourStory", section: "vc", tier: 2, url: "https://yourstory.com/feed" },
  { id: "et-startups", name: "ET Tech", section: "vc", tier: 3, url: "https://economictimes.indiatimes.com/tech/startups/rssfeeds/78570540.cms" },
  { id: "tc-venture", name: "TechCrunch", section: "vc", tier: 2, url: "https://techcrunch.com/category/venture/feed/" },
  { id: "crunchbase", name: "Crunchbase News", section: "vc", tier: 2, url: "https://news.crunchbase.com/feed/" },
  { id: "gn-funding", name: "Google News", section: "vc", tier: 1, url: gnews("India startup raises funding (seed OR \"Series A\" OR \"Series B\" OR \"Series C\") when:2d") },
  { id: "gn-ma", name: "Google News", section: "vc", tier: 1, url: gnews("India startup (acquires OR acquisition OR merger) when:2d") },
  { id: "gn-funds", name: "Google News", section: "vc", tier: 1, url: gnews("India venture capital fund (launches OR closes OR corpus) when:4d") },
  { id: "gn-ipo", name: "Google News", section: "vc", tier: 1, url: gnews("startup IPO India (DRHP OR listing) when:3d") },

  // ---------- Global ----------
  { id: "bbc-business", name: "BBC", section: "global", tier: 3, url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { id: "cnbc-world", name: "CNBC", section: "global", tier: 2, url: "https://www.cnbc.com/id/100727362/device/rss/rss.html" },
  { id: "gn-global", name: "Google News", section: "global", tier: 1, url: gnews("(\"Federal Reserve\" OR \"Wall Street\" OR \"oil prices\" OR \"global economy\" OR tariffs) when:1d") },

  // ---------- AI tools & skills ----------
  { id: "simonw", name: "Simon Willison", section: "ai", tier: 3, url: "https://simonwillison.net/atom/everything/" },
  { id: "openai", name: "OpenAI", section: "ai", tier: 3, url: "https://openai.com/news/rss.xml" },
  { id: "google-ai", name: "Google AI blog", section: "ai", tier: 3, url: "https://blog.google/technology/ai/rss/" },
  { id: "google-dev", name: "Google for Developers", section: "ai", tier: 2, url: "https://developers.googleblog.com/feeds/posts/default" },
  { id: "hf", name: "Hugging Face", section: "ai", tier: 1, url: "https://huggingface.co/blog/feed.xml" },
  { id: "verge-ai", name: "The Verge", section: "ai", tier: 2, url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { id: "latent", name: "Latent Space", section: "ai", tier: 2, url: "https://www.latent.space/feed" },
  { id: "gn-claude", name: "Google News", section: "ai", tier: 2, url: gnews("Anthropic Claude when:7d") },
  { id: "gn-agents", name: "Google News", section: "ai", tier: 1, url: gnews("(\"Claude skills\" OR \"MCP server\" OR \"Gemini in Chrome\" OR \"ChatGPT agent\" OR \"AI agents\") when:7d") },

  // ---------- Insider reads (essays from investors and operators) ----------
  { id: "avc", name: "AVC (Fred Wilson)", section: "insider", tier: 3, url: "https://avc.com/feed/" },
  { id: "bsott", name: "Both Sides of the Table", section: "insider", tier: 3, url: "https://bothsidesofthetable.com/feed" },
  { id: "tunguz", name: "Tomasz Tunguz", section: "insider", tier: 3, url: "https://tomtunguz.com/index.xml" },
  { id: "notboring", name: "Not Boring", section: "insider", tier: 3, url: "https://www.notboring.co/feed" },
  { id: "a16z", name: "a16z", section: "insider", tier: 2, url: "https://a16z.com/feed/" },
  { id: "eladgil", name: "Elad Gil", section: "insider", tier: 3, url: "https://blog.eladgil.com/feed" },
  { id: "abovecrowd", name: "Above the Crowd", section: "insider", tier: 3, url: "https://abovethecrowd.com/feed/" },
];

// Smaller, fast subset used by the "Update now" button during the day.
export const LIVE_FEED_IDS = [
  "et-top", "mint-companies", "mint-economy", "bs-companies", "bs-economy", "hbl",
  "et-policy", "rbi", "sebi", "gn-policy",
  "inc42", "entrackr", "et-startups", "gn-funding", "gn-ma",
  "bbc-business", "gn-global",
];
