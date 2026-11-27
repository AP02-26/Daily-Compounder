# The Daily Compounder

A personal daily portal: Indian business, startups & VC, high-impact policy, global news, live markets, a VC/PE Academy and an AI-builder Skill Lab. It refreshes itself four times a day and has an **Update now** button for anything published since.

**How it runs (no Claude tokens needed):**
- **GitHub Actions** (free) runs `scripts/build-edition.mjs` at ~06:40, 12:45, 18:50 and 22:55 IST. It reads ~50 news feeds, removes duplicates, ranks stories, and asks **Gemini** (free API tier) to pick the important ones and rewrite them in plain English. The result is saved to `public/data/edition.json`.
- **Vercel** (free) hosts the site and two small functions: `/api/latest` (powers *Update now*) and `/api/markets` (ticker).
- If Gemini is unavailable, the site still works and shows rule-ranked headlines.

---

## Setup (about 20 minutes, once)

### 1. Get a free Gemini API key (3 min)
1. Go to **https://aistudio.google.com** and sign in with your Google account.
2. Click **Get API key → Create API key**. Copy it (starts with `AIza…`).

Note: your Gemini Pro subscription is for the Gemini app. The API key is separate and has its own free tier, which is plenty for this site.

### 2. Put the code on GitHub (5 min)
1. Go to **https://github.com/new**. Name it `daily-compounder`, choose **Private**, click **Create repository**.
2. On the next page click **uploading an existing file**.
3. Unzip `daily-compounder.zip` on your computer, open the folder, select **everything inside it** and drag it into the GitHub page. Click **Commit changes**.
   - **Mac users:** the `.github` folder is hidden. In Finder press **Cmd + Shift + .** to show hidden files, then select all again. Check on GitHub that a `.github/workflows/edition.yml` file exists after uploading.
   - If it's missing: on GitHub click **Add file → Create new file**, type `.github/workflows/edition.yml` as the name, paste the contents of that file from the zip, and commit.

### 3. Add the key to GitHub (2 min)
1. In your repository: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `GEMINI_API_KEY`. Value: your key. Click **Add secret**.

### 4. Build the first edition (3 min)
1. Open the **Actions** tab. If asked, click **I understand my workflows, go ahead and enable them**.
2. Click **Build daily edition** on the left → **Run workflow** → **Run workflow**.
3. Wait 1–2 minutes for a green tick. A new commit called "Edition …" appears in the repository.

If it fails with a permissions error on `git push`: **Settings → Actions → General → Workflow permissions → Read and write permissions → Save**, then run it again.

### 5. Publish on Vercel (5 min)
1. Go to **https://vercel.com/new** and sign in with GitHub.
2. Under **Import Git Repository**, choose `daily-compounder` (click *Adjust GitHub App Permissions* if it isn't listed, and allow that repository).
3. **Framework Preset: Other.** Leave Build and Output settings as they are (the included `vercel.json` handles them).
4. Open **Environment Variables** and add `GEMINI_API_KEY` with your key. This powers the AI rewrite in *Update now*.
5. Click **Deploy**. In about a minute you get a link like `daily-compounder-xxxx.vercel.app`.
6. Optional: **Project → Settings → Domains** to pick a nicer `something.vercel.app` name.

Every time the GitHub job saves a new edition, Vercel republishes the site automatically.

### 6. Use it
- On your phone, open the link and choose **Add to Home Screen**. It opens like an app.
- Share the link with family. Everyone's saved stories and progress stay in their own browser.
- **Settings (gear icon):** your name for the greeting, your Skill Lab level, auto-update.

---

## Troubleshooting
- **Open `/#/status` on your site.** It lists every feed and whether it worked, plus any AI errors.
- **A feed keeps failing:** edit `config/feeds.mjs` on GitHub (pencil icon) and replace or delete that line.
- **"AI summaries weren't available":** check the `GEMINI_API_KEY` secret. If Google renamed models, add a repository **variable** (Settings → Secrets and variables → Actions → Variables) named `GEMINI_MODEL` with a model ID from AI Studio, such as a current "flash" model, and add the same variable in Vercel.
- **Ticker shows "unavailable":** the free market-data source occasionally blocks cloud servers; the cards fall back to the morning snapshot.
- **Scheduled runs are a few minutes late:** normal for GitHub's free scheduler.

## Customise
| What | Where |
|---|---|
| News sources | `config/feeds.mjs` |
| Edition times | `.github/workflows/edition.yml` (cron lines are in UTC; IST = UTC + 5:30) |
| How the AI selects and writes | `lib/gemini.mjs` (prompts) and `lib/edition.mjs` (how many stories per section) |
| Junk filters and ranking | `lib/rank.mjs` |
| Academy lessons | `public/content/academy.js` |
| Skill Lab guides | `public/content/skills.js` |
| Glossary | `public/content/glossary.js` |
| Look and feel | `public/styles.css` |

## Run locally (optional, needs Node 20+)
```
npm install
GEMINI_API_KEY=your_key npm run build:edition   # writes public/data/edition.json
npx serve public                               # open http://localhost:3000
npm run test:offline                           # pipeline test without internet
```

## Notes
- Summaries are AI-written from headlines and short feed excerpts only, in its own words, and always link to the original. Read the original before relying on details.
- Market data is delayed and indicative. Nothing here is investment advice.
