// Builds today's edition and writes it into public/data so Vercel serves it.
// Run by GitHub Actions on a schedule (see .github/workflows/edition.yml) or locally: npm run build:edition
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { buildEdition } from "../lib/edition.mjs";

const DATA = new URL("../public/data/", import.meta.url);
const ARCH = new URL("archive/", DATA);

function istDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

const edition = await buildEdition();
const total = edition.business.length + edition.vc.stories.length + edition.policy.length;

if (total < 5) {
  console.error("Too few stories fetched; keeping the previous edition. Notes:", edition.notes);
  process.exit(0);
}

await mkdir(ARCH, { recursive: true });
const json = JSON.stringify(edition, null, 1);
await writeFile(new URL("edition.json", DATA), json);
const day = istDate(new Date(edition.generatedAt));
await writeFile(new URL(`${day}.json`, ARCH), json);

let index = [];
try { index = JSON.parse(await readFile(new URL("index.json", ARCH), "utf8")); } catch {}
index = [day, ...index.filter((d) => d !== day)].slice(0, 365);
await writeFile(new URL("index.json", ARCH), JSON.stringify(index));

console.log(`Edition written for ${day}. AI: ${edition.aiUsed ? edition.model : "off"}. Notes: ${edition.notes.join(" | ") || "none"}`);
const bad = edition.feedHealth.filter((h) => !h.ok);
if (bad.length) console.log("Feeds that failed:", bad.map((b) => `${b.id} (${b.error})`).join(", "));
