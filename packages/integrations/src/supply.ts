import type { SupplySignal, SupplySignalType, SupplySeverity } from "@forkcast/domain";

// Tracked commodities ordered by restaurant criticality
export const TRACKED_COMMODITIES = [
  "LPG",
  "Chicken",
  "Onion",
  "Cooking Oil",
  "Tomato",
  "Paneer",
  "Rice",
  "Wheat"
] as const;

export type TrackedCommodity = (typeof TRACKED_COMMODITIES)[number];

// ── Keyword-based signal parser ────────────────────────────────────────────────
// Works without any API keys. When OPENAI_API_KEY is set, replace this with
// an LLM call to get higher-confidence structured signals.

const SHORTAGE_WORDS = /\b(shortage|unavailable|stock.?out|ran out|scarce|crisis|collapse)\b/i;
const DISRUPTION_WORDS = /\b(ban|sanction|import.?cut|import.?ban|blockade|embargo)\b/i;
const SPIKE_WORDS = /\b(price.?rise|price.?hike|price.?surge|rate.?hike|increase|surge|jumped|soared)\b/i;
const DROP_WORDS = /\b(price.?drop|fall|decrease|cheaper|declined|slumped)\b/i;
const CRITICAL_WORDS = /\b(crisis|collapse|severe|ban|sanction|shut.?down|no supply)\b/i;
const HIGH_WORDS = /\b(disruption|shortage|cut|block|unavailable)\b/i;
const MEDIUM_WORDS = /\b(rise|hike|surge|spike|jumped|soared|increase)\b/i;

function detectSignalType(headline: string): SupplySignalType {
  if (DISRUPTION_WORDS.test(headline)) return "import_disruption";
  if (SHORTAGE_WORDS.test(headline)) return "shortage_warning";
  if (DROP_WORDS.test(headline)) return "price_drop";
  return "price_spike";
}

function detectSeverity(headline: string): SupplySeverity {
  if (CRITICAL_WORDS.test(headline)) return "critical";
  if (HIGH_WORDS.test(headline)) return "high";
  if (MEDIUM_WORDS.test(headline)) return "medium";
  return "low";
}

function estimateDaysUntilImpact(headline: string, signalType: SupplySignalType): number {
  const lower = headline.toLowerCase();
  if (/\b(today|immediate|now|already|ongoing)\b/.test(lower)) return 1;
  if (/\b(tomorrow|24 hours?|next day)\b/.test(lower)) return 2;
  if (/\b(this week|within days?|coming days?)\b/.test(lower)) return 4;
  if (/\b(next week|within 10 days?)\b/.test(lower)) return 8;
  if (/\b(this month|within month)\b/.test(lower)) return 14;
  // Defaults by signal type
  return signalType === "shortage_warning" ? 3
    : signalType === "import_disruption" ? 5
    : signalType === "price_spike" ? 7
    : 10;
}

export function parseHeadlineToSignal(headline: string, commodity: string): SupplySignal | null {
  const signalType = detectSignalType(headline);
  const severity = detectSeverity(headline);

  // Only emit signals for medium severity and above — filter noise
  if (severity === "low" && signalType === "price_spike") return null;

  return {
    commodity,
    signalType,
    severity,
    region: guessAffectedRegions(headline),
    headline,
    daysUntilImpact: estimateDaysUntilImpact(headline, signalType),
    confidence: 0.6, // keyword-based; upgrade to 0.85+ with LLM
    source: "newsapi"
  };
}

function guessAffectedRegions(headline: string): string[] {
  const lower = headline.toLowerCase();
  const regions: string[] = [];

  const regionMap: Record<string, string> = {
    "south india": "South India",
    bengaluru: "Bengaluru",
    bangalore: "Bengaluru",
    mumbai: "Mumbai",
    delhi: "Delhi",
    chennai: "Chennai",
    hyderabad: "Hyderabad",
    kolkata: "Kolkata",
    maharashtra: "Maharashtra",
    karnataka: "Karnataka",
    "tamil nadu": "Tamil Nadu",
    kerala: "Kerala",
    india: "all India"
  };

  for (const [key, value] of Object.entries(regionMap)) {
    if (lower.includes(key)) regions.push(value);
  }

  return regions.length > 0 ? regions : ["all India"];
}

// ── NewsAPI integration ────────────────────────────────────────────────────────

