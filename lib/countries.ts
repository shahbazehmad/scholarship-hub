// Maps country names (and common aliases) to ISO 3166-1 alpha-2 codes for flag images.
const CODES: Record<string, string> = {
  "united kingdom": "gb",
  uk: "gb",
  england: "gb",
  scotland: "gb",
  "united states": "us",
  usa: "us",
  america: "us",
  canada: "ca",
  mexico: "mx",
  brazil: "br",
  chile: "cl",
  argentina: "ar",
  germany: "de",
  france: "fr",
  italy: "it",
  spain: "es",
  portugal: "pt",
  netherlands: "nl",
  belgium: "be",
  austria: "at",
  switzerland: "ch",
  sweden: "se",
  norway: "no",
  denmark: "dk",
  finland: "fi",
  ireland: "ie",
  poland: "pl",
  czechia: "cz",
  hungary: "hu",
  greece: "gr",
  russia: "ru",
  japan: "jp",
  china: "cn",
  "south korea": "kr",
  korea: "kr",
  taiwan: "tw",
  "hong kong": "hk",
  singapore: "sg",
  malaysia: "my",
  india: "in",
  thailand: "th",
  australia: "au",
  "new zealand": "nz",
  turkey: "tr",
  "t\u00fcrkiye": "tr",
  "saudi arabia": "sa",
  qatar: "qa",
  "united arab emirates": "ae",
  uae: "ae",
  israel: "il",
  egypt: "eg",
  "south africa": "za",
  kenya: "ke",
  ghana: "gh",
  nigeria: "ng",
};

const MAX_FLAGS = 3;

interface CountryInfo {
  country: string;
  name: string;
  countryCodes?: string[];
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scan(text: string): string[] {
  const found: string[] = [];
  let remaining = text.toLowerCase();
  // Longest names first so "south korea" wins over "korea".
  const keys = Object.keys(CODES).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const k = escapeRe(key);
    const re = new RegExp(`(^|[^a-z\u00c0-\u024f])${k}([^a-z\u00c0-\u024f]|$)`);
    if (re.test(remaining)) {
      const code = CODES[key];
      if (!found.includes(code)) found.push(code);
      remaining = remaining.replace(new RegExp(k, "g"), " ");
    }
  }
  return found;
}

/** Returns up to three lowercase ISO codes (or "eu"). Empty array means no specific country. */
export function getCountryCodes(s: CountryInfo): string[] {
  if (s.countryCodes && s.countryCodes.length > 0) {
    return s.countryCodes.slice(0, MAX_FLAGS).map((c) => c.toLowerCase());
  }
  const direct = CODES[s.country.toLowerCase()];
  if (direct) return [direct];
  if (/european/i.test(s.country)) return ["eu"];
  const fromCountry = scan(s.country);
  if (fromCountry.length > 0) return fromCountry.slice(0, MAX_FLAGS);
  return scan(s.name).slice(0, MAX_FLAGS);
}
