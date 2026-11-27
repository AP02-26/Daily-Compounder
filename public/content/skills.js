// Skill Lab — the AI-builder ladder. Each level: outcome, step-by-step guide, build challenge, resources.
// Menu names in apps change from time to time; if a label differs, look for the closest match.

export const LEVELS = [
  {
    level: 1, title: "Power prompting", tagline: "Get expert-level output from any chat assistant",
    outcome: "You can get Claude, ChatGPT or Gemini to produce work you'd actually submit, on the first or second try.",
    steps: [
      { title: "Give context like you'd brief a smart analyst", md: `Most weak answers come from thin prompts. Include: **who it's for**, **the goal**, **what good looks like**, **constraints** (length, format, tone), and **the material** (paste or attach it).

Example: "I'm an MBA student preparing for a VC internship interview. Using the attached article, explain this deal's investment thesis in 5 bullets a partner would accept, then list 3 risks. Plain English, no hype."` },
      { title: "Show an example of the output you want", md: `One good example beats ten adjectives. Paste a sample memo, slide or post you like and say "match this structure and tone".` },
      { title: "Use Projects, Gems and NotebookLM for repeat work", md: `- **Claude Projects:** keep files and standing instructions together (for example a "Case prep" project with your frameworks).
- **Gemini Gems** (included with Gemini Pro): saved custom assistants with fixed instructions, such as "Deal explainer".
- **NotebookLM:** upload reports or PDFs and ask questions grounded only in them; great for long industry reports.` },
      { title: "Ask for critique, then iterate", md: `After a first draft, ask "What are the three weakest points in this? Fix them." Then ask for a shorter version. Iterating is faster than writing the perfect prompt.` },
      { title: "Verify facts", md: `AI can state wrong numbers confidently. For anything you'll submit or post, check numbers against the original source, or use a research mode that shows citations.` },
    ],
    challenge: "Create a Gemini Gem or Claude Project called 'Deal Explainer' that turns any funding article into: what happened, thesis, risks, 3 founder questions.",
    resources: [
      { label: "Anthropic prompt engineering overview", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { label: "Search: Gemini Gems guide", q: "Gemini Gems how to create custom Gem" },
      { label: "Search: NotebookLM guide", q: "NotebookLM how to use guide" },
    ],
  },
  {
    level: 2, title: "Skills", tagline: "Teach Claude a workflow once, reuse it forever",
    outcome: "You can package any repeat task (case notes, deal memos, your X post style) as a Skill that Claude loads automatically when relevant.",
    steps: [
      { title: "Understand what a Skill is", md: `A **Skill** is a folder containing a file called **SKILL.md**, plus optional extra files (templates, examples, scripts). The top of SKILL.md has a short header with a **name** and a **description**. Claude reads only the descriptions of your skills at first, and loads the full instructions when a task matches. So you can have many skills without cluttering every chat.

Good candidates: anything you do repeatedly and want done the same way every time.` },
      { title: "Pick your first skill", md: `Start small and personal. Ideas:
- **case-notes**: turns rough case-interview notes into your standard structure (framework, guesstimate, recommendation).
- **deal-memo**: turns a funding article into a one-page mini investment memo.
- **x-post-style**: writes posts in your tone (modest, conversational, one insight).` },
      { title: "Write SKILL.md", md: `Create a folder named after the skill (lowercase with hyphens) and a SKILL.md inside it:

\`\`\`
---
name: deal-memo
description: Turn a startup funding article or announcement into a one-page mini investment memo for a VC partner. Use when the user shares a funding/acquisition article and asks for analysis, a memo, or a thesis.
---

# Deal memo

## Output structure
1. Summary (2 lines): company, round, amount, lead investor.
2. What the company does (1 line).
3. Investment thesis: 3 bullets phrased as "Investors are betting that…".
4. Key risks: 3 bullets.
5. Questions for the founder: 3.
6. Verdict: one line — interesting / pass / need more data, and why.

## Rules
- Use only facts from the article; mark assumptions as assumptions.
- Plain English, no hype, under 300 words.

## Example
(Paste one memo you like here.)
\`\`\`

The **description is the most important line**: it tells Claude when to use the skill. Be specific about the trigger.` },
      { title: "Package and upload", md: `1. Zip the **folder** (so the zip contains \`deal-memo/SKILL.md\`, not SKILL.md loose at the top level).
2. In Claude, open **Settings → Capabilities → Skills** (on some versions, **Customize → Skills**) and upload the zip.
3. Make sure the skill is switched on.

**Shortcut:** you can also ask Claude in a chat: "Help me create a skill that…". It will interview you, write the files and give you a zip to upload.` },
      { title: "Test and refine", md: `Open a new chat and paste a funding article without mentioning the skill. Check that Claude uses it. If it doesn't, make the description more specific. If the output drifts, add a worked example inside SKILL.md. Change one thing at a time.` },
    ],
    challenge: "Build and upload 'deal-memo'. Run it on today's Deal of the Day and compare with the portal's version.",
    resources: [
      { label: "Claude Help: creating custom skills", url: "https://support.claude.com/en/articles/12512198-creating-custom-skills" },
      { label: "Claude Help: create a skill through conversation", url: "https://support.claude.com/en/articles/12599426-how-to-create-a-skill-with-claude-through-conversation" },
      { label: "Example skills on GitHub (anthropics/skills)", url: "https://github.com/anthropics/skills" },
    ],
  },
  {
    level: 3, title: "Connectors & MCP", tagline: "Plug Claude into your apps and data",
    outcome: "Claude can read and act on your Google Drive, Gmail, Notion or calendar, and you understand how to connect a custom tool through MCP.",
    steps: [
      { title: "Understand MCP in one minute", md: `**MCP (Model Context Protocol)** is an open standard, created by Anthropic, that lets AI apps talk to tools and data in a common way. An **MCP server** exposes "tools" (for example "search my notes", "create a calendar event"). A **connector** in Claude is simply a connection to an MCP server. ChatGPT and other apps now support MCP too, so what you learn transfers.` },
      { title: "Turn on ready-made connectors", md: `In Claude, open **Customize → Connectors** (or **Settings → Connectors**) and browse the directory: Google Drive, Gmail, Google Calendar, Notion and many more. Connect one, sign in with your account, and try: "Find my notes on the PwC application in Drive and summarise what's pending."

Tip: each connector asks for permission before taking actions. Read what it will do before approving.` },
      { title: "Add a custom connector by URL", md: `If a service offers a **remote MCP server URL**, you can add it as a **custom connector**: in Connectors choose **Add custom connector**, paste the URL, and sign in if asked. On the Free plan you can add one custom connector. Only add servers from sources you trust, because they can see what you send them.` },
      { title: "Build a tiny MCP server (optional, needs Python)", md: `With Python installed, the official SDK makes a working server in a few lines:

\`\`\`python
# pip install "mcp[cli]"
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("deal-notes")

@mcp.tool()
def irr(multiple: float, years: float) -> float:
    """Annualised return (IRR) for a money multiple over a number of years."""
    return round((multiple ** (1 / years) - 1) * 100, 2)

if __name__ == "__main__":
    mcp.run()
\`\`\`

Then add it to **Claude Desktop** (Settings → Developer → Edit Config) under \`mcpServers\`, pointing to \`python /path/to/server.py\`, and restart the app. Ask Claude "What's the IRR of 3x over 5 years?" and watch it call your tool. Local servers like this work in Claude Desktop; for claude.ai on the web you need a server hosted at a public URL.` },
      { title: "Combine with Skills", md: `Connectors give Claude **access**; Skills give it **know-how**. A "weekly deal-flow" skill that uses your Drive connector to save a formatted note each Monday is a great combined project.` },
    ],
    challenge: "Connect Google Drive or Notion, then ask Claude to build a 'VC reading log' document from this week's Insider reads.",
    resources: [
      { label: "Claude Help: custom connectors using remote MCP", url: "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp" },
      { label: "Claude Help: local MCP servers on Claude Desktop", url: "https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop" },
      { label: "Model Context Protocol official site", url: "https://modelcontextprotocol.io" },
    ],
  },
  {
    level: 4, title: "Agents on the web", tagline: "Let AI work inside your browser and other websites",
    outcome: "You can safely delegate multi-step web tasks (research, comparisons, form drafts) to a browser agent, and you know how AI gets embedded in websites.",
    steps: [
      { title: "Know the tools", md: `- **Claude in Chrome:** a browser extension that lets Claude read pages and click, type and navigate in your Chrome.
- **Gemini in Chrome:** Gemini built into Chrome (available with your Gemini Pro plan in supported regions); ask about the page or across tabs.
- **ChatGPT agent mode** and OpenAI's browser: ChatGPT completes multi-step tasks on websites.
Availability changes often; check each product's help page.` },
      { title: "Start with read-only tasks", md: `Good first tasks: "Open these five fund websites and build a table of their stage focus, cheque size and three recent investments." Or "Compare these three internship postings by requirements." Reading is low-risk.` },
      { title: "Use guardrails for actions", md: `- Watch the first runs.
- Never let an agent enter passwords, payment details or submit forms without you checking.
- Be careful on pages with user-written content: hidden text can try to instruct the agent ("prompt injection"). Good agents ask before acting; keep that on.` },
      { title: "Understand how AI gets embedded in websites", md: `When a website has an "Ask AI" box, it usually sends your question plus page content to a model API (Claude, GPT or Gemini) from its server and shows the answer. This portal does the same thing each morning: a scheduled job sends headlines to Gemini and saves the rewritten summaries. Level 5 shows you how to build one yourself.` },
    ],
    challenge: "Use a browser agent to build a comparison table of 8 Indian seed funds (stage, cheque size, sectors, 2 portfolio companies).",
    resources: [
      { label: "Search: Claude in Chrome help", q: "Claude in Chrome extension help" },
      { label: "Search: Gemini in Chrome", q: "Gemini in Chrome features help" },
      { label: "Search: ChatGPT agent help", q: "ChatGPT agent mode help OpenAI" },
    ],
  },
  {
    level: 5, title: "APIs & automation", tagline: "Build your own AI tools that run on a schedule",
    outcome: "You can call an AI model from code, schedule it to run daily, and put the result on a website: exactly how this portal works.",
    steps: [
      { title: "Learn just enough Python", md: `Variables, lists and dictionaries, loops, functions, reading and writing JSON, and installing packages with pip. That's enough to build useful automations. Google Colab lets you run Python in the browser without installing anything.` },
      { title: "Make your first API call", md: `Create a free API key in **Google AI Studio**, then:

\`\`\`python
# pip install google-genai
from google import genai
client = genai.Client(api_key="YOUR_KEY")
r = client.models.generate_content(
    model="gemini-flash-latest",
    contents="Explain liquidation preference in 3 bullet points for an MBA student.")
print(r.text)
\`\`\`

The Claude API works the same way with Anthropic's SDK. Never paste API keys into public code; store them as secrets.` },
      { title: "Ask for structured output (JSON)", md: `Real apps need data, not prose. Ask the model to reply in JSON with fixed fields (headline, summary, why) so your code can use it. This portal's morning job does exactly that.` },
      { title: "Schedule it", md: `**GitHub Actions** can run your script on a timetable for free. This portal's \`.github/workflows/edition.yml\` runs four times a day: fetch feeds → ask Gemini → save JSON → commit. Vercel then publishes the updated site automatically.` },
      { title: "Capstone: extend this portal", md: `Ideas, from easy to harder:
- Add a new feed in \`config/feeds.mjs\` (no AI changes needed).
- Add a "Sector of the week" section with its own prompt.
- Add an "Ask about today's news" box: a Vercel function that sends your question plus today's edition to Gemini.
- Email yourself a Monday digest using a free email API.` },
    ],
    challenge: "Add one new feed and one new section to this portal, push to GitHub, and see it live after the next run.",
    resources: [
      { label: "Google AI Studio (API keys)", url: "https://aistudio.google.com" },
      { label: "Gemini API docs", url: "https://ai.google.dev/gemini-api/docs" },
      { label: "Claude API docs", url: "https://docs.claude.com/en/api/overview" },
      { label: "GitHub Actions: scheduled workflows", q: "GitHub Actions schedule cron workflow docs" },
    ],
  },
];