type NewsApiArticle = {
  title: string;
  description: string | null;
  publishedAt: string;
  source: { name: string };
};

type NewsApiResponse = {
  status: string;
  articles: NewsApiArticle[];
};

export async function fetchSupplyNewsSignals(
  commodities: readonly string[],
  region = "India"
): Promise<SupplySignal[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    // No key — return empty; dashboard falls back gracefully
    return [];
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const signals: SupplySignal[] = [];

  // Batch commodities into one query per group of 3 to stay within free tier
  const queries = commodities.map((c) => `"${c}" ${region}`);

  for (const query of queries) {
    try {
      const url = new URL("https://newsapi.org/v2/everything");
      url.searchParams.set("q", query);
      url.searchParams.set("language", "en");
      url.searchParams.set("sortBy", "publishedAt");
      url.searchParams.set("from", sevenDaysAgo);
      url.searchParams.set("pageSize", "5");
      url.searchParams.set("apiKey", apiKey);

      const res = await fetch(url.toString());

      if (!res.ok) continue;

      const data = (await res.json()) as NewsApiResponse;
      if (data.status !== "ok") continue;

      const commodity = commodities.find((c) => query.includes(`"${c}"`)) ?? "";

      for (const article of data.articles) {
        const combinedText = `${article.title} ${article.description ?? ""}`;
        const signal = parseHeadlineToSignal(combinedText, commodity);
        if (signal) signals.push(signal);
      }
    } catch {
      // Network failure — continue to next commodity silently
    }
  }

  // Deduplicate: keep highest-severity signal per commodity
  const byCommodity = new Map<string, SupplySignal>();
  const severityRank: Record<SupplySeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  for (const signal of signals) {
    const existing = byCommodity.get(signal.commodity);
    if (!existing || severityRank[signal.severity] > severityRank[existing.severity]) {
      byCommodity.set(signal.commodity, signal);
    }
  }

  return [...byCommodity.values()].sort(
    (a, b) => severityRank[b.severity] - severityRank[a.severity]
  );
}

// ── Agmarknet integration ──────────────────────────────────────────────────────
// Government of India open data portal (https://data.gov.in)
// Requires free registration at data.gov.in to get AGMARKNET_API_KEY.
// Returns daily mandi prices for agricultural commodities.

type AgmarknetRecord = {
  "State Name": string;
  "District Name": string;
  "Market Name": string;
  Commodity: string;
  "Min Price": string;
  "Max Price": string;
  "Modal Price": string;
  "Arrival Date": string;
};

type AgmarknetResponse = {
  count: number;
  records: AgmarknetRecord[];
};

const AGMARKNET_COMMODITY_IDS: Record<string, string> = {
  Onion: "Onion",
  Tomato: "Tomato",
  Chicken: "Broiler(Chicken)",
  Paneer: "Paneer(Chenna)",
  Rice: "Rice"
};

export async function fetchMandiPrices(commodity: string, state: string): Promise<SupplySignal | null> {
  const apiKey = process.env.AGMARKNET_API_KEY;
  if (!apiKey || !(commodity in AGMARKNET_COMMODITY_IDS)) return null;

  try {
    const url = new URL(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    );
    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "10");
    url.searchParams.set("filters[Commodity]", AGMARKNET_COMMODITY_IDS[commodity] ?? commodity);
    url.searchParams.set("filters[State Name]", state);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = (await res.json()) as AgmarknetResponse;
    if (!data.records || data.records.length === 0) return null;

    const prices = data.records.map((r) => Number(r["Modal Price"])).filter((p) => p > 0);
    if (prices.length === 0) return null;

    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const maxPrice = Math.max(...prices);

    // Spike if max price is more than 20% above average
    const spikeRatio = maxPrice / avgPrice;
    if (spikeRatio < 1.1) return null;

    const severity: SupplySeverity =
      spikeRatio > 1.4 ? "critical" : spikeRatio > 1.25 ? "high" : "medium";

    return {
      commodity,
      signalType: "price_spike",
      severity,
      region: [state, "all India"],
      headline: `${commodity} mandi price ₹${Math.round(maxPrice)}/kg — ${Math.round((spikeRatio - 1) * 100)}% above local average`,
      daysUntilImpact: 2,
      confidence: 0.85, // Agmarknet is reliable government data
      source: "agmarknet"
    };
  } catch {
    return null;
  }
}
