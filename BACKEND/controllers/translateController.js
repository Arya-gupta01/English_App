// controllers/translateController.js
import axios from "axios";

// normalize helper - remove punctuation, lowercase
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();

// heuristic: decide whether translation is "bad" (identical/too similar)
function isBadTranslation(input, translated) {
  if (!translated) return true;
  const a = normalize(input);
  const b = normalize(translated);
  if (!b) return true;
  if (a === b) return true; // identical
  // if most tokens are shared (very likely untranslated or copied)
  const aTokens = a.split(/\s+/).filter(Boolean);
  const shared = aTokens.filter((t) => b.includes(t)).length;
  if (aTokens.length > 0 && shared / aTokens.length >= 0.6) return true;
  return false;
}

// Provider attempts
async function tryArgos(text, from, to) {
  // Argos uses LibreTranslate API shape
  const r = await axios.post(
    "https://translate.argosopentech.com/translate",
    { q: text, source: from, target: to, format: "text" },
    { headers: { "Content-Type": "application/json" }, timeout: 10000 }
  );
  return r.data?.translatedText ?? null;
}

async function tryLibreDe(text, from, to) {
  const r = await axios.post(
    "https://libretranslate.de/translate",
    { q: text, source: from, target: to, format: "text" },
    { headers: { "Content-Type": "application/json" }, timeout: 10000 }
  );
  return r.data?.translatedText ?? null;
}

async function tryMyMemory(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${from}|${to}`;
  const r = await axios.get(url, { timeout: 10000 });
  return r.data?.responseData?.translatedText ?? null;
}

async function tryGoogleWeb(text, from, to) {
  // unofficial endpoint used by many demo projects (may be rate-limited)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const r = await axios.get(url, { timeout: 10000 });
  if (Array.isArray(r.data) && Array.isArray(r.data[0])) {
    return r.data[0].map((chunk) => chunk[0]).join("") || null;
  }
  return null;
}

export const translateText = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ error: "No request body" });

    const { text, from, to } = req.body;
    if (!text || !from || !to) {
      return res.status(400).json({ error: "Provide text, from, to" });
    }

    const attempts = [];

    // provider list (in order)
    const providers = [
      { name: "ArgosLibre", fn: tryArgos },
      { name: "LibreDe", fn: tryLibreDe },
      { name: "MyMemory", fn: tryMyMemory },
      { name: "GoogleWeb_unofficial", fn: tryGoogleWeb },
    ];

    for (const p of providers) {
      try {
        const translated = await p.fn(text, from, to);
        attempts.push({ provider: p.name, translated: translated ?? null });

        // if good translation, return immediately
        if (!isBadTranslation(text, translated)) {
          return res.json({ translated, provider: p.name, attempts });
        }
      } catch (err) {
        attempts.push({ provider: p.name, error: err.message || String(err) });
      }
    }

    // fallback: return last non-null translation if any
    const lastGood = attempts.find((a) => a.translated);
    if (lastGood) {
      return res.json({ translated: lastGood.translated, provider: lastGood.provider, attempts });
    }

    // all failed
    return res.status(500).json({ error: "All providers failed or returned bad translations", attempts });
  } catch (err) {
    console.error("translateText error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};




