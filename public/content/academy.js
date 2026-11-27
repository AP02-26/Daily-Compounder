// VC / PE / Finance Academy — evergreen lessons, written for this portal.
// Body uses light markdown: "### heading", "- bullet", "**bold**", blank line = new paragraph.
// "further" items become web-search links, so they never go stale.

export const TRACKS = [
  { id: "vc", title: "How venture capital works", blurb: "The machine behind every funding headline." },
  { id: "metrics", title: "Startup metrics & valuation", blurb: "The numbers investors actually look at." },
  { id: "india", title: "The Indian ecosystem", blurb: "Funds, rules and exits specific to India." },
  { id: "pe", title: "Private equity & exits", blurb: "Control deals, leverage and how money comes back." },
  { id: "intern", title: "The VC intern playbook", blurb: "What to actually do in the job." },
];

export const LESSONS = [
  // ───────────── TRACK: HOW VC WORKS ─────────────
  {
    id: "vc-basics", track: "vc", title: "What venture capital really is: the power law", mins: 5,
    summary: "VC is not about picking many winners. It is about owning a piece of the rare company that returns the whole fund.",
    body: `Venture capital is money invested in young, fast-growing companies in exchange for a share of ownership (equity). Most of these companies will fail or return little. VCs accept that because a very small number of winners can return many times the entire fund.

### The power law
Returns in VC are not spread evenly like marks in a class. They follow a **power law**: one or two investments in a portfolio often produce more than all the others combined. If a ₹500 crore fund backs 30 startups, it is common for 15–20 of them to return less than the money put in. The fund still succeeds if one company becomes worth thousands of crores and the fund owns a meaningful slice of it.

### What this means for how VCs think
- **Upside matters more than safety.** A VC asks "can this be enormous?" before "can this fail?"
- **Ownership matters.** Owning 0.5% of a giant is worth far less than owning 10% of it.
- **Missing the winner hurts more than backing a loser.** A loser costs at most 1x the cheque. A missed winner can cost the whole fund's return.
- **Market size is a filter.** A great team in a small market rarely produces a fund-returning outcome.

### Fund-returning math
A simple test VCs use: "If this works, could our stake alone return the entire fund?" For a ₹500 crore fund owning 10% at exit, the company must be worth about ₹5,000 crore for that stake to return the fund once.`,
    terms: ["equity", "power law", "fund-returner", "ownership"],
    tryThis: "Pick any three startups in today's VC Desk. For each, ask: if everything goes right, how big could this get? Would that return a ₹500 crore fund?",
    quiz: { q: "A ₹400 crore fund owns 8% of a startup at exit. Roughly how big must the startup be for this one stake to return the whole fund?", options: ["₹500 crore", "₹3,200 crore", "₹5,000 crore", "₹40,000 crore"], answer: 2, explain: "₹400 crore ÷ 8% = ₹5,000 crore. That is the 'fund-returner' test VCs run on every deal." },
    further: ["Peter Thiel power law venture capital", "Horsley Bridge venture returns distribution", "Paul Graham Black Swan Farming essay"],
  },
  {
    id: "fund-structure", track: "vc", title: "GPs, LPs and “2 and 20”: how a VC fund is built", mins: 6,
    summary: "A VC fund is a pool of other people's money with a fixed life, a management fee and a share of profits for the managers.",
    body: `### The two sides
- **Limited Partners (LPs)** put in the money: pension funds, university endowments, insurance companies, sovereign funds, fund-of-funds, family offices and wealthy individuals. They are "limited" because they don't run the fund and their risk is limited to what they committed.
- **General Partners (GPs)** run the fund: they find deals, invest, sit on boards and decide when to sell. GPs usually invest a small amount of their own money too (often around 1–2% of the fund) so they have skin in the game.

### Commitments and drawdowns
LPs don't hand over all the money on day one. They **commit** an amount, and the GP **calls capital** (draws it down) as deals happen, usually over 3–5 years.

### "2 and 20"
- **Management fee (~2% a year)** of committed capital pays salaries, rent and travel. It often steps down after the investment period.
- **Carried interest, or carry (~20%)** is the GPs' share of profits, paid only after LPs get their money back (and, in many PE funds, a minimum return called the **hurdle**, often around 8%).

### A worked example
A ₹1,000 crore fund with a 10-year life charging 2% a year might take roughly ₹150–200 crore in fees over its life (fees usually fall after year 5). If the fund eventually returns ₹3,000 crore, profit is ₹2,000 crore and carry at 20% is ₹400 crore to the GPs; LPs keep the rest.

### Fund life
A typical VC fund lives about 10 years (often extendable by 1–2 years): roughly 3–5 years to make new investments, then the remaining years to support companies and sell stakes. GPs usually raise their next fund every 3–4 years, so they manage several funds at once.`,
    terms: ["LP", "GP", "capital call", "management fee", "carried interest", "hurdle rate"],
    tryThis: "When you see 'X Ventures closes ₹800 crore Fund III' in the news, estimate its yearly fee budget (2%) and how many partners that can support.",
    quiz: { q: "Carried interest is…", options: ["The yearly fee paid on committed capital", "The GPs' share of profits after LPs are paid back", "Interest charged on capital calls", "The return LPs earn from cash in the bank"], answer: 1, explain: "Carry (usually ~20%) is the GPs' share of the fund's profits, earned only after LPs receive their capital back (plus any hurdle)." },
    further: ["venture capital fund structure GP LP explained", "management fee step down venture fund", "European vs American carry waterfall"],
  },
  {
    id: "fund-returns", track: "vc", title: "TVPI, DPI, IRR and the J-curve", mins: 6,
    summary: "How LPs judge a fund: paper value vs real cash back, and why young funds always look bad.",
    body: `### The three numbers LPs ask for
- **TVPI (Total Value to Paid-In):** (cash returned + current value of holdings) ÷ money paid in. A TVPI of 2.5x means the fund is worth 2.5 times what LPs put in, on paper plus cash.
- **DPI (Distributions to Paid-In):** cash actually returned ÷ money paid in. This is the number that counts. "DPI is the only real number" is a common LP saying, because paper valuations can fall.
- **IRR (Internal Rate of Return):** the annualised return, which rewards getting money back sooner.

### Why IRR and multiples can disagree
Doubling money in 2 years is an IRR of about 41%. Doubling it in 7 years is about 10%. Same 2x multiple, very different IRR. That is why LPs look at both.

### The J-curve
In the first years a fund pays fees and marks some failed companies down, while winners haven't been sold yet. So returns dip below zero, then rise as winners mature and exits happen. Plotted over time, that looks like a "J". A fund that looks poor in year 3 may be excellent by year 9.

### Good numbers (rough benchmarks)
For VC, a net TVPI above 3x is generally seen as top-tier, around 2x is decent, and below 1.5x is disappointing. DPI often stays near zero for the first 5–6 years.

### Indian context
For years, Indian VC funds showed strong TVPI but weak DPI because exits were scarce. The wave of startup IPOs and secondary sales since 2021 is slowly turning paper gains into DPI, which is why fund managers talk so much about "returning capital" today.`,
    terms: ["TVPI", "DPI", "IRR", "J-curve", "net vs gross returns"],
    tryThis: "Compute: a fund paid in ₹200 crore, has returned ₹100 crore in cash and holds stakes worth ₹350 crore. What are its DPI and TVPI?",
    quiz: { q: "Paid-in ₹200 cr, distributions ₹100 cr, remaining value ₹350 cr. TVPI is…", options: ["0.5x", "1.75x", "2.25x", "2.75x"], answer: 2, explain: "TVPI = (100 + 350) ÷ 200 = 2.25x. DPI = 100 ÷ 200 = 0.5x." },
    further: ["TVPI vs DPI explained venture", "private equity J-curve explained", "Cambridge Associates venture benchmark"],
  },
  {
    id: "stages", track: "vc", title: "Pre-seed to growth: the stages of funding", mins: 6,
    summary: "Each round buys the company time to prove the next big risk. Labels are loose; the risk being removed is what matters.",
    body: `### The usual ladder
- **Pre-seed / angel:** an idea, a founding team, maybe a prototype. Money from founders, friends, angels, accelerators. In India, often ₹50 lakh to a few crore.
- **Seed:** early product, first users or revenue signals. Typical Indian seed rounds in recent years: roughly $1–4 million.
- **Series A:** clear product-market fit signals and a repeatable way to acquire customers. Roughly $5–15 million in India.
- **Series B:** scaling what works: more cities, more products, bigger team. Roughly $15–40 million.
- **Series C and beyond / growth:** proven business expanding fast, often preparing for profitability or IPO. $40 million and up, frequently with growth funds, PE funds or crossover investors.

These ranges move with the market. In 2021 rounds were far bigger; in 2023 they shrank.

### Each round removes a risk
Think of rounds as answering questions in order: Can this team build it? (pre-seed) Will anyone want it? (seed) Can we acquire customers profitably and repeatedly? (A) Can we scale it? (B) Can we dominate and make money? (C+).

### Other labels you'll see
- **Bridge / extension:** extra money between rounds, often from existing investors, usually because the next round is not ready yet.
- **Pre-Series A, Series A1:** labels founders use to avoid signalling a "down" or delayed round.
- **Down round:** raising at a lower valuation than the last round.
- **Venture debt:** loans to VC-backed startups, usually alongside an equity round.`,
    terms: ["pre-seed", "seed", "Series A", "bridge round", "down round", "venture debt", "crossover investor"],
    tryThis: "For each deal in today's VC Desk table, write which risk you think that round is meant to remove.",
    quiz: { q: "A startup raises a 'Series A1' from its existing investors a year after its Series A. This most likely signals…", options: ["A huge IPO is imminent", "It needed more money before hitting the milestones for Series B", "It is being acquired", "It is now profitable"], answer: 1, explain: "Extensions like A1 usually buy time to reach Series B milestones. Not necessarily bad, but worth asking why." },
    further: ["startup funding stages explained seed series A B", "Tracxn India funding report", "Inc42 Indian startup funding report"],
  },
  {
    id: "valuation-dilution", track: "vc", title: "Pre-money, post-money, dilution and the ESOP pool", mins: 7,
    summary: "The arithmetic behind every 'raises X at a valuation of Y' headline.",
    body: `### The core formula
**Post-money valuation = pre-money valuation + new money invested.**
The investor's ownership = investment ÷ post-money.

Example: a startup is valued at ₹80 crore pre-money and raises ₹20 crore. Post-money is ₹100 crore, so the new investor owns 20%.

### Dilution
Existing owners now own a smaller percentage of a bigger company. If the founders owned 100% before, they own 80% after. A typical round sells about 15–25% of the company. After seed, A, B and C, founders commonly hold well under half the company together.

### The ESOP pool
Startups set aside shares for employees (an **ESOP pool**, often 10–15%). Investors usually ask for the pool to be created or topped up **before** their money comes in, so it is counted in the pre-money. This means founders, not the new investor, bear that dilution. People call it the "option pool shuffle".

Example: pre-money ₹80 crore including a new 10% pool. The founders' real, effective pre-money is lower than the headline, because part of the ₹80 crore is reserved for future employees.

### What headlines leave out
"Valued at ₹1,000 crore" is usually a post-money figure, and it may come with investor protections (like liquidation preferences) that make the true economic value lower than the headline.`,
    terms: ["pre-money", "post-money", "dilution", "ESOP pool", "option pool shuffle", "fully diluted"],
    tryThis: "If a company raises ₹30 crore at a ₹150 crore pre-money, what does the new investor own? (Answer: 30 ÷ 180 = 16.7%.)",
    quiz: { q: "Pre-money ₹120 crore, investment ₹30 crore. The new investor owns…", options: ["20%", "25%", "15%", "30%"], answer: 0, explain: "Post-money = 150. Ownership = 30 ÷ 150 = 20%." },
    further: ["pre money post money valuation example", "option pool shuffle Venture Hacks", "fully diluted capitalization table explained"],
  },
  {
    id: "term-sheet", track: "vc", title: "The term sheet terms that really matter", mins: 8,
    summary: "Valuation is only one line. Liquidation preferences, anti-dilution and control rights decide who gets what.",
    body: `A **term sheet** is a short, mostly non-binding document listing the key terms of an investment. Lawyers later turn it into the full agreements (in India, typically a Share Subscription Agreement and a Shareholders' Agreement).

### Economic terms
- **Liquidation preference:** when the company is sold or wound up, preferred investors get their money back first. "**1x non-participating**" (the market standard) means the investor gets either their money back or their percentage share, whichever is higher. "**Participating**" means they get their money back AND a share of what's left: the "double dip". Higher multiples (2x, 3x) are a sign of a tough negotiation.
- **Anti-dilution:** protects investors if a future round is priced lower. **Broad-based weighted average** (common) adjusts their price moderately; **full ratchet** (harsh) resets it entirely to the new lower price.
- **Pro-rata rights:** the right to invest in future rounds to keep the same ownership. Valuable in winners.
- **ESOP pool:** see the previous lesson.

### Control terms
- **Board seats:** who sits on the board and how many independents.
- **Protective provisions / affirmative votes:** decisions (new rounds, selling the company, changing the business, big spends) that need the investor's consent. In Indian deals these are often called "reserved matters".
- **Drag-along:** lets a majority force others to join a sale. **Tag-along:** lets minority holders sell alongside a majority seller.
- **ROFR (right of first refusal):** the company or investors can buy shares before an outsider does.

### India specifics
Indian VC investments are usually made through **CCPS** (compulsorily convertible preference shares): preferred shares that must convert into ordinary shares later. Foreign investment rules make CCPS the practical default. Early rounds sometimes use convertible notes or "iSAFE" notes, which convert into equity at the next priced round.`,
    terms: ["term sheet", "liquidation preference", "participating preferred", "anti-dilution", "full ratchet", "pro-rata", "drag-along", "tag-along", "ROFR", "CCPS"],
    tryThis: "Company sells for ₹100 crore. An investor put in ₹30 crore for 20% with a 1x non-participating preference. Do they take ₹30 crore (preference) or ₹20 crore (20%)? They take ₹30 crore.",
    quiz: { q: "An investor with a 1x NON-participating preference put in ₹40 cr for 25%. The company sells for ₹400 cr. They receive…", options: ["₹40 cr", "₹100 cr", "₹140 cr", "₹130 cr"], answer: 1, explain: "Non-participating: the higher of ₹40 cr (preference) or 25% × ₹400 cr = ₹100 cr. Participating would have given ₹40 cr + 25% of ₹360 cr = ₹130 cr." },
    further: ["Venture Deals Brad Feld term sheet", "liquidation preference participating vs non participating", "CCPS compulsorily convertible preference shares startups India"],
  },
  {
    id: "how-vcs-decide", track: "vc", title: "How VCs evaluate a startup", mins: 7,
    summary: "Team, market, product, traction, and 'why now'. Plus the one question that decides most deals.",
    body: `### The classic checklist
- **Team:** Why are these founders uniquely suited? Have they lived the problem? Can they hire better people than themselves and sell the vision?
- **Market:** How big can this be? VCs use **TAM** (total addressable market), **SAM** (the part you can serve) and **SOM** (what you can realistically capture). Bottom-up estimates (number of customers × price) are trusted more than top-down ("1% of a $50 billion market").
- **Product:** Is it 10x better, not 10% better? What does the customer do today instead?
- **Traction:** Revenue, growth rate, retention, engagement. Retention is often the most honest signal of product-market fit.
- **Why now:** What changed (technology, regulation, behaviour, cost) that makes this possible today and not five years ago? UPI, cheap data and the account aggregator framework are classic Indian "why nows".
- **Moat:** What will stop competitors later: network effects, data, brand, switching costs, scale economies, regulation?

### Early vs late stage
At seed, the team and insight dominate because there is little data. By Series B, the numbers dominate: growth efficiency, unit economics, retention cohorts.

### The question behind every decision
"**If this works, how big is it, and what has to be true for it to work?**" Good investment memos list those 3–5 things that must be true, then test each one.

### Common reasons for a 'no'
Market too small, no clear edge over incumbents, weak retention, founders lacking key skills, price too high, or "too early for us".`,
    terms: ["TAM", "SAM", "SOM", "product-market fit", "moat", "network effects", "why now"],
    tryThis: "Take the Deal of the Day and write the three things that must be true for it to become a ₹10,000 crore company.",
    quiz: { q: "Which market sizing is usually most credible to investors?", options: ["Top-down: 1% of a huge market", "Bottom-up: number of target customers × realistic price", "The largest number found in any report", "Competitor revenue × 10"], answer: 1, explain: "Bottom-up sizing shows you understand who the customer is and what they will pay." },
    further: ["how venture capitalists evaluate startups", "bottom up TAM calculation example", "Sequoia writing a business plan template"],
  },
  {
    id: "portfolio", track: "vc", title: "Portfolio construction and reserves", mins: 6,
    summary: "How many companies a fund backs, how big each cheque is, and why half the money is kept for later.",
    body: `**Portfolio construction** is the plan for how a fund spends its money: how many companies, at what stage, with what initial cheque, and how much to keep for follow-ons.

### Reserves
Many early-stage funds keep 40–60% of their capital as **reserves** to invest again in their best companies at later rounds. This protects ownership in winners, which (because of the power law) is where most returns come from.

### A simple example
A ₹300 crore seed fund, after fees, might have about ₹250 crore to invest. It could back 25 companies with ₹5 crore initial cheques (₹125 crore) and hold ₹125 crore in reserves for follow-ons in the 6–8 companies that do best.

### Concentrated vs spray-and-pray
- **Concentrated** funds back fewer companies with bigger stakes and work closely with each.
- **Diversified** funds back many companies with small cheques, increasing the odds of catching an outlier.
Both can work; the math must match the strategy.

### Ownership targets
Funds usually set a target ownership at entry (for example 10–20% for a Series A lead). Too little ownership means even a big winner can't return the fund.

### Why this matters for news reading
When you read that a fund "doubled down" in a later round, that is reserves at work, and a signal of conviction.`,
    terms: ["portfolio construction", "reserves", "follow-on", "ownership target", "initial cheque"],
    tryThis: "Look up any Indian seed fund's portfolio page. Count the companies and estimate the average cheque from the fund size.",
    quiz: { q: "Why do early-stage funds keep large reserves?", options: ["To pay management fees", "To invest more in their best-performing companies", "Because regulators require it", "To buy government bonds"], answer: 1, explain: "Follow-on capital protects and increases ownership in the winners that drive returns." },
    further: ["venture portfolio construction reserves strategy", "Fred Wilson portfolio construction", "follow-on reserves ratio venture"],
  },

  // ───────────── TRACK: METRICS ─────────────
  {
    id: "unit-economics", track: "metrics", title: "Unit economics: CAC, LTV, payback and contribution margin", mins: 7,
    summary: "Does each customer make money, and how fast? The first test of whether growth is worth funding.",
    body: `### The building blocks
- **CAC (customer acquisition cost):** total sales and marketing spend ÷ new customers won in the same period.
- **Contribution margin:** revenue from a customer minus the variable costs of serving them (delivery, payment fees, discounts, server costs). Indian investors often break this into CM1, CM2 and CM3, subtracting more costs at each level (for example product cost, then delivery and payment, then marketing).
- **LTV (lifetime value):** the total contribution margin a customer brings over their lifetime. Simple version: monthly contribution per customer × average months a customer stays.
- **LTV:CAC ratio:** above 3 is commonly treated as healthy.
- **CAC payback:** months of contribution margin needed to earn back CAC. Under 12 months is strong for most businesses.

### Example
A D2C brand spends ₹600 to acquire a customer. Each order earns ₹150 contribution margin after product, shipping and payment costs, and the average customer orders 6 times. LTV = ₹900. LTV:CAC = 1.5, which is weak: the brand is barely earning back what it spends.

### Traps
- Using revenue instead of margin in LTV (inflates it badly).
- Ignoring discounts and returns.
- Blended CAC hiding rising paid CAC: organic customers make blended CAC look cheaper than the cost of buying new ones.
- LTV based on assumed rather than observed retention.`,
    terms: ["CAC", "LTV", "contribution margin", "CM1/CM2/CM3", "CAC payback", "blended CAC"],
    tryThis: "For a quick-commerce order worth ₹500, list every variable cost you can think of. Is the contribution margin positive?",
    quiz: { q: "CAC ₹1,200; monthly contribution per customer ₹100; customers stay 18 months on average. LTV:CAC is…", options: ["0.75", "1.5", "3", "18"], answer: 1, explain: "LTV = 100 × 18 = ₹1,800. 1,800 ÷ 1,200 = 1.5. Payback = 12 months." },
    further: ["unit economics LTV CAC explained", "contribution margin CM1 CM2 CM3 D2C India", "CAC payback period benchmark"],
  },
  {
    id: "saas-metrics", track: "metrics", title: "SaaS metrics: ARR, NRR, churn, burn multiple, Rule of 40", mins: 7,
    summary: "The vocabulary of software investing, and the few numbers that separate great SaaS from average.",
    body: `### Revenue
- **ARR (annual recurring revenue):** subscription revenue annualised. MRR × 12.
- **Net new ARR:** new customers + upgrades − downgrades − cancellations, over a period.

### Retention
- **Gross churn:** revenue lost from cancellations and downgrades.
- **NRR (net revenue retention):** revenue this year from last year's customers ÷ their revenue last year. Above 100% means existing customers grow their spend faster than others leave. Strong enterprise SaaS often shows 120%+; SMB-focused SaaS is usually lower.

### Efficiency
- **Burn multiple:** net cash burned ÷ net new ARR. Under 1x is excellent; above 2x means growth is expensive.
- **Magic number:** net new ARR ÷ previous quarter's sales and marketing spend. Around 0.75+ suggests efficient go-to-market.
- **Rule of 40:** growth rate % + profit (or free cash flow) margin % should be at least 40. A company growing 60% with a −20% margin passes; one growing 15% with a 10% margin does not.

### Why India matters here
India has built many global SaaS companies (selling to the US and Europe from India), helped by lower engineering costs. Investors look closely at whether they can win mid-market and enterprise customers abroad, which shows up in NRR and average contract value.`,
    terms: ["ARR", "MRR", "NRR", "churn", "burn multiple", "magic number", "Rule of 40", "ACV"],
    tryThis: "A SaaS startup burned ₹30 crore last year and added ₹15 crore of net new ARR. What is its burn multiple? (2x — expensive growth.)",
    quiz: { q: "Last year's customers paid ₹10 cr; this year the same customers pay ₹12.5 cr. NRR is…", options: ["80%", "100%", "125%", "250%"], answer: 2, explain: "12.5 ÷ 10 = 125%. Existing customers expanded faster than others churned." },
    further: ["net revenue retention benchmark SaaS", "David Sacks burn multiple", "Rule of 40 SaaS explained"],
  },
  {
    id: "consumer-metrics", track: "metrics", title: "Consumer & marketplace metrics: GMV, take rate, cohorts", mins: 7,
    summary: "Why GMV is not revenue, and why a retention curve that flattens is the most beautiful chart in consumer investing.",
    body: `### GMV vs revenue
**GMV (gross merchandise value)** is the total value of goods sold through a platform. A marketplace's **revenue** is only its cut. If a food delivery app processes ₹1,000 crore of orders and keeps ₹200 crore in commissions and fees, GMV is ₹1,000 crore and the **take rate** is 20%.

Headlines love GMV because it is the bigger number. Investors look at revenue and margin.

### Cohorts and retention
A **cohort** is a group of users who joined in the same month. A **retention curve** shows what share of a cohort is still active after 1, 2, 3… months.
- If the curve keeps falling toward zero, users are trying and leaving: no product-market fit.
- If it **flattens** (say, at 30% after month 6), a loyal core has formed. That is the signal investors look for.
- If newer cohorts retain better than older ones, the product is improving.

### Frequency and engagement
- **DAU/MAU:** daily active users ÷ monthly active users. Shows how habitual the product is (above ~25% is strong for most apps).
- **Order frequency** and **AOV (average order value)** drive marketplace economics.

### Marketplaces
Two-sided marketplaces need **liquidity**: buyers find what they want and sellers find buyers quickly. Network effects can be strong but often local (city by city), which is why Indian marketplaces expand city by city.`,
    terms: ["GMV", "take rate", "cohort", "retention curve", "DAU/MAU", "AOV", "liquidity"],
    tryThis: "When a funding story mentions GMV, estimate revenue by assuming a take rate, then compare the valuation to that revenue.",
    quiz: { q: "A marketplace has ₹2,000 cr GMV and a 12% take rate. Its revenue is about…", options: ["₹2,000 cr", "₹1,760 cr", "₹240 cr", "₹12 cr"], answer: 2, explain: "Revenue ≈ GMV × take rate = ₹240 cr." },
    further: ["cohort retention curve flattening product market fit", "marketplace take rate benchmarks", "a16z marketplace metrics"],
  },
  {
    id: "burn-runway", track: "metrics", title: "Burn, runway and being 'default alive'", mins: 5,
    summary: "The cash maths every founder and investor checks first in a downturn.",
    body: `### Definitions
- **Gross burn:** total cash spent per month.
- **Net burn:** cash spent minus cash coming in per month.
- **Runway:** cash in bank ÷ net burn = months until the money runs out.

Example: ₹60 crore in the bank, net burn ₹3 crore a month → 20 months of runway.

### Default alive vs default dead
Paul Graham's question: on current growth and costs, will the company reach profitability before the money runs out? If yes, it is **default alive**. If not, it is **default dead** and depends on raising again.

### Why it matters
- Fundraising takes 3–6 months, so founders aim to start raising with at least 9–12 months of runway left.
- In tight markets (like 2022–23), many Indian startups cut burn sharply, laid off staff, or took **bridge rounds** and **venture debt** to extend runway.
- Layoff and shutdown headlines are often runway stories in disguise.

### Reading the signals
Rising "path to profitability" language, sudden cost cuts, or down rounds usually mean investors pushed for longer runway.`,
    terms: ["gross burn", "net burn", "runway", "default alive", "bridge round"],
    tryThis: "Next time you read about startup layoffs, look for the funding date of their last round and estimate how much runway they had.",
    quiz: { q: "₹45 cr in the bank, gross burn ₹5 cr/month, revenue inflow ₹2 cr/month. Runway is…", options: ["9 months", "15 months", "22.5 months", "45 months"], answer: 1, explain: "Net burn = 5 − 2 = ₹3 cr. 45 ÷ 3 = 15 months." },
    further: ["Paul Graham default alive or default dead", "startup runway calculation", "venture debt India explained"],
  },
  {
    id: "startup-valuation", track: "metrics", title: "How startups are valued: VC method and multiples", mins: 7,
    summary: "Early valuations are negotiations anchored on future exits and market comparables, not DCFs.",
    body: `Young startups rarely have the stable cash flows a DCF (discounted cash flow) needs. Investors use simpler tools.

### 1. The VC method (work backwards from the exit)
1. Estimate the company's value at exit (say ₹3,000 crore in 7 years).
2. Decide the return the fund needs at this stage (say 10x for a Series A).
3. Value today (post-money) = exit value ÷ target multiple = ₹300 crore.
4. Adjust for future dilution: if later rounds will dilute the fund by 40%, today's post-money should be closer to ₹300 crore × 60% = ₹180 crore.

### 2. Multiples and comparables
- **Revenue or ARR multiples** (EV/Revenue) for growth companies. Multiples depend on growth rate, gross margin and retention. Fast-growing, high-margin SaaS gets higher multiples than low-margin commerce.
- **Comparable transactions:** what similar companies raised at recently.
- **Public comparables:** listed peers' multiples, discounted for being private and smaller.

### 3. Market reality
At seed, valuation is mostly supply and demand: how many funds want in, how strong the team looks, and how much the founders need. Typical early rounds price to sell 15–25%, so the valuation often follows from "how much money do we need for 18–24 months?"

### Why headline valuations mislead
Valuations can include preference terms that protect investors, so a "₹10,000 crore valuation" is not the price every share would fetch. Watch for down rounds, flat rounds and structured terms when markets cool.`,
    terms: ["VC method", "DCF", "EV/Revenue", "comparables", "flat round", "structured round"],
    tryThis: "Using the VC method: exit ₹5,000 cr, target 20x, 50% future dilution. What post-money can the investor accept today? (₹125 cr.)",
    quiz: { q: "Expected exit ₹2,000 cr; target 10x; no further dilution. Maximum post-money today?", options: ["₹20 cr", "₹200 cr", "₹2,000 cr", "₹20,000 cr"], answer: 1, explain: "2,000 ÷ 10 = ₹200 crore post-money." },
    further: ["venture capital method valuation example", "SaaS revenue multiples growth", "Aswath Damodaran valuing young companies"],
  },

  // ───────────── TRACK: INDIA ─────────────
  {
    id: "india-landscape", track: "india", title: "Who's who in Indian venture capital", mins: 6,
    summary: "A mental map of the funds, angels and platforms you'll keep seeing in deal news.",
    body: `### Early-stage specialists (seed to Series A)
Blume Ventures, Kalaari Capital, Stellaris Venture Partners, Chiratae Ventures, Prime Venture Partners, Fireside Ventures (consumer brands), Info Edge Ventures, Antler India, and many newer micro-VCs.

### Multi-stage firms (seed through growth)
Peak XV Partners (formerly Sequoia Capital India & Southeast Asia, renamed after the 2023 split), Accel, Elevation Capital, Lightspeed India, Nexus Venture Partners, Z47 (formerly Matrix Partners India), Bessemer Venture Partners India, General Catalyst (which merged with India's Venture Highway in 2024).

### Growth and late-stage capital
A91 Partners, global growth funds and crossover investors, sovereign funds, and PE firms that also write late-stage startup cheques. Prosus and SoftBank have been large investors in Indian consumer internet.

### Angels and platforms
Indian Angel Network, LetsVenture, AngelList India, and "super-angels" who are often successful founders. Many startups raise seed rounds with dozens of angels alongside a lead fund.

### Accelerators
Y Combinator (many Indian startups each batch), Peak XV's Surge, Antler, and corporate and government-backed programmes.

### How to use this map
When you read a deal, ask: Is this fund known for this stage? Is it a new relationship or an existing investor following on? Did a top-tier fund lead, or just participate? Leads usually set the price and take a board seat; followers don't.`,
    terms: ["lead investor", "follow-on", "micro-VC", "crossover fund", "super-angel"],
    tryThis: "Pick three funds above, visit their websites, and note their stage focus and two portfolio companies each.",
    quiz: { q: "Peak XV Partners was formerly known as…", options: ["Matrix Partners India", "Sequoia Capital India & Southeast Asia", "Accel India", "SAIF Partners"], answer: 1, explain: "Sequoia's India & SEA business became Peak XV in 2023. Matrix Partners India became Z47." },
    further: ["top venture capital firms India", "Peak XV Surge accelerator", "Z47 Matrix Partners India rebrand"],
  },
  {
    id: "aif-sebi", track: "india", title: "AIFs and SEBI: how Indian funds are set up", mins: 6,
    summary: "Most Indian VC and PE funds are SEBI-registered Alternative Investment Funds. Here's what that means.",
    body: `In India, pooled private funds are regulated by **SEBI** under the **Alternative Investment Funds (AIF) Regulations, 2012**. Most domestic VC and PE funds are registered AIFs.

### The three categories
- **Category I:** funds with positive spillovers the government wants to encourage: venture capital funds (including angel funds), SME funds, social impact funds and infrastructure funds.
- **Category II:** everything that isn't I or III and doesn't use leverage beyond day-to-day needs: most private equity funds and private debt funds.
- **Category III:** funds using complex trading strategies and leverage, similar to hedge funds.

### Structure
An AIF is usually set up as a **trust**, with a **sponsor** and an **investment manager** (the GP equivalent). Investors sign **contribution agreements** (commitments) and money is drawn down over time.

### Minimums
The minimum commitment is generally ₹1 crore per investor (lower for angel funds, and with exceptions for accredited investors and employees of the manager). SEBI updates these rules periodically, so always check the current circular.

### Offshore money
Many Indian-focused funds also raise money from global LPs through offshore vehicles, or through funds set up in **GIFT City** (India's international financial services centre), which aims to make it easier for global capital to invest into India.

### Why it matters to you
When a fund announces a "first close" or "final close", it is usually raising commitments into a SEBI-registered AIF or an offshore vehicle. Regulatory changes from SEBI on AIFs (disclosures, valuation norms, investor protections) directly affect how funds operate.`,
    terms: ["AIF", "Category I/II/III", "sponsor", "first close", "final close", "GIFT City", "accredited investor"],
    tryThis: "Search SEBI's site for the latest circular on AIFs and summarise in two lines what changed.",
    quiz: { q: "A domestic venture capital fund in India is usually registered as…", options: ["A Category III AIF", "A Category I AIF", "A mutual fund", "An NBFC"], answer: 1, explain: "Venture capital funds (including angel funds) fall under Category I AIFs." },
    further: ["SEBI AIF regulations categories", "GIFT City fund setup IFSCA", "AIF minimum investment India"],
  },
  {
    id: "flipping", track: "india", title: "Flipping and reverse flipping", mins: 5,
    summary: "Why Indian startups once moved their parent company abroad, and why many are now moving it back.",
    body: `### The flip
In the 2010s many Indian startups set up their **holding company abroad** (usually the US or Singapore) with the Indian company as a subsidiary. Reasons: foreign VCs found it easier to invest in familiar legal systems, US-style ESOPs and SAFEs were simpler, and a US listing seemed the likely exit.

### The reverse flip
Since around 2022, many have moved their domicile back to India. Examples reported in the press include PhonePe, Groww, Zepto, Razorpay and Pine Labs. The main reasons:
- **Listing in India.** Indian public markets have welcomed tech IPOs and often value them richly, with strong domestic retail and mutual fund demand.
- **Home investor base and brand** among Indian customers and regulators.
- **Regulatory comfort** for businesses in regulated sectors like payments and lending.

### The cost
Moving back can trigger a large **tax bill**, because shareholders may be treated as selling shares abroad. PhonePe's move reportedly cost its investors a significant amount in Indian taxes. Some companies use mergers that can be tax-neutral under specific rules.

### Why it matters
Reverse flips are usually the first visible step toward an Indian IPO. When you read one, expect IPO preparation news within 12–24 months.`,
    terms: ["domicile", "flip", "reverse flip", "holding company", "subsidiary"],
    tryThis: "Find one startup that reverse-flipped and check whether it has since filed a DRHP.",
    quiz: { q: "The most common reason for a reverse flip to India is…", options: ["Lower salaries", "Preparing to list on Indian stock exchanges", "Avoiding all taxes", "Getting a US visa"], answer: 1, explain: "A domestic listing is the main driver; the move often carries a tax cost." },
    further: ["reverse flipping Indian startups explained", "PhonePe domicile shift India tax", "startup redomicile India IPO"],
  },
  {
    id: "india-ipos", track: "india", title: "New-age IPOs in India: from DRHP to listing", mins: 7,
    summary: "The path from filing papers with SEBI to the listing-day pop (or drop), and what each step signals.",
    body: `### The sequence
1. **DRHP (Draft Red Herring Prospectus)** filed with SEBI. It discloses the business, financials, risks, shareholders and the planned issue. Startups increasingly use a **confidential pre-filing** route first.
2. **SEBI observations.** The regulator comments; the company updates its document.
3. **RHP (Red Herring Prospectus)** filed with the price band and dates.
4. **Anchor investors** (large institutions) commit a day before the issue opens. Their shares are locked in (half for 30 days, half for 90 days).
5. **Subscription period** (usually 3 days) for QIBs (institutions), NIIs (high-net-worth individuals) and retail investors.
6. **Allotment and listing** a few days after the issue closes.

### Fresh issue vs OFS
- **Fresh issue:** new shares; money goes to the company.
- **OFS (offer for sale):** existing shareholders (often VCs) sell; money goes to them, not the company. A large OFS means early investors are taking money off the table. That is how VC funds turn paper value into DPI.

### Loss-making companies
Companies without a profit track record list under a route that requires at least 75% of the issue to go to QIBs, with a smaller retail portion (up to 10%). Most new-age tech IPOs used this route.

### Lock-ins
Pre-IPO shareholders face lock-ins (generally six months after listing for most pre-IPO investors). When lock-ins end, share prices sometimes fall as early holders sell.

### What insiders read in a DRHP
Shareholding table (who owns what and at what cost), use of proceeds, related-party transactions, risk factors, and unit economics hidden in the financial notes.`,
    terms: ["DRHP", "RHP", "anchor investors", "QIB", "NII", "fresh issue", "OFS", "lock-in", "price band"],
    tryThis: "Open any recent startup DRHP on SEBI's website and find the cost at which the largest VC investor bought its shares.",
    quiz: { q: "In an IPO, money from the Offer for Sale goes to…", options: ["The company", "Selling shareholders", "SEBI", "Anchor investors"], answer: 1, explain: "OFS proceeds go to the existing shareholders selling their stake; only the fresh issue funds the company." },
    further: ["DRHP explained India IPO", "SEBI Regulation 6(2) IPO QIB 75%", "IPO lock-in period pre-IPO shareholders India"],
  },
  {
    id: "india-capital", track: "india", title: "Where Indian startup money comes from", mins: 5,
    summary: "Follow the money upstream: the LPs behind Indian funds, and why domestic capital matters more every year.",
    body: `Behind every Indian VC fund is a set of LPs. Historically most came from abroad; that is slowly changing.

### Foreign LPs
US university endowments, pension funds, sovereign wealth funds and global fund-of-funds have supplied most of India's venture capital for two decades. Their appetite depends on global interest rates and on DPI from earlier Indian funds.

### Domestic LPs (growing)
- **Government fund-of-funds:** SIDBI manages the Fund of Funds for Startups under the Startup India programme, investing in SEBI-registered AIFs, which then invest in startups. Budgets have announced additional fund-of-funds support since.
- **Family offices and HNIs:** India's business families and newly wealthy founders are now major LPs and direct investors.
- **Banks, insurers and corporates** in limited amounts, subject to their regulators' rules.

### Why it matters
- More domestic LPs means Indian funds are less dependent on global cycles.
- Rupee-denominated funds avoid currency risk that hurts dollar returns when the rupee weakens.
- LP pressure for DPI shapes GP behaviour: more secondary sales, more push toward IPOs.

### Insider tip
When a fund announces a close, look at who the anchor LPs are. A government fund-of-funds, a top global endowment or a well-known family office each say something different about the fund.`,
    terms: ["fund of funds", "SIDBI FFS", "family office", "currency risk", "anchor LP"],
    tryThis: "Find the most recent 'fund close' announcement in the VC Desk and check whether its LPs are named.",
    quiz: { q: "Why do rupee-denominated funds appeal to some LPs?", options: ["They pay no fees", "They avoid currency losses when the rupee weakens against the dollar", "They are guaranteed by RBI", "They can't lose money"], answer: 1, explain: "Dollar funds investing in rupee assets lose returns when the rupee depreciates; rupee funds don't face that for INR investors." },
    further: ["SIDBI Fund of Funds for Startups", "family offices LP India venture", "India venture capital domestic LPs report"],
  },

  // ───────────── TRACK: PE & EXITS ─────────────
  {
    id: "pe-vs-vc", track: "pe", title: "Private equity vs venture capital", mins: 5,
    summary: "Same 2-and-20 model, very different game: control, cash flows and leverage instead of moonshots.",
    body: `| | Venture capital | Private equity (buyout) |
|---|---|---|
| Companies | Young, high-growth, often loss-making | Mature, profitable, steady cash flows |
| Stake | Minority (10–25%) | Often majority or full control |
| Leverage | Rarely | Often uses significant debt |
| Return driver | A few huge winners (power law) | Most deals return 2–3x |
| Risk per deal | High; many fail | Lower; failures are rarer |
| Value creation | Growth, product, hiring help | Operations, pricing, M&A, cost, governance |

### India's version
India's PE market has more **minority growth** deals than classic Western buyouts, because founders and promoter families often don't sell control. Control buyouts are rising, though, as founders retire, conglomerates sell non-core units, and funds gain experience.

### Where they overlap
Growth equity sits between the two: minority stakes in fast-growing but proven companies, with little or no debt. Many late-stage Indian startup rounds are really growth equity deals.

### Careers
VC rewards pattern recognition, networks and judgement about people and markets. PE rewards financial modelling, operations and deal execution. Both value people who can find great deals.`,
    terms: ["buyout", "growth equity", "control deal", "minority stake", "promoter"],
    tryThis: "Classify three deals from today's news as VC, growth equity or buyout. What gave it away?",
    quiz: { q: "Which feature is typical of PE buyouts but rare in VC?", options: ["Minority stakes", "Investing in loss-making companies", "Significant use of debt (leverage)", "Expecting most deals to fail"], answer: 2, explain: "Buyouts commonly use debt to fund part of the purchase; VC rarely does." },
    further: ["private equity vs venture capital differences", "growth equity explained", "Bain India private equity report"],
  },
  {
    id: "lbo", track: "pe", title: "An LBO in ten minutes", mins: 8,
    summary: "Buy with borrowed money, improve the business, pay down debt, sell. A worked example with the numbers.",
    body: `A **leveraged buyout (LBO)** is buying a company using a mix of the fund's equity and a large amount of debt, which the company itself repays from its cash flows.

### Worked example
- Company EBITDA (a proxy for operating cash profit): **₹100 crore**.
- Purchase price: 10x EBITDA = **₹1,000 crore** enterprise value.
- Funded with **₹500 crore debt** and **₹500 crore equity** from the PE fund.

Five years later:
- EBITDA has grown to **₹150 crore**.
- The company has used its cash to repay debt down to **₹300 crore**.
- The fund sells at the same 10x multiple: enterprise value **₹1,500 crore**.
- Equity value = ₹1,500 − ₹300 debt = **₹1,200 crore**.

Return: ₹1,200 ÷ ₹500 = **2.4x MOIC**, which is about **19% IRR** over five years.

### Where the ₹700 crore gain came from
- **EBITDA growth:** +₹50 crore × 10x = ₹500 crore.
- **Debt paydown (deleveraging):** ₹500 → ₹300 crore = ₹200 crore.
- **Multiple expansion:** none here (bought and sold at 10x). If they had sold at 11x, that would add another ₹150 crore.

### Why leverage boosts returns
Without debt, the fund would pay ₹1,000 crore and sell for ₹1,500 crore: just 1.5x. Debt magnifies returns on equity, but also magnifies losses if things go wrong.

### Key terms
MOIC (multiple on invested capital), IRR, EBITDA, enterprise value, net debt, leverage (debt ÷ EBITDA), covenants (conditions lenders impose).`,
    terms: ["LBO", "EBITDA", "enterprise value", "MOIC", "IRR", "deleveraging", "multiple expansion", "covenants"],
    tryThis: "Redo the example with exit at 12x instead of 10x. New equity value = ₹1,800 − ₹300 = ₹1,500 crore → 3.0x MOIC.",
    quiz: { q: "In the example, if there were NO debt (₹1,000 cr equity), what would the 5-year MOIC be at the same ₹1,500 cr exit?", options: ["1.5x", "2.4x", "3.0x", "1.2x"], answer: 0, explain: "₹1,500 ÷ ₹1,000 = 1.5x. Leverage is what turned it into 2.4x." },
    further: ["LBO model simple example", "PE value creation bridge EBITDA growth multiple expansion deleveraging", "MOIC vs IRR"],
  },
  {
    id: "exits", track: "pe", title: "How investors get their money back: exits", mins: 6,
    summary: "IPOs, acquisitions, secondary sales and buybacks: the four doors out, and what each signals.",
    body: `An investment only creates real returns (DPI) when it is sold. The main routes:

### 1. IPO
The company lists on a stock exchange. Investors may sell some shares in the IPO (through an OFS) and the rest after the lock-in ends. India's active IPO market has made this the headline exit route for Indian startups in recent years.

### 2. Strategic acquisition (M&A)
A larger company buys the startup. Payment can be cash, shares, or a mix, sometimes with an **earn-out** (part of the price paid later if targets are hit). An **acqui-hire** is when the buyer mainly wants the team; investors often get little.

### 3. Secondary sale
An investor sells its shares to another investor (often a later-stage fund or a secondaries fund) without the company going public. Common in India when early funds need DPI before an IPO.

### 4. Buyback
The company buys back shares from investors or employees, usually when it has spare cash. ESOP buybacks are popular in India as a way to reward employees.

### Reading exit news
- "Partial exit at 8x" means the fund sold part of its stake at eight times its cost.
- Exits at a lower value than the last funding round may still be profitable for early investors and painful for late ones.
- Fund managers highlight exits when raising their next fund.`,
    terms: ["exit", "OFS", "earn-out", "acqui-hire", "secondary sale", "buyback", "partial exit"],
    tryThis: "Track every exit or buyback in the VC Desk this week. Which route is most common?",
    quiz: { q: "A Series A investor sells its stake to a growth fund during the startup's Series D. This is…", options: ["An IPO", "A secondary sale", "A buyback", "An acqui-hire"], answer: 1, explain: "Selling existing shares to another investor without the company raising money is a secondary transaction." },
    further: ["venture capital exits India report", "ESOP buyback Indian startups", "secondary transactions venture capital"],
  },
  {
    id: "secondaries", track: "pe", title: "Secondaries and continuation funds", mins: 5,
    summary: "The fast-growing market that lets investors sell before an exit, and why GPs sometimes sell to themselves.",
    body: `### LP-led secondaries
An LP sells its **stake in a fund** to another investor, usually at a discount to the fund's reported value, to get liquidity early. Buyers are specialist secondaries funds.

### GP-led secondaries
The GP arranges a sale of one or more portfolio companies from an old fund into a **new vehicle** it also manages, called a **continuation fund**. Existing LPs can cash out or roll over into the new vehicle; new investors bring fresh money. This lets GPs keep owning a great company longer than the old fund's life allows.

### Direct secondaries
Buying startup shares directly from earlier investors, founders or employees. Common in Indian late-stage rounds, where a new round often has a "primary" part (new money to the company) and a "secondary" part (early backers selling).

### Why the market is growing
When IPOs and acquisitions slow, LPs still need cash back, so secondaries fill the gap. Pricing is a negotiation over how much the real value is below the reported value.

### Watch for
Conflicts of interest in GP-led deals (the GP is on both sides), and the discount at which stakes trade, which signals whether reported valuations are realistic.`,
    terms: ["LP-led secondary", "GP-led secondary", "continuation fund", "primary vs secondary", "NAV discount"],
    tryThis: "When a funding headline mentions a 'secondary component', note who sold and at what price versus the primary.",
    quiz: { q: "In a continuation fund deal, the GP…", options: ["Shuts down the old fund early", "Moves portfolio companies into a new vehicle it also manages", "Sells the management company", "Lists the fund on an exchange"], answer: 1, explain: "Continuation vehicles let a GP keep holding assets beyond the original fund's life, with LPs choosing to sell or roll." },
    further: ["continuation fund GP-led secondary explained", "LP secondaries discount NAV", "secondary transactions Indian startups"],
  },

  // ───────────── TRACK: INTERN PLAYBOOK ─────────────
  {
    id: "sourcing", track: "intern", title: "Sourcing: how deals find a fund (and how you can help)", mins: 6,
    summary: "Most great deals come through networks. Interns add value by finding companies before they're on everyone's radar.",
    body: `**Sourcing** means finding companies to invest in. It is the top of the funnel: a fund may see 2,000+ companies a year to make 15–25 investments.

### Where deals come from
- **Warm introductions** from founders, angels, other VCs and lawyers. These convert best.
- **Inbound:** founders emailing or applying through the website.
- **Outbound:** the fund finds and contacts companies first. This is where interns help most.

### Outbound techniques that work
- **Thesis-led search:** pick a theme (say "AI for Indian SMB accounting") and list every company in it.
- **Signals:** hiring spikes on LinkedIn, app-store rank changes, GitHub stars, product launches, new filings with the Registrar of Companies.
- **Communities:** founder communities, hackathons, accelerator demo days, X and LinkedIn posts by builders.
- **Talent tracking:** senior employees leaving well-known startups often start companies.

### Your output
A short, scannable list: company, one-line description, founders and background, stage and funding so far, why it's interesting, and a suggested next step. Quality beats volume: ten well-researched companies beat a hundred names.

### Etiquette
Never promise founders anything on the fund's behalf. Be quick, polite and clear about your role.`,
    terms: ["sourcing", "deal flow", "inbound", "outbound", "warm intro", "thesis-led"],
    tryThis: "Pick one theme from today's news and list five Indian startups in it with one line each.",
    quiz: { q: "Which sourcing channel typically converts best for VCs?", options: ["Cold inbound emails", "Warm introductions from trusted people", "Conference booths", "Paid lead lists"], answer: 1, explain: "Trusted referrals pre-filter quality, so they convert at much higher rates." },
    further: ["VC sourcing strategies outbound", "how to source deals as a VC analyst", "startup signals hiring data sourcing"],
  },
  {
    id: "market-map", track: "intern", title: "Building a market map", mins: 6,
    summary: "One page that shows every player in a space, grouped so the opportunity jumps out.",
    body: `A **market map** is a visual landscape of companies in a sector, grouped into categories. It is one of the most common intern deliverables because it helps partners form a view fast.

### Steps
1. **Define the boundary.** "Indian B2B payments" is clearer than "fintech".
2. **Choose the axes or buckets.** By customer (SMB, mid-market, enterprise), by product layer (infrastructure, application), or by business model.
3. **Collect companies.** Tracxn, Crunchbase, news, LinkedIn, app stores, accelerator lists, competitors' "alternatives" pages.
4. **Add key facts:** stage, total funding, notable investors, founding year.
5. **Mark the fund's portfolio** and any competitors of portfolio companies (conflicts matter).
6. **Write the "so what".** Three bullets: where is it crowded, where is it empty, where could a winner emerge?

### What makes it good
- MECE buckets (mutually exclusive, collectively exhaustive) — a consulting habit that helps here.
- Logos or names that fit on one slide; details in an appendix sheet.
- A clear point of view, not just a directory.

### Bonus
Turn the map into a **thesis**: "We believe the next big company in this space will be X because Y." Partners remember theses, not lists.`,
    terms: ["market map", "landscape", "MECE", "thesis", "white space"],
    tryThis: "Make a quick market map of Indian quick-commerce and dark-store players in 3 buckets. Write a 3-bullet 'so what'.",
    quiz: { q: "The most valuable part of a market map is usually…", options: ["The number of logos", "The design colours", "The 'so what': where the opportunity is", "Alphabetical ordering"], answer: 2, explain: "A clear point of view on where value will be created makes a map useful for investment decisions." },
    further: ["how to build a market map venture capital", "CB Insights market map examples", "MECE framework"],
  },
  {
    id: "memo", track: "intern", title: "Writing an investment memo", mins: 7,
    summary: "The document that gets a deal through the partner meeting. A template you can reuse.",
    body: `An **investment memo** argues for (or against) an investment and is read by partners before deciding.

### A reusable structure
1. **Summary:** company, round, amount, valuation, our proposed cheque and ownership, recommendation in one paragraph.
2. **Company and product:** what it does, for whom, how it makes money.
3. **Team:** founders' backgrounds and why they can win.
4. **Market:** size (bottom-up), growth, why now.
5. **Traction:** revenue, growth, retention, unit economics, with charts.
6. **Competition:** who else, and the company's edge.
7. **Business model and economics:** pricing, margins, path to profitability.
8. **Investment thesis:** 3–5 things that must be true, each with evidence.
9. **Key risks and mitigants:** honest, specific.
10. **Valuation and returns:** entry price, exit scenarios (bear/base/bull), what the fund needs.
11. **Diligence done and open questions.**

### Writing tips
- Lead with the answer. Partners skim.
- Separate facts from opinions. Label assumptions.
- A great risks section builds more credibility than a glowing thesis.
- Keep it to 4–6 pages plus appendix.

Your consulting habits (executive summary first, structured logic, clear recommendation) transfer directly.`,
    terms: ["investment memo", "IC (investment committee)", "thesis", "bear/base/bull case", "diligence"],
    tryThis: "Turn today's Deal of the Day into a one-page mini memo using sections 1, 8 and 9.",
    quiz: { q: "What should come first in an investment memo?", options: ["The company history", "A summary with the recommendation", "The appendix", "Competitor logos"], answer: 1, explain: "Partners read the summary first; lead with the deal terms and the recommendation." },
    further: ["venture capital investment memo template", "public investment memos Bessemer", "investment committee memo examples"],
  },
  {
    id: "first-call", track: "intern", title: "The first founder call: questions that matter", mins: 5,
    summary: "A 30-minute call where you learn the most by asking less and listening for specifics.",
    body: `### Before the call (15 minutes of prep)
Read the website, the founders' LinkedIn, any press, and the app or product if you can use it. Prepare five questions; don't ask anything Google can answer.

### Questions that reveal a lot
- "Walk me through how a typical customer finds you, buys, and uses the product." (Reveals go-to-market and real usage.)
- "What do customers do today if they don't use you?" (Reveals the real competition.)
- "What's working better than you expected, and what's worse?" (Reveals honesty and learning speed.)
- "Which metric do you look at every Monday?" (Reveals what the founder thinks drives the business.)
- "Why are you the team to build this?" (Founder-market fit.)
- "What would you do with this round, and what milestones will it get you to?" (Capital efficiency and plan.)
- "What has to be true for this to be a ₹10,000 crore company?" (Ambition and logic.)

### During the call
Listen for numbers, names and examples instead of adjectives. Note contradictions politely. Leave 5 minutes for their questions about the fund.

### After the call
Within the same day, write a short note: one-line summary, key facts, what impressed you, concerns, and a recommended next step (pass, keep warm, or take to a partner).`,
    terms: ["founder-market fit", "go-to-market", "milestones", "pass / keep warm"],
    tryThis: "Write five first-call questions for the startup in today's Deal of the Day.",
    quiz: { q: "Which answer signals the most from a founder?", options: ["'Our market is huge'", "'Customers love us'", "'Our 3-month retention went from 22% to 35% after we changed onboarding'", "'We have no competition'"], answer: 2, explain: "Specific numbers and causes show real understanding; adjectives and 'no competition' are red flags." },
    further: ["questions VCs ask founders first meeting", "founder interview questions venture capital", "YC how to evaluate startup ideas"],
  },
  {
    id: "reading-deal-news", track: "intern", title: "Reading a funding headline like an insider", mins: 6,
    summary: "What 'raises ₹200 crore' leaves out, and the five questions to ask of every deal story.",
    body: `### Five questions for every funding headline
1. **Equity or debt?** "Raises ₹200 crore" may include venture debt. Look for words like "debt", "structured" or specific lenders.
2. **Primary or secondary?** Part of the round may be early investors selling, not new money for the company.
3. **Who led?** The lead usually sets the price. "Participation from" means followers.
4. **Up, flat or down?** Compare with the last valuation. Silence on valuation often means it isn't flattering.
5. **Why now?** Long gaps since the last round, bridge rounds and insider-only rounds tell a story.

### Where Indian deal details come from
Many exact figures in Indian funding news come from **Registrar of Companies (RoC) filings** with the Ministry of Corporate Affairs: share allotments, valuations and investor names. Outlets like Entrackr and Inc42, and data platforms like Tracxn, report these, sometimes before the company announces anything.

### Spin to watch for
- "Valuation of up to…" or "in talks to raise" means it hasn't closed.
- "Largest-ever round in the segment" with no amount.
- GMV presented as revenue.
- "Profitable" meaning only one quarter, or EBITDA-positive excluding ESOP costs.

### Make it a habit
For each big deal, write one line: "This round is mainly about ___, and it tells me ___ about the market." In a month you'll see patterns most people miss.`,
    terms: ["venture debt", "primary vs secondary", "lead investor", "RoC filings", "flat round", "insider round"],
    tryThis: "Apply the five questions to the top three deals in today's VC Desk.",
    quiz: { q: "A headline says a startup is 'in talks to raise at a valuation of up to $1 billion'. What do you know?", options: ["It is now a unicorn", "The round has closed", "Nothing is final; terms may change", "It is profitable"], answer: 2, explain: "'In talks' and 'up to' mean the round hasn't closed and the valuation is a ceiling, not a fact." },
    further: ["how to read startup funding announcements", "RoC filings startup funding India", "venture debt vs equity India"],
  },
  {
    id: "remote-intern", track: "intern", title: "Being a great remote VC intern", mins: 5,
    summary: "A weekly rhythm that makes you visible and useful when nobody sees you at a desk.",
    body: `### Weekly rhythm
- **Monday:** read the week's deal flow (use this portal's VC Desk). Send your manager a 5-line note: notable deals, a pattern, one company worth a look.
- **Tuesday–Wednesday:** deep work on your main project (market map, memo, diligence).
- **Thursday:** sourcing: 5–10 new companies in your thesis area, with one-liners.
- **Friday:** a short written update: what you did, what you learned, what's next, where you need input.

### Habits that stand out
- **Over-communicate in writing.** Short, structured updates beat long calls.
- **Show your work.** Share a link to a clean sheet or doc, not a vague "done".
- **Bring a point of view.** "Here's what I think and why" beats "here's what I found".
- **Be fast on small asks.** Speed builds trust.
- **Know the portfolio.** Read about every portfolio company; flag news about them.

### Tools to be fluent in
Google Sheets or Excel, a deck tool, Notion or Docs, LinkedIn search, Tracxn or Crunchbase if the fund provides it, and AI assistants for first drafts (always verify facts).

### The goal
By the end, partners should think of you as someone who finds interesting companies and thinks clearly about them. That is exactly what VCs hire for.`,
    terms: ["deal flow note", "thesis area", "portfolio monitoring"],
    tryThis: "Draft this week's 5-line deal-flow note using the VC Desk. Keep it.",
    quiz: { q: "What makes a remote intern's update most useful?", options: ["Length", "A clear point of view with evidence", "Sending it daily at midnight", "Including every link you read"], answer: 1, explain: "Partners value judgement: what matters and why." },
    further: ["how to be a great VC intern", "venture capital analyst weekly routine", "portfolio monitoring venture capital"],
  },
];
