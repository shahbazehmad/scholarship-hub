// Nightly updater: removes expired listings and adds new ones from RSS feeds.
// Runs in GitHub Actions (see .github/workflows/nightly-update.yml). No dependencies.
import { readFile, writeFile } from "node:fs/promises";

const DATA_FILE = "data/scholarships.json";
const MAX_NEW_PER_RUN = 15;
const AUTO_NO_DEADLINE_DAYS = 45;
const KEYWORDS = /(scholarship|fellowship|grant|bursary|stipend|funded|funding)/i;

const today = new Date().toISOString().slice(0, 10);
const sources = JSON.parse(await readFile("scripts/sources.json", "utf8"));
const original = await readFile(DATA_FILE, "utf8");
let items = JSON.parse(original);

const daysBetween = (a, b) => (Date.parse(b) - Date.parse(a)) / 86400000;

function decode(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#039;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

const stripHtml = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function getTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function parseDeadline(text) {
  const patterns = [
    /deadline[^0-9A-Za-z]{0,10}([A-Za-z]{3,9}\.? \d{1,2}(?:st|nd|rd|th)?,? \d{4})/i,
    /deadline[^0-9A-Za-z]{0,10}(\d{1,2}(?:st|nd|rd|th)? [A-Za-z]{3,9},? \d{4})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (!m) continue;
    const cleaned = m[1].replace(/(\d)(st|nd|rd|th)/i, "$1");
    const t = Date.parse(`${cleaned} UTC`);
    if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  }
  return null;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

function infer(text) {
  const t = text.toLowerCase();
  const levels = [];
  if (/bachelor|undergraduate/.test(t)) levels.push("Bachelor");
  if (/master|msc|postgraduate/.test(t)) levels.push("Master");
  if (/phd|doctoral|doctorate/.test(t)) levels.push("PhD");
  if (/postdoc/.test(t)) levels.push("Postdoc");
  const type = /fellowship/.test(t) ? "Fellowship" : /\bgrant\b/.test(t) ? "Grant" : "Scholarship";
  const fully = /fully[- ]funded|full funding|full scholarship|full tuition/.test(t);
  return {
    levels: levels.length ? levels : ["Other"],
    type,
    fundingType: fully ? "Fully Funded" : "Partial",
  };
}

// 1. Remove expired listings
const before = items.length;
items = items.filter((s) => {
  if (s.deadline && s.deadline < today) return false;
  if (s.autoAdded && !s.deadline && daysBetween(s.addedAt, today) > AUTO_NO_DEADLINE_DAYS) return false;
  return true;
});
const removed = before - items.length;

// 2. Fetch new listings
const seen = new Set(items.flatMap((s) => [s.slug, s.officialUrl, s.sourceUrl].filter(Boolean)));
const added = [];

for (const source of sources) {
  if (added.length >= MAX_NEW_PER_RUN) break;
  let xml = "";
  try {
    const res = await fetch(source.feed, {
      headers: { "User-Agent": "ScholarshipHubBot/1.0 (+https://github.com)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(`Skipping ${source.name}: ${err.message}`);
    continue;
  }

  const entries = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of entries) {
    if (added.length >= MAX_NEW_PER_RUN) break;
    const title = stripHtml(getTag(block, "title"));
    const link = getTag(block, "link");
    if (!title || !link) continue;
    const categories = [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((m) =>
      stripHtml(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    );
    const full = getTag(block, "content:encoded") || getTag(block, "description");
    const text = stripHtml(full);
    if (!KEYWORDS.test(`${title} ${categories.join(" ")}`)) continue;

    const slug = slugify(title);
    if (!slug || seen.has(slug) || seen.has(link)) continue;

    const deadline = parseDeadline(text);
    if (deadline && deadline < today) continue;

    const excerpt = text.slice(0, 280).trim();
    const meta = infer(`${title} ${categories.join(" ")} ${text}`);
    added.push({
      slug,
      name: title,
      organization: source.name,
      country: "Multiple",
      region: "Global",
      type: meta.type,
      levels: meta.levels,
      fundingType: meta.fundingType,
      funding: "See the original listing for funding details.",
      deadline,
      deadlineNote: deadline ? "Taken from the source listing; confirm on the official site." : "No deadline found automatically; check the original post.",
      eligibility: "See the original listing for eligibility.",
      addedAt: today,
      featured: false,
      tags: categories.slice(0, 5).map((c) => c.toLowerCase()),
      description: `${excerpt}${excerpt.length >= 280 ? "..." : ""} (Summary of a listing found on ${source.name}.)`,
      officialUrl: link,
      autoAdded: true,
      source: source.name,
      sourceUrl: link,
    });
    seen.add(slug);
    seen.add(link);
  }
}

items = [...items, ...added];
const output = JSON.stringify(items, null, 2) + "\n";

if (output !== original) {
  await writeFile(DATA_FILE, output);
}
console.log(`Date ${today}: removed ${removed} expired, added ${added.length} new, total ${items.length}.`);
